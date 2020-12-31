const express = require('express');
const productcontroller = require('../controller/productController');
const authController = require('../controller/visitorAuthController');
const cartrouter = require('../route/cartitemroute')
const cartcontroller = require('../controller/cartController')
const router = express.Router();

// router
//      .route('/:productId/cart')
//      .post(
//           authController.protectTo,
//           authController.restrictTo('Visitor'),
//           cartcontroller.GetCardItemById
//      )

router.use('/:productId/carts', cartrouter)

router.route('/')
     .post(productcontroller.postProduct)
     .get(productcontroller.getProduct)


router
     .route('/:id')
     .get(productcontroller.getProductById)
     .delete(productcontroller.deleteById)
     .patch(productcontroller.updateProduct)

module.exports = router;

//api/product/2e1/cart