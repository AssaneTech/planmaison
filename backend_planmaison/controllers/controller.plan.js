// controller.plan.js
const Plan = require("../model.plan");

// Récupérer tous les plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un plan par ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan non trouvé" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter un plan
exports.createPlan = async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour un plan
exports.updatePlan = async (req, res) => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) return res.status(404).json({ message: "Plan non trouvé" });
    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un plan
exports.deletePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: "Plan non trouvé" });
    res.json({ message: "Plan supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
