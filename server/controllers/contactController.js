const ContactMessage = require("../models/ContactMessage");
const Newsletter = require("../models/Newsletter");

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    await ContactMessage.create({ name, email, subject, message });
    return res.status(201).json({ message: "Thanks for reaching out. We will be in touch shortly." });
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe to the newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "This email is already subscribed." });
    }

    await Newsletter.create({ email: email.toLowerCase() });
    return res.status(201).json({ message: "You are on the list." });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendContactMessage, subscribeNewsletter };
