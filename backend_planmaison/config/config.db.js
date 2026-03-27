// config/config.db.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/planmaison"
    );

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Erreur MongoDB :", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;