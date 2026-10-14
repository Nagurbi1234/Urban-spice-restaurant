const express = require("express");
const { getSummary, getUsers } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/summary", protect, adminOnly, getSummary);
router.get("/users", protect, adminOnly, getUsers);

module.exports = router;
