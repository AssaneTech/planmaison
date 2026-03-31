const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");

const User = require("../models/model.user");
const Order = require("../models/model.order");
const Plan = require("../models/model.plan");

const { generateFullProjectPdf } = require("../utils/generatePdf");
const sendEmail = require("../utils/utils.sendEmail");


/**
 * FINALISER UNE COMMANDE
 */
const processFinalOrder = async (req, res) => {
  try {
    const { plan: planFromFront, client } = req.body;

    if (!planFromFront || !planFromFront._id || !client || !client.email) {
      return res.status(400).json({ error: "Données invalides." });
    }

    // --- NOUVELLE ÉTAPE CRUCIALE ---
    // On va chercher le plan COMPLET en base de données
    const plan = await Plan.findById(planFromFront._id).lean();
    if (!plan) {
      return res.status(404).json({ error: "Plan introuvable en base de données." });
    }

    const clientEmail = client.email.toLowerCase().trim();

    // --- GESTION UTILISATEUR --- (Inchangé)
    let user = await User.findOne({ email: clientEmail });
    // ... ton code de création d'user ...
    const userId = user._id;

   // --- RÉFÉRENCE ET PDF ---
    const orderRef = `PM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // On prépare l'objet pour qu'il corresponde EXACTEMENT à ce que generatePdf attend
    const pdfPayload = {
      _id: plan._id,
      name: plan.name || "Villa Moderne", // On s'assure que name existe
      client: (client.nom || "Client").toUpperCase(), // Ton PDF utilise plan.client
      ref: orderRef, // Ton PDF utilise plan.ref
      rccm: "SN.MBR.2024.A.2346", // Données fixes pour BAOLMAX
      ninea: "011505346",
      designer: {
        name: "M. Assane DIOUF",
        title: "Ingénieur Génie Civil",
        email: "assanediouf0063@gmail.com",
        phones: "77 348 69 30",
        address: "Mbour, Sénégal"
      },
      images: plan.images && plan.images.length > 0 ? plan.images : ["http://localhost:5000/storage/default.png"],
      pdfs: plan.pdfs || []
    };

    console.log("⏳ Envoi des données adaptées au PDF pour :", pdfPayload.name);
    
    // On appelle la fonction avec l'objet formaté
    const generatedPdfPath = await generateFullProjectPdf(pdfPayload);
    
    const fileName = path.basename(generatedPdfPath);
    const downloadUrl = `/storage/generated/${fileName}`;

    // --- 5. ENREGISTRER COMMANDE ---
    const newOrder = await Order.create({
      user: userId,
      plan: plan._id,
      amount: plan.price,
      orderReference: orderRef,
      downloadUrl,
      status: "Completed"
    });

    // --- 5.1 MISE À JOUR DE L'UTILISATEUR (L'étape manquante !) ---
    // On ajoute le plan et son lien de téléchargement unique au profil de l'user
    await User.findByIdAndUpdate(userId, {
      $push: { 
        purchasedPlans: { 
          plan: plan._id, 
          downloadUrl: downloadUrl 
        } 
      }
    });

    console.log("✅ Plan ajouté à la bibliothèque de :", clientEmail);

    // --- 6. EMAIL --- (Inchangé)
    // ... ton code d'envoi d'email ...

    // --- 7. RÉPONSE ---
    res.status(201).json({
      success: true,
      message: "Commande finalisée et bibliothèque mise à jour",
      downloadUrl
    });

  } catch (error) {
    console.error("❌ ERREUR FINAL ORDER :", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

/**
 * HISTORIQUE DES COMMANDES
 */
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("plan")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Erreur getUserOrders :", error);
    res.status(500).json({
      error: "Impossible de récupérer les commandes"
    });
  }
};

//getAllOrders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate("plan", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (err) {
    console.error("Erreur getAllOrders:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//creer une commande
const createOrder = async (req, res) => {
  try {
    const { userId, planId, amount, status, downloadUrl } = req.body;

    const orderRef = `PM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newOrder = await Order.create({
      user: userId,
      plan: planId,
      amount,
      status: status || "Completed",
      orderReference: orderRef,
      downloadUrl: downloadUrl || ""
    });

    // Si la commande est créée directement en "Completed", on l'ajoute à l'user
    if (newOrder.status === "Completed") {
      await User.findByIdAndUpdate(userId, {
        $push: { 
          purchasedPlans: { plan: planId, downloadUrl: downloadUrl || "" } 
        }
      });
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//update une commande
const updateOrder = async (req, res) => {
  try {
    const { status, amount } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, amount },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    res.status(200).json(updatedOrder);

  } catch (err) {
    console.error("Erreur updateOrder:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//delete une commande
const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    res.status(200).json({ message: "Commande supprimée" });

  } catch (err) {
    console.error("Erreur deleteOrder:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mise à jour du statut de la commande (ex: "Completed") et liaison du plan à l'utilisateur

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // 1. Mise à jour de la commande
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    // 2. Si la commande est complétée, on lie le plan à l'utilisateur
    if (status === "Completed") {
      await User.findByIdAndUpdate(order.user, {
        $push: { 
          purchasedPlans: { 
            plan: order.plan, 
            downloadUrl: order.downloadUrl // On stocke l'URL générée ici !
          } 
        }
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  processFinalOrder,
  getUserOrders,
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus
};