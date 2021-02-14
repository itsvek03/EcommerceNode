const { Router } = require("express");
const visitorAuthController = require('../controller/visitorAuthController');
const order = require('../controller/ordercontroller');


const router = Router();

router.route("/").post(visitorAuthController.protectTo, order.addToOrder)
    .get(order.getAllOrdres)

router.route("/myorders").get(visitorAuthController.protectTo, order.getAllOders);

// router.route("/:orderId/pay").patch(visitorAuthController.protectTo, order.updateOrderToPaid)

router.route("/:orderId/deliver").patch(visitorAuthController.protectTo, order.UpdateOrderById)


router.route("/:id").get(visitorAuthController.protectTo, order.getOrderById);

module.exports = router;
