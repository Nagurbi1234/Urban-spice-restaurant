const Reservation = require("../models/Reservation");

// @desc    Get reservations (own reservations for users, all for admins)
// @route   GET /api/reservations
// @access  Private
const getReservations = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });
    return res.json(reservations);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, specialRequest } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: "Please fill in all required reservation details." });
    }

    const chosenDate = new Date(date);
    const today = new Date(new Date().toDateString());
    if (chosenDate < today) {
      return res.status(400).json({ error: "Please choose a valid future date." });
    }

    const reservation = await Reservation.create({
      user: req.user ? req.user._id : undefined,
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequest: specialRequest || "",
      status: "Pending",
    });

    return res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a reservation (status or details)
// @route   PUT /api/reservations/:id
// @access  Private
const updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    const isOwner = reservation.user && reservation.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not allowed to update this reservation." });
    }

    Object.assign(reservation, req.body);
    await reservation.save();
    return res.json(reservation);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/cancel a reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    const isOwner = reservation.user && reservation.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not allowed to delete this reservation." });
    }

    await reservation.deleteOne();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
};
