const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
      default: "/default-thumbnail.jpg"
    },
    duration: {
      type: Number,
      default: 0 // Duration in seconds
    },
    views: {
      type: Number,
      default: 0
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        ],
        replies: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
            text: {
              type: String,
              required: true
            },
            createdAt: {
              type: Date,
              default: Date.now
            },
            likes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
              }
            ]
          }
        ]
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    isPublished: {
      type: Boolean,
      default: true
    },
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public"
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      trim: true
    },
    processingStatus: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing"
    }
  },
  { timestamps: true }
);

// Virtual for getting like count
videoSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for getting dislike count
videoSchema.virtual("dislikeCount").get(function () {
  return this.dislikes.length;
});

// Virtual for getting comment count
videoSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Index for search functionality
videoSchema.index({ title: "text", description: "text", tags: "text" });

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;