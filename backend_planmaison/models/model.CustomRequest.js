const mongoose = require("mongoose");

const customRequestSchema = new mongoose.Schema({
  reference: { type: String, unique: true }, // Format: REF-2026-XXXX
  nomComplet: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  dimensionsTerrain: String,
  nombrePieces: Number,
  description: String,
  fichierTerrain: String, 
  status: { type: String, default: "en_attente" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CustomRequest", customRequestSchema);