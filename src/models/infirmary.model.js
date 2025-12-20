const mongoose = require('mongoose');
const { Schema } = mongoose;

const InfirmarySchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  nurseId: { type: Schema.Types.ObjectId, ref: 'Nurse', },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  date: Date,
  time: String,
  consentFrom: {
  type: String,
  enum: [
    'parent',
    'guardian',
    'student',
    'teacher',
    'doctor',
    'nurse',
    'school authority'
  ],
  required: true
},
 // complaints: String,
 complaints: [
  {
    complaint: { type: String, required: true },
    details: String,
    treatment: String
  }
],
  details: String,
  treatmentGiven: String,
  // medicineProvided: {
  //   inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory' },
  //   quantity: Number
  // }
  medicineProvided: {
    medicineName: String,
    quantity: Number
  }
}, { timestamps: true });

// Add indexes
// InfirmarySchema.index({ studentId: 1 });
// InfirmarySchema.index({ date: 1 });
InfirmarySchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);
module.exports = mongoose.model('Infirmary', InfirmarySchema); 