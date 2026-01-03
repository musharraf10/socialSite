const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebinarSchema = new Schema({
  title: {
    type: String,
    required: [true, "Webinar title is required"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  thumbnail :{
    type : String,
    required : true
  },
  link: {
    type: String,
    required: [true, "Webinar link is required"],
  },
  date: {
    type: Date,
    required: [true, "Webinar date is required"],
  },
  time: {
    type: String,
    required: [true, "Webinar time is required"],
    trim: true,
  },
  description: {
    type: String,
  },
});

const Webinar = mongoose.model("Webinar", WebinarSchema);
module.exports = Webinar;