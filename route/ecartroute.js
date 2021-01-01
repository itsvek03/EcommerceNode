const EcartItemController = require("../controller/EcartController")
const visitorauthcontroller = require("../controller/visitorAuthController")
const express = require("express");
const ecartitemroute = express.Router();

ecartitemroute
    .route("/")
    .post(visitorauthcontroller.protectTo, EcartItemController.InsertCartItems)

module.exports = ecartitemroute