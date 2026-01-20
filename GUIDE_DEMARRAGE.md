# 🚀 Guide de Démarrage Rapide - Smart Café

Ce guide vous aidera à lancer le projet Smart Café en quelques minutes.

## 📋 Prérequis

Assurez-vous d'avoir installé sur votre machine :

- **Docker Desktop** (version récente)
  - Windows : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Mac : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux : `sudo apt install docker.io docker-compose` (Ubuntu/Debian)

- **Git** (pour cloner le projet si nécessaire)

C'est tout ! Docker va s'occuper du reste (Node.js, PostgreSQL, etc.).

---

## 🎯 Démarrage en 3 étapes

### Étape 1 : Ouvrir le terminal dans le dossier du projet

```bash
cd challenge
```

### Étape 2 : Lancer tous les services avec Docker

```bash
docker-compose up -d
```

Cette commande va :
1. Télécharger les images Docker nécessaires (première fois uniquement)
2. Créer et démarrer 3 conteneurs :
   - PostgreSQL (base de données)
   - Backend API (Node.js + Express)
   - Frontend Web (React)
3. Initialiser la base de données avec des données de démonstration

⏱️ **Temps estimé** : 2-5 minutes (selon votre connexion internet)

### Étape 3 : Vérifier que tout fonctionne

Attendez environ 30 secondes que tous les services démarrent, puis ouvrez votre navigateur :

- **Application Web** : http://localhost:5173
- **API Backend** : http://localhost:3000
- **Base de données** : Port 5432 (accessible via un client PostgreSQL)

---

## 🔑 Se Connecter

### Application Web (Gestion)

1. **Ouvrez votre navigateur** sur : http://localhost:5173

2. **Attendez** que la page se charge complètement (peut prendre 5-10 secondes la première fois)

3. **Connectez-vous** avec un des comptes ci-dessous :

**Comptes de démonstration** :

| Rôle | Email | Mot de passe | Accès |
|------|-------|--------------|-------|
| **Administrateur** | `admin@smartcafe.com` | `admin123` | Tous les droits |
| Serveur | `waiter@smartcafe.com` | `admin123` | Commandes + Tables |
| Client | `client@smartcafe.com` | `admin123` | Ses commandes uniquement |

> **💡 Astuce** : Commencez avec le compte **Administrateur** pour avoir accès à toutes les fonctionnalités.

### ⚠️ Si la connexion ne fonctionne pas

Si vous voyez "Email ou mot de passe incorrect" :

```bash
# La base de données n'est pas bien initialisée
# Recréez-la avec cette commande :
docker-compose down -v && docker-compose up -d

# Attendez 20 secondes puis réessayez
```

---

## 📱 Lancer l'Application Mobile (Optionnel)

### Option 1 : Avec Expo Go (Recommandé pour débuter)

1. Installez l'application **Expo Go** sur votre smartphone :
   - [iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
   - [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Dans un nouveau terminal :
   ```bash
   cd mobile
   npm install
   npm start
   ```

3. Scannez le QR code affiché avec :
   - iPhone : Appareil photo
   - Android : Application Expo Go

4. **Important** : Modifiez l'URL de l'API dans `mobile/src/services/api.ts` :
   ```typescript
   // Remplacez localhost par votre IP locale
   const API_URL = 'http://192.168.1.XXX:3000/api';
   ```

   Pour trouver votre IP locale :
   - Windows : `ipconfig` (cherchez "IPv4")
   - Mac/Linux : `ifconfig` (cherchez "inet")

### Option 2 : Avec un émulateur (Avancé)

**Android** (nécessite Android Studio) :
```bash
cd mobile
npm install
npm run android
```

**iOS** (nécessite macOS et Xcode) :
```bash
cd mobile
npm install
npm run ios
```

---

## 🛠️ Commandes Utiles

### Voir les logs en temps réel

```bash
docker-compose logs -f
```

Voir les logs d'un service spécifique :
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Arrêter les services

```bash
docker-compose down
```

### Redémarrer les services

```bash
docker-compose restart
```

### Reconstruire les images (après modification du code)

```bash
docker-compose up -d --build
```

### Réinitialiser complètement (⚠️ efface les données)

```bash
docker-compose down -v
docker-compose up -d
```

---

## 🎨 Fonctionnalités à Tester

### En tant qu'Administrateur

1. **Tableau de bord** : Visualiser les statistiques
2. **Gestion des produits** : Ajouter/modifier/supprimer des produits
3. **Gestion des catégories** : Organiser le menu
4. **Gestion des commandes** : Voir toutes les commandes
5. **Gestion des tables** : Voir et modifier le statut des tables

### En tant que Serveur

1. **Commandes** : Voir et mettre à jour le statut
2. **Tables** : Gérer les tables (disponible/occupée/réservée)
3. **Tableau de bord** : Vue d'ensemble

### En tant que Client (Mobile)

1. **Menu** : Parcourir les produits
2. **Panier** : Ajouter des produits (en développement)
3. **Commandes** : Passer et suivre les commandes (en développement)

---

## 🐛 Dépannage

### Problème : Les conteneurs ne démarrent pas

**Solution** : Vérifiez que Docker Desktop est lancé

```bash
docker ps
```

Si cette commande ne fonctionne pas, lancez Docker Desktop.

---

### Problème : "container name is already in use"

**Solution** : Des conteneurs existent déjà, supprimez-les :

```bash
# Supprimer les anciens conteneurs
docker rm -f smartcafe-database smartcafe-backend smartcafe-frontend

# Ou arrêter proprement avec docker-compose
docker-compose down

# Puis relancer
docker-compose up -d
```

---

### Problème : "Email ou mot de passe incorrect" lors de la connexion

**Solution** : La base de données n'a pas été initialisée correctement. Recréez-la :

```bash
# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer (cela recréera la base avec les bons mots de passe)
docker-compose up -d

# Attendre 20 secondes que tout démarre
# Puis essayer de vous connecter
```

**Note** : Les mots de passe sont maintenant correctement hashés avec bcrypt dans la base de données.

---

### Problème : Erreur TypeScript dans le backend

**Solution** : Si vous voyez des erreurs TypeScript dans les logs :

```bash
# Redémarrer le backend
docker-compose restart backend

# Voir les logs pour vérifier
docker-compose logs backend --tail 20
```

---

### Problème : Port déjà utilisé (3000, 5173, ou 5432)

**Solution** : Arrêtez le service qui utilise le port

Windows PowerShell :
```bash
# Trouver le processus
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Tuer le processus (remplacez PID par le numéro)
Stop-Process -Id PID -Force
```

Ou changez le port dans `docker-compose.yml`.

---

### Problème : La base de données ne se connecte pas

**Solution** : Attendez que PostgreSQL soit complètement démarré

```bash
docker-compose logs database
```

Cherchez le message : `database system is ready to accept connections`

**Si le problème persiste** :

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Le conteneur database doit être "healthy"
# Si ce n'est pas le cas, recréez tout :
docker-compose down -v
docker-compose up -d
```

---

### Problème : Erreur "Cannot connect to API" sur l'app mobile

**Solutions** :

1. Vérifiez que le backend est démarré :
   ```bash
   Invoke-RestMethod -Uri http://localhost:3000/api/health
   ```

2. Sur smartphone, remplacez `localhost` par votre IP locale dans `mobile/src/services/api.ts`

3. Assurez-vous que smartphone et ordinateur sont sur le même réseau WiFi

---

### Problème : Le frontend affiche une page blanche

**Solutions** :

1. Vérifiez les logs :
   ```bash
   docker-compose logs frontend
   ```

2. Attendez que Vite ait terminé de compiler (cherchez "ready in XXms")

3. Si le problème persiste, reconstruisez :
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

---

### Problème : "FATAL: database does not exist"

**Cause** : La base de données n'a pas été initialisée avec le script init.sql

**Solution** :

```bash
# Supprimer complètement les volumes
docker-compose down -v

# Redémarrer (PostgreSQL exécutera init.sql au démarrage)
docker-compose up -d

# Attendre 20 secondes
# Vérifier les logs
docker-compose logs database | Select-String "Base de données Smart Café initialisée"
```

---

## 📊 Structure du Projet

```
challenge/
├── backend/           # API Node.js + Express + TypeScript
├── frontend/          # Application web React + TypeScript
├── mobile/            # Application mobile React Native
├── database/          # Scripts SQL PostgreSQL
├── docs/              # Documentation complète
├── docker-compose.yml # Configuration Docker
└── README.md          # Documentation principale
```

---

## 📚 Documentation Complète

- **[README.md](README.md)** - Vue d'ensemble du projet
- **[docs/DOCUMENTATION_FONCTIONNELLE.md](docs/DOCUMENTATION_FONCTIONNELLE.md)** - Fonctionnalités et parcours utilisateurs
- **[docs/DOCUMENTATION_TECHNIQUE.md](docs/DOCUMENTATION_TECHNIQUE.md)** - Architecture et technologies
- **[docs/API.md](docs/API.md)** - Documentation complète de l'API
- **[docs/DATABASE.md](docs/DATABASE.md)** - Schéma et structure de la base de données

---

## 🎓 Choix Techniques Justifiés

### Backend : Node.js + Express + TypeScript

**Pourquoi ?**
- **Simple** : Courbe d'apprentissage douce pour les débutants
- **JavaScript partout** : Même langage frontend/backend
- **TypeScript** : Sécurité avec les types
- **Express** : Framework minimaliste et flexible
- **Large communauté** : Beaucoup de ressources

**Alternatives considérées** : Django (Python), Spring Boot (Java) - Plus complexes

---

### Frontend : React + TypeScript + Vite

**Pourquoi ?**
- **React** : Bibliothèque UI la plus populaire
- **Composants réutilisables** : Code modulaire
- **Vite** : Build ultra-rapide
- **Tailwind CSS** : Design moderne sans CSS complexe
- **React Router** : Navigation simple

**Alternatives considérées** : Vue.js, Angular - Moins de ressources

---

### Mobile : React Native + Expo

**Pourquoi ?**
- **Cross-platform** : iOS + Android avec un seul code
- **Même syntaxe que React** : Réutilisation des compétences
- **Expo** : Toolchain simple pour débuter
- **Développement rapide** : Hot reload en temps réel

**Alternatives considérées** : Flutter - Nouveau langage à apprendre

---

### Base de données : PostgreSQL

**Pourquoi ?**
- **Relationnel** : Structure claire avec relations
- **ACID** : Garanties transactionnelles
- **Types personnalisés** : ENUM pour les statuts
- **Performance** : Index et optimisations
- **Open-source** : Gratuit et fiable

**Alternatives considérées** : MySQL (moins de fonctionnalités), MongoDB (pas adapté)

---

### Docker

**Pourquoi ?**
- **Isolation** : Chaque service dans son conteneur
- **Reproductibilité** : Fonctionne partout de la même façon
- **Simplicité** : Un seul `docker-compose up`
- **Pas de conflits** : Pas besoin d'installer Node, PostgreSQL, etc.

---

## 🏆 Bonnes Pratiques Appliquées

### Architecture

✅ **Séparation des responsabilités** : Frontend / Backend / Database
✅ **API RESTful** : Endpoints clairs et standardisés
✅ **Stateless** : Backend sans état (JWT)

### Code

✅ **SOLID** : Single Responsibility, Open/Closed, etc.
✅ **DRY** : Pas de duplication de code
✅ **KISS** : Solutions simples et claires

### Sécurité

✅ **JWT** : Authentification sécurisée
✅ **Bcrypt** : Hashage des mots de passe (10 rounds)
✅ **Requêtes paramétrées** : Protection SQL injection
✅ **CORS** : Configuration des origines autorisées

### Performance

✅ **Pool de connexions** : PostgreSQL (20 max)
✅ **Index** : Sur colonnes fréquentes
✅ **Transactions** : Pour opérations complexes

---

## 💡 Conseils pour les Débutants

### 1. Commencez par explorer l'interface web

Connectez-vous en tant qu'admin et testez toutes les fonctionnalités.

### 2. Regardez les logs

C'est le meilleur moyen de comprendre ce qui se passe :
```bash
docker-compose logs -f
```

### 3. Explorez le code progressivement

Commencez par :
1. `backend/src/index.ts` - Point d'entrée du backend
2. `frontend/src/App.tsx` - Structure de l'app web
3. `database/init.sql` - Structure de la base

### 4. Consultez la documentation

Tous les fichiers dans `/docs` expliquent en détail le fonctionnement.

### 5. Testez l'API avec curl

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartcafe.com","password":"admin123"}'

# Get products
curl http://localhost:3000/api/products
```

---

## 🆘 Besoin d'Aide ?

1. **Consultez la documentation** dans le dossier `/docs`
2. **Vérifiez les logs** : `docker-compose logs -f`
3. **Relancez les services** : `docker-compose restart`

---

## ✨ Améliorations Futures

Le projet est fonctionnel mais peut être étendu avec :

- 💳 **Paiement en ligne** (Stripe)
- 🔔 **Notifications push**
- 📧 **Emails de confirmation**
- 🧪 **Tests automatisés** (Jest, Cypress)
- 📊 **Monitoring** (Sentry, Analytics)
- 🌍 **Multi-langues**
- 🎨 **Mode sombre**

---

## 🎉 Félicitations !

Vous avez maintenant un projet complet de restaurant connecté qui fonctionne ! 

Le projet démontre :
- ✅ Architecture moderne client-serveur
- ✅ API RESTful sécurisée
- ✅ Application web responsive
- ✅ Application mobile cross-platform
- ✅ Base de données relationnelle
- ✅ Containerisation avec Docker
- ✅ Documentation complète
- ✅ Bonnes pratiques de développement

**Bon développement ! 🚀**
