const asyncHandler = require("express-async-handler");
const Post = require("../../models/Post/Post");
const Comment = require("../../models/Comment/Comment");
const Notification = require("../../models/Notification/Notification");
const {sendCommentNotification} = require("../../utils/commentNotification")

const commentsController = {
  create: asyncHandler(async (req, res) => {
    const { postId, content, parentCommentId } = req.body;

    const post = await Post.findById(postId).populate("author");
    if (!post) throw new Error("Post not found");

    const commentCreated = await Comment.create({
        content,
        author: req.user,
        post: postId,
        parentComment: parentCommentId || null,
    });

    await Post.findByIdAndUpdate(postId, { $push: { comments: commentCreated._id } });

    await Notification.create({
        userId: post.author._id,
        postId: postId,
        message: `Your post has a new comment: "${content}".`,
    });

    sendCommentNotification(post.author.email, postId, content);

    res.json({ message: "Comment submitted for review", commentCreated });
  }),


  delete: asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.json({ message: "Comment deleted successfully" });
  }),

  update: asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    res.json({ message: "Comment updated successfully", updatedComment });
  }),

  likeComment: asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user;
    const comment = await Comment.findById(commentId);
    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }
    await comment.save();
    res.json({ message: "Comment liked" });
  }),

  reportComment: asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { reason } = req.body;
    await Comment.findByIdAndUpdate(commentId, { $push: { reports: { reportedBy: req.user, reason } } });
    res.json({ message: "Comment reported for review" });
  }),
};

module.exports = commentsController;
