const transporter = require('./mailer');
const assignMemberTemplate = require('./emailTemplates/assignMember');
class EmailService {
  async sendAssignMemberMail({
    toEmail,
    toName,
    memberName,
    memberEmail,
    memberPhone
  }) {
    try {
      const html = assignMemberTemplate({
        receiverName: toName,
        name: memberName,
        email: memberEmail,
        phone: memberPhone
      });

      const info = await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        to: `${toName} <${toEmail}>`,
        subject: 'Member Assignment Notification',
        html
      });

      console.log('✅ Email sent:', info.messageId);
      return info;

    } catch (error) {
      console.error('❌ Email send failed:', error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();
