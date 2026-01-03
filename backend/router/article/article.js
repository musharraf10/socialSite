const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const { addarticlecontroller, updateArticleController,getAllArticles } = require("../../controllers/article/article.js");
const upload = require("../../utils/fileupload.js")
const isAccountVerified = require("../../middlewares/isAccountVerified.js")

const articleRouter = express.Router();

articleRouter.post("/addarticle", upload.single("thumbnail"), isAuthenticated,
// isAccountVerified, 
addarticlecontroller);
articleRouter.get("/getarticle",isAuthenticated, getAllArticles);
articleRouter.put("/updatearticle/:id", upload.single("thumbnail"), isAuthenticated, updateArticleController);
  

module.exports = articleRouter;
