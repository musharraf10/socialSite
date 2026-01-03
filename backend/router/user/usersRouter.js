const express = require("express");
const multer = require("multer");
const userController = require("../../controllers/users/userController");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleCheck = require("../../middlewares/roleCheck");
const upload = require("../../utils/fileupload");

const usersRouter = express.Router();

// Authentication Routes
usersRouter.post("/register", userController.register);
usersRouter.post("/login", userController.login);
usersRouter.post("/google", userController.googleauth);
usersRouter.get("/auth/google/callback", userController.googleAuthCallback);
usersRouter.get("/check-auth", userController.checkAuthenticated);
usersRouter.post("/logout", userController.logout);



// Profile & Account Management
usersRouter.get("/profile", isAuthenticated, userController.profile);
usersRouter.patch("/update-email", isAuthenticated, userController.updateEmail);
usersRouter.patch("/upload-profile-picture", isAuthenticated, upload.single("image"), userController.updateProfilePic);

usersRouter.get("/currentplan", isAuthenticated, userController.fetchUserPlan)
// get all users
// usersRouter.get('/getallusers', userController.getAllUsers)
// get active users
usersRouter.get('/getactiveusers', userController.updateUserStatus)

usersRouter.get('/paidusers/count', isAuthenticated, userController.PaidSub);

usersRouter.get('/unpaidusers/count', isAuthenticated, userController.UnPaidSub);



// Follow & Unfollow Routes
usersRouter.put("/follow/:followId", isAuthenticated, userController.followUser);
usersRouter.put("/unfollow/:unfollowId", isAuthenticated, userController.unFollowUser);

// Account Verification
usersRouter.put("/send-verification-email", isAuthenticated, userController.verifyEmailAccount);
usersRouter.put("/verify-account/:verifyToken", userController.verifyEmailAcc);
usersRouter.post("/become-creator", isAuthenticated, upload.single("govID"), userController.BecomeCreator);

// Password Reset
usersRouter.post("/forgot-password", userController.forgotPassword);
usersRouter.post("/reset-password/:verifyToken", userController.resetPassword);
usersRouter.put("/change-password", isAuthenticated, userController.changePassword);

// Admin Privileges
// Admin Privileges
usersRouter.delete("/delete-user/:userId", userController.deleteUser);
usersRouter.put("/update-user/:userId", userController.updateUser);
usersRouter.get('/getallusers', userController.getAllUsers)

module.exports = usersRouter;
