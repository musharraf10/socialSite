const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StepbyStepGuideSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tags: [{ type: String }],
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  steps: [
    {
      stepTitle: {
        type: String,
        required: true,
      },
      stepDescription: {
        type: String,
        required: true,
      },
      stepMedia: {
        type: String,
      },
    },
  ],
});

const StepbyStepGuide = mongoose.model(
  "StepbyStepGuide",
  StepbyStepGuideSchema
);

module.exports = StepbyStepGuide;
