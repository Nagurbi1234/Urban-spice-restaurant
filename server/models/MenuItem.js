const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
