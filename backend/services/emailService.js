const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- UPDATED TEXT ---
const sendNotificationEmail = async (userEmail, bookTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `The book you searched for is available now!`,
    text: `Hello!\n\nThe book you searched for, "${bookTitle}", is available now in the Vignan library.\n\nThank you!`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${userEmail} for ${bookTitle}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendNotificationEmail };