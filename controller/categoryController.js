// Importing the file
const Category = require("../model/Category");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
//const SubCategoryModel = require('../model/SubCategory');
//const SubCategoryController =require('../model/SubCategory')

// Post by reference
exports.postCategory = catchAsync(async (req, res, next) => {
  if (1) {
    const cat = new Category({
      cname: req.body.cname,
    });
    const newdata = await cat.save();
    res.status(200).json({
      status: "Success",
      data: newdata,

    });
  } else {
    next(new AppError("Insertion Failed", 401));
  }
});

//get by reference
exports.getCategory = catchAsync(async (req, res, next) => {
  const getdata = await Category.find();
  res.status(200).json({
    status: "Success",
    length: getdata.length,
    data: getdata,
  });
  // for one to many relationships
  // for (var i in getdata) {
  //   console.log(getdata[i]);
  // }
});

// Get By ID
exports.getCategoryID = catchAsync(async (req, res, next) => {
  const getData = await Category.findById(req.params.id);
  if (!getData) {
    return next(new AppError("Id is not present", 404));
  }
  res.status(200).json({
    status: "Success",
    data: getData,
  });
});

// Delete the category
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const cid = await Category.findByIdAndRemove(req.params.id);
  if (!cid) {
    return next(new AppError("Id is not present", 404));
  }
  res.status(200).json({
    status: "Deleted Successfully",
    data: cid,
  });
});

// Update the Category
exports.UpdateCategory = catchAsync(async (req, res, next) => {
  const cid = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!cid) {
    return next(new AppError("Id is not present", 404));
  }
  res.status(200).json({
    status: "Updated Successfully",
    data: cid,
  });
});
