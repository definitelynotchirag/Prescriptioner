// routes/medicines.js
const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medication');

// Create a new medicine
router.post('/:prescriptionId', async (req, res) => {
  try {
    console.log("Creating medicine for prescription:", req.body.data);
    const { medicines } = req.body; // Assuming medicines is an array of objects
    const { prescriptionId } = req.params;

    console.log("Received medicines data:", medicines);

    // Check if medicines is an array
    if (!Array.isArray(medicines)) {
      return res.status(400).json({ message: 'Medicines should be an array' });
    }

    for (const medicine of medicines) { // Use for...of loop for arrays
      const { name, dosage, timing, duration } = medicine;

      console.log("Creating medicine for prescription:", { name, dosage, timing, duration });

      // Create a new Medicine instance
      const newMedicine = new Medicine({
        name,
        dosage,
        timing,
        duration,
        prescriptionId,
      });

      await newMedicine.save(); // Await the save to ensure it completes
    }

    res.json({ message: 'Medicines created successfully' });
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ message: 'Error creating medicine' });
  }
});


// Update a medicine
router.put('/:prescriptionId/:medicineId', async (req, res) => {
  try {
    const { prescriptionId, medicineId } = req.params;
    const { name, dosage, frequency, duration } = req.body;

    console.log("Updating medicine:", medicineId, "for prescription:", prescriptionId);
    console.log("Updated medicine data:", { name, dosage, frequency, duration });

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const medicineIndex = prescription.medicines.findIndex(med => med.id === medicineId);
    if (medicineIndex === -1) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Update the medicine details
    prescription.medicines[medicineIndex] = { name, dosage, frequency, duration };
    await prescription.save();

    res.json(prescription);
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ message: 'Error updating medicine' });
  }
});

// Delete a medicine
router.delete('/:prescriptionId/:medicineId', async (req, res) => {
  try {
    const { prescriptionId, medicineId } = req.params;

    console.log("Deleting medicine:", medicineId, "from prescription:", prescriptionId);

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.medicines = prescription.medicines.filter(med => med.id !== medicineId);
    await prescription.save();

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ message: 'Error deleting medicine' });
  }
});

// Get all medicines for a prescription
router.get('/:prescriptionId', async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    console.log("Fetching medicines for prescription:", prescriptionId);

    const prescription = await Medicine.find();
    console.log("Prescriptinnnnnnnnnnnnnnon:", prescription.filter(med => med.prescriptionId == prescriptionId));
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription.filter(med => med.prescriptionId == prescriptionId));
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ message: 'Error fetching medicines' });
  }
});

module.exports = router;
