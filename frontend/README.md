# Frontend Web - Smart Café

Application web de gestion React + TypeScript + Vite pour Smart Café.

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173

## Build de production

```bash
npm run build
npm run preview
```

## Structure

```
frontend/
├── src/
│   ├── components/     # Composants réutilisables
│   │   ├── Layout.tsx
│   │   └── PrivateRoute.tsx
│   ├── context/        # Context API
│   │   └── AuthContext.tsx
│   ├── pages/          # Pages de l'application
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── TablesPage.tsx
│   ├── services/       # Services API
│   │   └── api.ts
│   ├── App.tsx         # Composant principal
│   ├── main.tsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── package.json
├── vite.config.ts
└── Dockerfile
```

## Fonctionnalités

### Accessible à tous les rôles (après connexion)
- 📊 **Dashboard** - Statistiques en temps réel
- 📦 **Produits** - Consultation du menu
- 📋 **Commandes** - Suivi des commandes
- 🪑 **Tables** - État des tables

### Réservé aux Administrateurs
- ➕ Création/modification/suppression de produits
- 📁 Gestion des catégories
- 👥 Gestion des utilisateurs

## Technologies

- **React** 18.2+ - Bibliothèque UI
- **TypeScript** 5.3+ - Langage typé
- **Vite** 5.0+ - Build tool ultra-rapide
- **React Router** 6.20+ - Navigation
- **Axios** 1.6+ - Client HTTP
- **Tailwind CSS** 3.3+ - Framework CSS utilitaire

## Configuration

### Variable d'environnement

Créez un fichier `.env` (optionnel) :

```env
VITE_API_URL=http://localhost:3000
```

Par défaut, l'API est sur http://localhost:3000

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@smartcafe.com` | `admin123` |
| Serveur | `waiter@smartcafe.com` | `admin123` |
| Client | `client@smartcafe.com` | `admin123` |

## Responsive

L'application est responsive et s'adapte à :
-  Desktop (1920px+)
-  Laptop (1024px+)
-  Tablet (768px+)
-  Mobile (375px+)
