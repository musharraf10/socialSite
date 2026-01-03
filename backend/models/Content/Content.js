const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  contentUrl: { type: String },

  author : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },

  type: { 
    type: String, 
    enum: ['article', 'video', 'webinar'], 
    required: true 
  },
  
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  webinarDate: { type: Date } // Only for webinars
});

// Index for better query performance
contentSchema.index({ type: 1, views: -1, createdAt: -1 });

module.exports = mongoose.model('Content', contentSchema);
