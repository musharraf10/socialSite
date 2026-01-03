const Earnings = require("../models/Earning/Earnings");
const Post = require("../models/Post/Post");

//Rate per view
const RATE_PER_VIEW = 0.001;

const calculateEarnings = async () => {
  try {
    const currentDate = new Date();
    const posts = await Post.find();

    for (const post of posts) {
      // Count new unique viewers since last calculation
      const newViewsCount = post.viewers.length - (post.lastCalculatedViewsCount || 0);

      if (newViewsCount > 0) {
        const earningsAmount = newViewsCount * RATE_PER_VIEW;

        // Update this month's and total earnings for the post
        post.thisMonthEarnings += earningsAmount;
        post.totalEarnings += earningsAmount;

        // Update or create earnings entry for the user
        await Earnings.findOneAndUpdate(
          { user: post.author }, // Find existing earnings for the user
          {
            $inc: { amount: earningsAmount }, // Increment earnings
            calculatedOn: currentDate,
          },
          { upsert: true, new: true } // If no document exists, create a new one
        );

        // Update lastCalculatedViewsCount and nextEarningDate
        post.lastCalculatedViewsCount = post.viewers.length;
        post.nextEarningDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);

        // Save the post
        await post.save();
      }
    }

    console.log("Earnings successfully calculated.");
  } catch (error) {
    console.error("Error calculating earnings:", error);
  }
};

const resetEarningsAfterWithdrawal = async (userId) => {
  try {
    await Earnings.findOneAndUpdate(
      { user: userId },
      { amount: 0 },
      { new: true }
    );
    console.log(`Earnings reset to 0 for user: ${userId}`);
  } catch (error) {
    console.error("Error resetting earnings:", error);
  }
};

module.exports = calculateEarnings;
