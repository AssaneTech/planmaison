//utils.generatePDF.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const generatePDF = (data, outputPath) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));
  // Add content to the PDF document
  doc.text(data);
  doc.end();
};

module.exports = generatePDF;