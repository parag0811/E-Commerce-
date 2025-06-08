require("dotenv").config();
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { upload } = require("../controllers/adminProductController");

const isAuthorized = require("../middleware/userAuth.js");
const adminProductController = require("../controllers/adminProductController.js");

const productValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Description must be at least 8 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ gt: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2 })
    .withMessage("Brand must be at least 2 characters"),

  body("size").isArray({ min: 1 }).withMessage("At least one size is required"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .custom((value) => {
      const allowedGenders = ["men", "women", "unisex", "kids"];
      if (!allowedGenders.includes(value.toLowerCase())) {
        throw new Error("Gender must be one of: Men, Women, Unisex, Kids");
      }
      return true;
    }),
];

router.get("/products", isAuthorized, adminProductController.getProducts);

router.post(
  "/add-Product",
  isAuthorized,
  upload.single("images"),
  productValidationRules,
  adminProductController.createProduct
);

router.post(
  "/editProduct/:productId",
  isAuthorized,
  upload.single("images"),
  productValidationRules,
  adminProductController.editProduct
);

router.get(
  "/products/:productId",
  isAuthorized,
  adminProductController.getProduct
);

router.delete(
  "/product/:productId",
  isAuthorized,
  adminProductController.deleteProduct
);

module.exports = router;
