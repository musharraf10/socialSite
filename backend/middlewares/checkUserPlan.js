const User = require("../models/User/User");
const asyncHandler = require("express-async-handler");

const checkUserPlan = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("hasSelectedPlan");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.hasSelectedPlan) {
      return res.status(403).json({ message: "You must select a plan before accessing this feature" });
    }
    next();
  } catch (error) {
    console.error("Error in checkUserPlan middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = checkUserPlan;