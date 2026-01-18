const { Doctor, Appointment, Member, Navigator, AuthCredential } = require('../models');
const { logger } = require('../utils/logger');
const emailService = require('../utils/emailService');
const mongoose = require('mongoose');
const pdfService = require('../utils/pdfService');
const bcrypt = require("bcryptjs");
const AhSpecialty = require('../models/ah-specialty.model');//2026

class DoctorController {
  constructor() {
    this.createDoctor = this.createDoctor.bind(this);
    this.updateDoctor = this.updateDoctor.bind(this);
    this.getDoctor = this.getDoctor.bind(this);
    // ... bind other methods that use this._convertTimeSlots ...
  }

  /**
   * Convert payload time slots to schema format
   */
  _convertTimeSlots(timeSlots) {
    const convertedSlots = [];
    timeSlots.forEach(daySlot => {
      daySlot.slots.forEach(slot => {
        const [from, to] = slot.split('|').map(time => time.trim());
        convertedSlots.push({
          day: daySlot.day.toLowerCase(),
          from,
          to
        });
      });
    });
    return convertedSlots;
  }

  /**
   * Convert schema time slots to payload format
   */
  _convertTimeSlotsToPayload(timeSlots) {
    const slotsByDay = {};
    
    timeSlots.forEach(slot => {
      if (!slotsByDay[slot.day]) {
        slotsByDay[slot.day] = [];
      }
      slotsByDay[slot.day].push(`${slot.from} | ${slot.to}`);
    });

    return Object.entries(slotsByDay).map(([day, slots]) => ({
      day,
      slots
    }));
  }

  /**
   * Create new doctor
   */
  // async createDoctor(req, res) {
  //   try {
  //     const {
  //       name,
  //       email,
  //       phone,
  //       profilePic,
  //       digitalSignature,
  //       gender,
  //       specializations = [],
  //       qualification = [],
  //       medicalCouncilRegistrationNumber,
  //       experienceYears = 0,
  //       languagesSpoken = [],
  //       serviceTypes = ['online'],
  //       introduction = '',
  //       onlineConsultationTimeSlots = [],
  //       offlineConsultationTimeSlots = [],
  //       offlineAddress = {},
  //       areas = []
  //     } = req.body;

  //     // Validate required fields
  //     if (!name || !email || !phone || !medicalCouncilRegistrationNumber) {
  //       return res.status(400).json({
  //         status: 'error',
  //         message: 'Name, email, phone, and medical council registration number are required'
  //       });
  //     }

  //     // Validate gender enum
  //     if (gender && !['male', 'female', 'other'].includes(gender)) {
  //       return res.status(400).json({
  //         status: 'error',
  //         message: 'Invalid gender value. Must be male, female, or other'
  //       });
  //     }

  //     // Check if doctor already exists
  //     const existingDoctor = await Doctor.findOne({
  //       $or: [{ email }, { phone }]
  //     });

  //     if (existingDoctor) {
  //       return res.status(400).json({
  //         status: 'error',
  //         message: 'Doctor already exists with this email or phone'
  //       });
  //     }

  //     const existingAuthCredential = await AuthCredential.findOne({
  //       $or: [{ email }, { phone }]
  //     });

  //     if (existingAuthCredential) {
  //       return res.status(400).json({
  //         status: 'error',
  //         message: `${existingAuthCredential.userType} already exists with this email or phone`
  //       });
  //     }
      
  //     // Convert time slots to schema format
  //     const convertedOnlineSlots = this._convertTimeSlots(onlineConsultationTimeSlots);
  //     const convertedOfflineSlots = this._convertTimeSlots(offlineConsultationTimeSlots);

  //     // Create doctor with converted time slots
  //     const doctor = await Doctor.create({
  //       name,
  //       email,
  //       phone,
  //       profilePic,
  //       digitalSignature,
  //       gender,
  //       specializations,
  //       qualification,
  //       medicalCouncilRegistrationNumber,
  //       experienceYears,
  //       languagesSpoken,
  //       serviceTypes,
  //       introduction,
  //       onlineConsultationTimeSlots: convertedOnlineSlots,
  //       offlineConsultationTimeSlots: convertedOfflineSlots,
  //       offlineAddress,
  //       areas
  //     });

  //     // //create a auth credential for the navigator
  //     // const authCredential = await AuthCredential.create({
  //     //   userId: doctor._id,
  //     //   email,
  //     //   phoneNumber: phone,
  //     //   phone,
  //     //   password: null,
  //     //   userType: 'doctor',
  //     //   temporaryPassword: {
  //     //     password: null,
  //     //     expiresAt: null
  //     //   },
        
  //     //   isFirstLogin: true,
  //     //   passwordResetRequired: true
  //     // });

  //     // await authCredential.save();

  //     // //send welcome email to the doctor
  //     //  const toObj = {
  //     //   name: name,
  //     //   email: email
  //     //  }
  //     //  emailService.sendEmail('welcome', toObj, {
  //     //   number: phone,
  //     //   name: name
  //     //  });

  //     // after doctor is created
  //     // const rawName = name.replace(/\s+/g, "");
  //     // const namePart = rawName.substring(0, 4).toUpperCase();

  //     // // extract birth year from dob (if exists)
  //     // let birthYear = "";
  //     // if (req.body.dob) {
  //     //   const dobDate = new Date(req.body.dob);
  //     //   if (!isNaN(dobDate)) {
  //     //     birthYear = dobDate.getFullYear().toString();
  //     //   }
  //     // }

  //     // // generate deterministic password
  //     // const rawPassword = birthYear
  //     //   ? `${namePart}@${birthYear}`
  //     //   : `${namePart}@`;

  //     // const hashedPassword = await bcrypt.hash(rawPassword, 12);

  //     const rawName = name.replace(/\s+/g, "");
  //     const namePart = rawName.substring(0, 4).toUpperCase();

  //     // extract last 3 digits from doctorId
  //     let last3 = "";

  //     if (doctor.doctorId && doctor.doctorId.length >= 3) {
  //       last3 = doctor.doctorId.slice(-3);
  //     }

  //     // generate password
  //     const rawPassword = last3
  //       ? `${namePart}@${last3}`
  //       : `${namePart}@`;

  //     const hashedPassword = await bcrypt.hash(rawPassword, 12);

  //     // create auth credential
  //     const authCredential = await AuthCredential.create({
  //       userId: doctor._id,
  //       email,
  //       phoneNumber: phone,
  //       userType: "doctor",

  //       password: hashedPassword,          // ✅ real password
  //       isFirstLogin: false,                 // ✅ force reset
  //       passwordResetRequired: false         // ✅ force reset

  //       // ❌ DO NOT SET temporaryPassword
  //     });

  //     await authCredential.save();


  //     await emailService.sendWelcomeDoctorMail({
  //       toEmail: email,
  //       name,
  //       phone,
  //       doctorId: doctor.doctorId
  //     });


  //     res.status(201).json({
  //       status: 'success',
  //       data: doctor
  //     });
  //   } catch (error) {
  //     logger.error('Create doctor error:', error);
  //     res.status(500).json({
  //       status: 'error',
  //       message: 'Error creating doctor',
  //       details: error.message
  //     });
  //   }
  // }
  //17.1.26
  async createDoctor(req, res) {
  try {
    const {
      name,
      email,
      phone,
      profilePic,
      digitalSignature,
      gender,
      specializations = [],
      qualification = [],
      medicalCouncilRegistrationNumber,
      experienceYears = 0,
      languagesSpoken = [],
      serviceTypes = ['online'],
      introduction = '',
      onlineConsultationTimeSlots = [],
      offlineConsultationTimeSlots = [],
      offlineAddress = {},
      areas = [],
      customSpeciality // 👈 from frontend
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !medicalCouncilRegistrationNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, phone, and medical council registration number are required'
      });
    }

    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid gender value'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingDoctor) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor already exists with this email or phone'
      });
    }

    const existingAuthCredential = await AuthCredential.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingAuthCredential) {
      return res.status(400).json({
        status: 'error',
        message: `${existingAuthCredential.userType} already exists with this email or phone`
      });
    }

    // ================= SPECIALIZATION NORMALIZATION =================

    let specializationIds = [];

    // Normal selected IDs (exclude "other")
    const normalIds = specializations.filter(id => id !== 'other');

    // Handle "Others"
    if (specializations.includes('other') && customSpeciality) {
      const name = customSpeciality.trim();

      let specialty = await AhSpecialty.findOne({
        name: new RegExp(`^${name}$`, 'i')
      });

      if (!specialty) {
        specialty = await AhSpecialty.create({ name });
      }

      specializationIds.push(specialty._id);
    }

    specializationIds = [...new Set([...normalIds, ...specializationIds])];

    // ================================================================

    const convertedOnlineSlots = this._convertTimeSlots(onlineConsultationTimeSlots);
    const convertedOfflineSlots = this._convertTimeSlots(offlineConsultationTimeSlots);

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      profilePic,
      digitalSignature,
      gender,
      specializations: specializationIds, // ✅ FIXED
      qualification,
      medicalCouncilRegistrationNumber,
      experienceYears,
      languagesSpoken,
      serviceTypes,
      introduction,
      onlineConsultationTimeSlots: convertedOnlineSlots,
      offlineConsultationTimeSlots: convertedOfflineSlots,
      offlineAddress,
      areas
    });

    // ================= PASSWORD + AUTH =================

    const rawName = name.replace(/\s+/g, "");
    const namePart = rawName.substring(0, 4).toUpperCase();

    let last3 = "";
    if (doctor.doctorId && doctor.doctorId.length >= 3) {
      last3 = doctor.doctorId.slice(-3);
    }

    const rawPassword = last3 ? `${namePart}@${last3}` : `${namePart}@`;
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const authCredential = await AuthCredential.create({
      userId: doctor._id,
      email,
      phoneNumber: phone,
      userType: "doctor",
      password: hashedPassword,
      isFirstLogin: false,
      passwordResetRequired: false
    });

    await authCredential.save();

    await emailService.sendWelcomeDoctorMail({
      toEmail: email,
      name,
      phone,
      doctorId: doctor.doctorId
    });

    res.status(201).json({
      status: 'success',
      data: doctor
    });

  } catch (error) {
    logger.error('Create doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating doctor',
      details: error.message
    });
  }
}

  /**
   * Get all doctors with filters and pagination
   */
  async getAllDoctors(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        doctorName,
        doctorId,
        serviceType,
        pincode,
        gender,
        rating,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {};

      // Search by name, email, phone, or doctorId
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { doctorId: { $regex: search, $options: 'i' } },
          { medicalCouncilRegistrationNumber: { $regex: search, $options: 'i' } }
        ];
      }

      // Filter by doctor name
      if (doctorName) {
        query.name = { $regex: doctorName, $options: 'i' };
      }

      // Filter by doctorId
      if (doctorId) {
        query.doctorId = doctorId;
      }

      // Filter by service type
      if (serviceType) {
        query.serviceTypes = { $in: serviceType.split(',').map(type => type.trim()) };
      }

      // Filter by pincode from areas
      if (pincode) {
        query['areas.pincode'] = pincode;
      }

      // Filter by gender
      if (gender) {
        query.gender = gender;
      }

      // Filter by rating
      if (rating) {
        query.rating = parseFloat(rating);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      };

      // First check if there are any doctors
      const totalDocs = await Doctor.countDocuments(query);

      if (totalDocs === 0) {
        return res.json({
          status: 'success',
          data: [],
          pagination: {
            total: 0,
            page: parseInt(page),
            pages: 0,
            limit: parseInt(limit)
          }
        });
      }

      //const doctors = await Doctor.paginate(query, options);
      const doctors = await Doctor.paginate(query, {
      ...options,
      populate: {
        path: 'specializations',
        select: 'name'
      }
    });


      res.json({
        status: 'success',
        data: doctors.docs,
        pagination: {
          total: doctors.totalDocs,
          page: doctors.page,
          pages: doctors.totalPages,
          limit: doctors.limit
        }
      });
    } catch (error) {
      logger.error('Get all doctors error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching doctors'
      });
    }
  }

  /**
   * Get doctor by ID
   */
  async getDoctor(req, res) {
    try {
      const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'specializations',
        select: 'name'
      })
        .populate({
          path: 'navigatorId',
          select: '_id name navigatorId profilePic',
          model: 'Navigator'
        });

      if (!doctor) {
        return res.status(404).json({
          status: 'error',
          message: 'Doctor not found'
        });
      }

      // Update total_assigned_members count
      const totalMembers = await Member.countDocuments({
        'healthcareTeam.doctor._id': new mongoose.Types.ObjectId(req.params.id)
      });
      
      // Update the doctor's total_assigned_members
      doctor.total_assigned_members = totalMembers;
      await doctor.save();

      // Convert time slots to payload format
      const doctorData = doctor.toObject();
      doctorData.onlineConsultationTimeSlots = this._convertTimeSlotsToPayload(doctor.onlineConsultationTimeSlots);
      doctorData.offlineConsultationTimeSlots = this._convertTimeSlotsToPayload(doctor.offlineConsultationTimeSlots);

      if (doctor && doctor.navigatorAssigned && doctor.navigatorId) {
        doctorData.navigator = {
          _id: doctor.navigatorId._id,
          name: doctor.navigatorId.name, 
          navigatorId: doctor.navigatorId.navigatorId
        };
      }

      res.json({
        status: 'success',
        data: doctorData
      });
    } catch (error) {
      logger.error('Get doctor error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching doctor'
      });
    }
  }

  /**
   * Update doctor profile
   */
  // async updateDoctor(req, res) {
  //   try {
  //     const {
  //       name,
  //       email,
  //       phone,
  //       profilePic,
  //       gender,
  //       digitalSignature,
  //       specializations,
  //       qualification,
  //       medicalCouncilRegistrationNumber,
  //       experienceYears,
  //       languagesSpoken,
  //       serviceTypes,
  //       introduction,
  //       onlineConsultationTimeSlots,
  //       offlineConsultationTimeSlots,
  //       offlineAddress,
  //       areas
  //     } = req.body;

  //     const doctor = await Doctor.findById(req.params.id);

  //     if (!doctor) {
  //       return res.status(404).json({
  //         status: 'error',
  //         message: 'Doctor not found'
  //       });
  //     }

  //     // Check if email or phone is already in use
  //     if (email || phone) {
  //       const existingDoctor = await Doctor.findOne({
  //         _id: { $ne: req.params.id },
  //         $or: [
  //           { email: email || doctor.email },
  //           { phone: phone || doctor.phone }
  //         ]
  //       });

  //       if (existingDoctor) {
  //         return res.status(400).json({
  //           status: 'error',
  //           message: 'Email or phone number already in use'
  //         });
  //       }
  //     }

  //     const existingAuthCredential = await AuthCredential.findOne({
  //       $or: [{ email }, { phone }]
  //     });

  //     if (existingAuthCredential) {
  //       return res.status(400).json({
  //         status: 'error',
  //         message: `${existingAuthCredential.userType} already exists with this email or phone`
  //       });
  //     }

  //     const updateData = {
  //       ...(name && { name }),
  //       ...(email && { email }),
  //       ...(phone && { phone }),
  //       ...(gender && { gender }),
  //       ...(profilePic && { profilePic }),
  //       ...(digitalSignature && { digitalSignature }),
  //       ...(specializations && { specializations }),
  //       ...(qualification && { qualification }),
  //       ...(medicalCouncilRegistrationNumber && { medicalCouncilRegistrationNumber }),
  //       ...(experienceYears && { experienceYears }),
  //       ...(languagesSpoken && { languagesSpoken }),
  //       ...(serviceTypes && { serviceTypes }),
  //       ...(introduction && { introduction }),
  //       ...(offlineAddress && { offlineAddress }),
  //       ...(areas && { areas })
  //     };

  //     // Convert time slots if provided
  //     if (onlineConsultationTimeSlots) {
  //       updateData.onlineConsultationTimeSlots = this._convertTimeSlots(onlineConsultationTimeSlots);
  //     }
  //     if (offlineConsultationTimeSlots) {
  //       updateData.offlineConsultationTimeSlots = this._convertTimeSlots(offlineConsultationTimeSlots);
  //     }

  //     const updatedDoctor = await Doctor.findByIdAndUpdate(
  //       req.params.id,
  //       updateData,
  //       { new: true }
  //     );

  //     // Convert time slots back to payload format for response
  //     const responseData = updatedDoctor.toObject();
  //     responseData.onlineConsultationTimeSlots = this._convertTimeSlotsToPayload(updatedDoctor.onlineConsultationTimeSlots);
  //     responseData.offlineConsultationTimeSlots = this._convertTimeSlotsToPayload(updatedDoctor.offlineConsultationTimeSlots);

  //     res.json({
  //       status: 'success',
  //       data: responseData
  //     });
  //   } catch (error) {
  //     logger.error('Update doctor error:', error);
  //     res.status(500).json({
  //       status: 'error',
  //       message: 'Error updating doctor'
  //     });
  //   }
  // }
   //17.1.26
   async updateDoctor(req, res) {
  try {
    const {
      name,
      email,
      phone,
      profilePic,
      gender,
      digitalSignature,
      specializations,
      qualification,
      medicalCouncilRegistrationNumber,
      experienceYears,
      languagesSpoken,
      serviceTypes,
      introduction,
      onlineConsultationTimeSlots,
      offlineConsultationTimeSlots,
      offlineAddress,
      areas,
      customSpeciality // 👈 from frontend
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Email / phone check
    // if (email || phone) {
    //   const existingDoctor = await Doctor.findOne({
    //     _id: { $ne: req.params.id },
    //     $or: [
    //       { email: email || doctor.email },
    //       { phone: phone || doctor.phone }
    //     ]
    //   });

    //   if (existingDoctor) {
    //     return res.status(400).json({
    //       status: 'error',
    //       message: 'Email or phone number already in use'
    //     });
    //   }
    // }

    // const existingAuthCredential = await AuthCredential.findOne({
    //   $or: [{ email }, { phone }]
    // });

    // if (existingAuthCredential) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: `${existingAuthCredential.userType} already exists with this email or phone`
    //   });
    // }

    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(gender && { gender }),
      ...(profilePic && { profilePic }),
      ...(digitalSignature && { digitalSignature }),
      ...(qualification && { qualification }),
      ...(medicalCouncilRegistrationNumber && { medicalCouncilRegistrationNumber }),
      ...(experienceYears && { experienceYears }),
      ...(languagesSpoken && { languagesSpoken }),
      ...(serviceTypes && { serviceTypes }),
      ...(introduction && { introduction }),
      ...(offlineAddress && { offlineAddress }),
      ...(areas && { areas })
    };

    // ================= SPECIALIZATION NORMALIZATION =================

    if (specializations) {
      let specializationIds = [];

      const normalIds = specializations.filter(id => id !== 'other');

      if (specializations.includes('other') && customSpeciality) {
        const name = customSpeciality.trim();

        let specialty = await AhSpecialty.findOne({
          name: new RegExp(`^${name}$`, 'i')
        });

        if (!specialty) {
          specialty = await AhSpecialty.create({ name });
        }

        specializationIds.push(specialty._id);
      }

      specializationIds = [...new Set([...normalIds, ...specializationIds])];
      updateData.specializations = specializationIds; // ✅ FIXED
    }

    // ================================================================

    if (onlineConsultationTimeSlots) {
      updateData.onlineConsultationTimeSlots = this._convertTimeSlots(onlineConsultationTimeSlots);
    }

    if (offlineConsultationTimeSlots) {
      updateData.offlineConsultationTimeSlots = this._convertTimeSlots(offlineConsultationTimeSlots);
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    const responseData = updatedDoctor.toObject();
    responseData.onlineConsultationTimeSlots =
      this._convertTimeSlotsToPayload(updatedDoctor.onlineConsultationTimeSlots);
    responseData.offlineConsultationTimeSlots =
      this._convertTimeSlotsToPayload(updatedDoctor.offlineConsultationTimeSlots);

    res.json({
      status: 'success',
      data: responseData
    });

  } catch (error) {
    logger.error('Update doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating doctor'
    });
  }
}

  /**
   * Get doctor's appointments
   */
  async getDoctorAppointments(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        date,
        sortBy = 'appointmentDateTime',
        sortOrder = 'desc'
      } = req.query;

      const query = {
        doctorId: req.params.id
      };

      if (status) {
        query.status = status;
      }

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        query.appointmentDateTime = {
          $gte: startDate,
          $lt: endDate
        };
      }

      const appointments = await Appointment.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('memberId', 'name email phone');

      const total = await Appointment.countDocuments(query);

      res.json({
        status: 'success',
        data: appointments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      logger.error('Get doctor appointments error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching appointments'
      });
    }
  }

  /**
   * Get doctor's assigned members
   */
  async getDoctorMembers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {
        'healthcareTeam.doctor._id': req.params.id
      };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      const members = await Member.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Member.countDocuments(query);

      res.json({
        status: 'success',
        data: members,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      logger.error('Get doctor members error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching members'
      });
    }
  }

  /**
   * Get doctor's availability
   */
  async getDoctorAvailability(req, res) {
    try {
      const { date } = req.query;
      const doctorId = req.params.id;

      // Get doctor's time slots
      const doctor = await Doctor.findById(doctorId)
        .select('onlineConsultationTimeSlots offlineConsultationTimeSlots');

      if (!doctor) {
        return res.status(404).json({
          status: 'error',
          message: 'Doctor not found'
        });
      }

      // Get booked appointments for the date
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      const bookedAppointments = await Appointment.find({
        doctorId,
        appointmentDateTime: {
          $gte: startDate,
          $lt: endDate
        },
        status: { $ne: 'cancelled' }
      }).select('appointmentDateTime appointmentType');

      // Calculate available slots
      const dayOfWeek = new Date(date).getDay();
      const availableSlots = {
        online: doctor.onlineConsultationTimeSlots.filter(slot => 
          slot.day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek].toLowerCase()
        ),
        offline: doctor.offlineConsultationTimeSlots.filter(slot => 
          slot.day.toLowerCase() === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek].toLowerCase()
        )
      };

      res.json({
        status: 'success',
        data: {
          availableSlots,
          bookedAppointments
        }
      });
    } catch (error) {
      logger.error('Get doctor availability error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching availability'
      });
    }
  }

  /**
   * Delete doctor
   */
  async deleteDoctor(req, res) {
    try {
      const doctor = await Doctor.findById(req.params.id);

      if (!doctor) {
        return res.status(404).json({
          status: 'error',
          message: 'Doctor not found'
        });
      }

          // Delete the doctor
    await Doctor.findByIdAndDelete(doctor._id);
    
    // Delete associated auth credentials
    await AuthCredential.deleteOne({ userId: doctor._id, userType: 'doctor' });

    res.json({
        status: 'success',
        message: 'Doctor deleted successfully'
      });
    } catch (error) {
      logger.error('Delete doctor error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting doctor'
      });
    }
  }

  async assignNavigator(req, res) {
    try {
      const { doctorId, navigatorId } = req.body;
      const doctor = await Doctor.findById(doctorId);
      const navigator = await Navigator.findById(navigatorId);
      if (!doctor || !navigator) {
        return res.status(404).json({
          status: 'error',
          message: 'Doctor or navigator not found'
        });
      }
      doctor.navigatorAssigned = true;
      doctor.navigatorId = navigatorId;
      await doctor.save();
      res.json({
        status: 'success',
        message: 'Navigator assigned to doctor successfully'
      });
    } catch (error) {
      logger.error('Assign navigator error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error assigning navigator'
      });
    }
  }

  async getDoctorStats(req, res) {
    try {
      // let userId = req.user.userId;
      // const doctor = await Doctor.findById(userId);
      // if (!doctor) {
      //   return res.status(404).json({
      //     status: 'error',
      //     message: 'Doctor not found'
      //   });
      // }
      // const doctorId = doctor._id;

      // const stats = {
      //   totalMembers: await Member.countDocuments({ active: true }),
      //   totalNavigators: await Navigator.countDocuments({ }),
      //   recentAppointments: await Appointment.find({ doctorId }).sort({ appointmentDateTime: -1 }).limit(5),
      //   totalAppointments: await Appointment.countDocuments({ doctorId }),
      // };
      // let upcomingAppointments = await Appointment.find({ doctorId, appointmentDateTime: { $gt: new Date() } }).sort({ appointmentDateTime: 1 }).limit(5);
      // let todayAppointments = await Appointment.find({ doctorId, appointmentDateTime: { $gte: new Date(), $lt: new Date(new Date().setDate(new Date().getDate() + 1)) } }).sort({ appointmentDateTime: 1 }).populate('memberId', 'name email phone');

      // res.json({
      //   status: 'success',
      //   data: {
      //     stats,
      //     upcomingAppointments,
      //     todayAppointments
      //   }
      // });
      let userId = req.user.userId;
            console.log(`userId: ${userId}`);
            let userType = req.user.userType;
            console.log(`userType: ${userType}`);
            let stats, members, doctors, appointments, pending, ongoing, completed, newMembers;
            if(userType === 'doctor') {
              members = await Member.find({isStudent: false, 'healthcareTeam.doctor._id': new mongoose.Types.ObjectId(userId)}).countDocuments();
            //  doctors = await Doctor.find({navigatorId: new mongoose.Types.ObjectId(userId)}).countDocuments();
              appointments = await Appointment.find({doctorId: new mongoose.Types.ObjectId(userId)}).countDocuments();
              pending = await Appointment.find({doctorId: new mongoose.Types.ObjectId(userId), status: 'pending'}).countDocuments();
              ongoing = await Appointment.find({doctorId: new mongoose.Types.ObjectId(userId), status: 'ongoing'}).countDocuments();
              completed = await Appointment.find({doctorId: new mongoose.Types.ObjectId(userId), status: 'completed'}).countDocuments();
              newMembers = await Member.find({
                isStudent: false,
                $or: [
                  { 'healthcareTeam.doctor': { $exists: false } },
                  { 'healthcareTeam.doctor': null },
                  { 'healthcareTeam.doctor._id': { $exists: false } }
                ]
              }).countDocuments();
            }
             
            stats = {
              members,
              doctors,
              appointments,
              pending,
              ongoing,
              completed,
              newMembers
            };
      
            res.json({
              status: 'success',
              data: stats
            });
    } catch (error) {
      logger.error('Get doctor stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching doctor stats'
      });
    }
  }

  /**
   * Generate doctor profile PDF
   */
  async generateProfile(req, res) {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({
          status: 'error',
          message: 'Doctor not found'
        });
      }

      const result = await pdfService.generateDoctorProfilePdf(doctor, res);

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      logger.error('Doctor profile generation error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error generating doctor profile'
      });
    }
  }
}

module.exports = new DoctorController(); 