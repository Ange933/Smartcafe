# Documentation Technique - Smart Café

## Table des Matières

1. [Architecture globale](#architecture-globale)
2. [Stack technique](#stack-technique)
3. [Structure du projet](#structure-du-projet)
4. [Backend API](#backend-api)
5. [Frontend Web](#frontend-web)
6. [Application Mobile](#application-mobile)
7. [Base de données](#base-de-données)
8. [Sécurité](#sécurité)
9. [Déploiement](#déploiement)
10. [Bonnes pratiques appliquées](#bonnes-pratiques-appliquées)

---

## Architecture globale

### Vue d'ensemble

```
┌─────────────────┐         ┌─────────────────┐
│  Mobile App     │         │   Web App       │
│  (React Native) │         │   (React)       │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │    HTTP/REST API          │
         └──────────┬────────────────┘
                    │
         ┌──────────▼──────────┐
         │   Backend API       │
         │   (Express/Node)    │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │   PostgreSQL        │
         │   (Database)        │
         └─────────────────────┘
```

### Principe d'architecture

L'application suit une **architecture client-serveur classique** avec séparation claire :

- **Backend** : API RESTful stateless
- **Frontend Web** : SPA (Single Page Application)
- **Mobile** : Application native cross-platform
- **Database** : Base de données relationnelle PostgreSQL

### Communication

- **Protocol** : HTTP/HTTPS
- **Format** : JSON
- **Authentification** : JWT (JSON Web Tokens)
- **CORS** : Activé pour permettre les requêtes cross-origin

---

## Stack technique

### Backend

| Technologie | Version | Rôle |
|------------|---------|------|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.18+ | Framework web |
| TypeScript | 5.3+ | Langage typé |
| PostgreSQL | 15+ | Base de données |
| pg | 8.11+ | Driver PostgreSQL |
| bcrypt | 5.1+ | Hashage des mots de passe |
| jsonwebtoken | 9.0+ | Génération/vérification JWT |
| cors | 2.8+ | Gestion CORS |
| dotenv | 16.3+ | Variables d'environnement |

### Frontend Web

| Technologie | Version | Rôle |
|------------|---------|------|
| React | 18.2+ | Bibliothèque UI |
| TypeScript | 5.3+ | Langage typé |
| Vite | 5.0+ | Build tool |
| React Router | 6.20+ | Navigation |
| Axios | 1.6+ | Client HTTP |
| Tailwind CSS | 3.3+ | Framework CSS |

### Mobile

| Technologie | Version | Rôle |
|------------|---------|------|
| React Native | 0.76+ | Framework mobile |
| Expo | 54+ | Toolchain |
| TypeScript | 5.1+ | Langage typé |
| React Navigation | 6.1+ | Navigation |
| Axios | 1.6+ | Client HTTP |

### DevOps

| Technologie | Version | Rôle |
|------------|---------|------|
| Docker | Latest | Containerisation |
| Docker Compose | Latest | Orchestration |
| Git | Latest | Versioning |

---

## Structure du projet

```
smart-cafe/
│
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuration (DB, etc.)
│   │   ├── controllers/    # Contrôleurs (logique métier)
│   │   ├── middleware/     # Middlewares (auth, errors)
│   │   ├── routes/         # Définition des routes
│   │   ├── types/          # Types TypeScript
│   │   ├── utils/          # Utilitaires
│   │   └── index.ts        # Point d'entrée
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/               # Application web React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── context/       # Context API (Auth)
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── App.tsx        # Composant principal
│   │   └── main.tsx       # Point d'entrée
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── mobile/                 # Application mobile
│   ├── src/
│   │   ├── screens/       # Écrans
│   │   └── services/      # Services API
│   ├── App.tsx
│   ├── package.json
│   └── app.json
│
├── database/               # Scripts SQL
│   └── init.sql           # Initialisation de la DB
│
├── docs/                   # Documentation
│   ├── DOCUMENTATION_FONCTIONNELLE.md
│   └── DOCUMENTATION_TECHNIQUE.md
│
├── docker-compose.yml      # Orchestration Docker
└── README.md              # Documentation principale
```

---

## Backend API

### Architecture

Le backend suit une architecture **MVC simplifiée** :

```
Routes → Middleware → Controllers → Database
```

#### Couches

1. **Routes** (`src/routes/`)
   - Définition des endpoints
   - Association avec les contrôleurs
   - Application des middlewares

2. **Middleware** (`src/middleware/`)
   - Authentification JWT
   - Autorisation par rôle
   - Gestion des erreurs
   - Validation des données

3. **Controllers** (`src/controllers/`)
   - Logique métier
   - Validation des entrées
   - Appels à la base de données
   - Formatage des réponses

4. **Database** (`src/config/`)
   - Pool de connexions PostgreSQL
   - Requêtes SQL paramétrées
   - Gestion des transactions

### Principes appliqués

#### 1. Single Responsibility Principle (SRP)

Chaque module a une seule responsabilité :

```typescript
// authController.ts - Gestion de l'authentification uniquement
export const registerWaiter = async (req, res) => { /* ... */ };
export const login = async (req, res) => { /* ... */ };
export const getProfile = async (req, res) => { /* ... */ };
```

#### 2. DRY (Don't Repeat Yourself)

Code réutilisable dans les utilitaires :

```typescript
// utils/jwt.ts
export const generateToken = (payload) => { /* ... */ };
export const verifyToken = (token) => { /* ... */ };
```

#### 3. Separation of Concerns

Séparation claire des responsabilités :
- Routes : définition des endpoints
- Controllers : logique métier
- Middleware : validation, auth
- Config : configuration

### Format des réponses

Toutes les réponses suivent ce format standard :

```json
{
  "success": true/false,
  "message": "Message descriptif",
  "data": { /* données */ },
  "count": 10  // optionnel pour les listes
}
```

### Gestion des erreurs

Centralisée dans `errorHandler.ts` :

```typescript
app.use(errorHandler);  // Catch toutes les erreurs
```

Format d'erreur :

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "stack": "..."  // en développement uniquement
}
```

---

## Frontend Web

### Architecture

Application **SPA (Single Page Application)** avec React Router.

#### Structure des composants

```
App (Router)
├── AuthProvider (Context)
│   ├── LoginPage (public)
│   └── Layout (protégé)
│       ├── Navigation
│       └── Pages
│           ├── DashboardPage
│           ├── ProductsPage
│           ├── OrdersPage
│           └── TablesPage
```

### State Management

#### Context API pour l'authentification

```typescript
const AuthContext = createContext<AuthContextType>();

// Fournit :
// - user: User | null
// - token: string | null
// - login(email, password)
// - logout()
// - isAuthenticated: boolean
```

#### State local pour les données

Chaque page gère son propre état avec `useState` et `useEffect`.

### Services API

Centralisation dans `services/api.ts` :

```typescript
// Instance Axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Routing

```typescript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/orders" element={<OrdersPage />} />
    <Route path="/tables" element={<TablesPage />} />
  </Route>
</Routes>
```

### Styling

**Tailwind CSS** pour un design moderne et responsive :

```tsx
<div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
  <h2 className="text-xl font-bold text-white">
    Titre
  </h2>
</div>
```

---

## Application Mobile

### Architecture

Application **React Native** avec Expo pour un développement rapide.

#### Navigation

```
Stack Navigator
└── Menu
```

### Composants natifs

Utilisation des composants React Native :
- `View` : conteneur
- `Text` : texte
- `SectionList` : menu par catégories
- `ActivityIndicator` : chargement

### Styling

StyleSheet natif :

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  // ...
});
```

### Services API

Même principe que le web avec Axios :

```typescript
const API_URL = 'http://localhost:3000/api';
const api = axios.create({ baseURL: API_URL });
```

⚠️ **Important** : Sur appareil physique, remplacer `localhost` par l'IP locale.

---

## Base de données

### Modèle relationnel

```
users (1) ──┬──> (N) orders (1) ──> (N) order_items (N) ──> (1) products (N) ──> (1) categories
            │
            └──> (1) restaurant_tables (1) ──> (N) orders
```

### Tables principales

1. **users** : Utilisateurs du système
2. **categories** : Catégories de produits
3. **products** : Produits du menu
4. **restaurant_tables** : Tables du restaurant
5. **orders** : Commandes
6. **order_items** : Détails des commandes (produits)

### Types personnalisés (ENUM)

```sql
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'WAITER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');
CREATE TYPE table_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED');
```

### Contraintes d'intégrité

- Clés primaires sur tous les IDs
- Clés étrangères avec `ON DELETE` approprié
- Contraintes `CHECK` sur les prix et quantités
- Index sur les colonnes fréquemment recherchées

### Performances

- **Pool de connexions** : 20 connexions max
- **Index** : Sur email, statuts, dates
- **Transactions** : Pour les opérations complexes
- **Requêtes préparées** : Protection contre SQL injection

---

## Sécurité

### Authentification

#### JWT (JSON Web Tokens)

```typescript
// Génération
const token = jwt.sign(
  { id, email, role },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Vérification
const decoded = jwt.verify(token, JWT_SECRET);
```

#### Stockage

- **Backend** : Variable d'environnement `JWT_SECRET`
- **Frontend** : `localStorage.setItem('token', token)`

### Mots de passe

#### Hashage avec bcrypt

```typescript
// Création d'un compte serveur
const hashedPassword = await bcrypt.hash(password, 10);

// Connexion
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Paramètres** :
- Salt rounds : 10
- Algorithme : bcrypt

### Protection des endpoints

```typescript
// Route publique
router.get('/products', getAllProducts);

// Route authentifiée
router.get('/profile', authenticate, getProfile);

// Route avec autorisation
router.post('/products', authenticate, authorize(UserRole.ADMIN), createProduct);
```

### Validation des données

```typescript
// Validation côté serveur
if (!email || !password) {
  return res.status(400).json({ 
    success: false, 
    message: 'Données manquantes' 
  });
}
```

### Protection contre les attaques

1. **SQL Injection** : Requêtes paramétrées
   ```typescript
   pool.query('SELECT * FROM users WHERE id = $1', [userId]);
   ```

2. **XSS** : Échappement automatique par React
3. **CSRF** : Token dans les headers
4. **CORS** : Configuration restreinte
5. **Rate Limiting** : À implémenter

---

## Déploiement

### Avec Docker (Recommandé)

#### 1. Démarrer tous les services

```bash
docker-compose up -d
```

Cela lance :
- PostgreSQL (port 5432)
- Backend API (port 3000)
- Frontend Web (port 5173)

#### 2. Vérifier les logs

```bash
docker-compose logs -f
```

#### 3. Arrêter les services

```bash
docker-compose down
```

### Sans Docker (Développement local)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Mobile

```bash
cd mobile
npm install
npm start
```

### Variables d'environnement

#### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DB_HOST=database
DB_PORT=5432
DB_NAME=smartcafe_db
DB_USER=smartcafe
DB_PASSWORD=smartcafe123
JWT_SECRET=votre_secret_super_securise
JWT_EXPIRES_IN=7d
```

⚠️ **En production** : Changez toutes les valeurs sensibles !

---

## Bonnes pratiques appliquées

### Principes SOLID

#### S - Single Responsibility

Chaque module a une seule responsabilité.

```typescript
// authController.ts : authentification uniquement
// productController.ts : produits uniquement
```

#### O - Open/Closed

Ouvert à l'extension, fermé à la modification.

```typescript
// Ajout de nouveaux rôles sans modifier le middleware
export const authorize = (...allowedRoles: UserRole[]) => {
  // ...
};
```

#### L - Liskov Substitution

Les interfaces sont substituables.

#### I - Interface Segregation

Interfaces spécifiques plutôt que génériques.

```typescript
interface AuthRequest extends Request {
  user?: { id: number; email: string; role: UserRole; };
}
```

#### D - Dependency Inversion

Dépendance sur les abstractions.

### Autres principes

#### DRY (Don't Repeat Yourself)

Pas de duplication de code :

```typescript
// Fonction réutilisable
export const generateToken = (payload) => { /* ... */ };

// Utilisée partout
const token = generateToken({ id, email, role });
```

#### KISS (Keep It Simple, Stupid)

Solutions simples et claires :

```typescript
// Simple et lisible
if (!user) {
  return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
}
```

#### Convention over Configuration

Conventions de nommage cohérentes :

- Fichiers : `camelCase.ts`
- Composants : `PascalCase.tsx`
- Variables : `camelCase`
- Constants : `UPPER_SNAKE_CASE`
- Types : `PascalCase`

### Code Quality

#### TypeScript

Type safety partout :

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  // ...
}
```

#### Comments

Documentation des fonctions importantes :

```typescript
/**
 * Génère un token JWT pour un utilisateur
 * @param payload - Données à inclure dans le token
 * @returns Token JWT signé
 */
export const generateToken = (payload: TokenPayload): string => {
  // ...
};
```

#### Error Handling

Gestion centralisée des erreurs :

```typescript
try {
  // Code
} catch (error) {
  console.error('Erreur:', error);
  res.status(500).json({ success: false, message: 'Erreur serveur' });
}
```

### Git

#### Structure des commits

```
<type>(<scope>): <subject>

feat(auth): ajouter connexion JWT
fix(orders): corriger calcul du total
docs(readme): mettre à jour installation
```

#### Branches

```
main        # Production
develop     # Développement
feature/*   # Nouvelles fonctionnalités
bugfix/*    # Corrections
```

---

## Performance

### Backend

- Pool de connexions PostgreSQL (20 max)
- Indexes sur les colonnes fréquentes
- Transactions pour les opérations complexes
- Pagination des résultats (à implémenter)

### Frontend

- Code splitting avec React Router
- Memoization des composants (si nécessaire)
- Optimisation Tailwind (purge CSS)

### Mobile

- FlatList pour les longues listes
- Cache des requêtes API

---

## Tests

Aucun test automatisé n'a été implémenté dans ce projet.

---

## Maintenance

### Logs

#### Backend

```typescript
console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
```

#### Erreurs

```typescript
console.error('Erreur:', error);
```

### Monitoring

À implémenter :
- Sentry pour le tracking d'erreurs
- Analytics pour l'usage
- Healthcheck endpoint

---

## Conclusion

Ce projet démontre une application complète suivant les bonnes pratiques de développement moderne. L'architecture est simple, maintenable et évolutive.

Les choix techniques privilégient la simplicité et l'efficacité, adaptés à un contexte de production réel.
