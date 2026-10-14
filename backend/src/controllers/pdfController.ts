import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { generateBulletin } from './bulletinController';
import db from '../database';

export const exportBulletinPDF = async (req: Request, res: Response) => {
  try {
    const { eleve_id, trimestre } = req.params;
    
    // Générer les données du bulletin
    const bulletinData = await new Promise((resolve) => {
      const mockReq = { params: { eleve_id, trimestre } } as any;
      const mockRes = {
        json: (data: any) => resolve(data),
        status: () => mockRes
      } as any;
      generateBulletin(mockReq, mockRes);
    });
    
    // Lancer Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Créer le HTML du bulletin
    const html = generateBulletinHTML(bulletinData);
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });
    
    await browser.close();
    
    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bulletin_T${trimestre}_${eleve_id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }
};

export const exportClassePDF = async (req: Request, res: Response) => {
  try {
    const { classe_id, trimestre } = req.params;
    
    // Récupérer tous les élèves de la classe
    const eleves = db.prepare('SELECT * FROM eleve WHERE classe_id = ?').all(classe_id);
    
    // Lancer Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Générer un PDF avec tous les bulletins
    let allHTML = '';
    
    for (const eleve of eleves) {
      const bulletinData = await new Promise((resolve) => {
        const mockReq = { params: { eleve_id: eleve.id, trimestre } } as any;
        const mockRes = {
          json: (data: any) => resolve(data),
          status: () => mockRes
        } as any;
        generateBulletin(mockReq, mockRes);
      });
      
      allHTML += generateBulletinHTML(bulletinData);
      allHTML += '<div style="page-break-after: always;"></div>';
    }
    
    await page.setContent(allHTML, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bulletins_classe_${classe_id}_T${trimestre}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF de classe:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }
};

function generateBulletinHTML(data: any): string {
  const trimestreLibelle = data.trimestre === 1 ? 'PREMIER' : data.trimestre === 2 ? 'DEUXIEME' : 'TROISIEME';
  
  const renderMatiereRow = (m: any) => `
    <tr>
      <td style="border: 1px solid black; padding: 5px;">${m.nom}</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${m.moyenne_classe || '-'}</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${m.note_composition || '-'}</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${m.moyenne_trim.toFixed(2)}</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${m.coefficient}</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${m.note_definitive.toFixed(2)}</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">-</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${m.appreciation}</td>
    </tr>
  `;
  
  const renderTable = (title: string, matieres: any[], groupe: any) => `
    <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 20px; font-size: 12px;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="border: 1px solid black; padding: 5px; text-align: left;">${title}</th>
          <th style="border: 1px solid black; padding: 5px;">Moy Classe</th>
          <th style="border: 1px solid black; padding: 5px;">COMP.</th>
          <th style="border: 1px solid black; padding: 5px;">MOY. Trim</th>
          <th style="border: 1px solid black; padding: 5px;">Coef</th>
          <th style="border: 1px solid black; padding: 5px;">Notes Définitives</th>
          <th style="border: 1px solid black; padding: 5px;">Rang</th>
          <th style="border: 1px solid black; padding: 5px;">Appréciations</th>
        </tr>
      </thead>
      <tbody>
        ${matieres.map(renderMatiereRow).join('')}
        <tr style="background-color: #e0e0e0; font-weight: bold;">
          <td style="border: 1px solid black; padding: 5px;">TOTAL</td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px; text-align: center;">${groupe.totalCoefficients}</td>
          <td style="border: 1px solid black; padding: 5px; text-align: center;">${groupe.totalNotes.toFixed(2)}</td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px;"></td>
        </tr>
        <tr style="background-color: #d0d0d0; font-weight: bold;">
          <td style="border: 1px solid black; padding: 5px;">MOYENNE</td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px; text-align: center;">${groupe.moyenneGroupe.toFixed(2)}</td>
          <td style="border: 1px solid black; padding: 5px;"></td>
          <td style="border: 1px solid black; padding: 5px;"></td>
        </tr>
      </tbody>
    </table>
  `;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; border: 2px solid black; padding: 20px; }
        .header { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 11px; }
        .header-left { }
        .header-center { text-align: center; }
        .header-right { text-align: right; }
        .title-box { border: 2px solid black; padding: 10px; text-align: center; margin-bottom: 20px; }
        .title-box h2 { margin: 0; font-size: 18px; }
        .footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 30px; font-size: 11px; }
        .footer-center { text-align: center; }
        .footer-right { text-align: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-left">
            <p><strong>N° d'agrément:</strong> ${data.etablissement?.numero_agrement || 'N/A'}</p>
            <p><strong>${data.etablissement?.ministere}</strong></p>
            <p><strong>${data.etablissement?.direction_regionale}</strong></p>
            <p><strong>${data.etablissement?.nom}</strong></p>
            <p>${data.etablissement?.adresse}</p>
            <p>${data.etablissement?.telephones}</p>
            <p>${data.etablissement?.ville}</p>
          </div>
          <div class="header-center">
            <div style="width: 80px; height: 80px; margin: 0 auto; border: 1px solid black; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0;">
              Logo
            </div>
          </div>
          <div class="header-right">
            <p><strong>REPUBLIQUE TOGOLAISE</strong></p>
            <p><strong>Travail-Liberté-Patrie</strong></p>
            <p>Année scolaire: 2025-2026</p>
            <p>Classe: ${data.classe?.nom}</p>
            <p>Effectif: ${data.classe?.effectif}</p>
            <p>Statut: ${data.eleve?.statut}</p>
            <p>Sexe: ${data.eleve?.sexe}</p>
          </div>
        </div>
        
        <div class="title-box">
          <h2>BULLETIN D'EVALUATION DU ${trimestreLibelle} TRIMESTRE</h2>
        </div>
        
        <p style="margin-bottom: 20px;"><strong>NOM ET PRENOMS:</strong> ${data.eleve?.nom} ${data.eleve?.prenoms}</p>
        
        ${renderTable('MATIERES LITTERAIRES', data.matieres_litteraires, data.groupe_litteraire)}
        ${renderTable('MATIERES SCIENTIFIQUES', data.matieres_scientifiques, data.groupe_scientifique)}
        ${renderTable('MATIERES E.P.S.', data.matieres_eps, data.groupe_eps)}
        
        <div style="border: 2px solid black; padding: 20px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p><strong>TOTAUX:</strong></p>
              <p>Coef: ${data.total_coefficients}</p>
              <p>Notes: ${data.total_notes.toFixed(2)}</p>
            </div>
            <div>
              <p><strong>MOYENNE DU TRIMESTRE:</strong></p>
              <p style="font-size: 32px; font-weight: bold;">${data.moyenne_trimestre.toFixed(2)}</p>
              <p style="font-size: 18px;">${data.moyenne_lettres}</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px;">
            <div>
              <p><strong>RANG:</strong></p>
              <p>${data.rang_general}${data.rang_general_ex_aequo ? ' (ex æquo)' : ''}</p>
            </div>
            <div>
              <p><strong>FAIBLE MOY:</strong></p>
              <p>${data.faible_moyenne.toFixed(2)}</p>
            </div>
            <div>
              <p><strong>FORTE MOY:</strong></p>
              <p>${data.forte_moyenne.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div style="border: 2px solid black; padding: 20px; margin-bottom: 20px;">
          <p><strong>OBSERVATIONS DU CHEF D'ETABLISSEMENT:</strong></p>
          <p style="font-size: 24px; font-weight: bold;">${data.appreciation}</p>
        </div>
        
        <div class="footer">
          <div>
            <p><strong>VIE SCOLAIRE:</strong></p>
            <p>Absences: _______</p>
            <p>Retards: _______</p>
            <p>Tableau d'honneur: [ ]</p>
            <p>Félicitations: [ ]</p>
            <p>Encouragements: [ ]</p>
            <p>Avertissement: [ ]</p>
            <p>Blâme: [ ]</p>
          </div>
          <div class="footer-center">
            <p><strong>DECISION DU CONSEIL DE CLASSE:</strong></p>
            <p>__________________________</p>
            <p style="margin-top: 20px;">Titulaire: ${data.classe?.titulaire}</p>
            <p>Signature: _______________</p>
          </div>
          <div class="footer-right">
            <p><strong>CACHET ET SIGNATURE</strong></p>
            <p style="margin-top: 20px;">${data.etablissement?.nom_proviseur}</p>
            <p>Proviseur Fondateur</p>
            <p style="margin-top: 20px;">Lomé, le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
