const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    name: { type: String }, // "MEDICINE_NAME"
    dosage: { 
        morning: { type: Number },
        afternoon: { type: Number },
        evening: { type: Number },
        night: { type: Number }
    }, // Dosage object with timing fields
    timing: { type: String }, // "Before/After Food"
    duration: { type: String }, // "X Days"
     // Total quantity of the medication
    userId: { type: String }, // "USER_ID"
    prescriptionId: { type: String , required: true} // "PRESCRIPTION_ID"
});

module.exports = mongoose.model('Medication', MedicationSchema);
