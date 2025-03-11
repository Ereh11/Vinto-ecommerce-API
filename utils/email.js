const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: options.from || "vinto <vinto@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
