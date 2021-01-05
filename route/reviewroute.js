const reviewController = require('../controller/reviewController')
const visitorAuthController = require('../controller/visitorAuthController')
const express = require('express')
const reviewrouter = express.Router({ mergeParams: true });

reviewrouter
    .route('/')
    .get(reviewController.getReviewById)
    .post(
        visitorAuthController.protectTo,
        visitorAuthController.restrictTo('Visitor'),
        reviewController.postReview
    )

module.exports = reviewrouter