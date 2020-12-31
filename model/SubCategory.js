// Importing the library
const mongooose = require("mongoose");

// Creating the schema
const SubSchema = new mongooose.Schema({
  subname: {
    type: String,
    unique: [true, "Already exists"],
    trim: true,
    minlength: [3, "Name should be above two characters"],
  },
});

// Creating the model
const subModel = mongooose.model("subcategories", SubSchema);

module.exports = subModel;
