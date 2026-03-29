const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ msg: "Accès refusé, token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'baolmax_ultra_secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token non valide" });
  }
};