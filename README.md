# Application de Bulletins Scolaires (Togo)

Application web de génération de bulletins scolaires trimestriels pour les établissements privés togolais (collège et lycée).

## Règles Git

### Branches permanentes
- `main` : branche stable, toujours déployable
- `develop` : branche d'intégration

**Ne jamais commiter directement sur `main` ni sur `develop`.**

### Branches de fonctionnalités
Chaque fonctionnalité a sa propre branche, créée depuis `develop` :
- `feature/<phase>-<nom-court>` (ex. `feature/p3-moteur-calcul`)
- `fix/<nom>` pour les corrections
- `docs/<nom>` pour la documentation

Une branche = une fonctionnalité = une Pull Request vers `develop`.

### Format des commits
Conventional Commits, en français :
- `feat(calcul): ajoute la moyenne par groupe`
- `fix(pdf): corrige le débordement de page`
- `test(rang): couvre les ex æquo`
- `docs: met à jour le README`

### Pull Requests
Chaque PR contient :
- Description de la fonctionnalité
- Tests ajoutés
- Captures d'écran si l'interface change
- Liste de vérification (tests verts, lint OK, pas de secret)

Une PR n'est fusionnée dans `develop` que si les tests passent.
Fusion en "squash merge", puis suppression de la branche.

### Versions
À la fin de chaque phase :
- Fusion de `develop` vers `main`
- Tag de version (`v0.1.0`, `v1.0.0`, etc.)

### Protection des branches
- `main` et `develop` : PR obligatoire, tests obligatoires
- Une seule branche ouverte à la fois
- Résumé après chaque fusion avant d'ouvrir la branche suivante

### Sécurité
Ne jamais commiter de secrets, de vraies données d'élèves ni de fichiers `.env`.
Fournir un `.env.example`.

## Stack technique (MVP)

- Frontend : React + TypeScript + Vite + Tailwind CSS
- Backend : Node.js + Express + TypeScript
- Base de données : SQLite (pour le MVP)
- Génération PDF : Puppeteer
- Interface 100 % en français

## Règles de calcul

Les règles de calcul ont été déduites du bulletin modèle fourni.
**Elles doivent être validées par l'administration ou l'inspection avant la mise en production.**

### Pour chaque matière
- **MOY. Trim** = (Moy Classe + Note de Composition) / 2
  - Exemple : 11,50 + 11,00 = 22,50 / 2 = 11,25
  - Vérification : 16,25 + 15,00 = 15,62 ; 13,00 + 11,00 = 12,00
- **Note Définitive** = MOY. Trim × Coefficient
  - Exemple : 11,25 × 3 = 33,75 ; 19,25 × 2 = 38,50
- **Rang par matière** : classement de l'élève sur la MOY. Trim dans sa classe

### Appréciation par matière (paramétrable)
- < 5 : Médiocre
- 5 à < 8 : Insuffisant
- 8 à < 10 : Faible
- 10 à < 12 : Passable
- 12 à < 14 : Assez bien
- 14 à < 16 : Bien
- 16 à < 18 : Très bien
- ≥ 18 : Excellent

### Pour chaque groupe de matières
- **Moyenne du groupe** = Somme des notes définitives / Somme des coefficients

### Pour l'élève
- **Moyenne du trimestre** = Total des notes définitives / Total des coefficients
  - Exemple : 272,11 / 18 = 15,11
- **Rang général** : classement par moyenne du trimestre (gestion des ex æquo)
- **Faible Moy / Forte Moy** : min et max des moyennes générales de la classe

### Arrondis
- Tous les calculs arrondis à 2 décimales
- Notes sur 20

### Conversion en lettres (français)
- Génération automatique de la moyenne en toutes lettres
- Exemple : 15,11 → "quinze virgule onze"

## Installation

```bash
# Cloner le dépôt
git clone <url>
cd App_bulletin

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Lancer le développement
npm run dev
```

## Phases de développement

### Phase 3 : Prototype MVP (v0.1.0)
Branches dans l'ordre :
1. feature/p3-init-projet
2. feature/p3-moteur-calcul
3. feature/p3-moyenne-en-lettres
4. feature/p3-gestion-classes-eleves
5. feature/p3-saisie-notes
6. feature/p3-gabarit-bulletin
7. feature/p3-export-pdf
8. feature/p3-parametres-etablissement

### Phase 1 : Application complète (v1.0.0)
Branches dans l'ordre :
1. feature/p1-schema-prisma-postgres
2. feature/p1-auth-roles
3. feature/p1-annees-trimestres
4. feature/p1-import-eleves-excel
5. feature/p1-import-notes-excel
6. feature/p1-vie-scolaire
7. feature/p1-conseil-classe
8. feature/p1-apercu-bulletin
9. feature/p1-export-zip-duplicata
10. feature/p1-qr-verification
11. feature/p1-tableau-de-bord
12. feature/p1-verrouillage-trimestre
13. feature/p1-journal-audit
14. feature/p1-docker-deploiement
15. docs/p1-readme-guide-secretariat

### Phase 2 : Extension annuelle (v1.1.0)
Branches dans l'ordre :
1. feature/p2-bulletins-t2-t3
2. feature/p2-evolution-trimestres
3. feature/p2-moyenne-annuelle
4. feature/p2-decision-passage
5. feature/p2-examen-bepc
6. feature/p2-releve-notes-annuel
7. feature/p2-proces-verbal-conseil
8. feature/p2-tableaux-honneur
9. feature/p2-listes-admis-redoublants

### Phase 4 : Espace enseignant mobile (v1.2.0)
Branches dans l'ordre :
1. feature/p4-pwa-base
2. feature/p4-connexion-pin
3. feature/p4-accueil-avancement
4. feature/p4-saisie-mobile
5. feature/p4-mode-hors-ligne
6. feature/p4-conflits-sync
7. feature/p4-import-colle
8. feature/p4-consultation-stats
9. feature/p4-appel-absences
10. feature/p4-date-limite-derogation
11. feature/p4-notifications-rappel

### Phase 5 : Espace parents (v2.0.0)
Branches dans l'ordre :
1. feature/p5-role-parent-activation
2. feature/p5-connexion-otp
3. feature/p5-securite-permissions
4. feature/p5-tableau-bord-parent
5. feature/p5-consultation-bulletins
6. feature/p5-publication-bulletins
7. feature/p5-notes-vie-scolaire-parent
8. feature/p5-annonces-ecole
9. feature/p5-notifications-sms-whatsapp
10. feature/p5-frais-mobile-money
11. feature/p5-journal-consultations
12. docs/p5-confidentialite-consentement

## Tests

```bash
# Tests unitaires
npm test

# Tests de bout en bout
npm run test:e2e

# Lint
npm run lint
```

## Données de test

Utiliser uniquement des données fictives pour le développement et les tests.
Ne jamais commiter de vraies données d'élèves.

## License

À définir avec l'établissement.
