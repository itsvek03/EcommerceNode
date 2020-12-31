// Importing the library
const express = require("express");
const visitrouter = express.Router();
const VisitorAuthController = require("../controller/visitorAuthController");
const VisitorController = require("../controller/VisitorController");

visitrouter
    .route("/signup")
    .post(VisitorAuthController.signup);

visitrouter
    .route("/login")
    .post(VisitorAuthController.Login);

visitrouter
    .route("/forgotPassword")
    .post(VisitorAuthController.forgotPassword);

visitrouter
    .route("/resetPassword/:token")
    .patch(VisitorAuthController.resetPassword);

visitrouter
    .route("/updateMyPassword")
    .patch(VisitorAuthController.protectTo, VisitorAuthController.updatePassword);

visitrouter
    .route("/getAllUsers")
    .get(VisitorController.getAllUsers)

visitrouter
    .route("/deleteMe")
    .delete(VisitorAuthController.protectTo, VisitorController.deleteMe)

visitrouter
    .route("/updateMe")
    .patch(VisitorAuthController.protectTo, VisitorController.UpdateMe)



module.exports = visitrouter;
