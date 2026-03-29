const User = require('../models/model.user'); 
const bcrypt = require('bcrypt'); // Importation de bcrypt

// RÉCUPÉRER TOUS LES MEMBRES
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: "Erreur lors de la récupération" });
    }
};

// AJOUTER UN MEMBRE
exports.register = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ msg: "Erreur lors de l'ajout", error: err.message });
    }
};

// ÉDITER UN MEMBRE (PUT)
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, role, password } = req.body;
        let updateData = { firstName, lastName, email, phone, address, role };

        // SI UN NOUVEAU MOT DE PASSE EST FOURNI
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ msg: "Membre introuvable" });

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: "Erreur lors de la modification" });
    }
};

// SUPPRIMER UN MEMBRE (DELETE)
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ msg: "Membre introuvable" });
        res.status(200).json({ msg: "Fichier bien supprimé !" });
    } catch (err) {
        res.status(500).json({ msg: "Erreur lors de la suppression" });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Trouver l'utilisateur par son email
        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            return res.status(401).json({ msg: "Identifiants incorrects" });
        }

        // 2. COMPARAISON SÉCURISÉE (Crucial)
        // bcrypt.compare prend le mdp clair (front) et le mdp hashé (base)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: "Identifiants incorrects" });
        }

        // 3. Si tout est bon, on renvoie les infos
        res.status(200).json({
            token: "BAOLMAX_TOKEN_SUCCESS", // Tu pourras générer un vrai JWT ici plus tard
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Erreur Login:", err);
        res.status(500).json({ msg: "Erreur serveur lors de la connexion" });
    }
};