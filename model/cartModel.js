// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema(
    {
        ProductId: [{
            type: mongoose.Schema.ObjectId,
            ref: 'products',
            required: [true, 'Review must belong to a Product.']
        }],
        count: [{
            type: Number,
            default: 0
        }],
        totalCartItems: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'visitors',
            required: [true, "Cart must belong to visitor"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


CartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'ProductId',
        select: '-__v'
    })
    next();
})

const CartModel = mongoose.model('carts', CartSchema);

module.exports = CartModel;