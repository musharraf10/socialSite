const express = require('express');
const upload = require('../../utils/fileupload'); // Ensure correct path
const  {addStepbyStepGuide, updateStepbyStepGuide, getVideoGuide, VideoGuideSingle} = require('../../controllers/StepbyStepGuide/StepbyStepController');
const multer = require('multer');
const isAuthenticated = require('../../middlewares/isAuthenticated');
const isAccountVerified = require("../../middlewares/isAccountVerified")

const VideoGuideRouter = express.Router();

// Upload Middleware
const uploadFields = upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "stepMedia", maxCount: 10 } 
]);

VideoGuideRouter.get("/", isAuthenticated, getVideoGuide)
VideoGuideRouter.get("/:guideId", isAuthenticated, VideoGuideSingle)

VideoGuideRouter.post("/addguide", (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err) {
        console.error("Multer Error:", err);
        if (err instanceof multer.MulterError) {
          console.error("Multer Error Code:", err.code);
          console.error("Multer Error Field:", err.field);
        }
        return res.status(500).send("File upload error.");
      }
      console.log("req.files.stepMedia:", req.files.stepMedia);
      console.log("req.files.thumbnailImage:", req.files.thumbnail);
      next(); 
    });
  }, isAuthenticated,
  //  isAccountVerified, 
   addStepbyStepGuide); 

// VideoGuideRouter.put(
//     "/updateguide/:id",
//     (req, res, next) => {
//       uploadFields(req, res, (err) => {
//         if (err) {
//           console.error("Multer Error:", err);
//           if (err instanceof multer.MulterError) {
//             console.error("Multer Error Code:", err.code);
//             console.error("Multer Error Field:", err.field);
//           }
//           return res.status(500).send("File upload error.");
//         }
//         console.log("req.files.stepMedia:", req.files.stepMedia);
//         console.log("req.files.thumbnailImage:", req.files.thumbnailImage);
//         next();
//       });
//     },
//     isAuthenticated,
//     updateStepbyStepGuide
// );
VideoGuideRouter.put(
    "/updateguide/:id",
    (req, res, next) => {
      uploadFields(req, res, (err) => {
        if (err) {
          console.error("Multer Error:", err);
          if (err instanceof multer.MulterError) {
            console.error("Multer Error Code:", err.code);
            console.error("Multer Error Field:", err.field);
          }
          return res.status(500).send("File upload error.");
        }
        console.log("req.files.stepMedia:", req.files.stepMedia);
        console.log("req.files.thumbnailImage:", req.files.thumbnail);
        next();
      });
    },
    isAuthenticated,
    //  isAccountVerified,
    updateStepbyStepGuide
);
  

module.exports = VideoGuideRouter;
