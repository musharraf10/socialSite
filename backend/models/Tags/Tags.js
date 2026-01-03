const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  tagname: {
    type: Array,
    required: true,
    unique: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  allposts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", 
    },
  ],
 
});

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;