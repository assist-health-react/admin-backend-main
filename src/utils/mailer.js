const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
  } else {
    console.log('✅ SMTP server ready to send emails');
  }
});
module.exports = transporter;
