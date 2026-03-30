const User = require("../models/model.user");
const bcrypt = require("bcrypt");

/**
 * GET ALL USERS
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de la récupération" });
  }
};

/**
 * REGISTER
 */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email et mot de passe requis" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(400).json({ msg: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...req.body,
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      msg: "Utilisateur créé avec succès",
      user: newUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de l'inscription" });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({ msg: "Identifiants incorrects" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Identifiants incorrects" });
    }

    res.status(200).json({
      token: "BAOLMAX_TOKEN_SUCCESS",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur login" });
  }
};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    let updateData = { ...req.body };

    if (email) {
      updateData.email = email.toLowerCase().trim();
    }

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Utilisateur introuvable" });
    }

    res.status(200).json(updatedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur modification utilisateur" });
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "Utilisateur introuvable" });
    }

    res.status(200).json({ msg: "Utilisateur supprimé" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur suppression utilisateur" });
  }
};

/**
 * CHECK EMAIL (IMPORTANT POUR TON FRONT)
 */
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    res.status(200).json({
      exists: !!user
    });

  } catch (err) {
    console.error("❌ Erreur checkEmail :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};