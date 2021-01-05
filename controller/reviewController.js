const reviewModel = require('../model/reviewModel')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError')

exports.postReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.product) {
        req.body.product = req.params.productId
    }

    if (!req.body.user) {
        req.body.user = req.user.id
    }
    const postreview = await reviewModel.create(req.body);
    res.status(200).json({
        status: 'Successfully',
        data: { postreview }
    })
})


exports.getReviewById = catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.productId) filter = { product: req.params.productId }

    const getid = await reviewModel.find(filter);
    if (!getid) {
        return next(new AppError("Review is not there", 400))
    }
    res.status(200).json({
        status: 'Successfully',
        length: getid.length,
        data: { getid }
    })
})