const Order = require('../models/model.order');
const Plan = require('../models/model.plan');
const User = require('../models/model.user');
const bcrypt = require('bcryptjs'); // Pour hasher le mot de passe généré
const crypto = require('crypto');   // Pour générer un mot de passe aléatoire

// 1. Route pour vérifier l'existence d'un email (Appelée par le Frontend)
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la vérification de l'email" });
  }
};

// 2. Création de la commande (Gère aussi la création de compte)
exports.createOrder = async (req, res) => {
  try {
    const { planId, paymentMethod, client } = req.body; 
    // client contient { nom, email, telephone } envoyé par le frontend

    // 1. Vérifier si le plan existe
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ msg: "Plan non trouvé" });

    // 2. Gérer l'utilisateur (Récupérer ou Créer)
    let user = await User.findOne({ email: client.email });
    let isNewUser = false;
    let generatedPassword = null;

    if (!user) {
      isNewUser = true;
      // Générer un mot de passe aléatoire de 8 caractères
      generatedPassword = crypto.randomBytes(4).toString('hex').toUpperCase(); 
      
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      // Créer le nouvel utilisateur
      user = new User({
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        password: hashedPassword,
        role: 'client'
      });
      await user.save();
    }

    // 3. Créer la commande initiale (en attente)
    const newOrder = new Order({
      user: user._id,
      plan: planId,
      amount: plan.price,
      paymentMethod,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();

    // 4. Réponse au frontend
    // On renvoie l'ID de la commande et si c'est un nouveau client
    // (Le mot de passe ne sera envoyé QUE par mail après paiement réussi)
    res.status(201).json({
      success: true,
      orderId: savedOrder._id,
      isNewUser,
      tempPass: isNewUser ? generatedPassword : null // À utiliser pour le mail final
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors du processus de commande" });
  }
};

// 3. Valider la commande et débloquer le plan
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, transactionId, tempPass } = req.body;

    const order = await Order.findById(orderId).populate('plan').populate('user');
    if (!order) return res.status(404).json({ msg: "Commande introuvable" });

    // Mise à jour de la commande
    order.status = 'completed';
    order.transactionId = transactionId;
    await order.save();

    // Ajouter le plan à la liste des achats de l'utilisateur
    await User.findByIdAndUpdate(order.user._id, {
      $addToSet: { purchasedPlans: order.plan._id }
    });

    // --- ICI : APPEL À VOTRE SERVICE D'EMAIL ---
    // Envoi du mail avec : 
    // - Le fichier PDF du plan
    // - Si tempPass existe : "Voici vos accès : Email + tempPass"
    // - Sinon : "Merci pour votre fidélité, votre plan est dispo dans votre espace"
    // sendPurchaseEmail(order.user.email, order.plan, tempPass);

    res.json({ 
      success: true, 
      msg: "Paiement validé !", 
      order 
    });

  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la validation du paiement" });
  }
};