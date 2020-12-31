const mongoose = require("mongoose");
const CardItem = require('../model/CardItems')
const validator = require("validator");

//making a schema
const UserCartSchema = new mongoose.Schema({
    UserEmail: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "An Email is required"],
        validate: [validator.isEmail, "Please write proper email Address"]
    },
    CardItem: {
        type: CardItem.CardItemsSchema,
        required: true
    }
})


// making a model
const UserCartModel = mongoose.model("usercarts", UserCartSchema)

module.exports = UserCartModel;