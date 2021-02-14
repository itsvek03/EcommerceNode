const cart = require('../model/cartModel')
const product = require('../model/Product')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.postECart = catchAsync(async (req, res, next) => {
    if (!req.body.user) {
        req.body.user = req.user.id
    }
    var updateprodu = await product.findById(req.params.productId);
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

        var usercartData = await cart.findOne({ user: req.user.id, ProductId: req.params.productId })
        console.log("USER CART", usercartData);

        if (!usercartData) {
            var newcart = new cart({
                user: req.user.id,
                ProductId: req.params.productId,
                Quantity: req.body.Quantity,
                AvailableQuantity: updateprodu.Quantity,
                totalPrice: updateprodu.Price * req.body.Quantity
            })
            var crtdata = await newcart.save();
            await product.findByIdAndUpdate(req.params.productId, {
                $inc: {
                    Quantity: -req.body.Quantity
                }
            })
            console.log("NEW CART", crtdata);
        } else {
            usercartData.Quantity += req.body.Quantity;
            usercartData.AvailableQuantity -= req.body.Quantity;
            usercartData.totalPrice = updateprodu.Price * usercartData.Quantity
            var updcartdata = await usercartData.save();
            await product.findByIdAndUpdate(req.params.productId, {
                $inc: {
                    Quantity: -req.body.Quantity
                }
            })
            console.log("UPDATE CART", updcartdata);
        }
        res.status(200).json({
            message: "Successfully added",

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
    console.log("DELETE", delcart.Quantity)
    await product.findByIdAndUpdate(delcart.ProductId._id, {
        $inc: {
            Quantity: delcart.Quantity
        }
    })

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



