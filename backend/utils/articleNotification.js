const nodemailer = require("nodemailer");

const sendArticleNotification = async (to, postId, title) => {
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
      subject: `New Article Published: ${title}`,
      html: `
        <h2>${title}</h2>
        <p>A new article has been published or Updated. Click the link below to read it:</p>
        <p><a href="http://localhost:5173/posts/article/${postId}" target="_blank">Read Article</a></p>
      `,
    };

    const info = await transporter.sendMail(message);
    console.log("Article Notification Email sent", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending article notification email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendArticleNotification;
