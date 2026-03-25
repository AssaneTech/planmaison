//controller.plan.js
const Plan = require('../models/model.plan');

// Créer un nouveau plan
exports.createPlan = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const plan = new Plan({ name, description, price });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error });
  }
};

// Récupérer tous les plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error });
  }
};

// Récupérer un plan par ID
exports.getPlanById = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan', error });
  }
};

// Mettre à jour un plan
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { name, description, price } = req.body;
    const plan = await Plan.findByIdAndUpdate(planId, { name, description, price }, { new: true });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating plan', error });
  }
};

// Supprimer un plan
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await Plan.findByIdAndDelete(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error });
  }
};