// createPost: asyncHandler(async (req, res) => {
//   const { description, category } = req.body;
//   const categoryFound = await Category.findById(category);
//   if (!categoryFound) throw new Error("Category not found");
//   const userFound = await User.findById(req.user);
//   if (!userFound) throw new Error("User not found");

//   const postCreated = await Post.create({
//     description,
//     image: req.files?.image || null,
//     video: req.files?.video || null,
//     author: req.user,
//     category,
//     status: "pending", // Default status for moderation
//   });

//   await Category.findByIdAndUpdate(category, { $push: { posts: postCreated._id } });
//   await User.findByIdAndUpdate(req.user, { $push: { posts: postCreated._id } });
//   await Notification.create({ userId: req.user, postId: postCreated._id, message: New post created by ${userFound.username} });

//   res.json({ message: "Post submitted for review", postCreated });
// }),

// fetchAllPosts: asyncHandler(async (req, res) => {
//   const { category, title, page = 1, limit = 10 } = req.query;
//   let filter = {  };
//   if (category) filter.category = category;
//   if (title) filter.description = { $regex: title, $options: "i" };

//   const posts = await Post.find(filter).populate("category").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
//   const totalPosts = await Post.countDocuments(filter);
//   res.json({ posts, currentPage: page, totalPages: Math.ceil(totalPosts / limit) });
// }),

const asyncHandler = require("express-async-handler");
const Post = require("../../models/Post/Post");
const Category = require("../../models/Category/Category");
const User = require("../../models/User/User");
const Notification = require("../../models/Notification/Notification");
const sendNotificatiomMsg = require("../../utils/sendNotificatiomMsg");

const postController = {
  //!Create post
  createPost: asyncHandler(async (req, res) => {
    const { content } = req.body;
    console.log(req.user);
    res.send(content);

    // try {
    //   const { title, description, category } = req.body;

    //   const postCreated = await Post.create({
    //     title,
    //     description,
    //     author: req.user,
    //     status: "pending",
    //   });

    //   const categoryIds = [];

    //   for (const { categoryName } of category) {
    //     let categoryFound = await Category.findOne({ categoryName });

    //     if (!categoryFound) {
    //       categoryFound = await Category.create({
    //         categoryName,
    //         posts: [postCreated._id],
    //         createdBy: req.user._id,
    //       });
    //     } else {
    //       await categoryFound.updateOne({ $push: { posts: postCreated._id } });
    //     }

    //     categoryIds.push(categoryFound._id);
    //     await categoryFound.save();
    //   }

    //   await postCreated.updateOne({ $set: { category: categoryIds } });

    //   // Find the user
    //   const userFound = await User.findById(req.user);
    //   if (!userFound) {
    //     throw new Error("User not found");
    //   }

    //   // Ensure posts array exists before pushing
    //   if (!userFound.posts) {
    //     userFound.posts = [];
    //   }
    //   userFound.posts.push(postCreated._id);
    //   await userFound.save();

    //   //Create notification
    //   await Notification.create({
    //     userId: req.user,
    //     postId: postCreated._id,
    //     message: New post created by ${userFound.username},
    //   });

    //   //Send email to all hus/her followers
    //   userFound.followers.forEach(async (follower) => {
    //     //find the users by ids
    //     const users = await User.find({ _id: follower });
    //     //loop through the users
    //     users.forEach((user) => {
    //       //send email
    //       sendNotificatiomMsg(user.email, postCreated._id);
    //     });
    //   });
    // } catch (error) {
    //   console.error("Error creating post:", error);
    // res.status(500).json({
    //   status: "error",
    //   message: "Something went wrong while creating the post",
    //   error: error.message,
    // });
    // }

    res.json({
      status: "success",
      message: "Post created successfully",
    });
  }),
  deletepost:asyncHandler(async(req,res)=>{
    try{
      const post = await Post.findByIdAndDelete(req.params.id);
      if(!post){
        return res.status(404).json({status:"error",message:"Post not found"})
      }
      res.json({message:"Deleted Successfully"})
    }
    catch(err){
      console.error("Error deleting post:", err);
    }
  }),
  getonepost:asyncHandler(async(req,res)=>{
    try{
      const post = await Post.findById(req.params.id).populate("refId")
      if(!post){
        return res.status(404).json({status:"error",message:"Post not found"})
        }
        res.json(post)
    }
    catch(err){
      console.log(err);
    }
  }),
  
  
  approvePost: asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("author");
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndUpdate(postId, { status: "approved" });

    await Notification.create({
        userId: post.author._id,
        postId: postId,
        message: `Your post "${post.title}" has been approved by the admin.`,
    });

    sendNotificatiomMsg(
        post.author.email,
        "Post Approved",
        `Hello ${post.author.username},\n\nGreat news! Your post "${post.title}" has been approved by the admin and is now live.\n\nCheck it out on the platform!`
    );

    res.json({ message: "Post approved successfully" });
  }),


  reportPost: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const { reason } = req.body;
    await Post.findByIdAndUpdate(postId, {
      $push: { reports: { reportedBy: req.user, reason } },
    });
    res.json({ message: "Post reported for review" });
  }),

  //!list all posts
  fetchAllArticles: asyncHandler(async (req, res) => {
    const { category, title, page = 1, limit = 300 } = req.query;
    //Basic filter
    let filter = { status: "approved", contentData : "Article" };
    // let filter = {};
    if (category) {
      filter.category = category;
    }
    if (title) {
      filter.description = { $regex: title, $options: "i" }; //case insensitive
    }

    const posts = await Post.find(filter)
      .populate("author")
      .populate("refId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    //total posts
    const totalPosts = await Post.countDocuments(filter);
    res.json({
      status: "success",
      message: " Approved Post fetched successfully",
      posts,
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(totalPosts / limit),
    });
  }),

  ownerposts : asyncHandler(async(req,res) =>{
    const id = req.user;

    const posts = await Post.find({author:id})

    res.status(200).json({data : posts})
  }),

  fetchAllWebiners: asyncHandler(async (req, res) => {
    const { category, title, page = 1, limit = 300 } = req.query;
    //Basic filter
    let filter = { status: "approved", contentData : "Webinar" };
    // let filter = {};
    if (category) {
      filter.category = category;
    }
    if (title) {
      filter.description = { $regex: title, $options: "i" }; //case insensitive
    }

    const posts = await Post.find(filter)
      .populate("author")
      .populate("refId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    //total posts
    const totalPosts = await Post.countDocuments(filter);
    res.json({
      status: "success",
      message: " Approved Post fetched successfully",
      posts,
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(totalPosts / limit),
    });
  }),

  getallpostsinadmincontroller: asyncHandler(async (req, res) => {
    try {
      const postsdata = await Post.find({}).populate("author");
      // .populate({
      //   path: "comments",
      //   populate: {
      //     path: "author",
      //   },
      // });
      // .limit(1);

      res.status(200).json({
        status: "success",
        message: "Approved Posts fetched successfully",
        posts: postsdata,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }),

  getallpublishedpostscontroller: asyncHandler(async (req, res) => {
    try {
      const postsdata = await Post.find({ status: "approved" })
        .populate("author").populate("refId");

      res.status(200).json({
        status: "success",
        message: "Approved Posts fetched successfully",
        posts: postsdata,
      });
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }),
//Updated 3/7/25
    getArticleCount: asyncHandler(async (req, res) => {
      const articleCount = await Post.countDocuments({ contentData: "Article" });
      res.status(200).json({ count: articleCount });
    }),

    getWebinarCount: asyncHandler(async (req, res) => {
      const webinarCount = await Post.countDocuments({ contentData: "Webinar" });
      res.status(200).json({ count: webinarCount });
    }),

    getStepbyStepGuideCount: asyncHandler(async (req, res) => {
      const guideCount = await Post.countDocuments({ contentData: "StepbyStepGuide" });
      res.status(200).json({ count: guideCount });
    }),


    approveAll: asyncHandler(async (req, res) => {
      // Fetch all posts that are pending approval
      const posts = await Post.find({ status: { $ne: "approved" } }).populate("author");
  
      if (posts.length === 0) {
          return res.status(404).json({ message: "No posts found for approval." });
      }
  
      // Update all posts to "approved"
      await Post.updateMany({}, { status: "approved" });
  
      // Send notifications and emails to all authors
      const notifications = posts.map(post => ({
          userId: post.author._id,
          postId: post._id,
          message: `Your post "${post.title}" has been approved by the admin.`,
      }));
  
      await Notification.insertMany(notifications);
  
     
  
      res.status(200).json({ message: "All posts approved successfully!" });
  }),
  
    
  rejectedAll: asyncHandler(async (req, res) => {
    
    const posts = await Post.find({ status: { $ne: "rejected" } }).populate("author");

    if (posts.length === 0) {
        return res.status(404).json({ message: "No posts found for rejection." });
    }

    // Update all posts to "rejected"
    await Post.updateMany({}, { status: "rejected" });

    // Send notifications and emails to all authors
    const notifications = posts.map(post => ({
        userId: post.author._id,
        postId: post._id,
        message: `Your post "${post.title}" has been rejected by the admin.`,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({ message: "All posts rejected successfully!" });
}),



  

  updatePostStatus: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid status" });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedPost) {
        return res
          .status(404)
          .json({ status: "error", message: "Post not found" });
      }

      res.status(200).json({
        status: "success",
        message: "Post status updated successfully",
        updatedPost,
      });
    } catch (error) {
      console.error("Error updating post status:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  }),

  //! get a post
  getPost: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user ? req.user : null;

    const postFound = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "profilePicture name", // Fetch only necessary fields
      },
    }).populate("refId");

    if (!postFound) {
      throw new Error("Post not found");
    }

    if (userId) {
      await Post.findByIdAndUpdate(
        postId,
        {
          $addToSet: { viewers: userId },
        },
        {
          new: true,
        }
      );
    }

    res.json({
      status: "success",
      message: "Post fetched successfully",
      postFound,
    });
}),

  //! delete
  delete: asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    await Post.findByIdAndDelete(postId);
    res.json({
      status: "success",
      message: "Post deleted successfully",
    });
  }),
  //! pdate post
  update: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const postUpdated = await Post.findByIdAndUpdate(
      postId,
      {
        description: req.body.description,
        image: req.files?.image || null,
        video: req.files?.video || null,
      },
      { new: true }
    );
    if (!postUpdated) throw new Error("Post not found");
    res.json({ message: "Post updated successfully", postUpdated });
  }),

  pendingPosts: asyncHandler(async (req, res) => {
    const posts = await Post.find({ status: "pending" });

    res.json({
      status: "success",
      message: "Pending posts fetched successfully",
      posts,
    });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { status } = req.body;
    await Post.findByIdAndUpdate(postId, { status }, { new: true });
    res.json({
      status: "success",
      message: "Post status updated successfully",
    });
  }),

  changePrice: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const { price } = req.body;
    await Post.findByIdAndUpdate(postId, { price });
    res.json({
      status: "success",
      message: "Post price updated successfully",
    });
  }),

  fetchPostAnalytics: async (req, res) => {
    try {
      const currentDate = new Date();
      const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);

      const startOfThisMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const startOfLastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );

      const allPosts = await Post.find({});

      // Calculate counts
      const totalPosts = allPosts.length;
      const approvedPosts = allPosts.filter(
        (post) => post.status === "approved"
      ).length;
      const pendingPosts = allPosts.filter(
        (post) => post.status === "pending"
      ).length;
      const rejectedPosts = allPosts.filter(
        (post) => post.status === "rejected"
      ).length;

      const thisMonthPosts = allPosts.filter(
        (post) => post.createdAt >= startOfThisMonth
      ).length;
      const lastMonthPosts = allPosts.filter(
        (post) =>
          post.createdAt >= startOfLastMonth &&
          post.createdAt < startOfThisMonth
      ).length;

      const yesterdayPosts = allPosts.filter(
        (post) =>
          post.createdAt >= startOfYesterday && post.createdAt < startOfToday
      ).length;

      res.status(200).json({
        success: true,
        data: {
          totalPosts,
          approvedPosts,
          pendingPosts,
          rejectedPosts,
          thisMonthPosts,
          lastMonthPosts,
          yesterdayPosts,
        },
      });
    } catch (error) {
      console.error("Error fetching post analytics:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch post analytics" });
    }
  },

  // curatorDetails: asyncHandler(async (req, res) => {
  //   try {
  //     const userId = req.user;
  //     console.log(userId)
  //     if (!userId) {
  //       return res.status(401).json({ message: "Unauthorized: No user ID provided" });
  //     }
  
  //     console.log("Fetching posts for user:", userId);
  
  //     const posts = await Post.find({ author: userId }).populate("refId");
  
  //     res.json({ data: posts });
  //   } catch (err) {
  //     console.error("Error fetching user posts:", err);
  //     res.status(500).json({ message: "Server Error" });
  //   }
  // }),

  like: asyncHandler(async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.user;

      console.log("Liking Post:", postId);
      console.log("User:", userId);

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post?.dislikes.includes(userId)) {
        post?.dislikes?.pull(userId);
      }

      if (post?.likes.includes(userId)) {
        post?.likes?.pull(userId);
      } else {
        post?.likes?.push(userId);
      }

      await post.save();

      res.json({ message: "Post Liked" });
    } catch (error) {
      console.error("Error in liking post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }),

  dislike: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    console.log("Dislike", postId);
    const userId = req.user;
    console.log("User", userId);
    const post = await Post.findById(postId);
    console.log("post", post);
    if (post?.likes.includes(userId)) {
      post?.likes?.pull(userId);
    }

    if (post?.dislikes.includes(userId)) {
      post?.dislikes?.pull(userId);
    } else {
      post?.dislikes?.push(userId);
    }

    await post.save();

    res.json({
      message: "Post Disliked",
    });
  }),

  curatorDetails: asyncHandler(async (req, res) => {
    try {
      const userId = req.user;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: No user ID provided" });
      }
  
      console.log("Fetching posts for user:", userId);
  
      const posts = await Post.find({ author: userId }).populate("refId");
  
      res.json({ data: posts });
    } catch (err) {
      console.error("Error fetching user posts:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }),

  BookMarkPost: asyncHandler(async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user;

      const post = await Post.findById(postId).populate("refId");
      if (post?.bookmarkedBy?.includes(userId)) {
        return res.status(400).json({ message: "Post already bookmarked" });
      }
      post?.bookmarkedBy?.push(userId);

      await post.save();

      res.status(200).json({
        message: "Post Bookmarked",
      });
    } catch (error) {
      console.error("Error bookmarking post:", error);
      res.status(500).json({ message: error.message });
    }
  }),

  unBookMarkPost: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user;

    const post = await Post.findById(postId);

    post?.bookmarkedBy?.pull(userId);

    await post.save();

    res.status(200).json({
      message: "Post Unbookmarked",
    });
  }),
  getallpost: asyncHandler(async (req, res) => {
    try {
      console.log(req.user.role);
      if (req.user.role === "admin") {
        const posts = await Post.find({}).populate("author").populate("refId");
        res.json({ data: posts });
      } else {
        const { userId } = req.query;

        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }

        const posts = await Post.find({ author: userId })
          .populate("author")
          .populate("refId");
        res.json({ data: posts });
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }),
  getBookmarkedPosts: asyncHandler(async (req, res) => {
    try {
      const userId = req.user;
      const posts = await Post.find({ bookmarkedBy: userId }).populate("refId")
      // console.log(posts);

      res.status(200).json({
        message: "Bookmarked Posts Fetched",
        posts,
      });
    } catch (error) {
      console.error("Error fetching bookmarked posts:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }),
  
};

module.exports = postController;

//OG
