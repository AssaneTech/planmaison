const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:5000";

// 🔥 Fonction pour récupérer les images d’un dossier
const getPlanImages = (planFolder) => {
  const dirPath = path.join(__dirname, "../storage", planFolder);

  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath);

  return files.map((file) => `${BASE_URL}/storage/${planFolder}/${file}`);
};
// 🔥 GET ONE PLAN
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const plan = {
    id,
    name: "Plan " + id,
    price: 450000,
    surface: "150 m²",
    dimensions: "10m x 15m",
    images: getPlanImages(`plan${id}`),
  };

  res.json(plan);
});

module.exports = router;