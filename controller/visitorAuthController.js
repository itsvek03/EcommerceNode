// Importing the library
const VisitorModel = require("../model/VisitorModel");
const jwt = require("jsonwebtoken");
const config = require("config");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const SendEmail = require("../middleware/Email");
const crypto = require("crypto");

// Creating a token for sign in
let signInToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    config.get("APP_KEY")
  );
};

// Creating a token
const CreateSendToken = (user, statusCode, res, msg) => {
  const token = signInToken(user.id);
  res.status(statusCode).json({
    status: "Success",
    msg: msg,
    token: token,
    data: {
      user: user,
    },
  });
};

//Signup for the users
exports.signup = catchAsync(async (req, res, next) => {
  const user = await VisitorModel.create({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Password: req.body.Password,
    ConfirmPassword: req.body.ConfirmPassword,
    role: req.body.role,
    termsAccepted: req.body.termsAccepted
  });
  let token = signInToken(user._id);
  CreateSendToken(user, 200, res, "Signup Successfully");

  if (!user) {
    return next(new AppError("Failed Signup", 400));
  }
});

//Login for the users

// 1) Take the body
// 2) Check the user is present or not
// 3) validate the user
// 4) Create a token
exports.Login = catchAsync(async (req, res, next) => {
  let { Email, Password } = req.body;

  if (!Email || !Password) {
    return next(new AppError("Please enter email or password", 404));
  }

  // Check the user
  const check = await VisitorModel.findOne({
    Email,
  }).select("+Password");

  if (!check || !(await check.ComparingPassword(Password, check.Password))) {
    return next(new AppError("Please enter valid email or password", 404));
  }
  CreateSendToken(check, 200, res, "Login Successfully");
});

// Verifying the token for routing
exports.protectTo = catchAsync(async (req, res, next) => {
  let token;
  // Check the authorization and bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // verifying the token
  if (!token) {
    return next(new AppError("Please Login First", 403));
  }

  // Verifying the token for the users
  let decoded = await promisify(jwt.verify)(token, config.get("APP_KEY"));

  const freshUser = await VisitorModel.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("User is not present"));
  }

  // check the user if the password has changed after the token has expired
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("Password Has been Changed", 403));
  }
  req.user = freshUser;
  next();
});

// Restrict the action
exports.restrictTo = (...roles) => {
  console.log("restrict to")
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(404).json({
        status: "Fail",
        message: "You do not have permission",
      });
    }
    next();
  };
};

// Forgot the password field
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Check if email is present or not
  const user = await VisitorModel.findOne({
    Email: req.body.Email,
  });
  if (!user) {
    return next(new AppError("Invalid Email ID", 403));
  }

  // Generate reset Token
  const resetToken = user.resetToken();
  await user.save({
    validateBeforeSave: false,
  });
  console.log(resetToken);

  //Send the Email to users
  const reseturl = `${req.protocol}://${req.get("host")}/api/visitor/resetPassword/${resetToken}`;
  console.log(reseturl)
  const message = `${resetToken}`;
  console.log(message);

  try {
    await SendEmail({
      Email: user.Email,
      subject: "Your password expires in 10 min",
      message,
    });

    res.status(200).json({
      status: "Success",
      message: "Email had sent successfully",
    });
  } catch (err) {
    user.passwordResetToken = "undefined";
    user.passwordTokenExpires = "undefined";
    await user.save({
      validateBeforeSave: false,
    });
    return next(new AppError("There was some error !!!!", 500));
  }
});

// Reset the password field
exports.resetPassword = catchAsync(async (req, res, next) => {
  const createHash = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await VisitorModel.findOne({
    passwordResetToken: createHash,
    passwordTokenExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new AppError("Token is expire or invalid", 400));
  }
  user.Password = req.body.Password;
  user.ConfirmPassword = req.body.ConfirmPassword;
  user.passwordResetToken = undefined;
  user.passwordTokenExpires = undefined;
  await user.save();
  CreateSendToken(user, 200, res, "Reset Password Successfully");
});

// Update the password field
exports.updatePassword = catchAsync(async (req, res, next) => {
  let token;
  const user = await VisitorModel.findById(req.user.id).select("Password");

  // check if posted current password is correct or not
  if (
    !(await user.ComparingPassword(req.body.CurrentPassword, user.Password))
  ) {
    return next(new AppError("Your Current Password is incorrect", 401));
  }

  user.Password = req.body.Password;
  user.ConfirmPassword = req.body.ConfirmPassword;
  await user.save();
  CreateSendToken(user, 200, res, "Password Update Successfully");
});
