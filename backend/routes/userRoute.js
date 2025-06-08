const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const isAuthorized = require("../middleware/userAuth.js");

const userController = require("../controllers/userController");

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("E-mail must not be empty.")
      .notEmpty()
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password must not be empty.")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be 8 character long.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number."),
    body("name").notEmpty().withMessage("Name must not be empty."),
  ],
  userController.registerUser
);

router.post("/login", userController.loginUser);

router.get("/profile", isAuthorized, userController.getProfile);

router.put(
  "/profile",
  isAuthorized,
  [
    body("name").notEmpty().withMessage("Name must not be empty."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("address.street")
      .notEmpty()
      .withMessage("Street address is required.")
      .isString(),
    body("address.city").notEmpty().withMessage("City is required.").isString(),
    body("address.state")
      .notEmpty()
      .withMessage("State is required.")
      .isString(),
    body("address.zipCode")
      .notEmpty()
      .withMessage("Zip code is required.")
      .isString(),
    body("address.country")
      .notEmpty()
      .withMessage("Country is required.")
      .isString(),
  ],
  userController.updateProfile
);

module.exports = router;
