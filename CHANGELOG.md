# Changelog - Smart Café

Toutes les modifications notables du projet sont documentées ici.

## [1.0.1] - 2026-01-20

### 🔧 Corrections

#### Authentification
- **CORRIGÉ** : Hash bcrypt invalide dans `database/init.sql`
  - Les mots de passe étaient hashés avec un hash factice non fonctionnel
  - **Nouveau hash valide** : `$2b$10$SN/wQaCn8tDl6U16206KR.EF65GdeKVGJZZUbb/VWUWqpDdY0BvuK`
  - Tous les comptes de démo utilisent maintenant le mot de passe `admin123` correctement hashé
  - **Impact** : La connexion fonctionne maintenant correctement

#### Backend
- **CORRIGÉ** : Erreur TypeScript dans `backend/src/utils/jwt.ts`
  - Typage incorrect pour `jwt.sign()` avec l'option `expiresIn`
  - Ajout de cast explicite : `expiresIn: JWT_EXPIRES_IN as string`
  - Ajout de cast pour SignOptions : `as jwt.SignOptions`
  - **Impact** : Le backend démarre maintenant sans erreur

#### Base de données
- **CORRIGÉ** : Script d'initialisation non exécuté correctement
  - Le volume Docker conservait l'ancienne base avec les mauvais hash
  - **Solution** : `docker-compose down -v` avant `docker-compose up -d`
  - **Impact** : La base est maintenant initialisée correctement à chaque démarrage propre

### 📚 Documentation

#### Nouvelles documentations
- **AJOUTÉ** : `docs/TROUBLESHOOTING.md` - Guide complet de dépannage
  - 10 problèmes courants et leurs solutions
  - Commandes de diagnostic
  - Checklist de vérification
  - "Commande magique" pour tout réinitialiser

#### Mises à jour
- **AMÉLIORÉ** : `README.md`
  - Instructions de démarrage plus claires
  - Ajout du temps d'attente recommandé (15-20s)
  - Mise en évidence de l'URL principale (http://localhost:5173)
  - Ajout de commandes utiles courantes
  - Lien vers le guide de dépannage

- **AMÉLIORÉ** : `GUIDE_DEMARRAGE.md`
  - Section "Se Connecter" plus détaillée
  - Ajout d'avertissements pour les problèmes courants
  - Instructions de dépannage plus complètes
  - Notes sur les hash bcrypt

- **AMÉLIORÉ** : `docs/DATABASE.md`
  - Ajout du vrai hash bcrypt dans les exemples
  - Note explicative sur le hashage des mots de passe

### 🎯 Problèmes résolus

1. ✅ Connexion impossible avec les comptes de démo
2. ✅ Backend qui ne démarre pas (erreur TypeScript)
3. ✅ Base de données non initialisée correctement
4. ✅ Conteneurs en conflit lors du redémarrage
5. ✅ Documentation manquante pour le dépannage

---

## [1.0.0] - 2026-01-20

### 🎉 Version initiale

#### Fonctionnalités

**Backend API** (Node.js + Express + TypeScript)
- Authentification JWT sécurisée
- CRUD complet pour : produits, catégories, commandes, tables
- Middleware d'authentification et d'autorisation par rôle
- Gestion centralisée des erreurs
- Connection pool PostgreSQL optimisée

**Frontend Web** (React + TypeScript + Tailwind)
- Interface de gestion responsive
- Pages : Dashboard, Produits, Commandes, Tables
- Authentification avec Context API
- Navigation avec React Router
- Design moderne avec Tailwind CSS

**Application Mobile** (React Native + Expo)
- App client cross-platform (iOS + Android)
- Écrans : Accueil, Menu, Panier, Profil
- Navigation avec React Navigation
- Design natif optimisé

**Base de données** (PostgreSQL 15)
- 6 tables relationnelles
- Types ENUM personnalisés
- Index de performance
- Triggers pour updated_at
- Vue matérialisée pour les commandes
- Données de démonstration incluses

**DevOps**
- Docker Compose pour orchestration
- 3 services containerisés
- Configuration optimisée pour le développement
- Volumes persistants pour PostgreSQL

#### Documentation

- README.md - Vue d'ensemble
- GUIDE_DEMARRAGE.md - Guide pas à pas
- docs/DOCUMENTATION_FONCTIONNELLE.md - Spécifications fonctionnelles
- docs/DOCUMENTATION_TECHNIQUE.md - Architecture et choix techniques
- docs/API.md - Documentation complète de l'API
- docs/DATABASE.md - Schéma de la base de données

#### Bonnes pratiques

- ✅ Principes SOLID (Single Responsibility, Open/Closed, etc.)
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ Sécurité (JWT, bcrypt, SQL injection protection)
- ✅ Architecture claire et maintenable
- ✅ Code commenté en français
- ✅ Documentation complète

---

## Prochaines versions

### [1.1.0] - Prévu

**Fonctionnalités à venir** :
- 💳 Paiement en ligne (Stripe)
- 🔔 Notifications push en temps réel
- 📧 Envoi d'emails de confirmation
- ⭐ Système d'avis et de notation
- 🎫 Programme de fidélité

**Améliorations techniques** :
- 🧪 Tests unitaires et d'intégration (Jest)
- 📊 Monitoring avec Sentry
- 🚀 CI/CD avec GitHub Actions
- 🔒 Rate limiting pour l'API
- 📱 Mode hors ligne pour l'app mobile

**Documentation** :
- Guide de contribution
- Guide de déploiement en production
- Tutoriels vidéo

---

## Comment signaler un bug ?

Si vous rencontrez un problème :

1. **Vérifiez** le [Guide de Dépannage](docs/TROUBLESHOOTING.md)
2. **Collectez** les informations de diagnostic :
   ```bash
   docker-compose ps
   docker-compose logs > logs.txt
   ```
3. **Décrivez** le problème avec :
   - Système d'exploitation et version
   - Versions Docker et Docker Compose
   - Étapes pour reproduire le bug
   - Logs pertinents

---

## Contributeurs

Projet réalisé dans le cadre du Projet UF B3 DEV - Ynov Informatique 2026
