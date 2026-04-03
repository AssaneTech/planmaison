const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

/* ================================
   TON PLAN (TES DONNÉES)
================================ */
const PLAN = {
  _id: "69c7cd0f7501948b49a88415",
  name: "Villa Moderne F4",
  surface: "150 m²",
  dimensions: "10m x 15m",
  rooms: 4,
  type: "Rue",

  images: [
    "http://localhost:5000/storage/plan3/image_0.png"
  ],

  pdfs: [
    "http://localhost:5000/storage/plan3/pdfs/1_rdc.pdf",
    "http://localhost:5000/storage/plan3/pdfs/2_etage1.pdf",
    "http://localhost:5000/storage/plan3/pdfs/3_etage2.pdf",
    "http://localhost:5000/storage/plan3/pdfs/4_etage3.pdf",
    "http://localhost:5000/storage/plan3/pdfs/5_situation.pdf",
    "http://localhost:5000/storage/plan3/pdfs/6_masse.pdf"
  ]
};

/* ================================
   TELECHARGER FICHIER
================================ */
async function fetchFile(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  return response.data;
}

/* ================================
   GENERATION PDF
================================ */
async function generatePdf(plan) {

  console.log("🚀 Début génération PDF...\n");

  const finalPdf = await PDFDocument.create();

  const fontBold = await finalPdf.embedFont(StandardFonts.HelveticaBold);
  const font = await finalPdf.embedFont(StandardFonts.Helvetica);

  /* ========= PAGE DE GARDE ========= */
  const page = finalPdf.addPage([595, 842]);

  page.drawText('REPUBLIQUE DU SENEGAL', {
    x: 120,
    y: 780,
    size: 16,
    font: fontBold,
  });

  page.drawText('DOSSIER D’EXECUTION', {
    x: 150,
    y: 740,
    size: 18,
    font: fontBold,
  });

  page.drawText(`Projet : ${plan.name}`, { x: 50, y: 700, size: 12, font });
  page.drawText(`Surface : ${plan.surface}`, { x: 50, y: 680, size: 12, font });
  page.drawText(`Dimensions : ${plan.dimensions}`, { x: 50, y: 660, size: 12, font });
  page.drawText(`Pièces : ${plan.rooms}`, { x: 50, y: 640, size: 12, font });
  page.drawText(`Type : ${plan.type}`, { x: 50, y: 620, size: 12, font });

  /* ========= IMAGE ========= */
  try {
    console.log("📥 Téléchargement image...");

    const imageBytes = await fetchFile(plan.images[0]);

    let image;
    if (plan.images[0].endsWith('.png')) {
      image = await finalPdf.embedPng(imageBytes);
    } else {
      image = await finalPdf.embedJpg(imageBytes);
    }

    page.drawImage(image, {
      x: 100,
      y: 350,
      width: 400,
      height: 200,
    });

  } catch (err) {
    console.log("❌ Image non chargée :", err.message);
  }

  page.drawText(`Date : ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: 100,
    size: 10,
    font,
  });

  /* ========= TRI DES PDFS ========= */
  const sortedPdfs = plan.pdfs.sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true });
  });

  /* ========= AJOUT DES PDFS ========= */
  for (const pdfUrl of sortedPdfs) {
    try {
      console.log("📥 Téléchargement :", pdfUrl);

      const pdfBytes = await fetchFile(pdfUrl);
      const pdf = await PDFDocument.load(pdfBytes);

      const pages = await finalPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => finalPdf.addPage(p));

    } catch (err) {
      console.log("❌ Erreur PDF :", pdfUrl);
    }
  }

  /* ========= NUMEROTATION ========= */
  const pages = finalPdf.getPages();
  const total = pages.length;

  pages.forEach((p, index) => {
    p.drawText(`Page ${index + 1} / ${total}`, {
      x: 250,
      y: 20,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  });

  /* ========= SAVE ========= */
  const outputDir = path.join(__dirname, 'generated');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputPath = path.join(outputDir, `DOSSIER_${plan._id}.pdf`);

  const pdfBytes = await finalPdf.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log("\n✅ PDF généré avec succès !");
  console.log("📄 Fichier :", outputPath);

  /* ========= OUVERTURE AUTOMATIQUE (WINDOWS) ========= */
  exec(`start "" "${outputPath}"`);
}

/* ================================
   EXECUTION
================================ */
generatePdf(PLAN);