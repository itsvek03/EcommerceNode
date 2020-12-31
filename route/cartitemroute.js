const cartItemController = require("../controller//cartController")
const visitorauthcontroller = require("../controller/visitorAuthController")
const express = require("express");
const cartitemroute = express.Router({ mergeParams: true });

cartitemroute
    .route("/")
    .post(visitorauthcontroller.protectTo, cartItemController.InsertCardItem)
    .get(cartItemController.GetCardItem)

cartitemroute
    .route("/:id")
    .get(cartItemController.GetCardItemById)
    .delete(cartItemController.DeleteCarts)
    .patch(cartItemController.UpdateCarts)


module.exports = cartitemroute;