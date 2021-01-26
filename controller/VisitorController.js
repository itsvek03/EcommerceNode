const VisitorModel = require("../model/VisitorModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


// Get the Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await VisitorModel.find().populate('CartItems');
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});


exports.getMe = catchAsync(async (req, res, next) => {
    const data = await VisitorModel.findById(req.user.id);
    return res.status(200).json({
        status: 'success',
        data: data
    });
})

//Update the Users
exports.UpdateMe = catchAsync(async (req, res, next) => {

    if (req.body.Password || req.body.ConfirmPassword) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    const filterbody = filterObj(req.body, 'FirstName', 'LastName', 'Email', 'Address');


    const data = await VisitorModel.findByIdAndUpdate(req.user.id, filterbody, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        message: "Updated Successfully",
        data: data
    })
})




// Delete the User data
exports.deleteMe = catchAsync(async (req, res, next) => {
    if (1) {
        await VisitorModel.findByIdAndRemove(req.user.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } else {
        next(new AppError("Id is not present", 401));
    }

})