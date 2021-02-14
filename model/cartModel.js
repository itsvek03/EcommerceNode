// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Product = require('../model/Product')
const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'visitors',
            required: [true, "Cart must belong to visitor"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        ProductId: {
            type: mongoose.Schema.ObjectId,
            ref: 'products',
            required: [true, 'Review must belong to a Product.']
        },
        Quantity: {
            type: Number,
            defualt: [1, "Quantity must be greater than 0"]
        },
        AvailableQuantity: {
            type: Number,
        },
        totalPrice: {
            type: Number
        }
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

// Create the avg rating
// CartSchema.statics.calculateQuantity = async function (productId) {
//     const stats = await this.aggregate([
//         {
//             $match: { ProductId: productId }
//         },
//         {
//             $project: {
//                 _id: '$ProductId',
//                 nQuantity: { $subtract: ["$AvailableQuantity", "$Quantity"] },
//             }
//         }
//     ])
//     console.log("HOOK STATS", stats);
//     await Product.findByIdAndUpdate(productId, {
//         Quantity: stats[0].nQuantity
//     });
// }

// CartSchema.post('save', function (doc) {
//     console.log("THIS PRODUCT ID", this.ProductId._id)
//     if (this.ProductId._id) {
//         this.constructor.calculateQuantity(this.ProductId._id)
//     } else {
//         this.constructor.calculateQuantity(doc.ProductId._id)
//     }
//     console.log("post save hook ", doc.ProductId._id)

// })

// findByIdAndUpdate
// findByIdAndDelete
// CartSchema.pre(/^findOneAnd/, async function (next) {
//     this.r = await this.findOne();
//     console.log("Update", this.r);
//     next();
// });

// CartSchema.post(/^findOneAnd/, async function () {
//     // await this.findOne(); does NOT work here, query has already executed
//     await this.r.constructor.calculateQuantity(this.r.ProductId);
// });




const CartModel = mongoose.model('carts', CartSchema);

module.exports = CartModel;