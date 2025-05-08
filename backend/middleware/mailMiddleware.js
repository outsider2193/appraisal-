const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (toEmail, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your preferred service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Welcome to Our Platform!",
      html: `
        <h2>Welcome, ${userName}!</h2>
        <p>We're excited to have you on board. Start exploring your dashboard now.</p>
        <p>Let us know if you need any help!</p>
        <br />
        <p>Regards,</p>
        <p><b>Appraisal Tracker</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to", toEmail);
  } catch (err) {
    console.error("❌ Failed to send welcome email:", err);
  }
};

module.exports = sendWelcomeEmail;
