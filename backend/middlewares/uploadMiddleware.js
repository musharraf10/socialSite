const multer = require("multer");
const path = require("path");

// Setting up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store uploaded files in "uploads/" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name based on timestamp
  },
});

// Filter to accept only video files (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type, only mp4, mkv, and webm are allowed."));
  }
};

// Setting up the upload configuration
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
