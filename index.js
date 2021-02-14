// Importing the file
const express = require("express");
const app = express();
let helmet = require("helmet");
let morgan = require("morgan");
const AppError = require("./utils/AppError")
const globalHandleError = require("./controller/errorController")
const cors = require("cors");
app.use(express.json());
app.use("/uploads", express.static("uploads"));
//app.options('*', cors())

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,PATCH,GET,OPTIONS');
//   next();
// })

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
  next();
});
let config = require("config");

// Importing the route file
const subCategoryroute = require("./route/subCategoryroute");
const categoryroute = require("./route/categoryroute");
const productroute = require("./route/productroute");
const visitRoute = require("./route/visitorRoute");
const feedroute = require("./route//feedbackroute");
const reviewroute = require("./route/reviewroute");
const ecartroute = require("./route/ecartroute");
const orderroute = require("./route//orderroute")



// Utilizing the app
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}
app.use(helmet());

/**
 *  These method blocks the user if does not provide app key
 */
if (!config.get("APP_KEY")) {
  console.error("SERVER FATAL ERROR!!! APP_KEY is not defined");
  process.exit(1);
}

// Using the route  file
app.use("/api/subcategory", subCategoryroute);
app.use("/api/category", categoryroute);
app.use("/api/product", productroute);
app.use("/api/visitor", visitRoute);
app.use("/api/feedback", feedroute);
app.use("/api/review", reviewroute);
app.use("/api/ecart", ecartroute);
app.use("/api/order", orderroute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on these server`, 404))
})
app.use(globalHandleError);
module.exports = app;


// Card Model the last Model