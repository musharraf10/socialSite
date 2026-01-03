const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    planName: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    features: [{ type: String }],
    price: { type: Number, required: true, default: 0 },
    billingcycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default : "monthly",
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    activeSubscribers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    isArchived: {
      type: Boolean,
      default: false, 
    },
    expirationDate: {
      type: Date,
      default: function () {
        const now = new Date();
        return this.billingCycle === "monthly"
          ? new Date(now.setMonth(now.getMonth() + 1)) 
          : new Date(now.setFullYear(now.getFullYear() + 1));
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plan", planSchema);
