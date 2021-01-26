// Importing the library
const mongooose = require("mongoose");
const subcategories = require("../model/SubCategory");

// Creating the schema
const CategorySchema = new mongooose.Schema({
  cname: {
    type: String,
    unique: [true, "Name already present"],
    trim: true,
    minlength: [3, "Name should be more than 3 characters"],
  },
});

// Creating the model
const CategoryModel = mongooose.model("Categories", CategorySchema);

module.exports = CategoryModel;
