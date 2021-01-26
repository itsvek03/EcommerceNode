// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Product = require('../model/Product')
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

// Create the avg rating
ReviewSchema.statics.calculateAverageQuantity = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    console.log(stats);

    await Product.findByIdAndUpdate(productId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    });
};

ReviewSchema.post('save', function () {
    this.constructor.calculateAverageQuantity(this.product)
})

// findByIdAndUpdate
// findByIdAndDelete
ReviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    console.log("Update", this.r);
    next();
});

ReviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.r.constructor.calculateAverageQuantity(this.r.product);
});


const ReviewModel = mongoose.model('reviews', ReviewSchema);

module.exports = ReviewModel;