//route.user.js
const express = require('express');
const router = express.Router();
const User = require('../models/model.user');
const generatePassword = require('../utils/utils.generatePassword');
const sendEmail = require('../utils/utils.sendEmail');
// Inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      // Générer un mot de passe aléatoire
      const password = generatePassword();
      // Créer un nouvel utilisateur
      const user = new User({ email, password });
      await user.save();
      // Envoyer le mot de passe par email
      await sendEmail(email, 'Your Account Password', `Your password is: ${password}`);
      res.status(201).json({ message: 'User registered successfully. Password sent to email.' });
    }} catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }       
});

module.exports = router;
