import { describe, it, expect } from 'vitest';
import {
  calculerMoyenneTrim,
  calculerNoteDefinitive,
  calculerRang,
  calculerAppreciation,
  calculerMoyenneGroupe,
  calculerMoyenneTrimestreGenerale,
  calculerResultatGeneral,
  arrondir,
  calculerResultatMatiere
} from './calculs';

describe('Moteur de calcul - Moyennes', () => {
  it('calcule la moyenne trimestrielle correctement (11,50 + 11,00) / 2 = 11,25', () => {
    const resultat = calculerMoyenneTrim(11.50, 11.00);
    expect(resultat).toBe(11.25);
  });

  it('calcule la moyenne trimestrielle correctement (16,25 + 15,00) / 2 = 15,63', () => {
    const resultat = calculerMoyenneTrim(16.25, 15.00);
    expect(resultat).toBe(15.63);
  });

  it('calcule la moyenne trimestrielle correctement (13,00 + 11,00) / 2 = 12,00', () => {
    const resultat = calculerMoyenneTrim(13.00, 11.00);
    expect(resultat).toBe(12.00);
  });

  it('arrondit à 2 décimales', () => {
    const resultat = calculerMoyenneTrim(11.123, 11.456);
    expect(resultat).toBe(11.29);
  });
});

describe('Moteur de calcul - Notes définitives', () => {
  it('calcule la note définitive (11,25 × 3 = 33,75)', () => {
    const resultat = calculerNoteDefinitive(11.25, 3);
    expect(resultat).toBe(33.75);
  });

  it('calcule la note définitive (19,25 × 2 = 38,50)', () => {
    const resultat = calculerNoteDefinitive(19.25, 2);
    expect(resultat).toBe(38.50);
  });

  it('calcule la note définitive avec coefficient 1', () => {
    const resultat = calculerNoteDefinitive(15.00, 1);
    expect(resultat).toBe(15.00);
  });
});

describe('Moteur de calcul - Rangs', () => {
  it('calcule le rang 1er pour la meilleure note', () => {
    const valeurs = [15.5, 12.3, 14.2, 15.5];
    const resultat = calculerRang(15.5, valeurs);
    expect(resultat.rang).toBe(1);
    expect(resultat.exAequo).toBe(true);
  });

  it('calcule le rang 2ème', () => {
    const valeurs = [15.5, 12.3, 14.2, 15.5];
    const resultat = calculerRang(14.2, valeurs);
    expect(resultat.rang).toBe(3); // rang 3 car il y a 2 ex æquo au rang 1
    expect(resultat.exAequo).toBe(false);
  });

  it('calcule le rang dernier', () => {
    const valeurs = [15.5, 12.3, 14.2, 15.5];
    const resultat = calculerRang(12.3, valeurs);
    expect(resultat.rang).toBe(4); // rang 4 car il y a 2 ex æquo au rang 1
    expect(resultat.exAequo).toBe(false);
  });

  it('gère les ex æquo correctement', () => {
    const valeurs = [15.5, 15.5, 15.5, 12.3];
    const resultat = calculerRang(15.5, valeurs);
    expect(resultat.rang).toBe(1);
    expect(resultat.exAequo).toBe(true);
  });

  it('retourne rang 0 si la valeur n\'est pas dans la liste', () => {
    const valeurs = [15.5, 12.3, 14.2];
    const resultat = calculerRang(10.0, valeurs);
    expect(resultat.rang).toBe(0);
    expect(resultat.exAequo).toBe(false);
  });
});

describe('Moteur de calcul - Appréciations', () => {
  it('retourne Médiocre pour < 5', () => {
    expect(calculerAppreciation(4.5)).toBe('Médiocre');
    expect(calculerAppreciation(0)).toBe('Médiocre');
  });

  it('retourne Insuffisant pour 5 à < 8', () => {
    expect(calculerAppreciation(5)).toBe('Insuffisant');
    expect(calculerAppreciation(7.99)).toBe('Insuffisant');
  });

  it('retourne Faible pour 8 à < 10', () => {
    expect(calculerAppreciation(8)).toBe('Faible');
    expect(calculerAppreciation(9.99)).toBe('Faible');
  });

  it('retourne Passable pour 10 à < 12', () => {
    expect(calculerAppreciation(10)).toBe('Passable');
    expect(calculerAppreciation(11.99)).toBe('Passable');
  });

  it('retourne Assez bien pour 12 à < 14', () => {
    expect(calculerAppreciation(12)).toBe('Assez bien');
    expect(calculerAppreciation(13.99)).toBe('Assez bien');
  });

  it('retourne Bien pour 14 à < 16', () => {
    expect(calculerAppreciation(14)).toBe('Bien');
    expect(calculerAppreciation(15.99)).toBe('Bien');
  });

  it('retourne Très bien pour 16 à < 18', () => {
    expect(calculerAppreciation(16)).toBe('Très bien');
    expect(calculerAppreciation(17.99)).toBe('Très bien');
  });

  it('retourne Excellent pour >= 18', () => {
    expect(calculerAppreciation(18)).toBe('Excellent');
    expect(calculerAppreciation(20)).toBe('Excellent');
  });

  it('accepte des seuils personnalisés', () => {
    const seuils = {
      mediocre: 6,
      insuffisant: 9,
      faible: 11,
      passable: 13,
      assezBien: 15,
      bien: 17,
      tresBien: 19
    };
    expect(calculerAppreciation(10, seuils)).toBe('Faible');
    expect(calculerAppreciation(14, seuils)).toBe('Assez bien');
  });
});

describe('Moteur de calcul - Moyennes de groupe', () => {
  it('calcule la moyenne d\'un groupe', () => {
    const notes = [33.75, 30.50, 28.00];
    const coeffs = [3, 2, 2];
    const resultat = calculerMoyenneGroupe(notes, coeffs);
    
    expect(resultat.totalCoefficients).toBe(7);
    expect(resultat.totalNotes).toBe(92.25);
    expect(resultat.moyenneGroupe).toBeCloseTo(13.18, 2);
  });

  it('gère le cas où tous les coefficients sont 0', () => {
    const notes = [10, 15, 12];
    const coeffs = [0, 0, 0];
    const resultat = calculerMoyenneGroupe(notes, coeffs);
    
    expect(resultat.totalCoefficients).toBe(0);
    expect(resultat.totalNotes).toBe(0); // Arrondi à 0 car coefficient total est 0
    expect(resultat.moyenneGroupe).toBe(0);
  });
});

describe('Moteur de calcul - Moyenne trimestrielle générale', () => {
  it('calcule la moyenne générale (272,11 / 18 = 15,11)', () => {
    // Simulation des données de l'exemple
    const notes = Array(18).fill(15.117); // 272.11 / 18 ≈ 15.117
    const coeffs = Array(18).fill(1);
    
    const resultat = calculerMoyenneTrimestreGenerale(notes, coeffs);
    expect(resultat).toBeCloseTo(15.12, 2);
  });

  it('calcule la moyenne générale avec différents coefficients', () => {
    const notes = [33.75, 31.25, 30.00, 28.50, 27.00, 25.50];
    const coeffs = [3, 2, 2, 3, 2, 2];
    
    const totalNotes = notes.reduce((a, b) => a + b, 0);
    const totalCoeffs = coeffs.reduce((a, b) => a + b, 0);
    const expected = totalNotes / totalCoeffs;
    
    const resultat = calculerMoyenneTrimestreGenerale(notes, coeffs);
    expect(resultat).toBeCloseTo(expected, 2);
  });

  it('gère le cas où tous les coefficients sont 0', () => {
    const notes = [10, 15, 12];
    const coeffs = [0, 0, 0];
    
    const resultat = calculerMoyenneTrimestreGenerale(notes, coeffs);
    expect(resultat).toBe(0);
  });
});

describe('Moteur de calcul - Résultat général', () => {
  it('calcule le résultat général complet', () => {
    const moyenneTrimestre = 15.11;
    const toutesMoyennes = [15.11, 14.50, 16.20, 13.80, 15.11];
    
    const resultat = calculerResultatGeneral(moyenneTrimestre, toutesMoyennes);
    
    expect(resultat.moyenneTrimestre).toBe(15.11);
    expect(resultat.rangGeneral).toBe(2);
    expect(resultat.rangGeneralExAequo).toBe(true);
    expect(resultat.appreciation).toBe('Bien');
    expect(resultat.faibleMoyenne).toBe(13.80);
    expect(resultat.forteMoyenne).toBe(16.20);
  });

  it('calcule l\'appréciation Passable pour moyenne 11', () => {
    const resultat = calculerResultatGeneral(11, [10, 11, 12]);
    expect(resultat.appreciation).toBe('Passable');
  });

  it('calcule l\'appréciation Excellent pour moyenne 19', () => {
    const resultat = calculerResultatGeneral(19, [15, 19, 17]);
    expect(resultat.appreciation).toBe('Excellent');
  });
});

describe('Moteur de calcul - Arrondi', () => {
  it('arrondit à 2 décimales', () => {
    expect(arrondir(15.123456)).toBe(15.12);
    expect(arrondir(15.127)).toBe(15.13);
    expect(arrondir(15.125)).toBe(15.13);
  });

  it('arrondit les nombres entiers', () => {
    expect(arrondir(15)).toBe(15);
    expect(arrondir(15.00)).toBe(15);
  });
});

describe('Moteur de calcul - Résultat matière complet', () => {
  it('calcule tous les résultats pour une matière', () => {
    const moyenneClasse = 11.50;
    const noteComposition = 11.00;
    const coefficient = 3;
    const toutesMoyennesTrim = [11.25, 12.50, 10.75, 11.25];
    
    const resultat = calculerResultatMatiere(
      moyenneClasse,
      noteComposition,
      coefficient,
      toutesMoyennesTrim
    );
    
    expect(resultat.moyenneTrim).toBe(11.25);
    expect(resultat.noteDefinitive).toBe(33.75);
    expect(resultat.rang).toBe(2);
    expect(resultat.rangExAequo).toBe(true);
    expect(resultat.appreciation).toBe('Passable');
  });

  it('calcule le résultat pour une matière excellente', () => {
    const resultat = calculerResultatMatiere(18.50, 19.00, 2, [18.75, 15.00, 12.50]);
    
    expect(resultat.moyenneTrim).toBe(18.75);
    expect(resultat.noteDefinitive).toBe(37.50);
    expect(resultat.rang).toBe(1);
    expect(resultat.rangExAequo).toBe(false);
    expect(resultat.appreciation).toBe('Excellent');
  });
});
