const express = require("express");
const { sendContactMessage, subscribeNewsletter } = require("../controllers/contactController");

const router = express.Router();

router.post("/contact", sendContactMessage);
router.post("/newsletter", subscribeNewsletter);

module.exports = router;
