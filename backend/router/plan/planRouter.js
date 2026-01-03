const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const planController = require("../../controllers/plan/planController");
const roleCheck = require("../../middlewares/roleCheck");

const planRouter = express.Router();

// Create Plan (Only Admins)
planRouter.post("/create", isAuthenticated, roleCheck(["admin"]), planController.createPlan);

// List All Plans
planRouter.get("/", planController.lists);

// planRouter

planRouter.get("/:planId", planController.getPlan);

planRouter.patch("/:planId", isAuthenticated, roleCheck(["admin"]), planController.update);

planRouter.delete("/:planId", isAuthenticated, roleCheck(["admin"]), planController.delete);

module.exports = planRouter;