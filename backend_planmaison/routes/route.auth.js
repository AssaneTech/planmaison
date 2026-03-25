//route.auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/model.user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    } else {
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      // Créer un nouvel utilisateur
      const user = new User({ email, password: hashedPassword });
      await user.save();
      // Générer un token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    }}
 catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    } 
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }   else {
      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Générer un token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
}); 

module.exports = router;
