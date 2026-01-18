require('dotenv').config();
const mongoose = require('mongoose');
const Specialty = require('../ah-specialty.model');
console.log(process.env.MONGODB_URI)
mongoose.connect(`mongodb+srv://balusiva1299:Siva2312@cluster0.avjoegu.mongodb.net/assistdb?retryWrites=true&w=majority&appName=Cluster0`);

const specialties = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Medicine",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Urology",
  "Gynecology",
  "ENT",
  "Dental",
  "Physiotherapy",
  "Ayurveda",
  "Homeopathy"
];

(async () => {
  try {
    const bulk = specialties.map(name => ({ name }));

    await Specialty.insertMany(bulk, { ordered: false });

    console.log("✅ Specialties seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
