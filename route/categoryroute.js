const express = require("express");
const catecontroller = require("../controller/categoryController");
const router = express.Router();

router
  .route("/")
  .get(catecontroller.getCategory)
  .post(catecontroller.postCategory);

router
  .route("/:id")
  .get(catecontroller.getCategoryID)
  .patch(catecontroller.UpdateCategory)
  .delete(catecontroller.deleteCategory);

module.exports = router;
