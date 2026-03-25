//route.plan.js
const express = require('express');
const router = express.Router();
const Plan = require('../models/model.plan');
const auth = require('../middleware/middleware.auth'); 
// Créer un nouveau plan
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const plan = new Plan({ name, description, price });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error });
  }
});

module.exports = router;
