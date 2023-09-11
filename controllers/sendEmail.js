const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d22d673378b18f",
    pass: "52d2854fc8e4eb",
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: "malwercin@proton.me",
      to: email,
      subject: "Potwierdzenie rejestracji",
      text: `Kliknij poniższy link, aby potwierdzić rejestrację:
        http://localhost:3000/users/verify/${verificationToken}`,
    };

    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendVerificationEmail;
