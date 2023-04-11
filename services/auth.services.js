const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");
const ApiError = require("../utils/apiErrors");
const User = require("../models/user.model");

// @desc     Singup
// @route    POST  /api/v1/auth/signup
// @access   Public
exports.signUp = asyncHandler(async (req, res, next) => {
  //1-create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //2-generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc     login
// @route    POST  /api/v1/auth/signup
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password correct
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 3) genterate token
  const token = createToken(user._id);
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not login,please login to get access this route",
        401
      )
    );
  }
  // 2) verify token (no change happens, expired token)
  const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token does no longer exist")
    );
  }
  // 4) check if user change his password after token created
  if (currentUser.passwordChangeAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError("user changed his passwordf please login again")
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc Authorzation (User Permissions)
// ["admin", mabager]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc       Forget password
// @route      Post /api/v1/auth/forgetpassword
// @access     Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user with that email ${req.body.email}`)
    );
  }

  // 2) if user exist, generate random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  console.log(resetCode);

  user.passwordResetCode = hashedCode;
  //add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  user.save();
  // 3) send the reset code via email
  message = `Hi ${user.name}, \n ${resetCode}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("there is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "reset code sent to email" });
});

exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedCode,
    // passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("reset code invalid or expired"));
  }
  // 2) if reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`there is no user with email`, 400));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // generate token

  const token = createToken(user._id);
  res.status(200).json({ token });
});
