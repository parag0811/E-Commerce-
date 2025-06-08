require("dotenv").config();

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

require("dotenv").config();

exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      const error = new Error(
        "E-mail already exists. Please login with the same e-mail or Register with new E-mail."
      );
      error.statusCode = 409;
      throw error;
    }
    const encryptedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: encryptedPassword,
    });
    await user.save();
    res.status(201).json({ userId: user._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("E-mail does not exist.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
      },
      process.env.jwToken,
      { expiresIn: "1h" }
    );
    res
      .status(201)
      .json({ token: token, userId: user._id.toString(), name: user.name });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("name email address");
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { name, email, address } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    // Check if email is changed and is unique
    if (user.email !== email) {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        const error = new Error("E-mail already exists.");
        error.statusCode = 409;
        throw error;
      }
      user.email = email;
    }

    user.name = name || user.name;
    user.address = {
      street: address?.street || "",
      city: address?.city || "",
      state: address?.state || "",
      zipCode: address?.zipCode || "",
      country: address?.country || "India",
    };

    await user.save();
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

