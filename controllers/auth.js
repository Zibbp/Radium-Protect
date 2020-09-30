const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const sqlDb = require("../models/index");

// TEMP REGISTER USER
// FOR TESTING ONLY
// DELETE
exports.register = asyncHandler(async (req, res, next) => {
  const { username, password, isAdmin } = req.body;

  if (!username || !password) {
    return res
      .status(500)
      .json({ status: "error", message: "supply all fields" });
  }

  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = await sqlDb.User.create({
      username: username,
      password: hash,
      isAdmin: isAdmin,
    });

    res.status(200).json({ status: "success", message: "registered", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error });
  }
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(500).json({ status: "error", message: "supply all fields" });
  }

  try {
    const user = await sqlDb.User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "invalid credentials" });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "invalid credentials" });
    }

    // Generate token
    const token = await jwt.sign(
      { username: username },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({ status: "success", token, isAdmin: user.isAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error" });
  }
});
