import db from './index';

export function seedDatabase() {
  console.log('Début du seeding de la base de données...');

  // Créer l'établissement
  const etablissement = db.prepare(`
    INSERT OR REPLACE INTO etablissement (id, nom, sigle, adresse, telephones, numero_agrement, nom_proviseur, ministere, direction_regionale, ville)
    VALUES (1, 'Collège Exemple Togo', 'CET', '123 Rue de l''Indépendance, Lomé', '+228 22 00 00 00 / +228 90 00 00 00', 'N° 1234/MEN/SG', 'M. Kouassi Jean', 'MINISTERE DE L''EDUCATION NATIONALE', 'DIRECTION REGIONALE DE L''EDUCATION GRAND-LOME', 'Lomé')
  `);
  etablissement.run();

  // Créer l'année scolaire
  const anneeScolaire = db.prepare(`
    INSERT OR REPLACE INTO annee_scolaire (id, libelle, date_debut, date_fin, active)
    VALUES (1, '2025-2026', '2025-09-01', '2026-07-31', 1)
  `);
  anneeScolaire.run();

  // Créer une classe de 3ème
  const classe = db.prepare(`
    INSERT INTO classe (nom, serie, effectif, titulaire, annee_scolaire_id)
    VALUES ('3ème', 'Littéraire', 38, 'Mme Adjoua Marie', 1)
  `);
  const classeResult = classe.run();
  const classeId = classeResult.lastInsertRowid as number;

  // Créer les matières littéraires
  const matieresLitteraires = [
    { nom: 'Français', groupe: 'LITTERAIRE', coefficient: 3 },
    { nom: 'Anglais', groupe: 'LITTERAIRE', coefficient: 2 },
    { nom: 'Histoire-Géographie', groupe: 'LITTERAIRE', coefficient: 2 },
    { nom: 'ECM', groupe: 'LITTERAIRE', coefficient: 1 }
  ];

  const matieresScientifiques = [
    { nom: 'Mathématiques', groupe: 'SCIENTIFIQUE', coefficient: 3 },
    { nom: 'Sciences Physiques & Technologie', groupe: 'SCIENTIFIQUE', coefficient: 2 },
    { nom: 'SVT', groupe: 'SCIENTIFIQUE', coefficient: 2 }
  ];

  const matieresEPS = [
    { nom: 'EPS', groupe: 'EPS', coefficient: 1 }
  ];

  const insertMatiere = db.prepare(`
    INSERT INTO matiere (nom, groupe, coefficient, classe_id)
    VALUES (?, ?, ?, ?)
  `);

  [...matieresLitteraires, ...matieresScientifiques, ...matieresEPS].forEach(matiere => {
    insertMatiere.run(matiere.nom, matiere.groupe, matiere.coefficient, classeId);
  });

  // Créer des élèves fictifs
  const eleves = [
    { nom: 'KOFFI', prenoms: 'Aya Élodie', sexe: 'F', statut: 'ANCIEN' },
    { nom: 'KOUASSI', prenoms: 'Jean-Pierre', sexe: 'M', statut: 'NOUVEAU' },
    { nom: 'ADJOUA', prenoms: 'Marie-Claire', sexe: 'F', statut: 'ANCIEN' },
    { nom: 'YAO', prenoms: 'Koffi Augustin', sexe: 'M', statut: 'ANCIEN' },
    { nom: 'MENSAH', prenoms: 'Abla Christelle', sexe: 'F', statut: 'NOUVEAU' }
  ];

  const insertEleve = db.prepare(`
    INSERT INTO eleve (nom, prenoms, sexe, statut, classe_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  eleves.forEach(eleve => {
    insertEleve.run(eleve.nom, eleve.prenoms, eleve.sexe, eleve.statut, classeId);
  });

  // Mettre à jour l'effectif de la classe
  const updateEffectif = db.prepare(`
    UPDATE classe SET effectif = ? WHERE id = ?
  `);
  updateEffectif.run(eleves.length, classeId);

  console.log('Seeding terminé avec succès !');
  console.log(`- 1 établissement créé`);
  console.log(`- 1 année scolaire créée`);
  console.log(`- 1 classe créée (${eleves.length} élèves)`);
  console.log(`- ${matieresLitteraires.length + matieresScientifiques.length + matieresEPS.length} matières créées`);
}
