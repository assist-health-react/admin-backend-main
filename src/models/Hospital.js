const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },

    // Address Details
    address: { type: String, required: true },
    area: { type: String, required: true },       // REGION
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "India" },  // ✔ ADDED
    pincode: { type: String, required: true },

    gstNumber: { type: String },

    // Services & Departments
    department: [{ type: String }],   // ✔ Keep this
    services: [{ type: String }],
    subServices: [{ type: String }],

    // ❌ REMOVE "departments" (duplicate)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", HospitalSchema);
