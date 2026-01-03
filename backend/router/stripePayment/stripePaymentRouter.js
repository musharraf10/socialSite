const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const checkUserPlan = require("../../middlewares/checkUserPlan");
const stripePaymentController = require("../../controllers/stripePayment/stripePaymentController");

const stripePaymentRouter = express.Router();

stripePaymentRouter.post("/create-payment", isAuthenticated, stripePaymentController.createCheckoutSession);

stripePaymentRouter.get("/verify/:paymentId", isAuthenticated, stripePaymentController.verifyPayment);

stripePaymentRouter.post("/free-plan", isAuthenticated, stripePaymentController.free);

stripePaymentRouter.get("/current-plan", isAuthenticated, checkUserPlan, stripePaymentController.CurrentUserPlan);

stripePaymentRouter.get("/user-payments", isAuthenticated, stripePaymentController.getUserPayments);

stripePaymentRouter.get("/:planId", isAuthenticated, stripePaymentController.getPlanId)

// stripePaymentRouter.post(
//   "/webhook",
//   express.raw({ type: "application/json" }), 
//   stripePaymentController.handleWebhook
// );

module.exports = stripePaymentRouter;
