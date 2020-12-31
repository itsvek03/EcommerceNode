// importing the library
const mongoose = require("mongoose");
const validator = require("validator");

// Creating the Schema
const FeedBackSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    lowercase: true,
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    validate: [validator.isEmail, "Please write proper e-mail address"],
  },
  FeedBack: {
    type: String,
    required: [true, "Write a message ....."],
    minlength: [10, "Please write atleast Characters"],
    trim: true,
  },
});

// Creating a model
const FeedBackModel = mongoose.model("feedbacks", FeedBackSchema);

// exporting the library
module.exports = FeedBackModel;
