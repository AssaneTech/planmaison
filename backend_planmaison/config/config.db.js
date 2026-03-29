// config.db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("🔗 URI utilisé:", uri); // debug
    if (!uri) throw new Error("MONGO_URI non défini");
    
    await mongoose.connect(uri); // plus besoin des options
    console.log("✅ MongoDB Atlas connecté");
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
