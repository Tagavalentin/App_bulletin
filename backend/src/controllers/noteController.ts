import { Request, Response } from 'express';
import db from '../database';
import { Note } from '../models/types';
import { calculerMoyenneTrim, calculerNoteDefinitive } from '../utils/calculs';

export const createNote = (req: Request, res: Response) => {
  try {
    const note: Note = req.body;
    
    // Validation des notes (0-20)
    if (note.moyenne_classe !== undefined && (note.moyenne_classe < 0 || note.moyenne_classe > 20)) {
      return res.status(400).json({ error: 'La moyenne de classe doit être entre 0 et 20' });
    }
    if (note.note_composition !== undefined && (note.note_composition < 0 || note.note_composition > 20)) {
      return res.status(400).json({ error: 'La note de composition doit être entre 0 et 20' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO note (eleve_id, matiere_id, trimestre, moyenne_classe, note_composition, appreciation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      note.eleve_id,
      note.matiere_id,
      note.trimestre,
      note.moyenne_classe || null,
      note.note_composition || null,
      note.appreciation || null
    );
    res.status(201).json({ id: result.lastInsertRowid, ...note });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la note' });
  }
};

export const getNotes = (req: Request, res: Response) => {
  try {
    const { eleve_id, matiere_id, trimestre, classe_id } = req.query;
    
    let query = 'SELECT n.*, e.nom as eleve_nom, e.prenoms as eleve_prenoms, m.nom as matiere_nom, m.coefficient FROM note n';
    query += ' JOIN eleve e ON n.eleve_id = e.id';
    query += ' JOIN matiere m ON n.matiere_id = m.id';
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (eleve_id) {
      conditions.push('n.eleve_id = ?');
      params.push(eleve_id);
    }
    if (matiere_id) {
      conditions.push('n.matiere_id = ?');
      params.push(matiere_id);
    }
    if (trimestre) {
      conditions.push('n.trimestre = ?');
      params.push(trimestre);
    }
    if (classe_id) {
      conditions.push('e.classe_id = ?');
      params.push(classe_id);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY e.nom, e.prenoms, m.nom';
    
    const notes = db.prepare(query).all(...params);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
};

export const getNote = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = db.prepare('SELECT * FROM note WHERE id = ?').get(id) as Note;
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la note' });
  }
};

export const updateNote = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note: Note = req.body;
    
    // Validation des notes (0-20)
    if (note.moyenne_classe !== undefined && (note.moyenne_classe < 0 || note.moyenne_classe > 20)) {
      return res.status(400).json({ error: 'La moyenne de classe doit être entre 0 et 20' });
    }
    if (note.note_composition !== undefined && (note.note_composition < 0 || note.note_composition > 20)) {
      return res.status(400).json({ error: 'La note de composition doit être entre 0 et 20' });
    }
    
    const stmt = db.prepare(`
      UPDATE note
      SET moyenne_classe = ?, note_composition = ?, appreciation = ?
      WHERE id = ?
    `);
    stmt.run(
      note.moyenne_classe || null,
      note.note_composition || null,
      note.appreciation || null,
      id
    );
    res.json({ ...note, id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la note' });
  }
};

export const deleteNote = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM note WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Note supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la note' });
  }
};

export const createNotesBulk = (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    
    if (!Array.isArray(notes)) {
      return res.status(400).json({ error: 'notes doit être un tableau' });
    }
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO note (eleve_id, matiere_id, trimestre, moyenne_classe, note_composition, appreciation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const errors: string[] = [];
    let successCount = 0;
    
    notes.forEach((note: Note, index: number) => {
      try {
        // Validation
        if (note.moyenne_classe !== undefined && (note.moyenne_classe < 0 || note.moyenne_classe > 20)) {
          errors.push(`Note ${index + 1}: moyenne de classe invalide`);
          return;
        }
        if (note.note_composition !== undefined && (note.note_composition < 0 || note.note_composition > 20)) {
          errors.push(`Note ${index + 1}: note de composition invalide`);
          return;
        }
        
        stmt.run(
          note.eleve_id,
          note.matiere_id,
          note.trimestre,
          note.moyenne_classe || null,
          note.note_composition || null,
          note.appreciation || null
        );
        successCount++;
      } catch (error) {
        errors.push(`Note ${index + 1}: erreur lors de l'insertion`);
      }
    });
    
    res.status(201).json({
      message: `${successCount} notes créées avec succès`,
      successCount,
      errorCount: errors.length,
      errors
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création des notes en masse' });
  }
};
