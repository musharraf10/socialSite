const mongoose = require("mongoose");

// Schema
const categorySchema = new mongoose.Schema(
  {
    categoryName: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true // Optimized for search
    },
    description: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isFeatured: { type: Boolean, default: false }, // For highlighting key categories
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
