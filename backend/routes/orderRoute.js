const express = require("express");
const router = express.Router();

const isAuthorized = require("../middleware/userAuth.js");
const orderControllers = require("../controllers/orderController.js");

router.get("/checkout", isAuthorized, orderControllers.checkoutPage);

router.get("/orders", isAuthorized, orderControllers.getOrders);

router.post("/orders", isAuthorized, orderControllers.placeOrder);

module.exports = router;
