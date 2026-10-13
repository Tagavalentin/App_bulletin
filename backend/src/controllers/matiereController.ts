import { Request, Response } from 'express';
import db from '../database';
import { Matiere } from '../models/types';

export const createMatiere = (req: Request, res: Response) => {
  try {
    const matiere: Matiere = req.body;
    const stmt = db.prepare(`
      INSERT INTO matiere (nom, groupe, coefficient, classe_id)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      matiere.nom,
      matiere.groupe,
      matiere.coefficient,
      matiere.classe_id || null
    );
    res.status(201).json({ id: result.lastInsertRowid, ...matiere });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la matière' });
  }
};

export const getMatieres = (req: Request, res: Response) => {
  try {
    const { classe_id } = req.query;
    let matieres;
    if (classe_id) {
      matieres = db.prepare('SELECT * FROM matiere WHERE classe_id = ?').all(classe_id) as Matiere[];
    } else {
      matieres = db.prepare('SELECT * FROM matiere').all() as Matiere[];
    }
    res.json(matieres);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des matières' });
  }
};

export const getMatiere = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const matiere = db.prepare('SELECT * FROM matiere WHERE id = ?').get(id) as Matiere;
    if (!matiere) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }
    res.json(matiere);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la matière' });
  }
};

export const updateMatiere = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const matiere: Matiere = req.body;
    const stmt = db.prepare(`
      UPDATE matiere
      SET nom = ?, groupe = ?, coefficient = ?, classe_id = ?
      WHERE id = ?
    `);
    stmt.run(
      matiere.nom,
      matiere.groupe,
      matiere.coefficient,
      matiere.classe_id || null,
      id
    );
    res.json({ ...matiere, id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la matière' });
  }
};

export const deleteMatiere = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM matiere WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Matière supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la matière' });
  }
};
