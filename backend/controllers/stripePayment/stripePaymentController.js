const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const Payment = require("../../models/Payment/Payment");
const Plan = require("../../models/Plan/Plan");
const Post = require("../../models/Post/Post");
const User = require("../../models/User/User");
const { response } = require("express");

const stripePaymentController = {
  createCheckoutSession: asyncHandler(async (req, res) => {
    const { subscriptionPlanId, billingCycle, postId } = req.body;
    let sessionConfig = {
      payment_method_types: ["card"],
      mode: "",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: req.user.email,
      metadata: { userId: req.user._id.toString() },
    };

    if (subscriptionPlanId) {
      const plan = await Plan.findById(subscriptionPlanId);
      if (!plan) return res.status(404).json({ message: "Plan not found" });

      sessionConfig.mode = "subscription";
      sessionConfig.line_items = [{ price: plan.stripePriceId, quantity: 1 }];
      sessionConfig.metadata.subscriptionPlanId = subscriptionPlanId;

    } else if (postId) {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });

      sessionConfig.mode = "payment";
      sessionConfig.line_items = [{
        price_data: {
          currency: "usd",
          product_data: { name: post.title },
          unit_amount: post.price * 100,
        },
        quantity: 1,
      }];
      sessionConfig.metadata.postId = postId;
    } else {
      return res.status(400).json({ message: "Invalid payment request" });
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ sessionId: session.id });
  }),

  verifyPayment: asyncHandler(async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const { userId, subscriptionPlanId, postId } = session.metadata;
    const transactionId = session.payment_intent || session.id;
    const amount = session.amount_total / 100;
    const currency = session.currency;
    const adminShare = amount * 0.10;

    let paymentData = {
      user: userId,
      reference: transactionId,
      currency,
      amount,
      transactionId,
      adminShare,
      status: session.payment_status === "paid" ? "completed" : "pending",
    };

    if (session.mode === "subscription") {
      paymentData.subscriptionPlan = subscriptionPlanId;
      await User.findByIdAndUpdate(userId, { plan: subscriptionPlanId, hasSelectedPlan: true });
    } else if (session.mode === "payment" && postId) {
      paymentData.content = postId;
      await User.findByIdAndUpdate(userId, { $push: { purchasedPosts: postId } });
    }

    await Payment.create(paymentData);
    res.json({ message: "Payment verified", paymentData });
  }),

  free: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const plan = await Plan.findOne({ planName: "Free" }); 
    
    if (!user) throw new Error("User not found");
    if (!plan) throw new Error("Free plan not found");
  
    if (!plan.activeSubscribers.includes(user._id)) {
      console.log("Adding user to free plan");
      plan.activeSubscribers.push(user._id);
    }
    console.log("User has selected free plan",user._id);
    user.hasSelectedPlan = true;
    user.plan = plan._id;
  
    await plan.save();
    await user.save();
  
    res.json({ status: true, message: "User updated to free plan" });
  }),

  CurrentUserPlan: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate("plan");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ plan: user.plan });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }),


  getUserPayments: asyncHandler(async (req, res) => {
    const payments = await Payment.find({ user: req.user._id }).populate("subscriptionPlan content");
    res.json({ payments });
  }),

  getPlanId: asyncHandler(async(req, res) =>{
    const {planId} = req.params;
    if(!planId){
      return res.status(404).json({message : "Plan Not Found"})
    }

    const plan = await Plan.findById(planId);

    res.status(200).json({response : plan})
  })
};

module.exports = stripePaymentController;
