const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const puppeteer = require('puppeteer');
const { exec } = require('child_process');

/* ==========================================================================
   1. GÉNÉRATION DE LA GARDE (DESIGN PREMIUM AVEC DRAPEAU COMPLET)
   ========================================================================== */
async function generateCoverFromHtml(plan) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <style>
            @page { size: A4; margin: 0; }
            * { box-sizing: border-box; }
            body {
                width: 210mm; height: 297mm; margin: 0; padding: 0;
                font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                background-color: #ffffff; color: #1a1a1a;
            }
            
            /* Liseré latéral tricolore avec étoile */
            .side-accent {
                position: absolute; left: 0; top: 0; width: 6mm; height: 100%;
                display: flex; flex-direction: column;
            }
            .accent-v { background: #00853f; flex: 1; }
            .accent-o { 
                background: #fdef42; flex: 1; 
                display: flex; align-items: center; justify-content: center;
            }
            .accent-r { background: #e31b23; flex: 1; }
            
            .star {
                width: 14px; height: 14px;
                background: #00853f;
                clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            }

            .main-container {
                margin-left: 6mm; height: 100%; padding: 15mm 20mm;
                display: flex; flex-direction: column; justify-content: space-between;
            }

            header {
                display: flex; justify-content: space-between; align-items: flex-start;
                border-bottom: 0.5px solid #eee; padding-bottom: 8mm;
            }
            .rep-sn { text-transform: uppercase; letter-spacing: 2px; font-size: 10px; font-weight: 700; color: #666; }
            
            .project-hero { margin-top: 10mm; }
            .doc-type { font-size: 11px; text-transform: uppercase; letter-spacing: 5px; color: #00853f; font-weight: 700; margin-bottom: 4mm; display: block; }
            .project-name { font-size: 38px; font-weight: 800; line-height: 1.1; margin: 0; color: #111; }

            .visual-container { flex-grow: 1; display: flex; align-items: center; justify-content: center; }
            .visual-container img { max-width: 100%; max-height: 340px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-radius: 4px; }

            .meta-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; margin-bottom: 12mm; }
            .info-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #aaa; margin-bottom: 3px; }
            .info-value { font-size: 16px; font-weight: 600; }

            footer { border-top: 2px solid #1a1a1a; padding-top: 8mm; display: grid; grid-template-columns: 1fr 1.6fr; align-items: start; }
            .brand-box { display: flex; align-items: center; gap: 12px; }
            .logo-square { width: 45px; height: 45px; background: #1a1a1a; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 20px; }
            .contact-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 9.5px; color: #444; }
            .contact-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
            .icon { width: 14px; height: 14px; fill: #00853f; flex-shrink: 0; }
            .bold-dark { color: #1a1a1a; font-weight: 700; }
            .right-align { text-align: right; justify-content: flex-end; }
        </style>
    </head>
    <body>
        <div class="side-accent">
            <div class="accent-v"></div>
            <div class="accent-o"><div class="star"></div></div>
            <div class="accent-r"></div>
        </div>
        <div class="main-container">
            <header>
                <div>
                    <div class="rep-sn">République du Sénégal</div>
                    <div style="font-size: 9px; color: #999;">Un Peuple · Un But · Une Foi</div>
                </div>
                <div style="text-align: right;">
                    <div class="info-label">Référence Dossier</div>
                    <div class="bold-dark">${plan.ref}</div>
                </div>
            </header>

            <section class="project-hero">
                <span class="doc-type">Dossier d'exécution</span>
                <h1 class="project-name">Construction d'une<br>${plan.name}</h1>
            </section>

            <div class="visual-container">
                <img src="${plan.images[0]}" alt="Architectural Rendering">
            </div>

            <section class="meta-info">
                <div>
                    <div class="info-label">Maître d'ouvrage</div>
                    <div class="info-value">${plan.client}</div>
                </div>
                <div>
                    <div class="info-label">Conception & Ingénierie</div>
                    <div class="info-value">${plan.designer.name}</div>
                    <div style="font-size: 11px; color: #666;">${plan.designer.title}</div>
                </div>
            </section>

            <footer>
                <div class="brand-box">
                    <div class="logo-square">B</div>
                    <div>
                        <div style="font-size: 16px; font-weight: 900;">BAOLMAX</div>
                        <div style="font-size: 9px; color: #00853f; font-weight: 700; text-transform: uppercase;">Ingénierie & BTP</div>
                    </div>
                </div>
                <div class="contact-details">
                    <div>
                        <div class="contact-item">
                            <svg class="icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                            <span>${plan.designer.address}</span>
                        </div>
                        <div style="margin-left: 22px; color: #888;">
                            RCCM : <span class="bold-dark">${plan.rccm}</span><br>
                            NINEA : <span class="bold-dark">${plan.ninea}</span>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <div class="contact-item right-align">
                            <span>${plan.designer.phones}</span>
                            <svg class="icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        </div>
                        <div class="contact-item right-align">
                            <span class="bold-dark">${plan.designer.email}</span>
                            <svg class="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </body>
    </html>`;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
}

/* ==========================================================================
   2. LOGIQUE DE FUSION, FILIGRANE ET SAUVEGARDE
   ========================================================================== */
async function generateFullProjectPdf(plan) {
    try {
        console.log("⏳ Génération du dossier technique en cours...");
        const finalPdf = await PDFDocument.create();

        // A. Couverture
        const coverBuffer = await generateCoverFromHtml(plan);
        const coverDoc = await PDFDocument.load(coverBuffer);
        const [coverPage] = await finalPdf.copyPages(coverDoc, [0]);
        finalPdf.addPage(coverPage);

        // B. Fusion des plans
        for (const url of plan.pdfs) {
            try {
                const res = await axios.get(url, { responseType: 'arraybuffer' });
                const doc = await PDFDocument.load(res.data);
                const pages = await finalPdf.copyPages(doc, doc.getPageIndices());
                pages.forEach(p => finalPdf.addPage(p));
                console.log(`✅ Plan fusionné : ${path.basename(url)}`);
            } catch (err) {
                console.error(`❌ Erreur sur le plan distant : ${url}`);
            }
        }

        // C. Filigrane et Numérotation
        const font = await finalPdf.embedFont(StandardFonts.HelveticaBold);
        const total = finalPdf.getPageCount();

        finalPdf.getPages().forEach((p, i) => {
            if (i > 0) { // On ignore la garde
                const { width, height } = p.getSize();
                p.drawText(`PROJET : ${plan.client}`, {
                    x: width / 4, y: height / 3, size: 50, font,
                    color: rgb(0.8, 0.8, 0.8), opacity: 0.15, rotate: degrees(45),
                });
                p.drawText(`Page ${i + 1} / ${total}`, { x: width - 80, y: 25, size: 9, font });
            }
        });

        // D. Sauvegarde
        const storageDir = path.resolve(__dirname, '..', 'storage', 'generated');
        if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

        const fileName = `DOSSIER_BAOLMAX_${plan.ref.replace(/-/g, '_')}_${Date.now()}.pdf`;
        const outputPath = path.join(storageDir, fileName);

        fs.writeFileSync(outputPath, await finalPdf.save());

        console.log(`\n🚀 SUCCÈS : PDF généré !`);
        console.log(`📍 Emplacement : ${outputPath}`);

        return `/storage/generated/${fileName}`;
    } catch (e) {
        console.error("❌ ERREUR CRITIQUE :", e);
        throw e;
    }
}

/* ==========================================================================
   LANCEMENT DE TEST (Uniquement si exécuté directement)
   ========================================================================== */
if (require.main === module) {
    const PLAN_TEST = {
        _id: "69c7cd0f7501948b49a88415",
        name: "Villa R+ 1",
        client: "OMAR DIOUF",
        ref: "PM-2026-SN-001",
        rccm: "SN.MBR.2024.A.2346",
        ninea: "011505346",
        designer: {
            name: "M. Assane DIOUF",
            title: "Ingénieur Génie Civil",
            email: "assanediouf0063@gmail.com",
            phones: "77 348 69 30",
            address: "Mbour, Sénégal"
        },
        images: ["http://localhost:5000/storage/plan3/image_0.png"],
        pdfs: ["http://localhost:5000/storage/plan3/pdfs/1_rdc.pdf"]
    };

    generateFullProjectPdf(PLAN_TEST).then(res => {
        const fullPath = path.join(__dirname, '..', res);
        exec(`start "" "${fullPath}"`); // Ouvre le PDF sur Windows
    });
}

module.exports = { generateFullProjectPdf };