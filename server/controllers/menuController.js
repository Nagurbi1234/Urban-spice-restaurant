const MenuItem = require("../models/MenuItem");

// @desc    Get all menu items (supports search, category, vegetarian, sort query params)
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res, next) => {
  try {
    const { search, category, vegetarian, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (vegetarian === "true") {
      query.isVegetarian = true;
    }

    let mongoQuery = MenuItem.find(query);

    if (sort === "price-low") {
      mongoQuery = mongoQuery.sort({ price: 1 });
    } else if (sort === "price-high") {
      mongoQuery = mongoQuery.sort({ price: -1 });
    } else {
      mongoQuery = mongoQuery.sort({ rating: -1 });
    }

    const items = await mongoQuery;
    return res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Dish not found." });
    }
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ error: "Dish not found." });
    }
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Dish not found." });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
