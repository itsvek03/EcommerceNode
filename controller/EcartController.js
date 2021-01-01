const Product = require("../model/Product")
const Visitor = require("../model/VisitorModel")
const AppError = require("../utils/AppError");
const Ecart = require("../model/EcartModel")
const catchAsync = require("../utils/catchAsync");


exports.InsertCartItems = catchAsync(async (req, res, next) => {
    //const cart = req.body;

    //let ProductId = [];

    //const email = await Visitor.findById(req.user.Email);
    const user = await Visitor.findOne({ UserEmail: req.user.Email })
    console.log(user)
    // const pid = await Ecart.ECartItemModel.findById({ UserEmail: user._id })
    // if (pid) {
    //     pid.remove();
    //     console.log("removed old cart");
    // }
    // for (let i = 0; i < cart.length; i++) {
    //     let object = {};
    //     object.product = cart[i]._id;
    //     object.count = cart[i].count;
    //     //object.color = cart[i].color;
    //     // get price for creating total
    //     let productFromDb = await Product.productModel.findById(cart[i]._id)
    //         .select("Price")
    //         .exec();
    //     object.price = productFromDb.Price;
    //     ProductId.push(object);
    // }

    // let cartTotal = 0;
    // for (let i = 0; i < ProductId.length; i++) {
    //     cartTotal = cartTotal + ProductId[i].price * ProductId[i].count;
    // }

    // let newCart = await new Ecart.ECartItemModel({
    //     ProductId,
    //     cartTotal,
    //     UserEmail: user.UserEmail,
    // }).save();

    // res.status(200).json({
    //     status: "Successfully",
    //     data: newCart
    // })
    next();
})
