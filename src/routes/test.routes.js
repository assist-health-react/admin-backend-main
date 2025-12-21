const express = require('express');
const router = express.Router();
const emailService = require('../utils/emailService');

router.get('/test-email', async (req, res) => {
  try {
    await emailService.sendAssignMemberMail({
      toEmail: req.query.email,
      toName: 'External User',
      memberName: 'Assigned Member',
      memberEmail: 'sivabs123@gmail.com',
      memberPhone: '9000000000'
    });

    res.json({ status: 'success', message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
