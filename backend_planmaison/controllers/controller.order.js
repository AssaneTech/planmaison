const bcrypt = require("bcrypt");
const path = require("path");

const User = require("../models/model.user");
const Order = require("../models/model.order");
const Plan = require("../models/model.plan");

const { generateFullProjectPdf } = require("../utils/generatePdf");
const sendEmail = require("../utils/utils.sendEmail");

/**
 * ================================
 * FINALISER UNE COMMANDE
 * ================================
 */
const processFinalOrder = async (req, res) => {
  try {
    const { plan: planFromFront, client } = req.body;

    console.log("📥 BODY :", req.body);

    // ========================
    // VALIDATION
    // ========================
    if (!planFromFront || !planFromFront._id || !client || !client.email) {
      return res.status(400).json({ error: "Données invalides." });
    }

    // ========================
    // RECUP PLAN
    // ========================
    const plan = await Plan.findById(planFromFront._id).lean();

    if (!plan) {
      return res.status(404).json({ error: "Plan introuvable." });
    }

    console.log("✅ PLAN :", plan.name);

    const clientEmail = client.email.toLowerCase().trim();

    // ========================
    // USER (ANTI CRASH)
    // ========================
    let user = await User.findOne({ email: clientEmail });

    if (!user) {
      user = await User.create({
        firstName: client.nom || "Client",
        lastName: "",
        email: clientEmail,
        password: await bcrypt.hash("123456", 10),
        role: "client"
      });

      console.log("🆕 USER CRÉÉ");
    }

    const userId = user._id;

    // ========================
    // REFERENCE
    // ========================
    const orderRef = `PM-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // ========================
    // PDF PAYLOAD
    // ========================
    const BASE_URL =
      process.env.BASE_URL || "https://backend-planmaison.onrender.com";

    const pdfPayload = {
      _id: plan._id,
      name: plan.name || "Villa",
      client: (client.nom || "Client").toUpperCase(),
      ref: orderRef,
      rccm: "SN.MBR.2024.A.2346",
      ninea: "011505346",
      designer: {
        name: "M. Assane DIOUF",
        title: "Ingénieur Génie Civil",
        email: "assanediouf0063@gmail.com",
        phones: "77 348 69 30",
        address: "Mbour, Sénégal"
      },
      images:
        plan.images && plan.images.length > 0
          ? plan.images
          : [`${BASE_URL}/storage/default.png`],
      pdfs: plan.pdfs || []
    };

    // ========================
    // GENERATION PDF (SAFE)
    // ========================
    let downloadUrl = "";

    try {
      console.log("⏳ Génération PDF...");

      const generatedPdfPath = await generateFullProjectPdf(pdfPayload);

      const fileName = path.basename(generatedPdfPath);

      downloadUrl = `/storage/generated/${fileName}`;

      console.log("✅ PDF OK");
    } catch (err) {
      console.error("❌ PDF ERROR :", err.message);

      downloadUrl = "/storage/generated/default.pdf";
    }

    // ========================
    // CREER COMMANDE
    // ========================
    const newOrder = await Order.create({
      user: userId,
      plan: plan._id,
      amount: plan.price,
      orderReference: orderRef,
      downloadUrl,
      status: "Completed"
    });

    console.log("🧾 COMMANDE CRÉÉE");

    // ========================
    // AJOUT AU USER
    // ========================
    await User.findByIdAndUpdate(userId, {
      $push: {
        purchasedPlans: {
          plan: plan._id,
          downloadUrl
        }
      }
    });

    console.log("📚 AJOUT USER OK");

    // ========================
    // EMAIL (SAFE)
    // ========================
    try {
      await sendEmail({
        to: clientEmail,
        subject: "Votre plan est prêt",
        text: `Téléchargement : ${downloadUrl}`
      });

      console.log("📧 EMAIL OK");
    } catch (err) {
      console.error("❌ EMAIL ERROR :", err.message);
    }

    // ========================
    // RESPONSE
    // ========================
    return res.status(201).json({
      success: true,
      message: "Commande réussie",
      downloadUrl
    });

  } catch (error) {
    console.error("❌ ERREUR GLOBAL :", error);

    return res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
};

/**
 * ================================
 * COMMANDES UTILISATEUR
 * ================================
 */
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("plan")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * ================================
 * ADMIN - TOUTES COMMANDES
 * ================================
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName email")
      .populate("plan", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * ================================
 * CRUD SIMPLE
 * ================================
 */
const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ================================
 * EXPORT
 * ================================
 */
module.exports = {
  processFinalOrder,
  getUserOrders,
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder
};