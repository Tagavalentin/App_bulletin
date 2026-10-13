import { Request, Response } from 'express';
import db from '../database';
import { Eleve } from '../models/types';

export const createEleve = (req: Request, res: Response) => {
  try {
    const eleve: Eleve = req.body;
    const stmt = db.prepare(`
      INSERT INTO eleve (matricule, nom, prenoms, sexe, date_naissance, statut, classe_id, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      eleve.matricule || null,
      eleve.nom,
      eleve.prenoms || null,
      eleve.sexe || null,
      eleve.date_naissance || null,
      eleve.statut || 'ANCIEN',
      eleve.classe_id || null,
      eleve.photo || null
    );
    res.status(201).json({ id: result.lastInsertRowid, ...eleve });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'élève' });
  }
};

export const getEleves = (req: Request, res: Response) => {
  try {
    const { classe_id } = req.query;
    let eleves;
    if (classe_id) {
      eleves = db.prepare('SELECT * FROM eleve WHERE classe_id = ? ORDER BY nom, prenoms').all(classe_id) as Eleve[];
    } else {
      eleves = db.prepare('SELECT * FROM eleve ORDER BY nom, prenoms').all() as Eleve[];
    }
    res.json(eleves);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des élèves' });
  }
};

export const getEleve = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eleve = db.prepare('SELECT * FROM eleve WHERE id = ?').get(id) as Eleve;
    if (!eleve) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    res.json(eleve);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'élève' });
  }
};

export const updateEleve = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eleve: Eleve = req.body;
    const stmt = db.prepare(`
      UPDATE eleve
      SET matricule = ?, nom = ?, prenoms = ?, sexe = ?, date_naissance = ?, statut = ?, classe_id = ?, photo = ?
      WHERE id = ?
    `);
    stmt.run(
      eleve.matricule || null,
      eleve.nom,
      eleve.prenoms || null,
      eleve.sexe || null,
      eleve.date_naissance || null,
      eleve.statut || 'ANCIEN',
      eleve.classe_id || null,
      eleve.photo || null,
      id
    );
    res.json({ ...eleve, id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élève' });
  }
};

export const deleteEleve = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM eleve WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Élève supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'élève' });
  }
};
