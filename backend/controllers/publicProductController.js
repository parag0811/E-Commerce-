const Product = require("../models/product.js");
const User = require("../models/user.js");

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACESS_KEY = process.env.SECRET_ACESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACESS_KEY,
  },
  region: BUCKET_REGION,
});

exports.getProducts = async (req, res, next) => {
  const {
    category,
    minPrice,
    maxPrice,
    gender,
    page = 1,
    limit = 10,
  } = req.query;
  let query = {};

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (category) {
    query.category = category;
  }

  if (gender) {
    query.gender = { $regex: new RegExp(`^${gender}$`, "i") };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = parseFloat(maxPrice);
    }
  }

  try {
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    if (products === 0) {
      const error = new Error("No products available.");
      error.statusCode = 404;
      throw error;
    }

    const updatedProducts = [];

    for (const product of products) {
      const prodObj = product.toObject();
      if (product.images) {
        const getObjectParams = {
          Bucket: BUCKET_NAME,
          Key: product.images,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        prodObj.imageURL = url;
      }
      updatedProducts.push(prodObj);
    }

    res.status(200).json({
      products: updatedProducts,
      totalProducts,
      currentPage: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("No posts found.");
      error.statusCode = 404;
      throw error;
    }
    const prodObj = product.toObject();

    if (product.images) {
      const getObjectParams = {
        Bucket: BUCKET_NAME,
        Key: product.images,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      prodObj.imageURL = url;
    }

    res.status(200).json({ product: prodObj });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    if (!req.userId) {
      const error = new Error("No user found.");
      error.statusCode = 404;
      throw error;
    }
    const { productId, quantity = 1, size } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user data found.");
      error.statusCode = 404;
      throw error;
    }
    if (!size) {
      const error = new Error("Select a size atleast.");
      error.statusCode = 400;
      throw error;
    }
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId && item.size === size
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity, size });
    }
    await user.save();
    res.status(200).json({ cart: user.cart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    if (!req.userId) {
      const error = new Error("No user found.");
      error.statusCode = 404;
      throw error;
    }
    const user = await User.findById(req.userId).populate("cart.productId"); // pop in cart
    if (!user) {
      const error = new Error("No user data found.");
      error.statusCode = 404;
      throw error;
    }
    for (let item of user.cart) {
      if (!item.productId) {
        const error = new Error("Items not found!");
        error.statusCode = 404;
        throw error;
      }

      const product = item.productId;

      if (!product) {
        const error = new Error("Products not available");
        error.statusCode = 400;
        throw error;
      }

      let plainProduct = product.toObject();

      if (product.images) {
        const getObjectParams = {
          Bucket: BUCKET_NAME,
          Key: product.images,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        plainProduct.imageURL = url;
      }
      item.productId = plainProduct;

      if (product) {
        item.totalPrice = product.price * item.quantity;
      }
    }
    const cartTotalPrice = user.cart.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
    res.status(200).json({ cart: user.cart || [], cartTotalPrice });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteFromCart = async (req, res, next) => {
  if (!req.userId) {
    const error = new Error("No user found.");
    error.statusCode = 404;
    throw error;
  }
  try {
    const user = await User.findById(req.userId);
    const { productId } = req.params;
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    res.status(200).json({ cart: user.cart });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
