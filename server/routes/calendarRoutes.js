const express = require("express");
const router = express.Router();
const { authorize, exchangeCodeForTokens, createOAuth2Client } = require("../utils/googleCalendar");
const { createMedicationReminders, createMultipleMedicationReminders } = require("../utils/medicationCalendar");
const Medication = require("../models/Medication");
const { google } = require("googleapis");

// Get authorization URL for Google Calendar
router.get("/auth-url", async (req, res) => {
    try {
        const oAuth2Client = await createOAuth2Client();
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/calendar"],
            prompt: "consent", // Force consent screen to get refresh token
        });
        res.json({ authUrl });
    } catch (err) {
        console.error("Error generating auth URL:", err);
        res.status(500).json({ error: "Error generating auth URL", details: err.message });
    }
});

// Handle OAuth callback and exchange code for tokens
router.post("/oauth-callback", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" });
        }

        const auth = await exchangeCodeForTokens(code);
        res.json({
            message: "Authentication successful",
            success: true,
        });
    } catch (err) {
        console.error("Error in OAuth callback:", err);
        res.status(500).json({ error: "Error during authentication", details: err.message });
    }
});

// Check authentication status
router.get("/auth-status", async (req, res) => {
    try {
        const auth = await authorize();
        res.json({ authenticated: true });
    } catch (err) {
        res.json({
            authenticated: false,
            message: "Authentication required",
            error: err.message,
        });
    }
});

// Create calendar event
router.post("/create-event", async (req, res) => {
    try {
        const auth = await authorize();
        const { summary, location, description, startDateTime, endDateTime } = req.body;

        if (!summary || !startDateTime || !endDateTime) {
            return res.status(400).json({
                error: "Missing required fields: summary, startDateTime, endDateTime",
            });
        }

        const event = {
            summary,
            location: location || "",
            description: description || "",
            start: {
                dateTime: new Date(startDateTime).toISOString(),
                timeZone: "Asia/Kolkata", // Changed to Indian timezone
            },
            end: {
                dateTime: new Date(endDateTime).toISOString(),
                timeZone: "Asia/Kolkata", // Changed to Indian timezone
            },
        };

        const calendar = google.calendar({ version: "v3", auth });
        const result = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
        });

        console.log("Event created:", result.data.htmlLink);
        res.status(200).json({
            message: "Event created successfully",
            eventLink: result.data.htmlLink,
            eventId: result.data.id,
        });
    } catch (err) {
        console.error("Error creating event:", err);
        if (err.message.includes("authentication required")) {
            res.status(401).json({
                error: "Authentication required",
                needsAuth: true,
                details: err.message,
            });
        } else {
            res.status(500).json({
                error: "Error creating event",
                details: err.message,
            });
        }
    }
});

// Update event by summary
router.put("/update-event-by-summary/:summary", async (req, res) => {
    try {
        const auth = await authorize();
        const { summary } = req.params;

        const calendar = google.calendar({ version: "v3", auth });
        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });

        const event = events.data.items.find(event => event.summary === summary);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const { location, description, startDateTime, endDateTime } = req.body;
        const updatedEvent = {
            summary,
            location: location || event.location || "",
            description: description || event.description || "",
            start: {
                dateTime: new Date(startDateTime || event.start.dateTime).toISOString(),
                timeZone: "Asia/Kolkata",
            },
            end: {
                dateTime: new Date(endDateTime || event.end.dateTime).toISOString(),
                timeZone: "Asia/Kolkata",
            },
        };

        const result = await calendar.events.update({
            calendarId: "primary",
            eventId: event.id,
            resource: updatedEvent,
        });

        console.log("Event updated:", result.data.htmlLink);
        res.status(200).json({
            message: "Event updated successfully",
            eventLink: result.data.htmlLink,
        });
    } catch (err) {
        console.error("Error updating event:", err);
        if (err.message.includes("authentication required")) {
            res.status(401).json({
                error: "Authentication required",
                needsAuth: true,
                details: err.message,
            });
        } else {
            res.status(500).json({
                error: "Error updating event",
                details: err.message,
            });
        }
    }
});

// Delete event by summary
router.delete("/delete-event-by-summary/:summary", async (req, res) => {
    try {
        const auth = await authorize();
        const { summary } = req.params;

        const calendar = google.calendar({ version: "v3", auth });
        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });

        const event = events.data.items.find(event => event.summary === summary);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await calendar.events.delete({
            calendarId: "primary",
            eventId: event.id,
        });

        console.log("Event deleted successfully");
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error("Error deleting event:", err);
        if (err.message.includes("authentication required")) {
            res.status(401).json({
                error: "Authentication required",
                needsAuth: true,
                details: err.message,
            });
        } else {
            res.status(500).json({
                error: "Error deleting event",
                details: err.message,
            });
        }
    }
});

// Create medication reminders
router.post("/create-medication-reminders", async (req, res) => {
    try {
        const auth = await authorize();
        const { prescriptionId } = req.body;

        if (!prescriptionId) {
            return res.status(400).json({ error: "Prescription ID is required" });
        }

        // Find the medication details by prescription ID
        const medication = await Medication.findById(prescriptionId);

        if (!medication) {
            return res.status(404).json({ error: "Medication not found" });
        }

        // Create reminders based on the medication details
        const reminders = await createMedicationReminders(auth, medication);

        res.status(200).json({
            message: "Medication reminders created successfully",
            reminders,
        });
    } catch (err) {
        console.error("Error creating medication reminders:", err);
        if (err.message.includes("authentication required")) {
            res.status(401).json({
                error: "Authentication required",
                needsAuth: true,
                details: err.message,
            });
        } else {
            res.status(500).json({
                error: "Error creating medication reminders",
                details: err.message,
            });
        }
    }
});

// Create multiple medication reminders
router.post("/create-multiple-medication-reminders", async (req, res) => {
    try {
        const auth = await authorize();
        const { prescriptionIds } = req.body;

        if (!Array.isArray(prescriptionIds) || prescriptionIds.length === 0) {
            return res.status(400).json({ error: "At least one prescription ID is required" });
        }

        // Find the medications by prescription IDs
        const medications = await Medication.find({ _id: { $in: prescriptionIds } });

        if (medications.length === 0) {
            return res.status(404).json({ error: "No medications found for the given IDs" });
        }

        // Create reminders for each medication
        const reminders = [];
        for (const medication of medications) {
            const reminder = await createMedicationReminders(auth, medication);
            reminders.push(reminder);
        }

        res.status(200).json({
            message: "Medication reminders created successfully",
            reminders,
        });
    } catch (err) {
        console.error("Error creating multiple medication reminders:", err);
        if (err.message.includes("authentication required")) {
            res.status(401).json({
                error: "Authentication required",
                needsAuth: true,
                details: err.message,
            });
        } else {
            res.status(500).json({
                error: "Error creating multiple medication reminders",
                details: err.message,
            });
        }
    }
});

// Create medication reminders for a specific prescription
router.post("/create-medication-reminders", async (req, res) => {
    try {
        const { prescriptionId, userId } = req.body;

        if (!prescriptionId || !userId) {
            return res.status(400).json({
                error: "Missing required fields: prescriptionId, userId",
            });
        }

        // Get all medications for this prescription
        const medications = await Medication.find({ prescriptionId, userId });

        if (medications.length === 0) {
            return res.status(404).json({
                error: "No medications found for this prescription",
            });
        }

        // Create calendar reminders
        const results = await createMultipleMedicationReminders(medications, userId);

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.length - successCount;

        res.status(200).json({
            message: `Created reminders for ${successCount} out of ${results.length} medications`,
            results,
            summary: {
                total: results.length,
                success: successCount,
                failed: failureCount,
            },
        });
    } catch (err) {
        console.error("Error creating medication reminders:", err);
        if (err.message.includes("authentication required")) {
            res.status(401).json({
                error: "Google Calendar authentication required",
                needsAuth: true,
                details: err.message,
            });
        } else {
            res.status(500).json({
                error: "Error creating medication reminders",
                details: err.message,
            });
        }
    }
});

// Create reminder for a single medication
router.post("/create-single-medication-reminder", async (req, res) => {
    try {
        const { medicationId, userId } = req.body;

        if (!medicationId || !userId) {
            return res.status(400).json({
                error: "Missing required fields: medicationId, userId",
            });
        }

        // Get the specific medication
        const medication = await Medication.findById(medicationId);

        if (!medication) {
            return res.status(404).json({
                error: "Medication not found",
            });
        }

        if (medication.userId !== userId) {
            return res.status(403).json({
                error: "Unauthorized: Medication does not belong to this user",
            });
        }

        // Create calendar reminder
        const result = await createMedicationReminders(medication, userId);

        if (result.success) {
            res.status(200).json({
                message: result.message,
                events: result.events,
                totalDays: result.totalDays,
            });
        } else {
            if (result.needsAuth) {
                res.status(401).json({
                    error: result.message,
                    needsAuth: true,
                });
            } else {
                res.status(500).json({
                    error: result.message,
                });
            }
        }
    } catch (err) {
        console.error("Error creating single medication reminder:", err);
        res.status(500).json({
            error: "Error creating medication reminder",
            details: err.message,
        });
    }
});

module.exports = router;
