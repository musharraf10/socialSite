const asyncHandler = require("express-async-handler");
const Earnings = require("../../models/Earning/Earnings");

const earningsController = {
  fetchAllEarnings: asyncHandler(async (req, res) => {
    // console.log("e",req.user._id)
    let earnings = await Earnings.aggregate([
      {
        $group: {
          _id: "$user",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    //Add a rank field to each document
    earnings = earnings.map((earning, index) => {
      return {
        ...earning,
        rank: index + 1,
      };
    });
    res.json({
      status: "success",
      message: "Earnings fetched successfully",
      earnings,
    });
  }),

  // getUserEarnings: asyncHandler(async (req, res) => {
  //   const { startDate, endDate } = req.query;
  //   let filter = { user: req.user };
  //   if (startDate && endDate) {
  //     filter.calculatedOn = { $gte: new Date(startDate), $lte: new Date(endDate) };
  //   }
    
  //   const earnings = await Earnings.find(filter).populate({
  //     path: "post",
  //     populate: { path: "author" },
  //   });
  //   res.json({ earnings });
  // }),

  getUserEarnings: asyncHandler(async (req, res) => {
    const earnings = await Earnings.find({ user: req.user }).populate({
      path: "post",
      populate: {
        path: "author",
      },
    });
    res.json(earnings);
  }),


  filterEarningsByDate: asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) throw new Error("Start and End date are required");
    const earnings = await Earnings.find({
      user: req.user,
      calculatedOn: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.json({ earnings });
  }),
};

module.exports = earningsController;