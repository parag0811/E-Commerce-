const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("User not authenticated! Please add the header!");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader?.split(" ")[1];

  if (!token) {
    const error = new Error("JWT is not sent correctly.");
    error.statusCode = 404;
    throw error;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.jwToken);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
