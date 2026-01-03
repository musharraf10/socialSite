const Webinar = require("../../models/webinar/webinar.js");
const Post = require("../../models/Post/Post.js");
const User = require("../../models/User/User");
const Notification = require("../../models/Notification/Notification");
const sendWebinarNotification = require("../../utils/webinersNotification.js");

const addWebinarController = async (req, res) => {
  try {
    const { title, link, date, time, description, price } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    console.log("Called");

    const newWebinar = new Webinar({
      title,
      link,
      date,
      time,
      description,
      thumbnail,
    });

    const createPost = new Post({
      author: req.user,
      contentData: "Webinar",
      refId: newWebinar._id,
      price,
      thumbnail,
    });

    await newWebinar.save();
    await createPost.save();
    console.log("hj");
    // Notify followers
    const user = await User.findById(req.user).populate("followers");
    user.followers.forEach(async (follower) => {
      await Notification.create({
        userId: follower._id,
        postId: createPost._id,
        message: `New webinar posted by ${user.username}: ${title}`,
      });
      sendWebinarNotification(follower.email, createPost._id, title);
    });

    res.status(201).json({
      message: "Webinar added successfully",
      webinar: newWebinar,
    });
  } catch (error) {
    console.error("Error adding webinar:", error);
    res.status(500).json({
      message: "Error adding webinar",
      error: error.message,
    });
  }
};

const updateWebinarController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, date, time, description, price, status } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    const post = await Post.findById(id).populate("refId");

    if (!post || !post.refId) {
      return res
        .status(404)
        .json({ status: "error", message: "Webinar post not found." });
    }

    post.refId.set({
      title: title || post.refId.title,
      link: link || post.refId.link,
      date: date || post.refId.date,
      time: time || post.refId.time,
      description: description || post.refId.description,
      thumbnail: thumbnail || post.refId.thumbnail,
    });

    post.set({
      status: status || post.status,
      price: price || post.price,
      thumbnail: thumbnail || post.thumbnail,
    });

    await post.refId.save();
    await post.save();

    // Notify the author
    const author = await User.findById(post.author);
    await Notification.create({
      userId: author._id,
      postId: post._id,
      message: `Your webinar "${post.refId.title}" has been updated.`,
    });
    sendWebinarNotification(author.email, post._id, post.refId.title);

    return res.status(200).json({
      status: "success",
      message: "Webinar updated successfully!",
      webinar: post.refId,
      post,
    });
  } catch (error) {
    console.error("Error updating webinar:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update webinar. Please try again.",
    });
  }
};

module.exports = { addWebinarController, updateWebinarController };
