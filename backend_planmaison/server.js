const express = require("express");
const cors = require("cors");
const path = require("path");
const { file } = require("pdfkit");

const app = express();
const PORT = 5000;

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 📂 Rendre accessible le dossier storage
app.use("/storage", express.static(path.join(__dirname, "storage")));

// 🧠 Fake data (simulation base de données)
const plans = [
  {
    id: 1,
    name: "Villa Moderne F4",
    price: 450000,
    surface: "150 m²",
    dimensions: "10m x 15m",
    images: [
        "http://localhost:5000/storage/plan1/image_0.png",
        "http://localhost:5000/storage/plan1/image_1.png",
        "http://localhost:5000/storage/plan1/image_2.png",
        "http://localhost:5000/storage/plan1/image_3.png"
    ],
    files: "http://localhost:5000/storage/plan1/plan.zip",
  },
  {
    id: 2,
    name: "Duplex Standing F5",
    price: 650000,
    surface: "220 m²",
    dimensions: "15m x 20m",
    images: [
        "http://localhost:5000/storage/plan1/image_0.png",
        "http://localhost:5000/storage/plan1/image_1.png",
        "http://localhost:5000/storage/plan1/image_2.png",
        "http://localhost:5000/storage/plan1/image_3.png"
    ],
    files: "http://localhost:5000/storage/plan2/plan.zip",
  },
  {
    id: 3,
    name: "Studio Compact Éco",
    price: 250000,
    surface: "45 m²",
    dimensions: "8m x 12m",
    images: [
        "http://localhost:5000/storage/plan1/image_0.png",
        "http://localhost:5000/storage/plan1/image_1.png",
        "http://localhost:5000/storage/plan1/image_2.png",
        "http://localhost:5000/storage/plan1/image_3.png"
    ],
    files: "http://localhost:5000/storage/plan3/plan.zip",
  },
];

// 🔥 ROUTE ACCUEIL
app.get("/", (req, res) => {
  res.send("🚀 API PlanMaison fonctionne");
});

// 🔥 GET ALL PLANS
app.get("/plans", (req, res) => {
  res.json(plans);
});

// 🔥 GET PLAN BY ID
app.get("/plans/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    return res.status(404).json({ message: "Plan introuvable" });
  }

  res.json(plan);
});

// 🚀 Lancer serveur
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});