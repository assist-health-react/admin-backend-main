const mongoose = require('mongoose');

const AhSpecialtySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model(
  'AhSpecialty',
  AhSpecialtySchema,
  'ah-specialties'
);
