// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'products',
            required: [true, 'Review must belong to a Product.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'visitors',
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

ReviewSchema.pre(/^find/, function (next) {
    this.populate(
        {
            path: 'user',
            select: 'Email Address'
        }
    )
    next();
})

const ReviewModel = mongoose.model('reviews', ReviewSchema);

module.exports = ReviewModel;