const mongoose = require("mongoose");
const validator = require("validator");


//making a schema
const ECardItemsSchema = new mongoose.Schema({
    UserEmail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visitors',
        required: [true, "You must login"]
    },
    ProductId: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            count: Number,
            price: Number
        },
    ],
    recordtime: {
        type: Date,
        default: Date.now()
    },
    updatetime: {
        type: Date,
    },
    CartTotal: {
        type: Number,
        trim: true,
        minlength: 1
    },
})


// making a model
const ECartItemModel = mongoose.model("ecarts", ECardItemsSchema)
module.exports = { ECartItemModel, ECardItemsSchema };