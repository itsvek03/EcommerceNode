const cart = require('../model/cartModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError')

exports.postECart = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.ProductId) {
        req.body.ProductId = req.params.productId
    }
    if (!req.body.user) {
        req.body.user = req.user.id
    }
    const ecart = await cart.create(req.body);
    res.status(200).json({
        status: 'Successfully',
        data: { ecart }
    })
    next();
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
        data: { getid }
    })
})