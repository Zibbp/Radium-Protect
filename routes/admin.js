const express = require("express");

const {
  login,
  add,
  users,
  deleteUser,
  stats,
  test,
} = require("../controllers/admin");

const router = express.Router({ mergeParams: true });

const { adminAuth } = require("../middleware/auth");

router.post("/login", login);
router.get("/test", adminAuth, test);
router.post("/add", adminAuth, add);
router.get("/users", adminAuth, users);
router.delete("/users/:id", adminAuth, deleteUser);
router.get("/stats", adminAuth, stats);

module.exports = router;
