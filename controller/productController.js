// Importing the library
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Product = require("../model/Product");
const multer = require("multer");
const APIfeatures = require("../utils/apiFeatures");
const subModel = require("../model/SubCategory");
let port = "http://localhost:8900";




//Making alias for any top 5 cheap prices 
/**
   api/tour/top5cheap

   we are making top5cheap as router

   there are many stuff is to be used so we 
   have to used the middleware before accessing the getAlltour function


   exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price';
    next();
  };



 */
// exports.aliasTopTours = (req, res, next) => {
//     req.query.limit = '5';
//     req.query.sort = '-ratingAverage,price';
//     req.query.fields = 'name,price';
//     next();
// };








// Storing the image in the folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true); // Accept the file;
    } else {
        cb(null, false); // Rejects the file
    }
};

// to store the image in the destination folder
const uploads = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: fileFilter,
});

// Making the function
exports.postProduct = [uploads.single("PImage"), catchAsync(async (req, res) => {
    if (1) {
        const p = new Product({
            PName: req.body.PName,
            Description: req.body.Description,
            Price: req.body.Price,
            Quantity: req.body.Quantity,
            PImage: port + "/uploads/" + req.file.filename,
            RecordAt: req.body.RecordAt,
            isAvailable: req.body.isAvailable,
            Category: req.body.Category,
            SubCategory: req.body.SubCategory,
            ratingsQuantity: req.body.ratingsQuantity,
            ratingsAverage: req.body.ratingsAverage
        });
        const dp = await p.save();
        res.status(200).json({
            status: "successfully",
            data: dp,
        });
    } else {
        return next(new AppError("Insertion failed", 404))
    }
})
];


// Paginate === localhost: 8900 / api / product ? page = 1 & limit=6


// LimitFields === localhost:8900/api/product?limit=3


// sort ======= localhost:8900/api/product?sort=Price


// sort&paginate ==== localhost:8900/api/product?sort=Price,page = 1&limit=6


// Filter ===== localhost: 8900 / api / product ? Price[lt] = 10000
// (can be used for Price slider)


// Get Product 
exports.getProduct = catchAsync(async (req, res, next) => {
    const fdata = new APIfeatures(Product.find(), req.query)
        .paginate()
        .limitFields()
        .sort()
        .filter();
    const data = await fdata.query.populate('SubCategory Category');
    res.status(200).json({
        message: "Successfully",
        data: data.length,
        data: data
    })
})

// Get Product By Id
exports.getProductById = catchAsync(async (req, res, next) => {
    const data = await Product.findById(req.params.id).populate('SubCategory Category review');
    if (!data) {
        return next(new AppError("Product Id is not valid", 400));
    }
    res.status(200).json({
        message: "Successfully",
        data: data.length,
        data: data
    })
})

// Delete

exports.deleteById = catchAsync(async (req, res, next) => {
    const data = await Product.findByIdAndDelete(req.params.id);
    if (!data) {
        return next(new AppError("Product Id is not valid", 400));
    }
    res.status(200).json({
        message: "Deleted Successfully",
        data: data
    })
})

// Update By Product 

exports.updateProduct = [uploads.single("PImage"), catchAsync(async (req, res, next) => {
    if (req.file) {
        var dataRecord = {
            //PName: req.body.PName,
            //Description: req.body.Description,
            //Price: req.body.Price,
            //Quantity: req.body.Quantity,
            PImage: port + "/uploads/" + req.file.filename
        };
    }
    else {
        var dataRecord = {
            PName: req.body.PName,
            Description: req.body.Description,
            Price: req.body.Price,
            Quantity: req.body.Quantity
        };
    }
    const updata = await Product.findByIdAndUpdate(req.params.id, dataRecord, {
        new: true,
        runValidators: true
    });
    console.log(updata);
    if (!updata) {
        return next(new AppError("Product is not there", 401))
    }
    res.status(200).json({
        status: "Updated Successfully",
        data: updata
    })
})]