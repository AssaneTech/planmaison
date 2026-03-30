const express = require('express');
const router = express.Router();
// ATTENTION : Le nom du require doit correspondre à ton fichier controller.user.js
const userCtrl = require('../controllers/controller.user');

router.get('/', userCtrl.getAllUsers);
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.put('/:id', userCtrl.updateUser); // Route pour l'édition
router.delete('/:id', userCtrl.deleteUser); // Route pour la suppression
// Vérifier si un email existe déjà
router.get("/check-email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;