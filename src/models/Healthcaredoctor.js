const mongoose = require("mongoose");

const TimeSlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: [{ type: String }],
});

const AreaSchema = new mongoose.Schema(
  {
    pincode: String,
    region: String,
  },
  { _id: false }
);

const HomeVisitLocationSchema = new mongoose.Schema({
  locationName: String,
  days: [{ type: String }],
  fromTime: String,
  toTime: String,
  areas: [
    {
      pincode: String,
      region: String,
    },
  ],
});

// ❤️ NEW — Shared Address Structure (AddressSection)
const AddressInfoSchema = new mongoose.Schema(
  {
    description: String,
    landmark: String,
    region: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    qualification: [{ type: String }],
    medicalCouncilRegistrationNumber: String,
    experienceYears: Number,
    languagesSpoken: [{ type: String }],

    specialty: String,
    specializations: [{ type: String }],
    serviceTypes: [{ type: String }],

    areas: [AreaSchema],

    // ❤️ NEW — two offline location address blocks
    offlineAddress1: AddressInfoSchema,
    offlineAddress2: AddressInfoSchema,

    onlineConsultationTimeSlots: [TimeSlotSchema],
    offlineConsultationTimeSlots: [TimeSlotSchema],

    homeVisitEnabled: { type: Boolean, default: false },
    homeVisitLocations: [HomeVisitLocationSchema],

    photoUrl: String,
    photoPublicId: String,
    digitalSignature: String,
    introduction: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthcareDoctor", DoctorSchema);
