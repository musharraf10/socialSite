const nodemailer = require("nodemailer");

const sendStepByStepNotification = async (to, postId, title) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const message = {
      to,
      subject: `New Step-by-Step Guide: ${title}`,
      html: `
        <h2>${title}</h2>
        <p>A new step-by-step guide is available. Click below to follow the steps:</p>
        <p><a href="http://localhost:5173/posts/guide/${postId}" target="_blank">View Guide</a></p>
      `,
    };

    const info = await transporter.sendMail(message);
    console.log("Step-by-Step Guide Notification Email sent", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending step-by-step guide notification email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendStepByStepNotification;
