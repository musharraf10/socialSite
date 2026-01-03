const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true, // Remove extra spaces
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimize author-based queries
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true, // Optimize post-based queries
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Nested comments support
    }],
    reports: [{
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reason: { type: String, required: true },
      reportedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
 module.exports = Comment;