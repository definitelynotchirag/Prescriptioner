const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ChatGroq } = require("@langchain/groq");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const AWS = require('aws-sdk');
const Prescription = require('../models/Prescription');  // Updated model

// Load environment variables
require('dotenv').config();

AWS.config.update({
  region: 'ap-south-1'
});

const textract = new AWS.Textract();

// Function to analyze image using AWS Textract
async function analyzeImage(imageUrl) {
  try {
    // Fetch the image data directly from the URL
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const detectParameter = {
      Document: { Bytes: Buffer.from(response.data) },
      FeatureTypes: ['FORMS'],
    };

    return new Promise((resolve, reject) => {
      textract.analyzeDocument(detectParameter, (err, data) => {
        if (err) {
          return reject(err);
        }

        const textBlocks = data.Blocks.filter(
          (block) => block.BlockType === 'WORD' && block.Text
        ).map((block) => block.Text);

        resolve(textBlocks.join(' '));
      });
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

// Initialize language model and output parser
const model = new ChatGroq({
  apiKey: "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", // Use environment variable for security
  model: 'mixtral-8x7b-32768',
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
  const jsonStart = str.indexOf('{');
  const jsonEnd = str.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No valid JSON object found in response');
  }
  return str.slice(jsonStart, jsonEnd + 1);
}

const promptTemplate = ChatPromptTemplate.fromTemplate(template);

// Process prescription text using the model
async function processPrescription(prescriptionText) {
  try {
    const chain = promptTemplate.pipe(model).pipe(outputParser);

    console.log('Sending request to model...');
    const result = await chain.invoke({ prescriptionText });

    console.log('Raw response from model:', result);

    const cleanedResult = cleanJsonString(result);
    const parsedJson = JSON.parse(cleanedResult);

    if (!parsedJson.medicines || !Array.isArray(parsedJson.medicines)) {
      throw new Error("Invalid JSON structure: 'medicines' array is required");
    }

    return parsedJson;
  } catch (error) {
    console.error('Error processing prescription:', error);
    throw error;
  }
}

// POST route to fetch and analyze image
router.post('/fetchimage', async (req, res) => {
  const { imageUrl } = req.body;

  console.log('Received image URL:', imageUrl);

  // Validate input
  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing imageUrl' });
  }

  try {
    const prescriptionText = await analyzeImage(imageUrl);
    const prescriptionData = await processPrescription(prescriptionText);

    const newPrescription = new Prescription(prescriptionData);

    // Save the extracted prescription data to the database
    const savedPrescription = await newPrescription.save();

    // Save the extracted prescription data to the database
    res.status(200).json({
      message: 'Prescription extracted and saved successfully',
      data: savedPrescription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing prescription', details: err.message });
  }
});

module.exports = router;
