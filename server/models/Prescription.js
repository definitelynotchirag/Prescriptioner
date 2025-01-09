// models/Prescription.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Medicine = require('./Medication');

const PrescriptionSchema = new Schema({
  doctorName: String,
  doctorLicense: String,
  patientName: String,
  patientAge: Number,
  patientGender: String,
  diagnosis: String,
  imageUrl : String,
  title : String,
  date: { type: Date, default: Date.now },
 
  userId: { type: Schema.Types.ObjectId, ref: 'User' } // Reference to the User model
});

// Export the Prescription model
module.exports = mongoose.model('Prescription', PrescriptionSchema);
