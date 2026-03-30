const nodemailer = require('nodemailer');

const sendEmail = async (options) => { // Reçoit un objet {to, subject, html, attachments}
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"BAOLMAX" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments || []
  });
};

module.exports = sendEmail;