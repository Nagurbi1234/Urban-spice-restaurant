const express = require("express");
const {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getReservations);
router.post("/", protect, createReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);

module.exports = router;
