// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/config.db");
const planRoutes = require("./routes/route.plan");
const userRoutes = require("./routes/route.user"); 
const orderRoutes = require("./routes/route.order");
const customRequestRoutes = require("./routes/route.CustomRequest");
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-planmaison.onrender.com"
];

const path = require("path");
const cors = require("cors");

// Initialisation de l'application Express
//10.221.15.241 salle  technique
//10.221.15.242 teranga
//10.221.15.243 switch principal 
//10.221.15.244 salle autocom
//10.221.15.245 salle autocom

const app = express();

// Middleware pour parser le JSON (Placer avant les routes)
app.use(express.json());

// Configuration CORS

/*app.use(cors({
  origin: function (origin, callback) {
    // autorise requêtes sans origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS non autorisé"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));*/


app.use(cors({
  origin: "*"
}));

// Servir les fichiers statiques
app.use("/storage", express.static(path.join(__dirname, "storage")));


// Connexion DB pour MongoDB Atlas
connectDB();

// --- Définition des Routes ---
app.use("/plans", planRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/customrequests", customRequestRoutes);

// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});