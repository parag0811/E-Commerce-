require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userAuthRoutes = require("./routes/userRoute");
const adminProductRoutes = require("./routes/adminProductRoute");
const publicProductRoutes = require("./routes/publictProductRoute");
const orderRoute = require("./routes/orderRoute");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use("/auth", userAuthRoutes);
app.use("/admin", adminProductRoutes);
app.use(publicProductRoutes);
app.use(orderRoute);

app.use((error, req, res, next) => {
  if (error.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ message: "User not logged in or invalid token" });
  }
  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  const data = error.data || null;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then((result) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
