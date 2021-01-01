// Importing the library
const { CartItemModel, CardItemsSchema } = require('../model/CardItems');
const Product = require("../model/Product")
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Fawn = require("fawn")


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
// CRUD operations

// Creating the Items
exports.InsertCardItem = catchAsync(async (req, res, next) => {
    //let { cart } = req.body;
    if (!req.body.UserEmail) {
        req.body.UserEmail = req.user.id
    }
    console.log(req.user.Email)
    const productId = await Product.productModel.findById(req.body.ProductId);
    console.log(productId);
    if (productId.Quantity == 0) {
        return res.status(200).json({
            message: "Out of Stock"
        })
    }
    if (!productId) {
        return next(new AppError("Invalid Product", 400));
    }
    let newcartitems = new CartItemModel({
        UserEmail: req.user.Email,
        ProductId: {
            PName: productId.PName,
            Price: productId.Price,
            Quantity: productId.Quantity,
            PImage: productId.PImage,
        },
        QuantityTaken: req.body.QuantityTaken
    });
    // const subprod = productId.Quantity - newcartitems.QuantityTaken;
    // console.log(subprod);
    try {
        new Fawn.Task()
            .save('carts', newcartitems)
            .update('products',
                { _id: productId._id },
                {
                    $inc: {
                        Quantity: -1
                    }
                })
            .run()
        res.status(200).json({
            status: "Successfully",
            data: newcartitems
        })
    } catch (err) {
        next(new AppError("Internal Serval Error", 500));
    }
})


//Get the Card CardItems
exports.GetCardItem = catchAsync(async (req, res, next) => {
    const items = await CartItemModel.find();
    console.log(items);
    res.status(200).json({
        count: items.length,
        status: "Successfully",
        data: { items }
    })

})


// Get By Id
exports.GetCardItemById = catchAsync(async (req, res, next) => {
    let filter = {}
    if (!req.params.productId) {
        filter = req.params.productId
    }
    const getid = await CartItemModel.find(filter);
    if (!getid) {
        return next(new AppError("It is not present in any cart", 400))
    }
    res.status(200).json({
        status: 'Successfully',
        data: { getid }
    })
})

// Delete the carts
exports.DeleteCarts = catchAsync(async (req, res, next) => {
    const cartid = await CartItemModel.findByIdAndRemove(req.params.id);
    if (!cartid) {
        return next(new AppError("This cart is not available", 400))
    }
    res.status(200).json({
        message: "Deleted Successfully"
    })
})

// Update the Cart Items
exports.UpdateCarts = catchAsync(async (req, res, next) => {
    const filterbody = filterObj(req.body, 'QuantityTaken');
    const updateid = await CartItemModel.findByIdAndUpdate(req.params.id,
        filterbody, ({
            new: true,
            runValidators: true
        }),
    );
    if (!updateid) {
        return next(new AppError("This cart is not available", 400))
    }
    res.status(200).json({
        message: "Updated Successfully",
        data: { updateid }
    })
})
