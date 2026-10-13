/**
 * Types TypeScript pour les modèles de données
 */

export interface Etablissement {
  id?: number;
  nom: string;
  sigle?: string;
  adresse?: string;
  telephones?: string;
  numero_agrement?: string;
  logo?: string;
  cache?: string;
  nom_proviseur?: string;
  signature?: string;
  ministere?: string;
  direction_regionale?: string;
  ville?: string;
}

export interface AnneeScolaire {
  id?: number;
  libelle: string;
  date_debut?: string;
  date_fin?: string;
  active?: number;
}

export interface Classe {
  id?: number;
  nom: string;
  serie?: string;
  effectif?: number;
  titulaire?: string;
  annee_scolaire_id?: number;
}

export interface Matiere {
  id?: number;
  nom: string;
  groupe: 'LITTERAIRE' | 'SCIENTIFIQUE' | 'EPS' | 'AUTRE';
  coefficient: number;
  classe_id?: number;
}

export interface Eleve {
  id?: number;
  matricule?: string;
  nom: string;
  prenoms?: string;
  sexe?: 'M' | 'F';
  date_naissance?: string;
  statut?: 'NOUVEAU' | 'ANCIEN';
  classe_id?: number;
  photo?: string;
}

export interface Note {
  id?: number;
  eleve_id: number;
  matiere_id: number;
  trimestre: 1 | 2 | 3;
  moyenne_classe?: number;
  note_composition?: number;
  appreciation?: string;
}

export interface Bulletin {
  id?: number;
  eleve_id: number;
  trimestre: 1 | 2 | 3;
  moyenne_trimestre?: number;
  rang_general?: number;
  appreciation?: string;
  decision_conseil?: string;
  observations_chef?: string;
  absences?: number;
  retards?: number;
  tableau_honneur?: number;
  felicitations?: number;
  encouragements?: number;
  avertissement?: number;
  blame?: number;
  date_edition?: string;
}
