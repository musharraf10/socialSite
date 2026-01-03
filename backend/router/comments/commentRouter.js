const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const commentsController = require("../../controllers/comments/commentsController");

const commentRouter = express.Router();

// Create a comment
commentRouter.post("/create", isAuthenticated, commentsController.create);

// Delete a comment
commentRouter.delete("/:commentId", isAuthenticated, commentsController.delete);

// Update a comment
commentRouter.patch("/:commentId", isAuthenticated, commentsController.update);

// Like a comment
commentRouter.patch("/like/:commentId", isAuthenticated, commentsController.likeComment);

// Report a comment
commentRouter.patch("/report/:commentId", isAuthenticated, commentsController.reportComment);

module.exports = commentRouter;
