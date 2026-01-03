const Content = require('../../models/Content/Content');

const getTrendingContent = async (req, res) => {
  try {
    // Fetch top 5 trending content from each category in parallel
    const [topArticles, topVideos, topWebinars] = await Promise.all([
      Content.find({ type: 'article' }).sort({ views: -1, createdAt: -1 }).limit(5),
      Content.find({ type: 'video' }).sort({ views: -1, createdAt: -1 }).limit(5),
      Content.find({ type: 'webinar' }).sort({ views: -1, createdAt: -1 }).limit(5),
    ]);

    // Send the trending data
    res.status(200).json({
      success: true,
      data: {
        articles: topArticles,
        videos: topVideos,
        webinars: topWebinars,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
 // Pass error to the global error handler middleware
  }
};

module.exports = getTrendingContent;