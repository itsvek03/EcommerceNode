const express = require("express");
const subcatecontroller = require("../controller/subcategoryController");
const router = express.Router();

router
  .route("/")
  .post(subcatecontroller.postsubCategory)
  .get(subcatecontroller.getsubCategory);

router
  .route("/:id")
  .get(subcatecontroller.getsubCategoryById)
  .patch(subcatecontroller.patchsubCategory)
  .delete(subcatecontroller.deletesubCategory);

module.exports = router;
