# Guide de Dépannage - Smart Café

Ce document liste tous les problèmes courants et leurs solutions.

## Diagnostic rapide

### Vérifier l'état des services

```bash
docker-compose ps
```

**Résultat attendu** :
```
NAME                 STATUS
smartcafe-backend    Up
smartcafe-database   Up (healthy)
smartcafe-frontend   Up
```

### Vérifier les logs

```bash
# Tous les services
docker-compose logs --tail 50

# Un service spécifique
docker-compose logs backend --tail 20
docker-compose logs database --tail 20
docker-compose logs frontend --tail 20
```

---

## Problèmes et Solutions

### 1. Impossible de démarrer les conteneurs

#### Symptôme
```
Error response from daemon: container name is already in use
```

#### Cause
Des conteneurs avec le même nom existent déjà.

#### Solution
```bash
# Option 1 : Arrêter proprement
docker-compose down

# Option 2 : Forcer la suppression
docker rm -f smartcafe-database smartcafe-backend smartcafe-frontend

# Puis redémarrer
docker-compose up -d
```

---

### 2. "Email ou mot de passe incorrect"

#### Symptôme
Impossible de se connecter avec `admin@smartcafe.com` / `admin123`

#### Cause
La base de données n'a pas été initialisée correctement, ou les hash bcrypt sont invalides.

#### Solution
```bash
# SOLUTION COMPLÈTE : Recréer la base de données

# 1. Arrêter et supprimer les volumes
docker-compose down -v

# 2. Redémarrer (init.sql sera ré-exécuté)
docker-compose up -d

# 3. Attendre 20 secondes que tout démarre

# 4. Vérifier que la base est initialisée
docker-compose logs database | Select-String "Smart Café initialisée"

# 5. Essayer de se connecter sur http://localhost:5173
```

---

### 3. Backend ne démarre pas (erreur TypeScript)

#### Symptôme
```
TSError: Unable to compile TypeScript
error TS2769: No overload matches this call
```

#### Cause
Problème de typage dans le code TypeScript.

#### Solution
```bash
# Redémarrer le backend
docker-compose restart backend

# Vérifier les logs
docker-compose logs backend --tail 30

# Si l'erreur persiste, reconstruire
docker-compose up -d --build backend
```

---

### 4. Base de données ne se connecte pas

#### Symptôme
```
FATAL: database "smartcafe" does not exist
```

#### Cause
Le script `init.sql` n'a pas été exécuté au démarrage de PostgreSQL.

#### Solution
```bash
# Recréer complètement la base
docker-compose down -v
docker-compose up -d

# Attendre que PostgreSQL soit prêt
docker-compose logs database | Select-String "ready to accept connections"

# Vérifier que les tables sont créées
docker exec smartcafe-database psql -U smartcafe -d smartcafe_db -c "\dt"
```

#### Vérification manuelle
```bash
# Se connecter à PostgreSQL
docker exec -it smartcafe-database psql -U smartcafe -d smartcafe_db

# Vérifier les utilisateurs
SELECT email, role FROM users;

# Quitter
\q
```

---

### 5. Port déjà utilisé

#### Symptôme
```
Error: bind: address already in use
```

#### Cause
Un autre service utilise le port 3000, 5173 ou 5432.

#### Solution Windows (PowerShell)
```bash
# Trouver le processus qui utilise le port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object OwningProcess

# Tuer le processus (remplacez PID)
Stop-Process -Id PID -Force
```

#### Solution alternative
Changez le port dans `docker-compose.yml` :

```yaml
# Exemple : changer le port du frontend
frontend:
  ports:
    - "5174:5173"  # Port externe changé
```

---

### 6. Frontend affiche une page blanche

#### Symptôme
Le navigateur affiche une page blanche sur http://localhost:5173

#### Causes possibles
1. Vite n'a pas terminé de compiler
2. Erreur JavaScript
3. API non accessible

#### Solution
```bash
# 1. Vérifier les logs du frontend
docker-compose logs frontend --tail 30

# Chercher : "VITE vX.X.X ready in XXms"

# 2. Si pas de message "ready", redémarrer
docker-compose restart frontend

# 3. Vérifier dans le navigateur (F12 > Console)
# Chercher des erreurs JavaScript

# 4. Si problème API, vérifier le backend
docker-compose logs backend --tail 20
```

---

### 7. Mobile ne se connecte pas à l'API

#### Symptôme
L'app mobile affiche "Cannot connect to API"

#### Cause
`localhost` ne fonctionne pas sur un smartphone.

#### Solution
```bash
# 1. Trouver votre IP locale
# Windows
ipconfig

# Chercher "Adresse IPv4" (ex: 192.168.1.100)

# 2. Modifier mobile/src/services/api.ts
# Remplacer
const API_URL = 'http://localhost:3000/api';
# Par
const API_URL = 'http://192.168.1.100:3000/api';

# 3. Relancer l'app mobile
cd mobile
npm start
```

---

### 8. Conteneurs redémarrent en boucle

#### Symptôme
```bash
docker-compose ps
# Montre "Restarting"
```

#### Solution
```bash
# Voir pourquoi le conteneur crash
docker-compose logs backend

# Problèmes courants :
# - Erreur de connexion DB → Vérifier les variables d'environnement
# - Erreur de compilation → Vérifier le code
# - Port occupé → Changer le port

# Reconstruire si nécessaire
docker-compose down
docker-compose up -d --build
```

---

### 9. Les modifications de code ne sont pas prises en compte

#### Symptôme
Vous modifiez du code mais rien ne change.

#### Cause
Le volume Docker n'est pas synchronisé ou le hot-reload ne fonctionne pas.

#### Solution Backend
```bash
# Redémarrer pour forcer la recompilation
docker-compose restart backend
```

#### Solution Frontend
```bash
# Vite devrait recharger automatiquement
# Si ce n'est pas le cas :
docker-compose restart frontend
```

---

### 10. Erreur "Permission denied"

#### Symptôme (Linux/Mac uniquement)
```
Permission denied accessing /app
```

#### Solution
```bash
# Donner les permissions sur les dossiers
sudo chown -R $USER:$USER backend frontend mobile

# Ou lancer avec sudo (non recommandé)
sudo docker-compose up -d
```

---

##  Commande magique : Tout réinitialiser

Si rien ne fonctionne, utilisez cette séquence :

```bash
# 1. Tout arrêter et nettoyer
docker-compose down -v

# 2. Supprimer les images (optionnel)
docker rmi challenge-backend challenge-frontend

# 3. Nettoyer Docker (optionnel, attention aux autres projets)
docker system prune -a

# 4. Redémarrer
docker-compose up -d --build

# 5. Attendre 30 secondes

# 6. Vérifier l'état
docker-compose ps
docker-compose logs --tail 20
```

---

##  Besoin d'aide supplémentaire ?

### Informations à collecter

Avant de demander de l'aide, collectez ces informations :

```bash
# 1. Système d'exploitation
# Windows, Mac, Linux + version

# 2. Version Docker
docker --version
docker-compose --version

# 3. État des conteneurs
docker-compose ps

# 4. Logs complets
docker-compose logs > logs.txt

# 5. Contenu du fichier problématique (si applicable)
```

### Checklist de vérification

- [ ] Docker Desktop est bien lancé
- [ ] Vous êtes dans le bon dossier (`cd challenge`)
- [ ] Le fichier `docker-compose.yml` existe
- [ ] Les ports 3000, 5173 et 5432 sont libres
- [ ] Vous avez attendu 20 secondes après `docker-compose up`
- [ ] Les logs ne montrent pas d'erreur critique

---

## Astuces

### Voir les logs en temps réel pendant le démarrage

```bash
docker-compose up
# (sans -d pour voir les logs en direct)
# Appuyez sur Ctrl+C pour arrêter
```

### Nettoyer l'espace disque Docker

```bash
# Voir l'espace utilisé
docker system df

# Nettoyer ce qui n'est pas utilisé
docker system prune -a
```

### Accéder au shell d'un conteneur

```bash
# Backend
docker exec -it smartcafe-backend sh

# Database
docker exec -it smartcafe-database psql -U smartcafe -d smartcafe_db

# Frontend
docker exec -it smartcafe-frontend sh
```

---

## Tout fonctionne maintenant ?

Si vous avez résolu votre problème, vérifiez que tout est OK :

1. `docker-compose ps` montre tous les services "Up"
2.  http://localhost:5173 affiche la page de connexion
3.  Vous pouvez vous connecter avec `admin@smartcafe.com` / `admin123`
4.  Le tableau de bord s'affiche correctement

**Félicitations ! Le projet Smart Café fonctionne ! 
