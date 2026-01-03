const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleCheck = require("../../middlewares/roleCheck");
const categoryController = require("../../controllers/categories/categoryController");

const categoriesRouter = express.Router();

// Create a category (Admin only)
categoriesRouter.post("/create", isAuthenticated, roleCheck(["admin"]), categoryController.createCategory);

// List all categories
categoriesRouter.get("/", categoryController.fetchAllCategories);

// Get a single category
categoriesRouter.get("/:categoryId", categoryController.getCategory);

// Update a category (Admin only)
categoriesRouter.patch("/:categoryId", isAuthenticated, roleCheck(["admin"]), categoryController.update);

// Delete a category (Admin only)
categoriesRouter.delete("/:categoryId", isAuthenticated, roleCheck(["admin"]), categoryController.delete);

module.exports = categoriesRouter;
