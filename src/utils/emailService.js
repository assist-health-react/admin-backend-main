// const transporter = require('./mailer');
// const assignMemberTemplate = require('./emailTemplates/assignMember');
// class EmailService {
//   async sendAssignMemberMail({
//     toEmail,
//     toName,
//     memberName,
//     memberEmail,
//     memberPhone
//   }) {
//     try {
//       const html = assignMemberTemplate({
//         receiverName: toName,
//         name: memberName,
//         email: memberEmail,
//         phone: memberPhone
//       });

//       const info = await transporter.sendMail({
//         from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
//         to: `${toName} <${toEmail}>`,
//         subject: 'Member Assignment Notification',
//         html
//       });

//       console.log('✅ Email sent:', info.messageId);
//       return info;

//     } catch (error) {
//       console.error('❌ Email send failed:', error.message);
//       throw error;
//     }
//   }
// }

// module.exports = new EmailService();
//15.1.26
const transporter = require('./mailer');

const assignMemberTemplate = require('./emailTemplates/assignMember');
const welcomeMemberTemplate = require('./emailTemplates/welcomeMember');
const adminNewMemberTemplate = require('./emailTemplates/adminNewMember');
const welcomeNavigatorTemplate = require('./emailTemplates/welcomeNavigator');
const welcomeDoctorTemplate = require('./emailTemplates/welcomeDoctor');

class EmailService {

  // 🔹 generic sender
  async sendEmail({ to, subject, html }) {
    return transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
      to,
      subject,
      html
    });
  }

  // 🔹 existing (UNCHANGED)
  async sendAssignMemberMail({ toEmail, toName, memberName, memberEmail, memberPhone }) {
    const html = assignMemberTemplate({
      receiverName: toName,
      name: memberName,
      email: memberEmail,
      phone: memberPhone
    });

    return this.sendEmail({
      to: `${toName} <${toEmail}>`,
      subject: 'Member Assignment Notification',
      html
    });
  }

  // 🔹 NEW: Member Welcome Mail
  async sendWelcomeMemberMail({ toEmail, name, memberId, phone }) {
    const html = welcomeMemberTemplate({
      name,
      memberId,
      phone,
    //tempPassword
    });

    return this.sendEmail({
      to: toEmail,
      subject: 'Welcome to AssisHealth',
      html
    });
  }

  // 🔹 NEW: Admin Notification
  async sendAdminNewMemberMail({ name, email, phone, memberId }) {
    const html = adminNewMemberTemplate({
      name,
      email,
      phone,
      memberId
    });

    return this.sendEmail({
      to: process.env.MAIL_FROM_EMAIL,
      subject: 'New Member Created',
      html
    });
  }

// 🔹 NEW: Navigator Welcome Mail
  async sendWelcomeNavigatorMail({ toEmail, name, phone }) {
    const html = welcomeNavigatorTemplate({
      name,
      phone
    });

    return this.sendEmail({
      to: toEmail,
      subject: 'Welcome to AssisHealth – Navigator Login Instructions',
      html
    });
  }
  // 🔹 NEW: Doctor Welcome Mail
async sendWelcomeDoctorMail({ toEmail, name, phone, doctorId }) {
  const html = welcomeDoctorTemplate({ name, phone, doctorId });

  return this.sendEmail({
    to: toEmail,
    subject: 'Welcome to AssisHealth – Doctor Login Instructions',
    html
  });
}

}

module.exports = new EmailService();
