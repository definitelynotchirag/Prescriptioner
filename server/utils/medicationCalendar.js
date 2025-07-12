const { google } = require("googleapis");
const { authorize } = require("./googleCalendar");
const User = require("../models/User");
const RootUser = require("../models/rootuser");

// Default meal timings
const DEFAULT_MEAL_TIMINGS = {
    breakfastTime: "08:00",
    lunchTime: "13:00",
    dinnerTime: "19:00",
};

/**
 * Calculate medication times based on user meal timings and medication dosage
 */
function calculateMedicationTimes(mealTimings, dosage, timing = "After Food") {
    const times = [];
    const { breakfastTime, lunchTime, dinnerTime } = mealTimings;

    // Helper function to add minutes to time string
    function addMinutesToTime(timeString, minutes) {
        const [hours, mins] = timeString.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, mins + minutes, 0, 0);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }

    // Determine offset based on timing preference
    const offset = timing === "Before Food" ? -30 : 30; // 30 minutes before/after meals

    if (dosage.morning > 0) {
        times.push({
            time: addMinutesToTime(breakfastTime, offset),
            label: `Morning (${timing})`,
            doses: dosage.morning,
        });
    }

    if (dosage.afternoon > 0) {
        times.push({
            time: addMinutesToTime(lunchTime, offset),
            label: `Afternoon (${timing})`,
            doses: dosage.afternoon,
        });
    }

    if (dosage.evening > 0) {
        times.push({
            time: addMinutesToTime(dinnerTime, offset),
            label: `Evening (${timing})`,
            doses: dosage.evening,
        });
    }

    if (dosage.night > 0) {
        times.push({
            time: addMinutesToTime(dinnerTime, offset + 180), // 3 hours after dinner
            label: `Night (${timing})`,
            doses: dosage.night,
        });
    }

    return times;
}

/**
 * Parse duration string to get number of days
 */
function parseDuration(durationString) {
    if (!durationString) return 7; // Default 7 days

    const duration = durationString.toLowerCase();
    const dayMatch = duration.match(/(\d+)\s*day/);
    const weekMatch = duration.match(/(\d+)\s*week/);
    const monthMatch = duration.match(/(\d+)\s*month/);

    if (dayMatch) return parseInt(dayMatch[1]);
    if (weekMatch) return parseInt(weekMatch[1]) * 7;
    if (monthMatch) return parseInt(monthMatch[1]) * 30;

    return 7; // Default fallback
}

/**
 * Create recurring medication reminder events in Google Calendar
 */
async function createMedicationReminders(medication, userId) {
    try {
        console.log("Creating medication reminders for:", medication.name);

        // Try to get user meal timings, fall back to defaults
        let mealTimings = DEFAULT_MEAL_TIMINGS;

        try {
            // First try to find in User model
            const user = await User.findById(userId);
            if (user && user.breakfastTime) {
                mealTimings = {
                    breakfastTime: user.breakfastTime,
                    lunchTime: user.lunchTime,
                    dinnerTime: user.dinnerTime,
                };
            } else {
                // If not found in User, check RootUser for future meal timing support
                const rootUser = await RootUser.findById(userId);
                if (rootUser && rootUser.breakfastTime) {
                    mealTimings = {
                        breakfastTime: rootUser.breakfastTime,
                        lunchTime: rootUser.lunchTime,
                        dinnerTime: rootUser.dinnerTime,
                    };
                }
            }
        } catch (userError) {
            console.log("Using default meal timings:", userError.message);
        }

        console.log("Using meal timings:", mealTimings);

        // Calculate medication times
        const medicationTimes = calculateMedicationTimes(mealTimings, medication.dosage, medication.timing);

        if (medicationTimes.length === 0) {
            console.log("No medication times calculated, skipping calendar creation");
            return { success: false, message: "No medication times to schedule" };
        }

        // Get Google Calendar auth
        const auth = await authorize();
        const calendar = google.calendar({ version: "v3", auth });

        // Parse duration
        const durationDays = parseDuration(medication.duration);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);

        const createdEvents = [];

        // Create events for each medication time
        for (const timeSlot of medicationTimes) {
            const eventTitle = `💊 ${medication.name} - ${timeSlot.doses} dose(s)`;
            const eventDescription = `Medication Reminder
            
Medicine: ${medication.name}
Dosage: ${timeSlot.doses} dose(s)
Timing: ${timeSlot.label}
Duration: ${medication.duration || "As prescribed"}
            
⏰ Don't forget to take your medicine!`;

            // Create the first event for today
            const today = new Date();
            const [hours, minutes] = timeSlot.time.split(":").map(Number);
            const startDateTime = new Date(today);
            startDateTime.setHours(hours, minutes, 0, 0);

            // If the time has already passed today, start from tomorrow
            if (startDateTime < new Date()) {
                startDateTime.setDate(startDateTime.getDate() + 1);
            }

            const endDateTime = new Date(startDateTime);
            endDateTime.setMinutes(endDateTime.getMinutes() + 15); // 15-minute reminder

            const event = {
                summary: eventTitle,
                description: eventDescription,
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                recurrence: [`RRULE:FREQ=DAILY;UNTIL=${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: "popup", minutes: 5 },
                        { method: "email", minutes: 30 },
                    ],
                },
            };

            try {
                const result = await calendar.events.insert({
                    calendarId: "primary",
                    resource: event,
                });

                createdEvents.push({
                    eventId: result.data.id,
                    eventLink: result.data.htmlLink,
                    time: timeSlot.time,
                    label: timeSlot.label,
                });

                console.log(`Created event for ${medication.name} at ${timeSlot.time}: ${result.data.htmlLink}`);
            } catch (eventError) {
                console.error(`Error creating event for ${timeSlot.time}:`, eventError);
                // Continue with other events even if one fails
            }
        }

        return {
            success: true,
            message: `Created ${createdEvents.length} recurring reminder(s) for ${medication.name}`,
            events: createdEvents,
            totalDays: durationDays,
        };
    } catch (error) {
        console.error("Error creating medication reminders:", error);
        return {
            success: false,
            message: error.message,
            needsAuth: error.message.includes("authentication required"),
        };
    }
}

/**
 * Create calendar reminders for multiple medications
 */
async function createMultipleMedicationReminders(medications, userId) {
    const results = [];

    for (const medication of medications) {
        const result = await createMedicationReminders(medication, userId);
        results.push({
            medicationName: medication.name,
            ...result,
        });
    }

    return results;
}

module.exports = {
    createMedicationReminders,
    createMultipleMedicationReminders,
    calculateMedicationTimes,
    parseDuration,
};
