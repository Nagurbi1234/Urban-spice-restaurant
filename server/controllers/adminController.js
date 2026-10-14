const User = require("../models/User");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");

// @desc    Get admin dashboard summary
// @route   GET /api/admin/summary
// @access  Private/Admin
const getSummary = async (req, res, next) => {
  try {
    const [totalUsers, totalOrders, totalReservations, orders, pendingOrders] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Reservation.countDocuments(),
      Order.find(),
      Order.countDocuments({ orderStatus: "Pending" }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Compute popular dishes by aggregating order items
    const dishCounts = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        dishCounts[item.name] = (dishCounts[item.name] || 0) + item.quantity;
      });
    });
    const popularDishes = Object.entries(dishCounts)
      .map(([name, orders]) => ({ name, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    return res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      totalReservations,
      pendingOrders,
      popularDishes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getUsers };
