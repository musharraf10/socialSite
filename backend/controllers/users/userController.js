const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../models/User/User");
const sendAccVerificationEmail = require("../../utils/sendAccVerificationEmail");
const sendPasswordEmail = require("../../utils/sendPasswordEmail");
const { console } = require("inspector");


//-----User Controller---

const CreateToken = (user = null) => {
  if (!user) return null;
  const payload = {
    userId: user._id,
    role: user.role,
    username: user.username,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const userController = {
  // !Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //Check if username already exist
    const userFound = await User.findOne({ username, email });
    if (userFound) {
      throw new Error("User already exists");
    }
    //Hash the password
    // console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10);
    //Register the user
    const userRegistered = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //send the response
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      userRegistered,
    });
  }),
  // ! Login
  login: asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      
      if (!user) {
        return res.status(401).json({ message: "User Not Found" });
      }
      //generate token
      const token = jwt.sign({ id: user?._id, role: user?.role }, process.env.JWT_SECRET);
      //set the token into cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //1 day
      });

      //send the response
      res.json({
        status: "success",
        message: "Login Success",
        username: user?.username,
        email: user?.email,
        _id: user?._id,
        role: user?.role
      });
    })(req, res, next);
  }),
  // ! googleAuth-->
  googleAuth: passport.authenticate("google", { scope: ["profile"] }),
  // ! GoogleAuthCallback
  googleAuthCallback: asyncHandler(async (req, res, next) => {
    passport.authenticate(
      "google",
      {
        failureRedirect: "/login",
        session: false,
      },
      (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.redirect("http://localhost:5173/google-login-error");
        }
        //generate the token

        const token = jwt.sign({ id: user?._id, role: user?.role }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        //set the token into the cooke
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, 
        });
        //redirect the user dashboard
        res.redirect("http://localhost:5173/");
      }
    )(req, res, next);
  }),
  // ! check user authentication status
  checkAuthenticated: asyncHandler(async (req, res) => {
    console.log(req.cookies)
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //find the user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ isAuthenticated: false });
      } else {
        return res.status(200).json({
          isAuthenticated: true,
          _id: user?._id,
          username: user?.username,
          profilePicture: user?.profilePicture,
          role: user?.role
        });
      }
    } catch (error) { }
    return res.status(401).json({ isAuthenticated: false, error });
  }),
  // ! Logout
  logout: asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout success" });
  }),
  //! Profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

      .populate("followers")
      .populate("following")
      .populate("posts")
      .select(
        "-password -passwordResetToken -accountVerificationToken -accountVerificationExpires -passwordResetExpires"
      );
    res.json({ user });
  }),
  // !Following
  followUser: asyncHandler(async (req, res) => {
    //1. Find the user who wants to follow user (req.user)
    const userId = req.user;
    //2. Get the user to follow (req.params)
    const followId = req.params.followId;
    // Check if the userId and followId are the same

    //3. Update the users followers and following arrays
    //Udate the user who is following a user
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { following: followId },
      },
      { new: true }
    );
    //Udate the user who is been followed followers array
    await User.findByIdAndUpdate(
      followId,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    );
    res.json({
      message: "User followed",
    });
  }),
  // !UnFollowing
  unFollowUser: asyncHandler(async (req, res) => {
    //1. Find the user who wants to follow user (req.user)
    const userId = req.user;
    //2. Get the user to follow (req.params)
    const unfollowId = req.params.unfollowId;
    //Find the users
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);
    if (!user || !unfollowUser) {
      throw new Error("User not found");
    }
    user.following.pull(unfollowId);
    unfollowUser.followers.pull(userId);
    //save the users
    await user.save();
    await unfollowUser.save();
    res.json({
      message: "User unfollowed",
    });
  }),
  //! Verify email acount (token)
  verifyEmailAccount: asyncHandler(async (req, res) => {
    //find the login user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found please login");
    }
    // check if user email exists
    if (!user?.email) {
      throw new Error("Email not found");
    }
    //use the method from the model
    const token = await user.generateAccVerificationToken();
    user.accountVerificationToken = token;
    await user.save();
    //send the email
    sendAccVerificationEmail(user?.email, token);
    res.json({
      message: `Account verification email sent to ${user?.email} token expires in 10 minutes`,
    });
  }),
  //! Verify email acount (token)
  verifyEmailAccount: asyncHandler(async (req, res) => {
    //find the login user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found please login");
    }
    // check if user email exists
    if (!user?.email) {
      throw new Error("Email not found");
    }
    //use the method from the model
    const token = await user.generateAccVerificationToken();
    user.accountVerificationToken = token;
    await user.save();
    //send the email
    sendAccVerificationEmail(user?.email, token);
    res.json({
      message: `Account verification email sent to ${user?.email} token expires in 10 minutes`,
    });
  }),
  //! Verify email acount
  verifyEmailAcc: asyncHandler(async (req, res) => {
    //Get the token
    const { verifyToken } = req.params;
    console.log(verifyToken)
    //Convert the token to actual token that has been saved in our db
    const cryptoToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");
    //Find the user
    const userFound = await User.findOne({
      accountVerificationToken: verifyToken,
      accountVerificationExpires: { $gt: Date.now() },
    });
    if (!userFound) {
      throw new Error("Account verification expires");
    }

    //Update the user field
    userFound.isEmailVerified = true;
    userFound.accountVerificationToken = null;
    userFound.accountVerificationExpires = null;
    //resave the user
    await userFound.save();
    res.json({ message: "Account successfully verified" });
  }),

  //! forgot password (sending email token)
  forgotPassword: asyncHandler(async (req, res) => {
    //find the user email
    const { email } = req.body;
    // find the user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User with email ${email} is not found in our database`);
    }
    //check if user registered with google
    if (user.authMethod !== "local") {
      throw new Error("Please login with your social account");
    }

    //use the method from the model
    const token = await user.generatePasswordResetToken();
    //resave the user
    await user.save();
    //send the email
    sendPasswordEmail(user?.email, token);
    res.json({
      message: `Password reset email sent to ${email}`,
    });
  }),
  //! reset password
  resetPassword: asyncHandler(async (req, res) => {
    //Get the token
    const { verifyToken } = req.params;
    const { password } = req.body;

    //Convert the token to actual token that has been saved in our db
    const cryptoToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");
    //Find the user
    const userFound = await User.findOne({
      passwordResetToken: cryptoToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!userFound) {
      throw new Error("Password reset token expires");
    }

    //Update the user field
    //change the password
    const salt = await bcrypt.genSalt(10);
    userFound.password = await bcrypt.hash(password, salt);
    userFound.passwordResetToken = null;
    userFound.passwordResetExpires = null;
    //resave the user
    await userFound.save();
    res.json({ message: "Password successfully reset" });
  }),
  // update email
  updateEmail: asyncHandler(async (req, res) => {
    //email
    const { email } = req.body;
    console.log(email)
    const checkEmail = await User.findOne({email})
    if(checkEmail){
      return res.status(302).json({message : "Email Already Exists"})
    }
    const user = await User.findById(req.user);

    if(user.email == email){
      return res.status(400).json({message : "Enter New Email"})
    }

   
    user.email = email;
    user.isEmailVerified = false;

    await user.save();

    const token = await user.generateAccVerificationToken();

    sendAccVerificationEmail(user?.email, token);

    res.json({
      message: `Account verification email sent to ${user?.email} token expires in 10 minutes`,
    });
  }),

  updateProfilePic: asyncHandler(async (req, res) => {
    console.log(req.file)
    await User.findByIdAndUpdate(
      req.user,
      {
        $set: { profilePicture: req.file },
      },
      { new: true }
    );

    res.json({
      message: "Profile picture updated successfully",
    });
  }),
  deleteUser: asyncHandler(async (req, res) => {
    const userId = req.params;
    await User.findByIdAndDelete(userId)
    res.json({ message: "User Deleted Successfully" });
  }),

  // update userstatus
  updateUserStatus: asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive field must be a boolean" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User status updated successfully", user: updatedUser });
  }),

  // !getallTheusers

  deleteUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId)
    res.json({ message: "User Deleted Successfully" });
  }),
  // !getallTheusers
  getAllUsers: asyncHandler(async (req, res, next) => {
    const getallusers = await User.find({});

    if (!getallusers || getallusers.length === 0) {
      return res.status(404).json({ message: "No users found", success: false });
    }

    res.status(200).json({ success: true, users: getallusers });

  }),
  // updateuser
  updateUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  }),



  changePassword: asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("User not found");
    }
    //check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    //change the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Password successfully changed" });
  }),

  fetchUserPlan: asyncHandler(async (req, res) => {
    try {
      const userId = req.user; // Ensure `req.user` is populated correctly
      console.log("User ID:", userId);
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const userPlanDetails = await User.findById(userId);
  
      if (!userPlanDetails) {
        return res.status(404).json({ message: "No plan found for this user" });
      }
  
      res.status(200).json({ data: userPlanDetails.hasSelectedPlan });
    } catch (error) {
      console.error("Error fetching user plan:", error);
      res.status(500).json({ message: "Server error" });
    }
  }),
  
  BecomeCreator: asyncHandler(async (req, res) => {
    const { phone, channelName, GovtIdType } = req.body;
    const govID = req.file ? req.file.path : null;
    const user = await User.findById(req.user);
    user.phone = phone;
    user.channelName = channelName;
    user.GovtIdType = GovtIdType;
    user.GovtId = govID;
    user.role = "curator";
    await user.save();
    res.json({ message: "Application submitted successfully!" });
  }),

  googleauth: async (req, res) => {
    const { email, username } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required", success: false });

    try {
      let user = await User.findOne({ email });

      if (user) {
        const token = CreateToken(user);
        return res.status(200).json({
          message: "Login successful",
          success: true,
          user,
          token
        });
      } else {
        const generatePassword = () => Math.random().toString(36).slice(-8); 
        const hashedPassword = await bcrypt.hash(generatePassword(), 10);

        const newUser = new User({
          username: username.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 100000).toString(),
          email,
          password: hashedPassword,
        });

        user = await newUser.save();
        const token = CreateToken(user);

        return res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .status(201)
          .json({
            message: "User created successfully",
            success: true,
            user,
            token,
          });
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      return res.status(500).json({ error: err.message, success: false });
    }
  },

  PaidSub : asyncHandler(async(req,res) =>{
    const countPaid = await User.countDocuments({hasSelectedPlan : true})
    res.status(200).json({count: countPaid})
  }),
  UnPaidSub : asyncHandler(async(req,res) =>{
    const countUnPaid = await User.countDocuments({hasSelectedPlan : false})
    res.status(200).json({count: countUnPaid})
  })

};


module.exports = userController;

// original