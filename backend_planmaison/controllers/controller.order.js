const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");

const User = require("../models/model.user");
const Order = require("../models/model.order");

const { generateFullProjectPdf } = require("../utils/generatePdf");
const sendEmail = require("../utils/utils.sendEmail");

/**
 * FINALISER UNE COMMANDE
 */
const processFinalOrder = async (req, res) => {
  try {
    const { plan, client } = req.body;

    // --- 1. VALIDATION ---
    if (!plan || !plan._id || !client || !client.email) {
      return res.status(400).json({
        error: "Données invalides (plan ou client manquant)."
      });
    }

    const clientEmail = client.email.toLowerCase().trim();

    // --- 2. GESTION UTILISATEUR (ANTI-DOUBLON) ---
    let user = await User.findOne({ email: clientEmail });
    let tempPassword = "";
    let isNewUser = false;

    if (!user) {
      isNewUser = true;

      tempPassword = crypto.randomBytes(4).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await User.create({
        firstName: client.nom || "Client",
        lastName: "BAOLMAX",
        email: clientEmail,
        phone: client.telephone,
        password: hashedPassword,
        role: "client"
      });

      console.log("👤 Nouveau user créé :", clientEmail);
    } else {
      console.log("👤 User existant :", clientEmail);
    }

    const userId = user._id;

    // --- 3. RÉFÉRENCE UNIQUE ---
    const orderRef = `PM-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // --- 4. GÉNÉRATION PDF ---
    const pdfPayload = {
      ...plan,
      client: (client.nom || "CLIENT").toUpperCase(),
      ref: orderRef,
      designer: {
        name: "M. Assane DIOUF",
        title: "Ingénieur Génie Civil",
        address: "Mbour, Sénégal",
        phones: "77 348 69 30",
        email: "assanediouf0063@gmail.com"
      },
      rccm: "SN.MBR.2024.A.2346",
      ninea: "011505346"
    };

    const generatedPdfPath = await generateFullProjectPdf(pdfPayload);

    if (!generatedPdfPath) {
      throw new Error("Erreur génération PDF");
    }

    const fileName = path.basename(generatedPdfPath);
    const downloadUrl = `/storage/generated/${fileName}`;

    console.log("📄 PDF généré :", fileName);

    // --- 5. ENREGISTRER COMMANDE ---
    const newOrder = await Order.create({
      user: userId,
      plan: plan._id,
      amount: plan.price,
      orderReference: orderRef,
      downloadUrl,
      status: "Completed"
    });

    console.log("📦 Commande enregistrée :", orderRef);

    // --- 6. EMAIL ---
    const absolutePdfPath = path.resolve(
      __dirname,
      "..",
      "storage",
      "generated",
      fileName
    );

    const welcomeHtml = isNewUser
      ? `
        <p><b>Bienvenue chez BAOLMAX</b></p>
        <p>Email : ${clientEmail}</p>
        <p>Mot de passe : <b style="color:red">${tempPassword}</b></p>
      `
      : `<p>Ravi de vous revoir sur BAOLMAX 👷‍♂️</p>`;

    try {
      await sendEmail({
        to: clientEmail,
        subject: `Dossier Technique - ${plan.name} (${orderRef})`,
        html: `
          <div style="font-family:Arial;padding:20px">
            <h2 style="color:#00853f">BAOLMAX PlanMaison</h2>
            <p>Bonjour <b>${client.nom}</b>,</p>
            ${welcomeHtml}
            <p>Votre dossier est en pièce jointe.</p>
            <p><b>Référence :</b> ${orderRef}</p>
          </div>
        `,
        attachments: [
          {
            filename: `BAOLMAX_${orderRef}.pdf`,
            path: absolutePdfPath
          }
        ]
      });

      console.log("📧 Email envoyé :", clientEmail);
    } catch (err) {
      console.error("⚠️ Email échoué :", err.message);
    }

    // --- 7. RÉPONSE ---
    res.status(201).json({
      success: true,
      message: "Commande finalisée avec succès",
      downloadUrl
    });

  } catch (error) {
    console.error("❌ ERREUR FINAL ORDER :", error);

    res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
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
    const { userId, planId, amount, status } = req.body;

    if (!userId || !planId || !amount) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const orderRef = `PM-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const newOrder = await Order.create({
      user: userId,
      plan: planId,
      amount,
      status: status || "Completed",
      orderReference: orderRef
    });

    res.status(201).json(newOrder);

  } catch (err) {
    console.error("Erreur createOrder:", err);
    res.status(500).json({ error: "Erreur serveur" });
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

module.exports = {
  processFinalOrder,
  getUserOrders,
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder
};