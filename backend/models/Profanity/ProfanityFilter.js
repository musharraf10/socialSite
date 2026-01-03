const mongoose = require("mongoose");

const profanityFilterSchema = new mongoose.Schema(
  {
    bannedWords: [{ type: String, index: true }], // Index for faster lookups
    regexPatterns: [{ type: String }], // Store regex for advanced filtering
    severityLevels: {
      type: Map,
      of: String, // Example: { "word1": "mild", "word2": "severe" }
    },
    lastUpdated: {
      type: Date,
      default: Date.now, // Track last modification
    },
  }
);

module.exports = mongoose.model("ProfanityFilter", profanityFilterSchema);
