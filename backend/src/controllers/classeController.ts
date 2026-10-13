import { Request, Response } from 'express';
import db from '../database';
import { Classe } from '../models/types';

export const createClasse = (req: Request, res: Response) => {
  try {
    const classe: Classe = req.body;
    const stmt = db.prepare(`
      INSERT INTO classe (nom, serie, effectif, titulaire, annee_scolaire_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      classe.nom,
      classe.serie || null,
      classe.effectif || 0,
      classe.titulaire || null,
      classe.annee_scolaire_id || null
    );
    res.status(201).json({ id: result.lastInsertRowid, ...classe });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la classe' });
  }
};

export const getClasses = (req: Request, res: Response) => {
  try {
    const classes = db.prepare('SELECT * FROM classe').all() as Classe[];
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des classes' });
  }
};

export const getClasse = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classe = db.prepare('SELECT * FROM classe WHERE id = ?').get(id) as Classe;
    if (!classe) {
      return res.status(404).json({ error: 'Classe non trouvée' });
    }
    res.json(classe);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la classe' });
  }
};

export const updateClasse = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classe: Classe = req.body;
    const stmt = db.prepare(`
      UPDATE classe
      SET nom = ?, serie = ?, effectif = ?, titulaire = ?, annee_scolaire_id = ?
      WHERE id = ?
    `);
    stmt.run(
      classe.nom,
      classe.serie || null,
      classe.effectif || 0,
      classe.titulaire || null,
      classe.annee_scolaire_id || null,
      id
    );
    res.json({ ...classe, id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la classe' });
  }
};

export const deleteClasse = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM classe WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Classe supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la classe' });
  }
};
