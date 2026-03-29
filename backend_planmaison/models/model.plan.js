// model.plan.js
const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  surface: String,
  dimensions: String,
  rooms: Number,
  type: String,
  folder: String,
  images: [String],
  pdfs: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Plan", planSchema);
