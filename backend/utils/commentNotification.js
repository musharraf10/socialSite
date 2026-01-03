const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendCommentNotification = async (to, postId, commenterName) => {
    try {
      const message = {
        to,
        subject: `New Comment on Your Article`,
        html: `
          <p>${commenterName} has commented on your article.</p>
          <p>Click the link below to view the comment:</p>
          <p><a href="http://localhost:5173/article/${postId}" target="_blank">View Comment</a></p>
        `,
      };
  
      const info = await transporter.sendMail(message);
      console.log("Comment Notification Email sent", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending comment notification email:", error);
      throw new Error("Email sending failed");
    }
  };
  
  const sendLikeNotification = async (to, postId, likerName) => {
    try {
      const message = {
        to,
        subject: `Someone Liked Your Article`,
        html: `
          <p>${likerName} liked your article.</p>
          <p>Click the link below to check it out:</p>
          <p><a href="http://localhost:5173/posts/article/${postId}" target="_blank">View Article</a></p>
        `,
      };
  
      const info = await transporter.sendMail(message);
      console.log("Like Notification Email sent", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending like notification email:", error);
      throw new Error("Email sending failed");
    }
  };
  
  module.exports = {
    sendCommentNotification,
    sendLikeNotification,
  };