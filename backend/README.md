# Backend API - Smart Café

API RESTful Node.js + Express + TypeScript pour Smart Café.

## Installation

```bash
npm install
```

## Variables d'environnement

Créez un fichier `.env` à la racine de `backend/` (ce fichier ne doit pas être commité) :

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartcafe_db
DB_USER=smartcafe
DB_PASSWORD=smartcafe123  # valeur par défaut en Docker
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
```

En production : changez toutes les valeurs sensibles.

## Démarrage

### Avec Docker (recommandé)

Depuis la racine du projet  :

```bash
docker-compose up -d
```

### Mode développement (avec hot reload)

```bash
cd backend
```

```bash
npm run dev
```

### Mode production

Non utilisé dans ce projet (pas de déploiement).

Note : pas déployé en production dans ce projet.

## Endpoints principaux

- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil (auth requise)
- `POST /api/auth/register-waiter` - Création d’un serveur (ADMIN)
- `GET /api/products` - Liste des produits
- `GET /api/categories` - Liste des catégories
- `GET /api/orders` - Liste des commandes (auth requise)
- `POST /api/orders` - Créer une commande (auth requise)
- `GET /api/orders/stats/summary` - Statistiques (ADMIN/WAITER)
- `GET /api/tables` - Liste des tables

Voir [docs/API.md](../docs/API.md) pour la documentation complète.

## Technologies

- **Node.js** 18+
- **Express** 4.18+ - Framework web
- **TypeScript** 5.3+ - Langage typé
- **PostgreSQL** - Base de données (driver `pg`)
- **bcrypt** - Hashage des mots de passe
- **jsonwebtoken** - Authentification JWT
- **cors** - Gestion CORS

## Sécurité

- JWT pour l'authentification
- Bcrypt (10 rounds) pour les mots de passe
- Requêtes SQL paramétrées (protection injection)
- Middleware d'autorisation par rôle
- Gestion centralisée des erreurs

## Tests

```bash
npm test
```

Non implémentés dans cette version.

## Création des serveurs

Un admin peut créer un compte serveur uniquement avec prénom/nom via :
`POST /api/auth/register-waiter`.
Le backend génère automatiquement l’email et un mot de passe temporaire.
