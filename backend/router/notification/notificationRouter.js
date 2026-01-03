const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const notificationController = require("../../controllers/notifications/notificationController");

const notificationRouter = express.Router();

// Fetch Notifications (User must be authenticated)
notificationRouter.get("/",  isAuthenticated,notificationController.fetchNotifications);

// Mark Notification as Read
notificationRouter.patch("/:notificationId", isAuthenticated, notificationController.readNotification);

// Mark All Notifications as Read
notificationRouter.patch("/mark-all", isAuthenticated, notificationController.markAllAsRead);

module.exports = notificationRouter;
