const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// Fetch all prescriptions for a user
router.get('/:userId/prescriptions', prescriptionController.getPrescriptions);

// Create a new prescription
router.post('/:userId/newPrescription', prescriptionController.createPrescription);

// Edit a specific prescription
router.put('/:id', prescriptionController.editPrescription);

// Delete a specific prescription
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
