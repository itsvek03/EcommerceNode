const EcartController = require('../controller/ecartController')
const visitorAuthController = require('../controller/visitorAuthController');
const express = require('express')
const ecartrouter = express.Router({ mergeParams: true });

ecartrouter
    .route('/')
    .post(visitorAuthController.protectTo,
        visitorAuthController.restrictTo('Visitor'),
        EcartController.postECart)
    .get(EcartController.getCartUser)

module.exports = ecartrouter
