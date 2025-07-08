import nodemailer from "nodemailer";

export const sendOtpEmail = async (toEmail, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your OTP for Note App",
    html: `<p>Your OTP is <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
