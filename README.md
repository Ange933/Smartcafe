# Smart Café - Projet Restaurant de Luxe Connecté

## 📋 Description du Projet

Smart Café est une solution complète de gestion de restaurant de luxe avec commande mobile. Le projet comprend :

- **Application Web** : Interface de gestion pour le personnel (admin/serveurs)
- **Application Mobile** : Application pour les clients pour passer commande
- **API Backend** : Services REST sécurisés
- **Base de données** : PostgreSQL pour stocker toutes les données

## 🏗️ Architecture du Projet

```
smart-cafe/
├── backend/           # API Node.js + Express + TypeScript
├── frontend/          # Application web React + TypeScript
├── mobile/            # Application mobile React Native
├── database/          # Scripts SQL et migrations PostgreSQL
├── docker/            # Configurations Docker
├── docs/              # Documentation
└── docker-compose.yml # Orchestration des services
```

## 🚀 Technologies Utilisées

### Backend
- **Node.js** : Environnement d'exécution JavaScript
- **Express** : Framework web minimaliste et flexible
- **TypeScript** : Typage statique pour JavaScript
- **PostgreSQL** : Base de données relationnelle
- **JWT** : Authentification sécurisée
- **Bcrypt** : Hashage des mots de passe

### Frontend Web
- **React** : Bibliothèque UI moderne
- **TypeScript** : Typage statique
- **Axios** : Client HTTP
- **React Router** : Navigation
- **Tailwind CSS** : Framework CSS utilitaire

### Mobile
- **React Native** : Framework mobile cross-platform
- **TypeScript** : Typage statique
- **React Navigation** : Navigation mobile

### DevOps
- **Docker** : Containerisation
- **Docker Compose** : Orchestration multi-conteneurs
- **PostgreSQL** : Base de données en conteneur

## 📦 Installation et Démarrage

### Prérequis

- Docker Desktop installé
- Node.js 18+ (pour développement local)
- Git

### Démarrage Rapide avec Docker

1. **Naviguer dans le dossier du projet**
```bash
cd challenge
```

2. **Démarrer tous les services avec Docker**
```bash
docker-compose up -d
```

⏱️ **Attendez 15-20 secondes** que tous les services démarrent complètement.

3. **Vérifier que tout fonctionne**
- **Frontend Web** : http://localhost:5173 👈 **Ouvrez cette URL dans votre navigateur**
- API Backend : http://localhost:3000
- Base de données PostgreSQL : localhost:5432

4. **Connexion**

Connectez-vous avec :
- **Email** : `admin@smartcafe.com`
- **Mot de passe** : `admin123`

### Commandes utiles

```bash
# Voir l'état des services
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter les services
docker-compose down

# Tout nettoyer et repartir à zéro (⚠️ efface les données)
docker-compose down -v
docker-compose up -d
```

## 📚 Structure de la Base de Données

### Tables principales

1. **users** : Utilisateurs (clients, serveurs, admins)
2. **categories** : Catégories de produits
3. **products** : Produits du menu
4. **orders** : Commandes
5. **order_items** : Détails des commandes
6. **tables** : Tables du restaurant

Voir `docs/DATABASE.md` pour plus de détails.

## 🔐 Sécurité

- Authentification JWT pour toutes les routes protégées
- Mots de passe hashés avec bcrypt (10 rounds)
- Validation des données avec middleware
- Protection contre les injections SQL (requêtes paramétrées)
- CORS configuré pour les origines autorisées
- Variables d'environnement pour les secrets

## 👥 Rôles Utilisateurs

1. **ADMIN** : Gestion complète (produits, catégories, utilisateurs)
2. **WAITER** : Gestion des commandes et tables
3. **CUSTOMER** : Consultation du menu et passage de commandes

## 📱 Fonctionnalités

### Application Web (Gérance)
- Dashboard avec statistiques
- Gestion du menu (produits, catégories)
- Gestion des commandes en temps réel
- Gestion des tables
- Gestion des utilisateurs

### Application Mobile (Client)
- Consultation du menu par catégorie
- Panier de commande
- Passage de commande
- Suivi de commande
- Profil utilisateur

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📖 Documentation

- **[Guide de Démarrage](GUIDE_DEMARRAGE.md)** ⭐ Commencez ici !
- [Documentation Fonctionnelle](docs/DOCUMENTATION_FONCTIONNELLE.md)
- [Documentation Technique](docs/DOCUMENTATION_TECHNIQUE.md)
- [Guide Base de Données](docs/DATABASE.md)
- [Guide API](docs/API.md)
- [Guide de Dépannage](docs/TROUBLESHOOTING.md) 🔧 En cas de problème

## 🎯 Bonnes Pratiques Appliquées

### Principes SOLID
- **S**ingle Responsibility : Chaque classe/fonction a une seule responsabilité
- **O**pen/Closed : Ouvert à l'extension, fermé à la modification
- **L**iskov Substitution : Les sous-types doivent être substituables
- **I**nterface Segregation : Interfaces spécifiques plutôt que générales
- **D**ependency Inversion : Dépendre des abstractions, pas des implémentations

### Autres Principes
- **DRY** (Don't Repeat Yourself) : Pas de duplication de code
- **KISS** (Keep It Simple, Stupid) : Solutions simples et claires
- **Convention over Configuration** : Conventions de nommage cohérentes
- **Separation of Concerns** : Séparation claire des responsabilités

## 🌳 Utilisation de Git

```bash
# Branches principales
main        # Production
develop     # Développement
feature/*   # Nouvelles fonctionnalités
bugfix/*    # Corrections de bugs
```

## 👨‍💻 Contributeurs

Projet réalisé dans le cadre du Projet UF B3 DEV - Ynov Informatique

## 📄 Licence

Projet académique - Ynov Informatique 2026
