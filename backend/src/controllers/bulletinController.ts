import { Request, Response } from 'express';
import db from '../database';
import { Bulletin } from '../models/types';
import {
  calculerMoyenneTrim,
  calculerNoteDefinitive,
  calculerRang,
  calculerAppreciation,
  calculerMoyenneGroupe,
  calculerMoyenneTrimestreGenerale,
  calculerResultatGeneral
} from '../utils/calculs';
import { moyenneEnLettres } from '../utils/nombreEnLettres';

export const generateBulletin = (req: Request, res: Response) => {
  try {
    const { eleve_id, trimestre } = req.params;
    
    // Récupérer l'élève
    const eleve = db.prepare('SELECT * FROM eleve WHERE id = ?').get(eleve_id);
    if (!eleve) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    
    // Récupérer la classe
    const classe = db.prepare('SELECT * FROM classe WHERE id = ?').get(eleve.classe_id);
    
    // Récupérer l'établissement
    const etablissement = db.prepare('SELECT * FROM etablissement WHERE id = 1').get();
    
    // Récupérer les matières de la classe
    const matieres = db.prepare('SELECT * FROM matiere WHERE classe_id = ?').all(eleve.classe_id);
    
    // Récupérer les notes de l'élève pour ce trimestre
    const notes = db.prepare(`
      SELECT * FROM note WHERE eleve_id = ? AND trimestre = ?
    `).all(eleve_id, trimestre);
    
    // Créer un map des notes par matière
    const notesMap = new Map();
    notes.forEach((note: any) => {
      notesMap.set(note.matiere_id, note);
    });
    
    // Calculer les résultats pour chaque matière
    const resultatsMatieres = matieres.map((matiere: any) => {
      const note = notesMap.get(matiere.id);
      const moyenneClasse = note?.moyenne_classe || 0;
      const noteComposition = note?.note_composition || 0;
      
      const moyenneTrim = calculerMoyenneTrim(moyenneClasse, noteComposition);
      const noteDefinitive = calculerNoteDefinitive(moyenneTrim, matiere.coefficient);
      
      return {
        ...matiere,
        moyenne_classe: moyenneClasse,
        note_composition: noteComposition,
        moyenne_trim: moyenneTrim,
        note_definitive: noteDefinitive,
        appreciation: calculerAppreciation(moyenneTrim)
      };
    });
    
    // Grouper par groupe de matières
    const matieresLitteraires = resultatsMatieres.filter(m => m.groupe === 'LITTERAIRE');
    const matieresScientifiques = resultatsMatieres.filter(m => m.groupe === 'SCIENTIFIQUE');
    const matieresEPS = resultatsMatieres.filter(m => m.groupe === 'EPS');
    
    // Calculer les totaux et moyennes par groupe
    const calculerGroupe = (matieres: any[]) => {
      const notesDefinitives = matieres.map(m => m.note_definitive);
      const coefficients = matieres.map(m => m.coefficient);
      return calculerMoyenneGroupe(notesDefinitives, coefficients);
    };
    
    const groupeLitteraire = calculerGroupe(matieresLitteraires);
    const groupeScientifique = calculerGroupe(matieresScientifiques);
    const groupeEPS = calculerGroupe(matieresEPS);
    
    // Calculer la moyenne générale
    const toutesNotesDefinitives = resultatsMatieres.map(m => m.note_definitive);
    const tousCoefficients = resultatsMatieres.map(m => m.coefficient);
    const moyenneTrimestre = calculerMoyenneTrimestreGenerale(toutesNotesDefinitives, tousCoefficients);
    
    // Récupérer toutes les moyennes de la classe pour le rang
    const tousEleves = db.prepare('SELECT id FROM eleve WHERE classe_id = ?').all(eleve.classe_id);
    const toutesMoyennes: number[] = [];
    
    tousEleves.forEach((e: any) => {
      const notesEleve = db.prepare(`
        SELECT * FROM note WHERE eleve_id = ? AND trimestre = ?
      `).all(e.id, trimestre);
      
      if (notesEleve.length > 0) {
        const notesMapEleve = new Map();
        notesEleve.forEach((n: any) => notesMapEleve.set(n.matiere_id, n));
        
        const notesDef = matieres.map((m: any) => {
          const n = notesMapEleve.get(m.id);
          const mc = n?.moyenne_classe || 0;
          const nc = n?.note_composition || 0;
          const mt = calculerMoyenneTrim(mc, nc);
          return calculerNoteDefinitive(mt, m.coefficient);
        });
        
        const moy = calculerMoyenneTrimestreGenerale(notesDef, tousCoefficients);
        toutesMoyennes.push(moy);
      }
    });
    
    toutesMoyennes.push(moyenneTrimestre);
    
    // Calculer le résultat général
    const resultatGeneral = calculerResultatGeneral(moyenneTrimestre, toutesMoyennes);
    
    // Récupérer ou créer le bulletin
    let bulletin = db.prepare(`
      SELECT * FROM bulletin WHERE eleve_id = ? AND trimestre = ?
    `).get(eleve_id, trimestre) as Bulletin;
    
    if (!bulletin) {
      const stmt = db.prepare(`
        INSERT INTO bulletin (eleve_id, trimestre, moyenne_trimestre, rang_general, appreciation)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(eleve_id, trimestre, moyenneTrimestre, resultatGeneral.rangGeneral, resultatGeneral.appreciation);
      bulletin = { id: result.lastInsertRowid, eleve_id: parseInt(eleve_id as string), trimestre: parseInt(trimestre as string) as 1 | 2 | 3 };
    } else {
      const stmt = db.prepare(`
        UPDATE bulletin
        SET moyenne_trimestre = ?, rang_general = ?, appreciation = ?
        WHERE id = ?
      `);
      stmt.run(moyenneTrimestre, resultatGeneral.rangGeneral, resultatGeneral.appreciation, bulletin.id);
    }
    
    res.json({
      etablissement,
      classe,
      eleve,
      trimestre: parseInt(trimestre as string),
      matieres_litteraires: matieresLitteraires,
      matieres_scientifiques: matieresScientifiques,
      matieres_eps: matieresEPS,
      groupe_litteraire: groupeLitteraire,
      groupe_scientifique: groupeScientifique,
      groupe_eps: groupeEPS,
      total_coefficients: tousCoefficients.reduce((a, b) => a + b, 0),
      total_notes: toutesNotesDefinitives.reduce((a, b) => a + b, 0),
      moyenne_trimestre: moyenneTrimestre,
      moyenne_lettres: moyenneEnLettres(moyenneTrimestre),
      rang_general: resultatGeneral.rangGeneral,
      rang_general_ex_aequo: resultatGeneral.rangGeneralExAequo,
      appreciation: resultatGeneral.appreciation,
      faible_moyenne: resultatGeneral.faibleMoyenne,
      forte_moyenne: resultatGeneral.forteMoyenne,
      bulletin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la génération du bulletin' });
  }
};

export const getBulletins = (req: Request, res: Response) => {
  try {
    const { classe_id, trimestre } = req.query;
    
    let query = 'SELECT b.*, e.nom, e.prenoms FROM bulletin b JOIN eleve e ON b.eleve_id = e.id';
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (classe_id) {
      query += ' JOIN classe c ON e.classe_id = c.id';
      conditions.push('c.id = ?');
      params.push(classe_id);
    }
    if (trimestre) {
      conditions.push('b.trimestre = ?');
      params.push(trimestre);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY e.nom, e.prenoms';
    
    const bulletins = db.prepare(query).all(...params);
    res.json(bulletins);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des bulletins' });
  }
};
