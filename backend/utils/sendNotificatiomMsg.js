const nodemailer = require("nodemailer");
const Queue = require("bull"); // Requires installing bull: npm install bull

// Create a Bull queue for email sending
const emailQueue = new Queue("email-queue");

// Process emails from the queue
emailQueue.process(async (job, done) => {
  const { to, postId } = job.data;
  try {
    await sendEmail(to, postId);
    done(); // Signal successful processing
  } catch (error) {
    console.error("Email processing failed in queue:", error);
    done(error); // Signal failure
  }
});

async function sendEmail(to, postId, retryCount = 0) {
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
      subject: "New Post Created",
      html: ` <p>A new post has been created on our site Niche Flare</p>
        <p>Click <a href="http://localhost:5173/posts/${postId}">here</a> to view the post.</p>
      `,
    };

    const info = await transporter.sendMail(message);
    console.log("Email sent", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending attempt failed:", error);

    if (error.responseCode === 421 && retryCount < 3) {
      console.log(`Retrying email send (attempt ${retryCount + 1})...`);
      await new Promise((resolve) => setTimeout(resolve, 5000 * (retryCount + 1)));
      return sendEmail(to, postId, retryCount + 1);
    } else {
      console.error("Email sending permanently failed:", error);
      throw new Error("Email sending failed");
    }
  }
}

// Function to add email to queue
async function sendNotificationMsg(to, postId) {
  try {
    await emailQueue.add({ to, postId });
    console.log("Email added to queue");
  } catch (error) {
    console.error("Failed to add email to queue:", error);
    throw new Error("Failed to add email to queue");
  }
}

module.exports = sendNotificationMsg;