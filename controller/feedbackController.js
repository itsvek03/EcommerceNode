// Importing the library
const FeedBackModel = require("../model/FeedbackModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

//post.delete.get
exports.postFeedBack = catchAsync(async (req, res, next) => {
  if (1) {
    const feed = await FeedBackModel.create(req.body);
    res.status(200).json({
      status: "Feedback posted Successfully",
      data: {
        data: feed,
      },
    });
  } else {
    next(new AppError("Insertion Failed", 400));
  }
});

// Get Feedback
exports.getFeedBack = catchAsync(async (req, res, next) => {
  const getfeed = await FeedBackModel.find();
  return res.status(200).json({
    status: "Successfully",
    data: getfeed,
  });
  next();
});

exports.deleteFeedBack = catchAsync(async (req, res) => {
  const del = await FeedBackModel.findByIdAndRemove(req.params.id);
  if (!del) {
    return next(new AppError("Id is not present"));
  }
  res.status(200).json({
    status: "Deleted Successfully",
    data: del,
  });
});
