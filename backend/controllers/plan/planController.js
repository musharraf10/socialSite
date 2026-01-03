const asyncHandler = require("express-async-handler");
const Plan = require("../../models/Plan/Plan");
const User = require("../../models/User/User")

const planController = {
  createPlan: asyncHandler(async (req, res) => {
    const { planName, features, price, billingcycle } = req.body;
    if (await Plan.findOne({ planName }))
      throw new Error("Plan already exists");
    if ((await Plan.countDocuments()) >= 5) {
      return res.status(400).json({ error: "Maximum plan limit reached" });
    }

    if (price <= 0) throw new Error("Price must be a positive value");

    const planCreated = await Plan.create({
      planName,
      features,
      price,
      billingcycle,
    });
    res.json({ message: "Plan created successfully", planCreated });
  }),

  lists: asyncHandler(async (req, res) => {
    const plans = await Plan.find();
    res.json({ message: "Plans fetched successfully", plans });
  }),

  getPlan: asyncHandler(async (req, res) => {
    const planFound = await Plan.findById(req.params.planId);
    if (!planFound) throw new Error("Plan not found");
    res.json({ message: "Plan fetched successfully", planFound });
  }),

  delete: asyncHandler(async (req, res) => {
    //get the plan id from params
    const planId = req.params.planId;
    //find the plan
    await Plan.findByIdAndDelete(planId);
    res.json({
      status: "success",
      message: "Plan deleted successfully",
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { planName, features, price, billingcycle } = req.body;
    console.log(req.body);
    console.log(req.params);
    const planUpdated = await Plan.findByIdAndUpdate(
      req.params.planId,
      { planName, features, price, billingcycle },
      { new: true }
    );
    if (!planUpdated) throw new Error("Plan not found");
    res.json({ message: "Plan updated successfully", planUpdated });
  }),

  // fetchUserPlan : asyncHandler(async(req, res)=>{
  //   const userId = req.user;
  //   console.log("User",userId)
  //   const userPlanDetails = Plan.findOne({activeSubscribers : userId});
  //   console.log(userPlanDetails)
  //   res.status(200).json({message: userPlanDetails})
  // })
};

module.exports = planController;
