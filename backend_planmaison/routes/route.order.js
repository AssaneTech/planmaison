const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/controller.order");

// 1. Route pour finaliser une commande (Paiement simulé -> PDF -> Email)
// Appelée par le bouton "Confirmer le paiement" de ton frontend
router.post("/finalize", orderCtrl.processFinalOrder);

// 2. Route pour récupérer les commandes d'un utilisateur spécifique
// Utilisée pour l'affichage dans l'Espace Client (Mes Plans)
router.get("/user/:userId", orderCtrl.getUserOrders);
// 3. Route pour récupérer toutes les commandes (Admin)
router.get("/", orderCtrl.getAllOrders);
router.post("/", orderCtrl.createOrder);
router.put("/:id", orderCtrl.updateOrder);
router.delete("/:id", orderCtrl.deleteOrder);

module.exports = router;