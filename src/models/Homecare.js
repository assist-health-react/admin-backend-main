const mongoose = require("mongoose");

const coverageAddressSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  street: { type: String, required: true },        // renamed
  region: { type: String, required: true },        // was area
  city: { type: String, required: true },
  state: { type: String, required: true },         // added
  country: { type: String, default: "India" },     // added
  pincode: { type: String, required: true },
});

const homecareSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },

    servicetype: {
      type: String,
      enum: ["Home Visit", "Centre", "Both"],
      required: true
    },

    website: { type: String, default: "" },

    // Main Address (Centre)
    address: {
      street: { type: String },
      region: { type: String },    // changed from area
      city: { type: String },
      state: { type: String },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    gstNumber: { type: String, default: "" },

    services: {
      type: [String],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0,
    },

    introduction: { type: String, default: "" },

    // MULTIPLE HOMECARE LOCATIONS
    addresses: {
      type: [coverageAddressSchema],
      default: [],
    },

    languagesSpoken: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homecare", homecareSchema);
