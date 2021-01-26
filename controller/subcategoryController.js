// Import the library
const subModel = require("../model/SubCategory");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// Posting the SubCategory
exports.postsubCategory = catchAsync(async (req, res, next) => {
  if (1) {
    const psub = await subModel.create(req.body);
    res.status(200).json({
      status: "Successfully",
      data: psub
    });
  } else {
    next(new AppError("Insertion Failed", 401));
  }
});

// Get the Subcategory
exports.getsubCategory = catchAsync(async (req, res, next) => {
  //let getdata =await subModel.find();
  const features = new ApiFeatures(subModel.find(), req.query).paginate();
  const getdata = await features.query;
  //const getdata =await query;
  console.log(getdata);
  res.status(200).json({
    status: "Success",
    length: getdata.length,
    data: {
      getdata,
    },
  });
});

// Get the SubCategory by Id
exports.getsubCategoryById = catchAsync(async (req, res, next) => {
  const scid = await subModel.findById(req.params.id);
  if (!scid) {
    return next(new AppError("Id is not present...", 404));
  }
  res.status(200).json({
    status: "Successfully",
    data: { scid },
  });
});

// Update the SubCategory
exports.patchsubCategory = catchAsync(async (req, res, next) => {
  const upsubcat = await subModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!upsubcat) {
    return next(new AppError("Id is not present", 404));
  }
  res.status(200).json({
    status: "Updated Successfully",
    data: { upsubcat },
  });
});

// Delete the Sub category
exports.deletesubCategory = catchAsync(async (req, res, next) => {
  const dscid = await subModel.findByIdAndRemove(req.params.id);
  if (!dscid) {
    return next(new AppError("Can not find that id", 404));
  }
  res.status(200).json({
    status: "Deleted Successfully",
    data: { dscid },
  });
});
