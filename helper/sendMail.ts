// mailer.js
import 'dotenv/config'; // ES6 way to instantly load your .env file
import nodemailer from 'nodemailer';

// 1. Configure the Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
}); 



 export  const sendWelcomeEmail = async (targetEmail :string, tempPassword :string) => {
  const mailOptions = {
    from: `"My App Support" <${process.env.EMAIL_USER}>`, 
    to: targetEmail,
    subject: 'Your New Account Credentials',
    text: `Welcome! Your login email is: ${targetEmail}. Your temporary password is: ${tempPassword}. Please change it upon logging in.`,
    html: `
      <h2>Welcome to Our Platform!</h2>
      <p>Your account has been successfully created. Here are your login details:</p>
      <ul>
        <li><b>Email:</b> ${targetEmail}</li>
        <li><b>Temporary Password:</b> ${tempPassword}</li>
      </ul>
      <p><i>For your security, please log in and change this password immediately.</i></p>
    `
  };

  // 3. Use try/catch with await for clean error handling
  try {
   await transporter.sendMail(mailOptions);
  

  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};


