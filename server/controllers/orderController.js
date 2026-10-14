const Order = require("../models/Order");

// @desc    Get orders (own orders for users, all orders for admins)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by id (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    const isOwner = order.user && order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not allowed to view this order." });
    }
    return res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must include at least one item." });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const method = paymentMethod === "online" ? "online" : "cod";

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress: deliveryAddress || "",
      paymentMethod: method,
      paymentStatus: method === "online" ? "paid" : "pending",
      orderStatus: "Confirmed",
    });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    return res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
