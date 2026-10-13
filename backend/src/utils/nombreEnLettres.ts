/**
 * Conversion de nombres en lettres en français
 * Utilisé pour afficher les moyennes des bulletins scolaires
 */

const UNITS = [
  '',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf'
];

const TEENS = [
  'dix',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze',
  'seize',
  'dix-sept',
  'dix-huit',
  'dix-neuf'
];

const TENS = [
  '',
  'dix',
  'vingt',
  'trente',
  'quarante',
  'cinquante',
  'soixante',
  'soixante',
  'quatre-vingt',
  'quatre-vingt'
];

/**
 * Convertir un nombre entre 0 et 99 en lettres
 */
function convert0To99(num: number): string {
  if (num === 0) return 'zéro';
  
  if (num < 10) {
    return UNITS[num];
  }
  
  if (num < 20) {
    return TEENS[num - 10];
  }
  
  const tens = Math.floor(num / 10);
  const units = num % 10;
  
  let result = TENS[tens];
  
  // Cas particuliers pour 70-79 et 90-99
  if (tens === 7 || tens === 9) {
    if (units === 0) {
      if (tens === 7) return 'soixante-dix';
      return 'quatre-vingt-dix';
    }
    if (units === 1) {
      if (tens === 7) return 'soixante-et-onze';
      return 'quatre-vingt-onze';
    }
    return result + '-' + TEENS[units];
  }
  
  // Cas pour 20, 30, 40, 50, 60, 80
  if (units === 0) {
    if (tens === 8) return 'quatre-vingts';
    return result;
  }
  
  // Cas pour 21, 31, 41, 51, 61
  if (units === 1 && tens !== 8) {
    return result + '-et-un';
  }
  
  return result + '-' + UNITS[units];
}

/**
 * Convertir un nombre entre 0 et 999 en lettres
 */
function convert0To999(num: number): string {
  if (num < 100) {
    return convert0To99(num);
  }
  
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  
  let result = '';
  
  if (hundreds === 1) {
    result = 'cent';
  } else {
    result = UNITS[hundreds] + '-cent';
  }
  
  if (remainder === 0) {
    if (hundreds > 1) {
      result += 's';
    }
    return result;
  }
  
  return result + '-' + convert0To99(remainder);
}

/**
 * Convertir un nombre décimal en lettres
 * Exemple : 15.11 -> "quinze virgule onze"
 */
export function nombreEnLettres(nombre: number): string {
  // Vérifier que le nombre est valide
  if (isNaN(nombre) || !isFinite(nombre)) {
    return 'nombre invalide';
  }
  
  // Séparer la partie entière et décimale
  const str = nombre.toFixed(2);
  const [entiereStr, decimaleStr] = str.split('.');
  
  const entiere = parseInt(entiereStr, 10);
  const decimale = parseInt(decimaleStr, 10);
  
  let result = convert0To999(entiere);
  
  // Ajouter la partie décimale si elle existe et n'est pas 00
  if (decimale > 0) {
    result += ' virgule ' + convert0To99(decimale);
  }
  
  return result;
}

/**
 * Convertir une moyenne en lettres (fonction spécifique pour les bulletins)
 */
export function moyenneEnLettres(moyenne: number): string {
  return nombreEnLettres(moyenne);
}
