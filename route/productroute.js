const express = require('express');
const productcontroller = require('../controller/productController');
const reviewroute = require('../route/reviewroute')
const router = express.Router();

// router
//      .route('/:productId/reviews')
//      .post(
//           visitorAuthController.protectTo,
//           visitorAuthController.restrictTo('Visitor'),
//           reviewController.postReview
//      )

// it is in the mounted way
router.use('/:productId/review', reviewroute)

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