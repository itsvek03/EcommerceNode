// Importing the library
const mongooose = require("mongoose");

// Creating the schema
const ProductSchema = new mongooose.Schema({
  PName: {
    type: String,
    unique: [true, "A password must be unique"],
    trim: true,
    minlength: 3,
    required: true,
  },
  Description: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  Price: {
    type: Number,
    trim: true,
    required: true,
  },
  Quantity: {
    type: Number,
    max: 1000,
    required: true,
  },
  PImage: {
    type: String,
  },
  RecordAt: {
    type: Date,
    default: Date.now(),
  },
  UpdateRecord: {
    type: Date,
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  Category: [
    {
      type: mongooose.Schema.Types.ObjectId,
      ref: "Categories",
    },
  ],
  SubCategory: [
    {
      type: mongooose.Schema.Types.ObjectId,
      ref: "subcategories",
    },
  ],
});

// Creating the model
const productModel = mongooose.model("products", ProductSchema);

module.exports = { productModel, ProductSchema };
