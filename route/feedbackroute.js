// Importing the library
const express = require("express");
const feedrouter = express.Router();
const FeedBackController = require("../controller/feedbackController");
const VisitorAuthController = require("../controller/visitorAuthController");

feedrouter
  .route("/")
  .get(VisitorAuthController.protectTo, FeedBackController.getFeedBack)
  .post(FeedBackController.postFeedBack);

feedrouter
  .route("/:id")
  .delete(
    VisitorAuthController.protectTo,
    VisitorAuthController.restrictTo("Admin"),
    FeedBackController.deleteFeedBack
  );

// Exporting the library
module.exports = feedrouter;
