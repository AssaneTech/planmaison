//route.plan.js
const express = require("express");
const router = express.Router();
const Plan = require("../models/model.plan");

// GET /plans - Récupérer tous les plans
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /plans/:id - Récupérer un plan par ID
router.get("/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan non trouvé" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /plans - Ajouter un plan
router.post("/", async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /plans/:id - Mettre à jour un plan
router.put("/:id", async (req, res) => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) return res.status(404).json({ message: "Plan non trouvé" });
    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE /plans/:id - Supprimer un plan
router.delete("/:id", async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: "Plan non trouvé" });
    res.json({ message: "Plan supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

