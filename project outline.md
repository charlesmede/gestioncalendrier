# Structure du Projet - Application de Gestion Universitaire

## Architecture des Fichiers

### Pages Principales
1. **index.html** - Page d'accueil et tableau de bord principal
   - Interface de gestion principale
   - Accès rapide aux fonctionnalités
   - Vue d'ensemble des cours programmés

2. **schedule.html** - Page de visualisation des emplois du temps
   - Calendrier hebdomadaire interactif
   - Filtres par niveau, parcours, enseignant
   - Mode vue liste et vue grille

3. **courses.html** - Gestion des cours et programmes
   - CRUD complet des cours
   - Association aux parcours et niveaux
   - Gestion des enseignants

4. **email.html** - Système d'envoi d'emails
   - Composition et templates
   - Gestion des listes de diffusion
   - Historique des envois

### Composants JavaScript
1. **main.js** - Logique principale de l'application
   - Gestion de l'état global
   - Navigation entre pages
   - Initialisation des composants

2. **calendar.js** - Module calendrier
   - Affichage hebdomadaire/mensuel
   - Drag & drop des cours
   - Gestion des conflits

3. **email.js** - Module d'envoi d'emails
   - Composition des messages
   - Gestion des templates
   - Envoi automatisé

4. **pdf.js** - Module d'export PDF
   - Génération des documents
   - Templates de mise en page
   - Téléchargement automatique

### Ressources et Assets
1. **resources/** - Dossier des images et médias
   - Logo de l'université
   - Icons et pictogrammes
   - Images de fond et textures

2. **styles/** - Fichiers de style (si séparés)
   - Variables CSS
   - Composants réutilisables
   - Thèmes et animations

### Données et Configuration
1. **data/** - Fichiers de données JSON
   - Cours prédéfinis
   - Niveaux et parcours
   - Templates d'emails

2. **config.js** - Configuration de l'application
   - Paramètres de l'université
   - Configuration email
   - Paramètres PDF

## Structure des Données

### Modèle de Données
```javascript
// Niveau
{
  id: "niveau_1",
  nom: "Licence 1",
  code: "L1",
  couleur: "#3b82f6",
  parcours: ["parcours_1", "parcours_2"]
}

// Parcours
{
  id: "parcours_1",
  niveau_id: "niveau_1",
  nom: "Informatique",
  code: "INFO",
  description: "Parcours informatique",
  cours: ["cours_1", "cours_2"]
}

// Cours
{
  id: "cours_1",
  nom: "Programmation Web",
  code: "WEB101",
  description: "Introduction au développement web",
  enseignant: "Dr. Martin",
  duree: 120,
  recurrence: "hebdomadaire",
  parcours_id: "parcours_1"
}

// Session
{
  id: "session_1",
  cours_id: "cours_1",
  date: "2025-11-14",
  heure_debut: "08:00",
  heure_fin: "10:00",
  salle: "A101",
  etudiants: ["etudiant_1", "etudiant_2"]
}
```

## Fonctionnalités par Page

### Index (Tableau de Bord)
- [ ] Vue d'ensemble des cours de la semaine
- [ ] Statistiques rapides (nombre d'étudiants, taux d'occupation)
- [ ] Alertes et notifications
- [ ] Raccourcis vers les actions principales

### Schedule (Calendrier)
- [ ] Vue hebdomadaire/mensuelle
- [ ] Drag & drop pour programmer les cours
- [ ] Filtres avancés (niveau, parcours, enseignant, salle)
- [ ] Gestion des conflits horaires
- [ ] Impression et export PDF

### Courses (Gestion des Cours)
- [ ] CRUD complet des cours
- [ ] Association aux parcours et niveaux
- [ ] Gestion des enseignants et salles
- [ ] Import/export de données
- [ ] Duplication de cours

### Email (Communication)
- [ ] Composition de messages
- [ ] Templates prédéfinis
- [ ] Gestion des listes de diffusion
- [ ] Planification des envois
- [ ] Suivi des statuts d'envoi

## Intégrations Externes

### Services Email
- Configuration SMTP avec charles@career-academyinstitute.com
- Gestion des quotas et limites d'envoi
- Templates HTML responsive

### Génération PDF
- Bibliothèque jsPDF pour la génération
- Mise en page professionnelle
- Personnalisation des templates

### Stockage Local
- LocalStorage pour les données temporaires
- IndexedDB pour les données volumineuses
- Synchronisation avec serveur (si disponible)

## Sécurité et Performance

### Sécurité
- Validation des entrées utilisateur
- Échappement des caractères spéciaux
- Protection contre les injections
- Gestion sécurisée des emails

### Performance
- Lazy loading des composants
- Cache des données fréquentes
- Optimisation des images
- Minification du code en production