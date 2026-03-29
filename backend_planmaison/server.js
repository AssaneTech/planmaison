// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/config.db");
const planRoutes = require("./routes/route.plan");
const userRoutes = require("./routes/route.user"); 
const orderRoutes = require("./routes/route.order");
const path = require("path");
const cors = require("cors");

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le JSON (Placer avant les routes)
app.use(express.json());

// Configuration CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] // Ajout de Authorization pour le futur JWT
}));

// Servir les fichiers statiques
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Connexion DB pour MongoDB Atlas
connectDB();

// --- Définition des Routes ---
app.use("/plans", planRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});