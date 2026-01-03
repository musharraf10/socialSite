const nodemailer = require("nodemailer");

const sendWebinarNotification = async (to, postId, title) => {
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
      subject: `Upcoming Webinar: ${title}`,
      html: `
        <h2>${title}</h2>
        <p>Join our upcoming webinar! Click the link below to learn more:</p>
        <p><a href="http://localhost:5173/posts/webinar/${postId}" target="_blank">View Webinar</a></p>
      `,
    };

    const info = await transporter.sendMail(message);
    console.log("Webinar Notification Email sent", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending webinar notification email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendWebinarNotification;
