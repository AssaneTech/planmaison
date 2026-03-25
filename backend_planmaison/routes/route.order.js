//route.order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/model.order');
const auth = require('../middleware/middleware.auth');
// Créer une nouvelle commande
router.post('/', auth, async (req, res) => {
  try {    const { items, total } = req.body;
    const userId = req.user.id;
    const order = new Order({ userId, items, total });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  } });

// Récupérer les commandes d'un utilisateur
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

module.exports = router;

