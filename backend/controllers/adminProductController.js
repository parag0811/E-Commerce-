const Product = require("../models/product.js");
const User = require("../models/user.js");
const multer = require("multer");
const sharp = require("sharp");

const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { validationResult } = require("express-validator");

const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // *Only stores in memory not disk.

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACESS_KEY = process.env.SECRET_ACESS_KEY;

// const randomImageName = (bytes = 32) =>
//   crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACESS_KEY,
  },
  region: BUCKET_REGION,
});

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.userId });

    if (!products) {
      const error = new Error("Can't find the products!");
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
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    const error = new Error(
      "Validation failed, Check all the required blocks."
    );
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const stock = req.body.stock;
  const category = req.body.category;
  const brand = req.body.brand;
  const flatSize = Array.isArray(req.body.size)
    ? req.body.size.flat()
    : [req.body.size];
  const gender = req.body.gender
    ? req.body.gender.charAt(0).toUpperCase() +
      req.body.gender.slice(1).toLowerCase()
    : "";

  console.log(req.body);
  console.log(req.file);

  if (!req.file) {
    const error = new Error("Image file is required.");
    error.statusCode = 422;
    throw error;
  }

  const buffer = await sharp(req.file.buffer)
    // .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer();

  const uniqueId = uuidv4();
  const image = uniqueId;
  const params = {
    Bucket: BUCKET_NAME,
    Key: image,
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command); // Saves in S3 Bucket

  const product = new Product({
    userId: userId,
    title: title,
    description: description,
    price: price,
    stock: stock,
    category: category,
    images: image,
    brand: brand,
    size: flatSize,
    gender: gender,
  });
  console.log(product);
  try {
    await product.save();
    res.status(201).json({
      product: product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const editProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    if (!product.userId || product.userId.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    
    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    if (req.body.size) {
      product.size = Array.isArray(req.body.size)
        ? req.body.size
        : [req.body.size]; // ensures it's always an array
    }

    if (req.body.gender) {
      product.gender =
        req.body.gender.charAt(0).toUpperCase() +
        req.body.gender.slice(1).toLowerCase();
    } else {
      product.gender = product.gender;
    }

    if (req.file) {
      if (product.images) {
        const deleteParams = {
          Bucket: BUCKET_NAME,
          Key: product.images,
        };
        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3.send(deleteCommand);
      }

      const uniqueId = uuidv4();
      const image = uniqueId;
      const buffer = await sharp(req.file.buffer).toBuffer();
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: image,
        Body: buffer,
        ContentType: req.file.mimetype,
      };

      const uploadCommand = new PutObjectCommand(uploadParams);
      await s3.send(uploadCommand);

      product.images = uniqueId;
    }
    console.log(product);
    await product.save();
    console.log(product);

    res.status(200).json({
      product: product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    const prodObj = product.toObject();
    if (!product) {
      const error = new Error("No posts found.");
      error.statusCode = 404;
      throw error;
    }

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

const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (!product.userId || product.userId.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    
    if (
      !product.userId ||
      product.userId.toString() !== req.userId.toString()
    ) {
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }
    
    const users = await User.find({ "cart.productId": productId });

    for (let user of users) {
      user.cart = user.cart.filter(
        (item) => item.productId.toString() !== productId
      );

      await user.save();
    }

    if (product.images) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: product.images,
      };
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
    }
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getProducts,
  createProduct,
  editProduct,
  getProduct,
  deleteProduct,
  upload,
};
