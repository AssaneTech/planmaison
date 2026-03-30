const CustomRequest = require("../models/model.CustomRequest");

// 1. Soumission d'une nouvelle demande (POST)
exports.submitRequest = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const reference = `REF-${year}-${randomId}`;

    const newRequest = new CustomRequest({
      ...req.body,
      reference,
      fichierTerrain: req.file ? req.file.path : null
    });

    await newRequest.save();
    
    res.status(201).json({ 
      success: true, 
      reference: reference,
      data: newRequest 
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
};

// 2. Récupération de toutes les demandes (GET) - C'EST CETTE FONCTION QUI MANQUAIT
exports.getAllCustomRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des demandes" });
  }
};