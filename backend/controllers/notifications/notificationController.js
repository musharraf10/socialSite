const asyncHandler = require("express-async-handler");
const Notification = require("../../models/Notification/Notification");
const mongoose = require("mongoose");

const notificationController = {
  fetchNotifications: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, type } = req.query;
    let filter = {};
    if (type) filter.type = type;
    
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)).populate("userId")
    // console.log(notifications)
    const totalNotifications = await Notification.countDocuments();
    // console.log("T", totalNotifications)
    res.json({
      notifications,
      currentPage: page,
      totalPages: Math.ceil(totalNotifications / limit),
    });
  }),

  readNotification: asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      throw new Error("Invalid notification ID");
    }
    
    await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    res.json({ message: "Notification marked as read" });
  }),

  markAllAsRead: asyncHandler(async (req, res) => {
    await Notification.updateMany({ userId: req.user, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  }),
};

module.exports = notificationController;
