const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const sqlDb = require("../models/index");
const asyncHandler = require("./async");

// Protect routes
exports.userAuth = asyncHandler(async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ status: "error", message: "unauthorized" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await sqlDb.User.findOne({
      where: { username: decoded.username },
    });

    if (user) {
      next();
    } else {
      return res.status(401).json({ status: "error", message: "unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ status: "error", message: "unauthorized" });
  }
});

// Ensure admin auth

exports.adminAuth = asyncHandler(async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ status: "error", message: "unauthorized" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.secret == "admin") {
      next();
    } else {
      return res.status(401).json({ status: "error", message: "unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ status: "error", message: "unauthorized" });
  }
});
