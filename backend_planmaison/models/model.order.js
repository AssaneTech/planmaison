const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  // 1. Référence au Client (Qui achète ?)
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // 2. Référence au Plan (Quoi ?)
  plan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Plan", 
    required: true 
  },

  // 3. Détails de la transaction
  amount: { 
    type: Number, 
    required: true 
  },
  
  currency: { 
    type: String, 
    default: "XOF",
    uppercase: true // Force l'affichage en majuscules (ex: XOF)
  },

  // 4. Statut de la commande
  status: { 
    type: String, 
    enum: ["Pending", "Completed", "Cancelled"], 
    default: "Pending" 
  },

  // 5. LIVRAISON : Le lien vers le fichier final (PDF)
  // Stocké sous la forme : /storage/generated/BAOLMAX_123.pdf
  downloadUrl: { 
    type: String, 
    required: false 
  },

  // 6. Référence unique de transaction (ex: PM-2026-XXXX)
  orderReference: {
    type: String,
    unique: true,
    required: true // Indispensable pour le suivi ingénieur
  }
}, { 
  timestamps: true // Crée automatiquement createdAt et updatedAt
});

module.exports = mongoose.model("Order", orderSchema);