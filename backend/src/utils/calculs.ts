/**
 * Moteur de calcul pour les bulletins scolaires
 * Implémente les règles de calcul du système éducatif togolais
 */

export interface Note {
  moyenneClasse: number;
  noteComposition: number;
  coefficient: number;
}

export interface ResultatMatiere {
  moyenneTrim: number;
  noteDefinitive: number;
  rang: number;
  rangExAequo: boolean;
  appreciation: string;
}

export interface ResultatGroupe {
  totalCoefficients: number;
  totalNotes: number;
  moyenneGroupe: number;
}

export interface ResultatGeneral {
  moyenneTrimestre: number;
  rangGeneral: number;
  rangGeneralExAequo: boolean;
  appreciation: string;
  faibleMoyenne: number;
  forteMoyenne: number;
}

/**
 * Calculer la moyenne trimestrielle d'une matière
 * Formule : (Moy Classe + Note Composition) / 2
 */
export function calculerMoyenneTrim(moyenneClasse: number, noteComposition: number): number {
  const resultat = (moyenneClasse + noteComposition) / 2;
  return arrondir(resultat);
}

/**
 * Calculer la note définitive d'une matière
 * Formule : MOY. Trim × Coefficient
 */
export function calculerNoteDefinitive(moyenneTrim: number, coefficient: number): number {
  const resultat = moyenneTrim * coefficient;
  return arrondir(resultat);
}

/**
 * Calculer le rang dans une liste de valeurs
 * Gère les ex æquo
 */
export function calculerRang(valeur: number, valeurs: number[]): { rang: number; exAequo: boolean } {
  // Trier les valeurs par ordre décroissant
  const sorted = [...valeurs].sort((a, b) => b - a);
  
  // Trouver l'index de la valeur
  const index = sorted.indexOf(valeur);
  
  if (index === -1) {
    return { rang: 0, exAequo: false };
  }
  
  // Vérifier s'il y a des ex æquo
  const countSame = sorted.filter(v => v === valeur).length;
  const exAequo = countSame > 1;
  
  // Le rang est l'index + 1
  return { rang: index + 1, exAequo };
}

/**
 * Calculer l'appréciation selon la moyenne
 * Barème par défaut (paramétrable)
 */
export function calculerAppreciation(moyenne: number, seuils?: {
  mediocre: number;
  insuffisant: number;
  faible: number;
  passable: number;
  assezBien: number;
  bien: number;
  tresBien: number;
}): string {
  const s = seuils || {
    mediocre: 5,
    insuffisant: 8,
    faible: 10,
    passable: 12,
    assezBien: 14,
    bien: 16,
    tresBien: 18
  };

  if (moyenne < s.mediocre) return 'Médiocre';
  if (moyenne < s.insuffisant) return 'Insuffisant';
  if (moyenne < s.faible) return 'Faible';
  if (moyenne < s.passable) return 'Passable';
  if (moyenne < s.assezBien) return 'Assez bien';
  if (moyenne < s.bien) return 'Bien';
  if (moyenne < s.tresBien) return 'Très bien';
  return 'Excellent';
}

/**
 * Calculer la moyenne d'un groupe de matières
 * Formule : Somme des notes définitives / Somme des coefficients
 */
export function calculerMoyenneGroupe(notesDefinitives: number[], coefficients: number[]): ResultatGroupe {
  const totalCoefficients = coefficients.reduce((sum, coef) => sum + coef, 0);
  const totalNotes = notesDefinitives.reduce((sum, note) => sum + note, 0);
  
  if (totalCoefficients === 0) {
    return {
      totalCoefficients: 0,
      totalNotes: 0,
      moyenneGroupe: 0
    };
  }
  
  const moyenneGroupe = totalNotes / totalCoefficients;
  
  return {
    totalCoefficients: arrondir(totalCoefficients),
    totalNotes: arrondir(totalNotes),
    moyenneGroupe: arrondir(moyenneGroupe)
  };
}

/**
 * Calculer la moyenne trimestrielle générale
 * Formule : Total des notes définitives / Total des coefficients
 */
export function calculerMoyenneTrimestreGenerale(
  toutesNotesDefinitives: number[],
  tousCoefficients: number[]
): number {
  const totalCoefficients = tousCoefficients.reduce((sum, coef) => sum + coef, 0);
  const totalNotes = toutesNotesDefinitives.reduce((sum, note) => sum + note, 0);
  
  if (totalCoefficients === 0) {
    return 0;
  }
  
  return arrondir(totalNotes / totalCoefficients);
}

/**
 * Calculer le résultat général d'un élève
 */
export function calculerResultatGeneral(
  moyenneTrimestre: number,
  toutesMoyennes: number[]
): ResultatGeneral {
  // Rang général
  const { rang: rangGeneral, exAequo: rangGeneralExAequo } = calculerRang(moyenneTrimestre, toutesMoyennes);
  
  // Appréciation
  const appreciation = calculerAppreciation(moyenneTrimestre);
  
  // Faible et forte moyenne de la classe
  const faibleMoyenne = Math.min(...toutesMoyennes);
  const forteMoyenne = Math.max(...toutesMoyennes);
  
  return {
    moyenneTrimestre,
    rangGeneral,
    rangGeneralExAequo,
    appreciation,
    faibleMoyenne: arrondir(faibleMoyenne),
    forteMoyenne: arrondir(forteMoyenne)
  };
}

/**
 * Arrondir à 2 décimales
 */
export function arrondir(valeur: number): number {
  return Math.round(valeur * 100) / 100;
}

/**
 * Calculer tous les résultats pour une matière
 */
export function calculerResultatMatiere(
  moyenneClasse: number,
  noteComposition: number,
  coefficient: number,
  toutesMoyennesTrim: number[]
): ResultatMatiere {
  const moyenneTrim = calculerMoyenneTrim(moyenneClasse, noteComposition);
  const noteDefinitive = calculerNoteDefinitive(moyenneTrim, coefficient);
  const { rang, exAequo } = calculerRang(moyenneTrim, toutesMoyennesTrim);
  const appreciation = calculerAppreciation(moyenneTrim);
  
  return {
    moyenneTrim,
    noteDefinitive,
    rang,
    rangExAequo: exAequo,
    appreciation
  };
}
