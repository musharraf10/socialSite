// require("dotenv").config();
// const corse = require("cors");
// const passport = require("./utils/passport-config");
// const express = require("express");
// const cron = require("node-cron");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./utils/connectDB");

// const postRouter = require("./router/post/postsRouter");
// const usersRouter = require("./router/user/usersRouter");
// const categoriesRouter = require("./router/category/categoriesRouter");
// const planRouter = require("./router/plan/planRouter");
// const stripePaymentRouter = require("./router/stripePayment/stripePaymentRouter");
// const calculateEarnings = require("./utils/calculateEarnings");
// const earningsRouter = require("./router/earnings/earningsRouter");
// const notificationRouter = require("./router/notification/notificationRouter");
// const commentRouter = require("./router/comments/commentRouter");
// //call the db
// connectDB();
// calculateEarnings();
// //Schedule the task to run at 23:59 on the last day of every month
// cron.schedule(
//   "59 23 * * * ",
//   async () => {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     if (today.getMonth() !== tomorrow.getMonth()) {
//       calculateEarnings(); //calc earnings
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "America/New_York",
//   }
// );
// const app = express();
// //! PORT
// const PORT = 5000;

// //Middlewares
// app.use(express.json()); //Pass json data
// // corse middleware
// const corsOptions = {
//   origin: ["http://localjhost:5173"],
//   credentials: true,
// };
// app.use(corse(corsOptions));
// // Passport middleware
// app.use(passport.initialize());
// app.use(cookieParser()); //automattically parses the cookie
// //!---Route handlers
// app.use("/api/v1/posts", postRouter);
// app.use("/api/v1/users", usersRouter);
// app.use("/api/v1/categories", categoriesRouter);
// app.use("/api/v1/plans", planRouter);
// app.use("/api/v1/stripe", stripePaymentRouter);
// app.use("/api/v1/earnings", earningsRouter);
// app.use("/api/v1/notifications", notificationRouter);
// app.use("/api/v1/comments", commentRouter);

// //!Not found
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found on our server" });
// });
// //! Error handdling middleware
// app.use((err, req, res, next) => {
//   //prepare the error message
//   const message = err.message;
//   const stack = err.stack;
//   res.status(500).json({
//     message,
//     stack,
//   });
// });

// //!Start the server
// app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));

require("dotenv").config();
const cors = require("cors"); // Fixed typo: "corse" → "cors"
const passport = require("./utils/passport-config");
const express = require("express");
const cron = require("node-cron");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/connectDB");
const calculateEarnings = require("./utils/calculateEarnings");

// Import Routers
const postRouter = require("./router/post/postsRouter");
const usersRouter = require("./router/user/usersRouter");
const categoriesRouter = require("./router/category/categoriesRouter");
const planRouter = require("./router/plan/planRouter");
const stripePaymentRouter = require("./router/stripePayment/stripePaymentRouter");
const earningsRouter = require("./router/earnings/earningsRouter");
const notificationRouter = require("./router/notification/notificationRouter");
const commentRouter = require("./router/comments/commentRouter");
const trendingRouter = require("./router/TrendingSubscribe/trendingRoutes");

// const webinarRouter = require("./router/webinar/webinar");

const articleRouter = require("./router/article/article");
const webinarRouter = require("./router/webinar/webinar");
const VideoGuideRouter = require("./router/StepbyStepRouter/StepbyStepRouter");
// const PlaylistRouter = require("./router/Playlist/Playlistrouter");

// Connect to Database
connectDB();
// calculateEarnings();

cron.schedule(
  "0 8 * * *", // Runs at 8:00 AM IST
  async () => {
    try {
      await calculateEarnings();
      console.log("Earnings calculated successfully.");
    } catch (err) {
      console.error("Error calculating earnings:", err);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Indian Standard Time (IST)
  }
);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
express.urlencoded({ extended: true });
app.use(cookieParser());
app.use(passport.initialize());

const corsOptions = {
  origin: ["https://skillupbuildup.netlify.app"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/stepbystepguide", VideoGuideRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/stripe", stripePaymentRouter);
app.use("/api/v1/earnings", earningsRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/trending", trendingRouter);
app.use("/api/v1/article", articleRouter);
app.use("/api/v1/webinar", webinarRouter);

// Not Found Route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found on our server" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

//!Start the server
app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));

// original
