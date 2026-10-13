import { Request, Response } from 'express';
import db from '../database';
import { Etablissement } from '../models/types';

export const createEtablissement = (req: Request, res: Response) => {
  try {
    const etablissement: Etablissement = req.body;
    const stmt = db.prepare(`
      INSERT INTO etablissement (nom, sigle, adresse, telephones, numero_agrement, logo, cache, nom_proviseur, signature, ministere, direction_regionale, ville)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      etablissement.nom,
      etablissement.sigle || null,
      etablissement.adresse || null,
      etablissement.telephones || null,
      etablissement.numero_agrement || null,
      etablissement.logo || null,
      etablissement.cache || null,
      etablissement.nom_proviseur || null,
      etablissement.signature || null,
      etablissement.ministere || 'MINISTERE DE L\'EDUCATION NATIONALE',
      etablissement.direction_regionale || 'DIRECTION REGIONALE DE L\'EDUCATION GRAND-LOME',
      etablissement.ville || 'Lomé'
    );
    res.status(201).json({ id: result.lastInsertRowid, ...etablissement });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'établissement' });
  }
};

export const getEtablissement = (req: Request, res: Response) => {
  try {
    const etablissement = db.prepare('SELECT * FROM etablissement WHERE id = 1').get() as Etablissement;
    if (!etablissement) {
      return res.status(404).json({ error: 'Établissement non trouvé' });
    }
    res.json(etablissement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'établissement' });
  }
};

export const updateEtablissement = (req: Request, res: Response) => {
  try {
    const etablissement: Etablissement = req.body;
    const stmt = db.prepare(`
      UPDATE etablissement
      SET nom = ?, sigle = ?, adresse = ?, telephones = ?, numero_agrement = ?, logo = ?, cache = ?, nom_proviseur = ?, signature = ?, ministere = ?, direction_regionale = ?, ville = ?
      WHERE id = 1
    `);
    stmt.run(
      etablissement.nom,
      etablissement.sigle || null,
      etablissement.adresse || null,
      etablissement.telephones || null,
      etablissement.numero_agrement || null,
      etablissement.logo || null,
      etablissement.cache || null,
      etablissement.nom_proviseur || null,
      etablissement.signature || null,
      etablissement.ministere || 'MINISTERE DE L\'EDUCATION NATIONALE',
      etablissement.direction_regionale || 'DIRECTION REGIONALE DE L\'EDUCATION GRAND-LOME',
      etablissement.ville || 'Lomé'
    );
    res.json({ ...etablissement, id: 1 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'établissement' });
  }
};
