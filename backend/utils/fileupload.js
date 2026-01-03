const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("./Cloudinary");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: "step_guides",
      resource_type: isVideo ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname
        .replace(/\s+/g, "_")
        .replace(/\.[^/.]+$/, "")}`,
    };
  },
});

// File filter (FORMAT CONTROL)
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "video/mp4",
  ];

  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Invalid file type"), false);
  } else {
    cb(null, true);
  }
};

// Multer Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB (adjust if needed)
  },
});

module.exports = upload;
