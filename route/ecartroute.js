const EcartController = require('../controller/ecartController')
const visitorAuthController = require('../controller/visitorAuthController');
const express = require('express')
const ecartrouter = express.Router({ mergeParams: true });

ecartrouter
    .route('/')
    .get(EcartController.getCartUser)

ecartrouter.route('/:productId').post(visitorAuthController.protectTo,
    visitorAuthController.restrictTo('Visitor'),
    EcartController.postECart)


ecartrouter.route('/:id')
    .delete(visitorAuthController.protectTo, EcartController.removeCart)

module.exports = ecartrouter
