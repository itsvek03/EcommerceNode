const order = require('../model/orderModel')
const cart = require('../model/cartModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');



exports.addToOrder = catchAsync(async (req, res) => {
    let userId = req.user.id;

    let cartData = await cart.find({ user: userId })
    console.log("cart data", cartData)

    if (cartData.length == 0) {
        return res.status(400).json({
            message: "No cart data"
        })
    }


    let orderDetails = { ...req.body };

    let orderProducts = cartData.map(pd => ({ productId: pd.ProductId, Quantity: pd.Quantity }))
    console.log(orderProducts)
    let orderData = {
        user: userId,
        products: orderProducts,
        total: orderDetails.total,
        shippingAddress: orderDetails.shippingAddress,
        paymentMethod: orderDetails.paymentMethod,
        shippingPrice: orderDetails.shippingPrice,
        taxPrice: orderDetails.taxPrice,
    };
    await cart.deleteMany({ user: userId });
    let data = await order.create(orderData);
    res.status(201).send({ message: "Order Placed!!", data });
});


exports.getAllOders = catchAsync(async (req, res) => {
    let userId = req.user.id;
    let data = await order.find({ user: userId });
    res.status(200).send({ data });
});


exports.updateOrderToPaid = catchAsync(async (req, res) => {
    let orderId = req.params.orderId;

    let data = await order.findById(orderId);
    data.isPaid = true;
    data.paidAt = Date.now();

    const updateOrder = await data.save();
    res.status(200).send({ message: "Order paid!", updateOrder });
});


exports.getOrderById = catchAsync(async (req, res) => {
    let orderId = req.params.id;

    let data = await order
        .findById(orderId)
        .populate({ path: "products.productId user", select: "-__v" });

    res.status(200).send({ message: "Order Placed!!", data });
});


exports.getAllOrdres = catchAsync(async (req, res, next) => {
    let data = await order.find();
    return res.status(200).json({
        data
    })
})

exports.UpdateOrderById = catchAsync(async (req, res) => {
    let orderId = req.params.orderId;
    if (!orderId) {
        return res.status(404).json({
            message: "Id is not present"
        })
    }
    let data = await order.findById(orderId);
    data.isDelivered = true;
    const updateOrder = await data.save();
    res.status(200).send({ message: "Order Delivered", updateOrder });
})

// 