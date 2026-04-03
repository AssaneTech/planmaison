const processFinalOrder = async (req, res) => {
  try {
    const { plan: planFromFront, client } = req.body;

    console.log("📥 BODY RECU :", req.body);

    // ================================
    // 🔒 VALIDATION
    // ================================
    if (!planFromFront || !planFromFront._id || !client || !client.email) {
      return res.status(400).json({ error: "Données invalides." });
    }

    // ================================
    // 📦 RECUP PLAN
    // ================================
    const plan = await Plan.findById(planFromFront._id).lean();

    if (!plan) {
      return res.status(404).json({ error: "Plan introuvable en base de données." });
    }

    console.log("✅ PLAN OK :", plan.name);

    const clientEmail = client.email.toLowerCase().trim();

    // ================================
    // 👤 USER (FIX CRITIQUE)
    // ================================
    let user = await User.findOne({ email: clientEmail });

    if (!user) {
      user = await User.create({
        firstName: client.nom || "Client",
        lastName: "",
        email: clientEmail,
        password: await bcrypt.hash("123456", 10),
        role: "client"
      });

      console.log("🆕 USER CRÉÉ :", clientEmail);
    } else {
      console.log("👤 USER EXISTANT :", clientEmail);
    }

    const userId = user._id;

    // ================================
    // 🔖 REF COMMANDE
    // ================================
    const orderRef = `PM-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // ================================
    // 📄 PAYLOAD PDF
    // ================================
    const BASE_URL = process.env.BASE_URL || "https://backend-planmaison.onrender.com";

    const pdfPayload = {
      _id: plan._id,
      name: plan.name || "Villa Moderne",
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

    console.log("⏳ Génération PDF...");

    // ================================
    // 🧠 GENERATION PDF (ANTI CRASH)
    // ================================
    let downloadUrl = "";

    try {
      const generatedPdfPath = await generateFullProjectPdf(pdfPayload);

      const fileName = path.basename(generatedPdfPath);

      downloadUrl = `/storage/generated/${fileName}`;

      console.log("✅ PDF OK :", downloadUrl);

    } catch (err) {
      console.error("❌ ERREUR PDF :", err.message);

      downloadUrl = "/storage/generated/default.pdf"; // fallback
    }

    // ================================
    // 💾 ENREGISTRER COMMANDE
    // ================================
    const newOrder = await Order.create({
      user: userId,
      plan: plan._id,
      amount: plan.price,
      orderReference: orderRef,
      downloadUrl,
      status: "Completed"
    });

    console.log("🧾 COMMANDE CRÉÉE :", orderRef);

    // ================================
    // 📚 MAJ USER
    // ================================
    await User.findByIdAndUpdate(userId, {
      $push: {
        purchasedPlans: {
          plan: plan._id,
          downloadUrl: downloadUrl
        }
      }
    });

    console.log("📚 PLAN AJOUTÉ AU USER");

    // ================================
    // 📧 EMAIL (OPTIONNEL SAFE)
    // ================================
    try {
      await sendEmail({
        to: clientEmail,
        subject: "Votre plan est prêt",
        text: `Votre plan est disponible ici : ${downloadUrl}`
      });

      console.log("📧 EMAIL ENVOYÉ");
    } catch (err) {
      console.error("❌ EMAIL ERROR :", err.message);
    }

    // ================================
    // ✅ REPONSE
    // ================================
    return res.status(201).json({
      success: true,
      message: "Commande finalisée avec succès",
      downloadUrl
    });

  } catch (error) {
    console.error("❌ ERREUR FINAL ORDER :", error);

    return res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
};