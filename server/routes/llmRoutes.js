const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ChatGroq } = require("@langchain/groq");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const AWS = require("aws-sdk");
const Prescription = require("../models/Prescription"); // Updated model
const Medication = require("../models/Medication"); // Add Medication model
const { createMultipleMedicationReminders } = require("../utils/medicationCalendar"); // Add calendar integration

// Load environment variables
require("dotenv").config();

AWS.config.update({
    region: "ap-south-1",
});

const textract = new AWS.Textract();

// Function to analyze image using AWS Textract
async function analyzeImage(imageUrl) {
    try {
        // Fetch the image data directly from the URL
        const response = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "arraybuffer",
        });

        const detectParameter = {
            Document: { Bytes: Buffer.from(response.data) },
            FeatureTypes: ["FORMS"],
        };

        return new Promise((resolve, reject) => {
            textract.analyzeDocument(detectParameter, (err, data) => {
                if (err) {
                    return reject(err);
                }

                const textBlocks = data.Blocks.filter(block => block.BlockType === "WORD" && block.Text).map(
                    block => block.Text
                );

                resolve(textBlocks.join(" "));
            });
        });
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
}

// Initialize language model and output parser
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY, // Use environment variable for security
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
});

const outputParser = new StringOutputParser();

// Define template for model prompt
const template = `Extract the following details from the prescription and return it in valid JSON format.
Rules:
1. Return ONLY the JSON object, no additional text
2. Ensure the JSON is properly formatted

Prescription: {prescriptionText}

Return the data in this exact format (replace with actual values):
{{
  "doctorName": "Dr. John Doe",
  "doctorLicense": "MD12345",
  "patientName": "Jane Smith",
  "patientAge": 35,
  "patientGender": "Female",
  "diagnosis": "Common Cold",
  "date": "2024-10-18",
  "medicines": [
    {{
      "name": "Acetaminophen",
      "dosage": "500mg",
      "frequency": "Every 6 hours",
      "duration": "5 days"
    }},
    {{
      "name": "Loratadine",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "7 days"
    }}
  ]
}}`;

function cleanJsonString(str) {
    const jsonStart = str.indexOf("{");
    const jsonEnd = str.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No valid JSON object found in response");
    }
    return str.slice(jsonStart, jsonEnd + 1);
}

const promptTemplate = ChatPromptTemplate.fromTemplate(template);

// Helper function to parse dosage from frequency string
function parseDosageFromFrequency(frequency, dosage) {
    const parsedDosage = {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
    };

    if (!frequency) return parsedDosage;

    const frequencyLower = frequency.toLowerCase();
    const dosageValue = parseFloat(dosage) || 1;

    // Parse different frequency patterns
    if (frequencyLower.includes("morning")) {
        parsedDosage.morning = dosageValue;
    }
    if (frequencyLower.includes("afternoon")) {
        parsedDosage.afternoon = dosageValue;
    }
    if (frequencyLower.includes("evening")) {
        parsedDosage.evening = dosageValue;
    }
    if (frequencyLower.includes("night")) {
        parsedDosage.night = dosageValue;
    }

    // Handle common patterns
    if (frequencyLower.includes("once daily") || frequencyLower.includes("1 time")) {
        parsedDosage.morning = dosageValue;
    } else if (frequencyLower.includes("twice daily") || frequencyLower.includes("2 times")) {
        parsedDosage.morning = dosageValue;
        parsedDosage.night = dosageValue;
    } else if (frequencyLower.includes("thrice daily") || frequencyLower.includes("3 times")) {
        parsedDosage.morning = dosageValue;
        parsedDosage.afternoon = dosageValue;
        parsedDosage.evening = dosageValue;
    } else if (frequencyLower.includes("every 6 hours")) {
        parsedDosage.morning = dosageValue;
        parsedDosage.afternoon = dosageValue;
        parsedDosage.evening = dosageValue;
        parsedDosage.night = dosageValue;
    }

    return parsedDosage;
}

// Process prescription text using the model
async function processPrescription(prescriptionText) {
    try {
        const chain = promptTemplate.pipe(model).pipe(outputParser);

        console.log("Sending request to model...");
        const result = await chain.invoke({ prescriptionText });

        console.log("Raw response from model:", result);

        const cleanedResult = cleanJsonString(result);
        const parsedJson = JSON.parse(cleanedResult);

        if (!parsedJson.medicines || !Array.isArray(parsedJson.medicines)) {
            throw new Error("Invalid JSON structure: 'medicines' array is required");
        }

        return parsedJson;
    } catch (error) {
        console.error("Error processing prescription:", error);
        throw error;
    }
}

// POST route to fetch and analyze image
router.post("/fetchimage", async (req, res) => {
    const { imageUrl, userId, title } = req.body;

    console.log("Received image URL:", imageUrl);
    console.log("Received userId:", userId);
    console.log("Received title:", title);

    // Validate input
    if (!imageUrl || typeof imageUrl !== "string") {
        return res.status(400).json({ error: "Invalid or missing imageUrl" });
    }

    try {
        const prescriptionText = await analyzeImage(imageUrl);
        const prescriptionData = await processPrescription(prescriptionText);

        // Extract medicines from prescriptionData
        const { medicines, ...prescriptionDetails } = prescriptionData;

        // Add the missing fields
        const prescriptionToSave = {
            ...prescriptionDetails,
            imageUrl,
            title: title || "Untitled Prescription",
            userId,
        };

        // Create prescription without medicines
        const newPrescription = new Prescription(prescriptionToSave);

        // Save the extracted prescription data to the database
        const savedPrescription = await newPrescription.save();

        console.log("Saved prescription:", savedPrescription);

        // Save medicines separately if they exist
        if (medicines && Array.isArray(medicines)) {
            console.log("Processing medicines:", medicines);

            const savedMedications = [];

            for (const medicine of medicines) {
                const { name, dosage, frequency, duration } = medicine;

                // Parse frequency to determine dosage timing
                const parsedDosage = parseDosageFromFrequency(frequency, dosage);

                console.log("Creating medicine:", { name, parsedDosage, frequency, duration });

                const newMedicine = new Medication({
                    name,
                    dosage: parsedDosage,
                    timing: "After Food", // Default timing, can be extracted later
                    duration,
                    prescriptionId: savedPrescription._id.toString(),
                    userId: userId || savedPrescription.userId,
                });

                const savedMedicine = await newMedicine.save();
                savedMedications.push(savedMedicine);
                console.log("Medicine saved successfully");
            }

            // Create calendar reminders for all medications
            if (savedMedications.length > 0) {
                try {
                    console.log("Creating calendar reminders for medications...");
                    const calendarResults = await createMultipleMedicationReminders(savedMedications, userId);

                    console.log("Calendar reminder results:", calendarResults);

                    // Add calendar results to response
                    res.status(200).json({
                        message: "Prescription extracted and saved successfully",
                        data: savedPrescription,
                        medications: savedMedications,
                        calendarReminders: calendarResults,
                    });
                } catch (calendarError) {
                    console.error("Error creating calendar reminders:", calendarError);

                    // Still return success for prescription/medicine saving, but note calendar issue
                    res.status(200).json({
                        message: "Prescription and medicines saved successfully, but calendar reminders failed",
                        data: savedPrescription,
                        medications: savedMedications,
                        calendarError: calendarError.message,
                        needsCalendarAuth: calendarError.message.includes("authentication required"),
                    });
                }
            } else {
                res.status(200).json({
                    message: "Prescription extracted and saved successfully",
                    data: savedPrescription,
                });
            }
        } else {
            res.status(200).json({
                message: "Prescription extracted and saved successfully",
                data: savedPrescription,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error processing prescription", details: err.message });
    }
});

module.exports = router;
