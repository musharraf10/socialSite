const mongoose = require("mongoose");

const earningsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimized for user-based lookups
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      index: true, // Optimize post-based earnings queries
    },
    amount: {
      type: Number,
      required: true,
    },
    earningSource: {
      type: String,
      enum: ["subscription", "affiliate", "sponsored", "ad-revenue"],
      // required: true,
    },
    adminCommission: {
      type: Number,
      default: 0, // Track admin's share
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    calculatedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Earnings = mongoose.model("Earnings", earningsSchema);

module.exports = Earnings;