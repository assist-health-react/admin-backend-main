const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student.model');
const AuthCredential = require('../models/auth-credential.model');
const { logger } = require('../utils/logger');

class StudentController {

  /**
   * CREATE STUDENT
   * - Saves in students collection
   * - Creates AuthCredential
   * - Common password: "student"
   * - Email must be unique
   */
  async createStudent(req, res) {
    try {
      const {
        name,
        email,
        phone,
        dob,
        gender,
        bloodGroup,
        address,
        studentDetails,
        emergencyContact,
        onBoarded = false,
        termsConditionsAccepted = false
      } = req.body;

      /* ----------------------------
         VALIDATIONS
      ----------------------------- */
      if (!name || !phone || !studentDetails?.schoolId) {
        return res.status(400).json({
          status: 'error',
          message: 'Name, phone and studentDetails.schoolId are required'
        });
      }

      // Email must be unique (Auth + Student)
      if (email) {
        const emailExists = await AuthCredential.findOne({ email });
        if (emailExists) {
          return res.status(400).json({
            status: 'error',
            message: 'Email already exists'
          });
        }
      }

      /* ----------------------------
         CREATE STUDENT
      ----------------------------- */
      const student = new Student({
        name,
        email,
        phone,
        dob,
        gender,
        bloodGroup,
        address,
        studentDetails,
        emergencyContact,
        isStudent: true,
        isMember: true,
        active: true,
        onBoarded,
        termsConditionsAccepted,
        membershipStatus: {
          isRegistered: true,
          registrationDate: Date.now(),
          hasOneTimeRegistrationDiscount: false,
          premiumMembership: {
            isActive: true,
            startDate: Date.now(),
            expiryDate: Date.now() + (365.25 * 24 * 60 * 60 * 1000),
            renewalCount: 0
          }
        }
      });

      await student.save(); // triggers memberId generation

      /* ----------------------------
         CREATE AUTH CREDENTIAL
      ----------------------------- */
      const hashedPassword = await bcrypt.hash('student', 10);

      const authCredential = new AuthCredential({
        userId: student._id,
        email: student.email,
        phoneNumber: student.phone,
        password: hashedPassword,
        userType: 'student',
        memberId: student.memberId,
        temporaryPassword: {
          password: null,
          expiresAt: null
        },
        isFirstLogin: true,
        passwordResetRequired: true
      });

      await authCredential.save();

      res.status(201).json({
        status: 'success',
        data: student
      });

    } catch (error) {
      logger.error('Create student error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error creating student',
        details: error.message
      });
    }
  }

  /**
 * UPDATE STUDENT
 */
async updateStudent(req, res) {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Prevent memberId override
    delete req.body.memberId;

    Object.assign(student, req.body);
    await student.save();

    return res.json({
      status: 'success',
      data: student
    });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error updating student'
    });
  }
}


  /**
   * GET ALL STUDENTS (pagination + filters)
   */
  async getAllStudents(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        schoolId,
        grade,
        section,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {
        isStudent: true,
        active: true,
         isSubprofile: false
      };

      if (schoolId) query['studentDetails.schoolId'] = schoolId;
      if (grade) query['studentDetails.grade'] = grade;
      if (section) query['studentDetails.section'] = section;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { memberId: { $regex: search, $options: 'i' } }
        ];
      }
    

      const students = await Student.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Student.countDocuments(query);

      res.json({
        status: 'success',
        data: students,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
          limit: Number(limit)
        }
      });

    } catch (error) {
      logger.error('Get students error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching students'
      });
    }
  }

  /**
   * GET STUDENT BY ID
   */
  async getStudentById(req, res) {
    try {
      const student = await Student.findById(req.params.id);

      if (!student) {
        return res.status(404).json({
          status: 'error',
          message: 'Student not found'
        });
      }

      res.json({
        status: 'success',
        data: student
      });
    } catch (error) {
      logger.error('Get student error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error fetching student'
      });
    }
  }

  /**
   * DELETE STUDENT (soft delete)
   */
  async deleteStudent(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({
          status: 'error',
          message: 'Student not found'
        });
      }

      student.active = false;
      await student.save();

      await AuthCredential.updateOne(
        { userId: student._id },
        { $set: { active: false } }
      );

      res.json({
        status: 'success',
        message: 'Student deactivated successfully'
      });
    } catch (error) {
      logger.error('Delete student error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting student'
      });
    }
  }

  /**
 * BULK INSERT STUDENTS (CSV)
 */
async bulkInsertStudents(req, res) {
  return res.status(501).json({
    status: 'error',
    message: 'Bulk insert students not implemented yet'
  });
}

/**
 * BULK UPDATE STUDENTS (CSV)
 */
async bulkUpdateStudents(req, res) {
  return res.status(501).json({
    status: 'error',
    message: 'Bulk update students not implemented yet'
  });
}

/**
 * ADD SUB PROFILE (Sibling / Family Member)
 * - Same login as parent
 * - No AuthCredential
 */
async addSubStudent(req, res) {
  try {
    const { primaryStudentId } = req.body;

    if (!primaryStudentId || !mongoose.Types.ObjectId.isValid(primaryStudentId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid primaryStudentId is required'
      });
    }

    // Clean emergency contact
    if (req.body.emergencyContact) {
      Object.keys(req.body.emergencyContact).forEach(key => {
        if (!req.body.emergencyContact[key]) {
          delete req.body.emergencyContact[key];
        }
      });
    }

    const primaryStudent = await Student.findById(primaryStudentId);
    if (!primaryStudent) {
      return res.status(404).json({
        status: 'error',
        message: 'Primary student not found'
      });
    }

    const subStudent = new Student({
      ...req.body,
      isSubprofile: true,
      active: true
    });

    await subStudent.save();

    res.status(201).json({
      status: 'success',
      data: subStudent
    });

  } catch (error) {
    console.error('Add sub student error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

// async addSubStudent(req, res) {
//   try {
//     const { parentStudentId } = req.params;
//     const {
//       name,
//       dob,
//       gender,
//       bloodGroup,
//       studentDetails,
//       emergencyContact,
//       profilePic
//     } = req.body;

//     const parent = await Student.findById(parentStudentId);
//     if (!parent) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Parent student not found'
//       });
//     }

//     /* ----------------------------
//        CREATE SUB STUDENT
//     ----------------------------- */
//     const subStudent = new Student({
//       name,
//       dob,
//       gender,
//       bloodGroup,
//       studentDetails,

//       // 🔑 SAME CONTACT DETAILS
//       email: parent.email,
//       phone: parent.phone,

//       emergencyContact,
//       profilePic,

//       isStudent: true,
//       isSubprofile: true,
//       isMember: false,           // ❌ no membership
//       primaryStudentId: parent._id,
//       active: true
//     });

//     await subStudent.save();

//     /* ----------------------------
//        LINK TO PARENT
//     ----------------------------- */
//     parent.subprofileIds.push(subStudent._id);
//     await parent.save();

//     res.status(201).json({
//       status: 'success',
//       data: subStudent
//     });

//   } catch (error) {
//     console.error('Add sub student error:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to add sub student'
//     });
//   }
// }
async getSubStudents(req, res) {
  const subs = await Student.find({
    primaryStudentId: req.params.id,
    isSubprofile: true,
    active: true
  });

  res.json({
    status: 'success',
    data: subs
  });
}

// controllers/student.controller.js
 async getSubProfilesByParent(req, res)  {
  try {
    const { parentId } = req.params;
    console.log(parentId)

    const subProfiles = await Student.find({
      primaryStudentId:parentId,
      isSubprofile: true
    }).sort({ createdAt: 1 });

    return res.json({
      status: 'success',
      data: subProfiles
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sub profiles'
    });
  }
};

}

module.exports = new StudentController();
