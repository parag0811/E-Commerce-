const express = require("express");
const router = express.Router();

const isAuthorized = require("../middleware/userAuth.js");
const publicProductController = require("../controllers/publicProductController.js");

router.get("/products", publicProductController.getProducts);

router.get("/products/:productId", publicProductController.getSingleProduct);

router.post("/cart", isAuthorized, publicProductController.addToCart);

router.get("/cart", isAuthorized, publicProductController.getCart);

router.delete("/cart/:productId", isAuthorized, publicProductController.deleteFromCart)

module.exports = router;
