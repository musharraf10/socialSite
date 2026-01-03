const Tag = require("../../models/Tags/Tags.js");
const User = require("../../models/User/User");
const Notification = require("../../models/Notification/Notification");
const sendArticleNotification = require("../../utils/articleNotification.js");
const Article = require("../../models/article/article.js");
const Post = require("../../models/Post/Post.js");

const addarticlecontroller = async (req, res) => {
  try {
    const { title, content, status, tags, price } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    if (!title || !content || !status) {
      return res.status(400).json({
        status: "error",
        message: "Title, content, and status are required.",
      });
    }

    // Create new article
    const newArticle = new Article({
      title,
      description: content,
      tags,
      thumbnail,
    });

    // Create related post
    const createPost = new Post({
      author: req.user,
      status,
      contentData: "Article",
      refId: newArticle._id,
      price,
      thumbnail,
    });

    await newArticle.save();
    await createPost.save();

    // Fetch the user's followers
    const user = await User.findById(req.user).populate("followers");

    // Send notifications to followers
    user.followers.forEach(async (follower) => {
      await Notification.create({
        userId: follower._id,
        postId: createPost._id,
        message: `New article posted by ${user.username}: ${title}`,
      });
      sendArticleNotification(follower.email, createPost._id, title);
    });
    console.log("article ");
    return res.status(201).json({
      status: "success",
      message: "Article created successfully!",
      article: newArticle,
      post: createPost,
    });
  } catch (error) {
    console.error("Error saving article:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create article. Please try again.",
    });
  }
};

const updateArticleController = async (req, res) => {
  try {
    const { title, content, status, tags, price } = req.body;
    const { id } = req.params;
    const thumbnail = req.file ? req.file.path : null;

    const article = await Post.findById(id).populate("refId");

    if (!article || !article.refId) {
      return res
        .status(404)
        .json({ status: "error", message: "Article not found." });
    }

    article.refId.set({
      title: title || article.refId.title,
      description: content || article.refId.description,
      tags: tags || article.refId.tags,
      thumbnail: thumbnail || article.refId.thumbnail,
    });

    const post = await Post.findOne({
      refId: article.refId._id,
      contentData: "Article",
    });

    if (post) {
      post.set({
        status: status || post.status,
        price: price || post.price,
      });
      await post.save();
    }

    await article.refId.save();
    await article.save();

    // Notify the author about the update
    const author = await User.findById(post.author);
    await Notification.create({
      userId: author._id,
      postId: post._id,
      message: `Your article "${post.refId.title}" has been updated.`,
    });
    sendArticleNotification(author.email, post._id, title);

    return res.status(200).json({
      status: "success",
      message: "Article updated successfully!",
      article,
      post,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Failed to update article. Please try again.",
      });
  }
};

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();

    return res.status(200).json({
      status: "success",
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch articles. Please try again.",
    });
  }
};

module.exports = {
  addarticlecontroller,
  getAllArticles,
  updateArticleController,
};
