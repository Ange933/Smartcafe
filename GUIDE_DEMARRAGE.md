# Guide de Démarrage Rapide - Smart Café

Ce guide permet de lancer le projet Smart Café et d'accéder à l'application en quelques minutes.

## Prérequis

Assurez-vous d'avoir installé :

- Docker Desktop (version récente)
- Windows / macOS : https://www.docker.com/products/docker-desktop
- Linux (Ubuntu/Debian) : `sudo apt install docker.io docker-compose`
- Git

## Démarrage du projet

1. Ouvrir un terminal dans le dossier du projet
```bash
cd challenge
```

2. Lancer les services avec Docker
```bash
docker-compose up -d
```

Cette commande :
- télécharge les images nécessaires (premier lancement),
- démarre la base de données PostgreSQL,
- démarre l'API backend (Node.js / Express),
- démarre l'application web frontend (React),
- initialise la base de données avec des données de démonstration.

## Accès aux services

- Application Web : http://localhost:5173
- API Backend : http://localhost:3000
- Base de données PostgreSQL : port 5432

## Connexion à l'application

Compte administrateur de démonstration :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | admin@smartcafe.com | admin123 |

Le compte Serveur est créé par l'administrateur depuis le tableau de bord.
Le client n'a pas de compte : il accède directement au menu via un QR code.

## Application mobile (optionnel)

L'application mobile n'est pas conteneurisée.

Lancement avec Expo :
```bash
cd mobile
npm install
npm start
```

Version web de l'application mobile :
```bash
npm run web
```

Accès : http://localhost:19006

## Documentation

Pour plus de détails sur le projet :

- README.md : vue d'ensemble
- docs/DOCUMENTATION_FONCTIONNELLE.md : fonctionnalités et parcours utilisateurs
- docs/DOCUMENTATION_TECHNIQUE.md : architecture et choix techniques
- docs/API.md : documentation de l'API
- docs/DATABASE.md : schéma et structure de la base de données

## Dépannage rapide

Voir les logs :
```bash
docker-compose logs -f
```

Redémarrer les services :
```bash
docker-compose restart
```
