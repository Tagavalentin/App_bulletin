import { describe, it, expect } from 'vitest';
import { nombreEnLettres, moyenneEnLettres } from './nombreEnLettres';

describe('Conversion nombre en lettres', () => {
  describe('Nombres de 0 à 19', () => {
    it('convertit 0 en "zéro"', () => {
      expect(nombreEnLettres(0)).toBe('zéro');
    });

    it('convertit 1 en "un"', () => {
      expect(nombreEnLettres(1)).toBe('un');
    });

    it('convertit 5 en "cinq"', () => {
      expect(nombreEnLettres(5)).toBe('cinq');
    });

    it('convertit 10 en "dix"', () => {
      expect(nombreEnLettres(10)).toBe('dix');
    });

    it('convertit 11 en "onze"', () => {
      expect(nombreEnLettres(11)).toBe('onze');
    });

    it('convertit 15 en "quinze"', () => {
      expect(nombreEnLettres(15)).toBe('quinze');
    });

    it('convertit 19 en "dix-neuf"', () => {
      expect(nombreEnLettres(19)).toBe('dix-neuf');
    });
  });

  describe('Dizaines (20-99)', () => {
    it('convertit 20 en "vingt"', () => {
      expect(nombreEnLettres(20)).toBe('vingt');
    });

    it('convertit 21 en "vingt-et-un"', () => {
      expect(nombreEnLettres(21)).toBe('vingt-et-un');
    });

    it('convertit 25 en "vingt-cinq"', () => {
      expect(nombreEnLettres(25)).toBe('vingt-cinq');
    });

    it('convertit 30 en "trente"', () => {
      expect(nombreEnLettres(30)).toBe('trente');
    });

    it('convertit 40 en "quarante"', () => {
      expect(nombreEnLettres(40)).toBe('quarante');
    });

    it('convertit 50 en "cinquante"', () => {
      expect(nombreEnLettres(50)).toBe('cinquante');
    });

    it('convertit 60 en "soixante"', () => {
      expect(nombreEnLettres(60)).toBe('soixante');
    });

    it('convertit 70 en "soixante-dix"', () => {
      expect(nombreEnLettres(70)).toBe('soixante-dix');
    });

    it('convertit 71 en "soixante-et-onze"', () => {
      expect(nombreEnLettres(71)).toBe('soixante-et-onze');
    });

    it('convertit 75 en "soixante-quinze"', () => {
      expect(nombreEnLettres(75)).toBe('soixante-quinze');
    });

    it('convertit 80 en "quatre-vingts"', () => {
      expect(nombreEnLettres(80)).toBe('quatre-vingts');
    });

    it('convertit 81 en "quatre-vingt-un"', () => {
      expect(nombreEnLettres(81)).toBe('quatre-vingt-un');
    });

    it('convertit 90 en "quatre-vingt-dix"', () => {
      expect(nombreEnLettres(90)).toBe('quatre-vingt-dix');
    });

    it('convertit 91 en "quatre-vingt-onze"', () => {
      expect(nombreEnLettres(91)).toBe('quatre-vingt-onze');
    });

    it('convertit 99 en "quatre-vingt-dix-neuf"', () => {
      expect(nombreEnLettres(99)).toBe('quatre-vingt-dix-neuf');
    });
  });

  describe('Centaines (100-999)', () => {
    it('convertit 100 en "cent"', () => {
      expect(nombreEnLettres(100)).toBe('cent');
    });

    it('convertit 101 en "cent-un"', () => {
      expect(nombreEnLettres(101)).toBe('cent-un');
    });

    it('convertit 110 en "cent-dix"', () => {
      expect(nombreEnLettres(110)).toBe('cent-dix');
    });

    it('convertit 200 en "deux-cents"', () => {
      expect(nombreEnLettres(200)).toBe('deux-cents');
    });

    it('convertit 201 en "deux-cent-un"', () => {
      expect(nombreEnLettres(201)).toBe('deux-cent-un');
    });

    it('convertit 250 en "deux-cent-cinquante"', () => {
      expect(nombreEnLettres(250)).toBe('deux-cent-cinquante');
    });

    it('convertit 300 en "trois-cents"', () => {
      expect(nombreEnLettres(300)).toBe('trois-cents');
    });

    it('convertit 500 en "cinq-cents"', () => {
      expect(nombreEnLettres(500)).toBe('cinq-cents');
    });

    it('convertit 999 en "neuf-cent-quatre-vingt-dix-neuf"', () => {
      expect(nombreEnLettres(999)).toBe('neuf-cent-quatre-vingt-dix-neuf');
    });
  });

  describe('Nombres décimaux', () => {
    it('convertit 15.11 en "quinze virgule onze"', () => {
      expect(nombreEnLettres(15.11)).toBe('quinze virgule onze');
    });

    it('convertit 15.00 en "quinze"', () => {
      expect(nombreEnLettres(15.00)).toBe('quinze');
    });

    it('convertit 15.50 en "quinze virgule cinquante"', () => {
      expect(nombreEnLettres(15.50)).toBe('quinze virgule cinquante');
    });

    it('convertit 15.05 en "quinze virgule cinq"', () => {
      expect(nombreEnLettres(15.05)).toBe('quinze virgule cinq');
    });

    it('convertit 15.01 en "quinze virgule un"', () => {
      expect(nombreEnLettres(15.01)).toBe('quinze virgule un');
    });

    it('convertit 15.99 en "quinze virgule quatre-vingt-dix-neuf"', () => {
      expect(nombreEnLettres(15.99)).toBe('quinze virgule quatre-vingt-dix-neuf');
    });

    it('convertit 11.25 en "onze virgule vingt-cinq"', () => {
      expect(nombreEnLettres(11.25)).toBe('onze virgule vingt-cinq');
    });

    it('convertit 10.00 en "dix"', () => {
      expect(nombreEnLettres(10.00)).toBe('dix');
    });

    it('convertit 0.50 en "zéro virgule cinquante"', () => {
      expect(nombreEnLettres(0.50)).toBe('zéro virgule cinquante');
    });

    it('convertit 0.00 en "zéro"', () => {
      expect(nombreEnLettres(0.00)).toBe('zéro');
    });
  });

  describe('Cas particuliers', () => {
    it('gère les nombres invalides', () => {
      expect(nombreEnLettres(NaN)).toBe('nombre invalide');
      expect(nombreEnLettres(Infinity)).toBe('nombre invalide');
    });

    it('convertit les nombres très précis', () => {
      expect(nombreEnLettres(15.123456)).toBe('quinze virgule douze');
    });

    it('convertit 20.00 en "vingt"', () => {
      expect(nombreEnLettres(20.00)).toBe('vingt');
    });
  });

  describe('Moyennes spécifiques pour bulletins', () => {
    it('convertit la moyenne 15.11 du bulletin exemple', () => {
      expect(moyenneEnLettres(15.11)).toBe('quinze virgule onze');
    });

    it('convertit une moyenne de 12.50', () => {
      expect(moyenneEnLettres(12.50)).toBe('douze virgule cinquante');
    });

    it('convertit une moyenne de 18.75', () => {
      expect(moyenneEnLettres(18.75)).toBe('dix-huit virgule soixante-quinze');
    });

    it('convertit une moyenne de 8.33', () => {
      expect(moyenneEnLettres(8.33)).toBe('huit virgule trente-trois');
    });
  });
});
