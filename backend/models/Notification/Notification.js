const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true, // Optimize lookup
    },
    type: {
      type: String,
      enum: ["Post","comment", "like", "subscription", "earnings", "system"],
      required: true, // Classify notification types
      default : "Post"
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    earningsId: { type: mongoose.Schema.Types.ObjectId, ref: "Earnings", default: null },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", default: null },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    pushNotificationSent: { type: Boolean, default: false }, // Track push delivery
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
