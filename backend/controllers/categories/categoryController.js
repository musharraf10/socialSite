const asyncHandler = require("express-async-handler");
const Category = require("../../models/Category/Category");
const Post = require("../../models/Post/Post");

const categoryController = {
  createCategory: asyncHandler(async (req, res) => {
    const { categoryName} = req.body;
    if (await Category.findOne({ categoryName })) {
      throw new Error("Category already exists");
    }
    const categoryCreated = await Category.create({
      categoryName,
      author: req.user._id,
      createdBy : req.user._id
    });
    res.json({ message: "Category submitted for review", categoryCreated });
  }),

  fetchAllCategories: asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({ message: "Categories fetched successfully", categories });
  }),

  getCategory: asyncHandler(async (req, res) => {
    const categoryFound = await Category.findById(req.params.categoryId);
    if (!categoryFound) throw new Error("Category not found");
    res.json({ message: "Category fetched successfully", categoryFound });
  }),

  delete: asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    if (await Post.exists({ category: categoryId })) {
      throw new Error("Cannot delete category with associated posts");
    }
    await Category.findByIdAndDelete(categoryId);
    res.json({ message: "Category deleted successfully" });
  }),

  update: asyncHandler(async (req, res) => {
    const { categoryName, description, status, isFeatured } = req.body;
    const categoryUpdated = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { categoryName, description, status, isFeatured },
      { new: true }
    );
    if (!categoryUpdated) throw new Error("Category not found");
    res.json({ message: "Category updated successfully", categoryUpdated });
  }),
};

module.exports = categoryController;
