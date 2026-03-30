const express = require("express");
const router = express.Router();
const customCtrl = require("../controllers/controller.CustomRequest");
// Importe Multer ici si tu gères l'upload de fichiers

router.post("/", customCtrl.submitRequest);
router.get("/", customCtrl.getAllCustomRequests);

module.exports = router;