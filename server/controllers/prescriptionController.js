const User = require('../models/User'); 
const Prescription = require('../models/Prescription');

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { doctorName, doctorLicense, patientName, patientAge, patientGender, diagnosis, imageUrl, title } = req.body;

    const newPrescription = new Prescription({
      userId: userId,
      doctorName,
      doctorLicense,
      patientName,
      patientAge,
      patientGender,
      diagnosis,
      imageUrl, title
     // An array of medicine objects
    });

    await newPrescription.save();

    console.log("Presc", newPrescription)

    res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Error creating prescription' });
  }
};

// Update a prescription
exports.editPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorName, doctorLicense, patientName, patientAge, patientGender, diagnosis, medicines } = req.body;

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      { doctorName, doctorLicense, patientName, patientAge, patientGender, diagnosis, medicines },
      { new: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(updatedPrescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ message: 'Error updating prescription' });
  }
};

// Delete a prescription
exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPrescription = await Prescription.findByIdAndDelete(id);

    if (!deletedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ message: 'Error deleting prescription' });
  }
};

// Get all prescriptions for a user
exports.getPrescriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const prescriptions = await Prescription.find({ userId: userId });
    res.json(prescriptions);  
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
};
