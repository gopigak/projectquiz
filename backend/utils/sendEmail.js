const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer.
 * If credentials are not supplied in env, dynamically provision a test Ethereal SMTP account.
 */
const sendEmail = async (options) => {
  let transporter;
  let isEthereal = false;

  const hasEnvCredentials = process.env.SMTP_USER && process.env.SMTP_PASS;

  if (hasEnvCredentials) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    console.log('SMTP user/pass not configured. Creating Ethereal Test Account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isEthereal = true;
    } catch (err) {
      console.warn('Failed to build Ethereal account, falling back to mock logs:', err.message);
      console.log('=== Mock Email Score Report ===');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('Content Summary:\n', options.message);
      console.log('===============================');
      return { success: true, mock: true };
    }
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || '"QuizApp Platform" <noreply@quizapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent successfully. Message ID:', info.messageId);

  if (isEthereal) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[Ethereal Sandbox] E-mail sent to ${options.email}. View preview: ${previewUrl}`);
    return { success: true, previewUrl };
  }

  return { success: true };
};

module.exports = sendEmail;
