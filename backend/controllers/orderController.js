const User = require("../models/user.js");
const Order = require("../models/order.js");
const Product = require("../models/product.js");
const { v4: uuidv4 } = require("uuid");

exports.checkoutPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("cart.productId");
    if (!user) {
      const error = new Error("No user found");
      error.statusCode = 404;
      throw error;
    }
    if (user.cart.length === 0) {
      const error = new Error("Cart is Empty!");
      error.statusCode = 404;
      throw error;
    }

    const orderItems = user.cart.map((item) => {
      const price = item.productId.price;
      const quantity = item.quantity;
      return {
        productId: item.productId,
        quantity,
        size: item.size,
        totalPrice: price * quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    res.status(201).json({ totalAmount: totalAmount, orderItems: orderItems });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    
    res.status(200).json({ orders });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("cart.productId");

    if (!user) {
      const error = new Error("No user found");
      error.statusCode = 404;
      throw error;
    }

    if (user.cart.length === 0) {
      const error = new Error("Cart is Empty!");
      error.statusCode = 400;
      throw error;
    }

    const uniqueId = uuidv4();

    let totalAmount = 0;

    const orderItems = user.cart.map((item) => {
      const price = item.productId.price;
      const quantity = item.quantity;

      const totalPrice = price * quantity;

      return {
        productId: item.productId._id,
        quantity: quantity,
        totalPrice: totalPrice,
      };
    });

    totalAmount = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);

    const newOrder = new Order({
      user: req.userId,
      orderItems: orderItems,
      totalAmount: totalAmount,
      paymentStatus: "completed",
      orderStatus: "pending",
      transactionId: uniqueId,
    });
    await newOrder.save();

    user.cart = [];
    await user.save();

    res.status(201).json({ order: newOrder });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
