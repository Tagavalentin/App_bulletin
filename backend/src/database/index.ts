import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../dev.db');
const db = new Database(dbPath);

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

// Initialiser le schéma de la base de données
export function initDatabase() {
  // Table des établissements
  db.exec(`
    CREATE TABLE IF NOT EXISTS etablissement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      sigle TEXT,
      adresse TEXT,
      telephones TEXT,
      numero_agrement TEXT,
      logo TEXT,
      cache TEXT,
      nom_proviseur TEXT,
      signature TEXT,
      ministere TEXT DEFAULT 'MINISTERE DE L''EDUCATION NATIONALE',
      direction_regionale TEXT DEFAULT 'DIRECTION REGIONALE DE L''EDUCATION GRAND-LOME',
      ville TEXT DEFAULT 'Lomé'
    )
  `);

  // Table des années scolaires
  db.exec(`
    CREATE TABLE IF NOT EXISTS annee_scolaire (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      libelle TEXT NOT NULL UNIQUE,
      date_debut TEXT,
      date_fin TEXT,
      active INTEGER DEFAULT 0
    )
  `);

  // Table des classes
  db.exec(`
    CREATE TABLE IF NOT EXISTS classe (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      serie TEXT,
      effectif INTEGER DEFAULT 0,
      titulaire TEXT,
      annee_scolaire_id INTEGER,
      FOREIGN KEY (annee_scolaire_id) REFERENCES annee_scolaire(id)
    )
  `);

  // Table des matières
  db.exec(`
    CREATE TABLE IF NOT EXISTS matiere (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      groupe TEXT NOT NULL CHECK(groupe IN ('LITTERAIRE', 'SCIENTIFIQUE', 'EPS', 'AUTRE')),
      coefficient INTEGER DEFAULT 1,
      classe_id INTEGER,
      FOREIGN KEY (classe_id) REFERENCES classe(id)
    )
  `);

  // Table des élèves
  db.exec(`
    CREATE TABLE IF NOT EXISTS eleve (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricule TEXT UNIQUE,
      nom TEXT NOT NULL,
      prenoms TEXT,
      sexe TEXT CHECK(sexe IN ('M', 'F')),
      date_naissance TEXT,
      statut TEXT DEFAULT 'ANCIEN' CHECK(statut IN ('NOUVEAU', 'ANCIEN')),
      classe_id INTEGER,
      photo TEXT,
      FOREIGN KEY (classe_id) REFERENCES classe(id)
    )
  `);

  // Table des notes
  db.exec(`
    CREATE TABLE IF NOT EXISTS note (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eleve_id INTEGER NOT NULL,
      matiere_id INTEGER NOT NULL,
      trimestre INTEGER NOT NULL CHECK(trimestre IN (1, 2, 3)),
      moyenne_classe REAL CHECK(moyenne_classe >= 0 AND moyenne_classe <= 20),
      note_composition REAL CHECK(note_composition >= 0 AND note_composition <= 20),
      appreciation TEXT,
      FOREIGN KEY (eleve_id) REFERENCES eleve(id),
      FOREIGN KEY (matiere_id) REFERENCES matiere(id),
      UNIQUE(eleve_id, matiere_id, trimestre)
    )
  `);

  // Table des bulletins
  db.exec(`
    CREATE TABLE IF NOT EXISTS bulletin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eleve_id INTEGER NOT NULL,
      trimestre INTEGER NOT NULL CHECK(trimestre IN (1, 2, 3)),
      moyenne_trimestre REAL,
      rang_general INTEGER,
      appreciation TEXT,
      decision_conseil TEXT,
      observations_chef TEXT,
      absences INTEGER DEFAULT 0,
      retards INTEGER DEFAULT 0,
      tableau_honneur INTEGER DEFAULT 0,
      felicitations INTEGER DEFAULT 0,
      encouragements INTEGER DEFAULT 0,
      avertissement INTEGER DEFAULT 0,
      blame INTEGER DEFAULT 0,
      date_edition TEXT,
      FOREIGN KEY (eleve_id) REFERENCES eleve(id),
      UNIQUE(eleve_id, trimestre)
    )
  `);

  console.log('Base de données initialisée avec succès');
}

export default db;
