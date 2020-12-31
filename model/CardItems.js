const mongoose = require("mongoose");
const Product = require("../model/Product")
const validator = require("validator");


//making a schema
const CardItemsSchema = new mongoose.Schema({
    UserEmail: {
        type: mongoose.Schema.Types.String,
        ref: 'visitors',
        required: [true, "You must login"]
    },
    ProductId: {
        type: Product.ProductSchema,
        required: true
    },
    recordtime: {
        type: Date,
        default: Date.now()
    },
    updatetime: {
        type: Date,
    },
    QuantityTaken: {
        type: Number,
        trim: true,
        minlength: 1
    },
})


// making a model
const CartItemModel = mongoose.model("carts", CardItemsSchema)
module.exports = { CartItemModel, CardItemsSchema };