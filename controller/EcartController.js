const cart = require('../model/cartModel')
const product = require('../model/Product')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { findById, update } = require('../model/cartModel');

exports.postECart = catchAsync(async (req, res, next) => {


    // Allow nested routes
    // if (!req.body.ProductId.productId) {
    //     req.body.ProductId.productId = req.params.productId
    // }
    if (!req.body.user) {
        req.body.user = req.user.id
    }


    const updateprodu = await product.findById(req.params.productId);
    console.log(updateprodu);



    if (req.body.Quantity === 0) {
        return res.status(400).json({
            message: "Cart Cannot be empty"
        })
    } else if (updateprodu.Quantity < req.body.Quantity) {
        return res.status(400).json({
            message: "Your Quantity is greater than the available Product"
        })
    } else {
        const newcart = new cart({
            user: req.user.id,
            ProductId: req.params.productId,
            Quantity: req.body.Quantity,
            AvailableQuantity: updateprodu.Quantity
        })
        const crtdata = await newcart.save();
        console.log(crtdata);
        //productQuantityUpdate(ProductId.Quantity, updateprodu.Quantity);
        res.status(200).json({
            message: "Successfully added",
            data: crtdata
        })
    }
})


exports.getCartUser = catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.userid) {
        filter = { user: req.params.userid }
    }
    const getid = await cart.find(filter);
    if (!getid) {
        return next(new AppError("Cart is not there", 400))
    }
    res.status(200).json({
        status: 'Successfully',
        countitems: getid.length,
        data: getid
    })
})

exports.removeCart = catchAsync(async (req, res, next) => {
    const delcart = await cart.findByIdAndRemove(req.params.id);
    if (!delcart) {
        return res.status(200).json({
            message: "Cart Is no present"
        })
    }
    return res.status(200).json({
        message: "Deleted Successfully",
        data: delcart
    })
})

