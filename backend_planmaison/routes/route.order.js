const express = require('express');
const router = express.Router();
const orderController = require('../controllers/controller.order');
const { protect } = require('../middleware/middleware.auth'); // À créer

// Créer une commande (Nécessite d'être connecté)
router.post('/create', protect, orderController.createOrder);

// Valider un paiement
router.post('/verify', protect, orderController.verifyPayment);

module.exports = router;