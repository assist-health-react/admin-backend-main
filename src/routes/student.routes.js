const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const auth = require('../middlewares/auth');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const multer = require('multer');

/* =========================
   VALIDATIONS
========================= */
const createStudentValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^\+?[\d\s-]+$/).withMessage('Valid phone number required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('studentDetails.schoolId').notEmpty().withMessage('School ID is required'),
  body('studentDetails.grade').notEmpty().withMessage('Grade is required'),
  body('studentDetails.section').notEmpty().withMessage('Section is required')
];

const updateStudentValidation = [
  body('email').optional().isEmail(),
  body('phone').optional().matches(/^\+?[\d\s-]+$/),
  body('gender').optional().isIn(['male', 'female', 'other'])
];

/* =========================
   FILE UPLOAD (CSV)
========================= */
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') cb(null, true);
    else cb(new Error('Only CSV files are allowed'));
  }
});

/* =========================
   ROUTES
========================= */

/**
 * CREATE STUDENT
 * - Creates student in students collection
 * - Creates AuthCredential
 * - Default password: "student"
 */
router.post('/',
  auth.protect(['admin', 'navigator', 'nurse']),
  createStudentValidation,
  validate,
  studentController.createStudent
);

/**
 * GET ALL STUDENTS
 * - Pagination
 * - Filters: schoolId, grade, section, search
 */
router.get('/',
  auth.protect(['admin', 'navigator', 'doctor', 'nurse']),
  studentController.getAllStudents
);

/**
 * GET STUDENT BY ID
 */
router.get('/:id',
  auth.protect(['admin', 'navigator', 'doctor', 'nurse', 'student']),
  studentController.getStudentById
);

/**
 * UPDATE STUDENT
 */
router.put('/:id',
  auth.protect(['admin', 'navigator']),
  updateStudentValidation,
  validate,
  studentController.updateStudent
);

/**
 * DELETE (SOFT DELETE) STUDENT
 */
router.delete('/:id',
  auth.protect(['admin', 'navigator']),
  studentController.deleteStudent
);

/**
 * BULK INSERT STUDENTS (CSV)
 * Optional – if you later add bulk student controller
 */
router.post('/bulk-insert/:schoolId',
  auth.protect(['admin', 'navigator']),
  upload.single('file'),
  studentController.bulkInsertStudents
);

/**
 * BULK UPDATE STUDENTS (CSV)
 */
router.post('/bulk-update',
  auth.protect(['admin', 'navigator']),
  upload.single('file'),
  studentController.bulkUpdateStudents
);


// Add sibling / family member
router.post(
  '/:parentStudentId/sub-student',
  auth.protect(['student', 'admin', 'navigator']),
  studentController.addSubStudent
);

// Get sub profiles of a student
router.get(
  '/:id/sub-students',
  auth.protect(['student', 'admin', 'navigator']),
  studentController.getSubStudents
);

router.get('/sub-profiles/:parentId', studentController.getSubProfilesByParent);

module.exports = router;
