const User = require("../models/User/User");
const asyncHandler = require("express-async-handler");

const isAccountVerified = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("isEmailVerified");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Action denied, email not verified" });
    }
    next();
  } catch (error) {
    console.error("Error in isAccountVerified middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = isAccountVerified;
