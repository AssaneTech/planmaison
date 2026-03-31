const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "Mbour" },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
    
    // --- AJOUT DE LA BIBLIOTHÈQUE DE PLANS ---
    purchasedPlans: [
        {
            plan: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Plan' // Assure-toi que ton modèle de plan s'appelle bien 'Plan'
            },
            downloadUrl: { type: String }, // L'URL du PDF généré spécifiquement
            purchasedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);