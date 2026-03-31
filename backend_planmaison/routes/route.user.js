const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/controller.user");

// --- 1. ROUTES FIXES (Toujours en premier) ---
router.get("/check-email", userCtrl.checkEmail); // Déplacé ici pour éviter le conflit avec :id
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/", userCtrl.getAllUsers);

// --- 2. ROUTES AVEC PARAMÈTRES ---
router.get("/:id", userCtrl.getUserById);
router.put("/:id", userCtrl.updateUser);
router.delete("/:id", userCtrl.deleteUser);

module.exports = router;