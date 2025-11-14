# Guide d'Interaction - Application de Gestion Universitaire

## Vue d'Ensemble des Interactions

### 1. Gestion des Niveaux et Parcours
**Création d'un Niveau**:
- Bouton "+" dans la section Niveaux
- Formulaire modale avec nom du niveau (L1, L2, L3, M1, M2, Doctorat)
- Validation en temps réel des doublons
- Sauvegarde automatique avec confirmation visuelle

**Création d'un Parcours**:
- Sélection du niveau parent depuis un dropdown
- Champ de saisie pour le nom du parcours (Informatique, Mathématiques, etc.)
- Attribution automatique d'une couleur distinctive
- Possibilité d'ajouter une description

### 2. Gestion des Cours
**Ajout d'un Cours**:
- Formulaire multi-étapes avec validation
- Étape 1: Informations générales (nom, code, description)
- Étape 2: Association au parcours et niveau
- Étape 3: Configuration des horaires et récurrence
- Étape 4: Attribution des enseignants
- Prévisualisation avant validation finale

**Modification d'un Cours**:
- Double-clic sur un cours dans le calendrier
- Ouverture du formulaire avec données pré-remplies
- Sauvegarde automatique des modifications
- Mise à jour en temps réel du calendrier

### 3. Calendrier Hebdomadaire
**Navigation**:
- Flèches gauche/droite pour changer de semaine
- Sélecteur de semaine par numéro
- Bouton "Aujourd'hui" pour revenir à la semaine courante
- Vue mois disponible pour la planification à long terme

**Programmation des Cours**:
- Drag & drop des cours depuis une liste latérale
- Redimensionnement pour ajuster la durée
- Validation des conflits d'horaires avec alertes visuelles
- Récurrence automatique (hebdomadaire, mensuelle)

**Interactions Avancées**:
- Clic droit pour menu contextuel (éditer, supprimer, dupliquer)
- Multi-sélection pour les actions groupées
- Filtrage par niveau, parcours, ou enseignant
- Recherche rapide par nom de cours

### 4. Système d'Email
**Composition**:
- Template prédefini pour les emplois du temps
- Destinataires automatiques selon le niveau/parcours
- Personnalisation avec variables dynamiques
- Aperçu avant envoi

**Envoi Automatique**:
- Planification des envois (début de semaine)
- Gestion des listes de diffusion
- Suivi des statuts d'envoi
- Gestion des rebonds et erreurs

### 5. Export PDF
**Configuration**:
- Sélection du format (landscape/portrait)
- Choix des informations à inclure
- Personnalisation du header/footer
- Aperçu en temps réel

**Génération**:
- Traitement asynchrone avec indicateur de progression
- Notification de completion
- Téléchargement automatique
- Historique des exports générés

## Flux de Travail Typique

### Pour un Gestionnaire:
1. Créer les niveaux et parcours académiques
2. Importer ou créer la base de cours
3. Planifier les emplois du temps hebdomadaires
4. Visualiser et ajuster les planning
5. Envoyer les emplois du temps par email
6. Exporter les PDFs pour archivage

### Pour un Étudiant (Vue Lecture Seule):
1. Accéder à son emploi du temps personnalisé
2. Filtrer par semaine ou période
3. Télécharger son emploi du temps en PDF
4. Recevoir les mises à jour par email

## Fonctionnalités Avancées

### Intelligence Artificielle:
- Suggestions d'optimisation d'horaires
- Détection automatique de conflits
- Proposition d'alternatives en cas de problème

### Analytics:
- Taux d'occupation des salles
- Répartition des cours par enseignant
- Statistiques d'utilisation par niveau
- Suivi des modifications et versions

### Collaboratif:
- Commentaires sur les cours
- Partage d'emplois du temps
- Notifications de changements
- Système de validation hiérarchique