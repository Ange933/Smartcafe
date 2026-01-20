# Documentation API - Smart Café

## Base URL

```
http://localhost:3000/api
```

## Format des réponses

Toutes les réponses suivent ce format standard :

```json
{
  "success": true,
  "message": "Message descriptif",
  "data": {},
  "count": 0
}
```

## Authentification

L'API utilise des **JSON Web Tokens (JWT)** pour l'authentification.

### Header requis

```
Authorization: Bearer <token>
```

---

## Endpoints

### Health Check

#### GET `/api/health`

Vérifier que l'API fonctionne.

**Authentification** : Non requise

**Réponse** :
```json
{
  "success": true,
  "message": "API Smart Café opérationnelle",
  "timestamp": "2026-01-20T10:30:00.000Z"
}
```

---

## Authentification

### POST `/api/auth/register`

Créer un nouveau compte utilisateur.

**Authentification** : Non requise

**Body** :
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+33612345678",
  "role": "CUSTOMER"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST `/api/auth/register-waiter`

Créer un compte serveur (réservé à l’ADMIN). L’email et un mot de passe temporaire sont générés automatiquement.

**Authentification** : Requise (ADMIN)

**Body** :
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Serveur créé avec succès",
  "data": {
    "user": {
      "id": 5,
      "email": "jean.dupont@smartcafe.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "role": "WAITER"
    },
    "credentials": {
      "email": "jean.dupont@smartcafe.com",
      "password": "serveur4821"
    }
  }
}
```

---

### POST `/api/auth/login`

Se connecter avec un compte existant.

**Authentification** : Non requise

**Body** :
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erreurs** :
- `400` : Données manquantes
- `401` : Email ou mot de passe incorrect

---

### GET `/api/auth/profile`

Récupérer le profil de l'utilisateur connecté.

**Authentification** : Requise

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "CUSTOMER",
    "phone": "+33612345678",
    "created_at": "2026-01-20T10:00:00.000Z"
  }
}
```

---

## Catégories

### GET `/api/categories`

Récupérer toutes les catégories actives.

**Authentification** : Non requise

**Réponse** :
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Entrées",
      "description": "Découvrez nos entrées raffinées",
      "image_url": "https://...",
      "display_order": 1,
      "is_active": true,
      "created_at": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/categories/:id`

Récupérer une catégorie par ID.

**Authentification** : Non requise

**Paramètres** :
- `id` : ID de la catégorie

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Entrées",
    "description": "Découvrez nos entrées raffinées",
    "image_url": "https://...",
    "display_order": 1,
    "is_active": true
  }
}
```

**Erreurs** :
- `404` : Catégorie non trouvée

---

### POST `/api/categories`

Créer une nouvelle catégorie.

**Authentification** : Requise (ADMIN ou WAITER)

**Body** :
```json
{
  "name": "Cocktails",
  "description": "Nos cocktails signature",
  "image_url": "https://...",
  "display_order": 6
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Catégorie créée avec succès",
  "data": {
    "id": 6,
    "name": "Cocktails",
    ...
  }
}
```

---

### PUT `/api/categories/:id`

Mettre à jour une catégorie.

**Authentification** : Requise (ADMIN)

**Paramètres** :
- `id` : ID de la catégorie

**Body** : (tous les champs sont optionnels)
```json
{
  "name": "Nouveaux Cocktails",
  "description": "Description mise à jour",
  "is_active": false
}
```

---

### DELETE `/api/categories/:id`

Supprimer une catégorie.

**Authentification** : Requise (ADMIN)

**Paramètres** :
- `id` : ID de la catégorie

**Réponse** :
```json
{
  "success": true,
  "message": "Catégorie supprimée avec succès"
}
```

---

## Produits

### GET `/api/products`

Récupérer tous les produits disponibles.

**Authentification** : Non requise

**Query Parameters** :
- `category_id` (optionnel) : Filtrer par catégorie

**Exemples** :
- `/api/products` : Tous les produits
- `/api/products?category_id=1` : Produits de la catégorie 1

**Réponse** :
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "category_name": "Entrées",
      "name": "Foie Gras Maison",
      "description": "Foie gras de canard mi-cuit...",
      "price": 28.00,
      "image_url": "https://...",
      "is_available": true,
      "preparation_time": 10,
      "allergens": null,
      "is_vegetarian": false,
      "is_vegan": false,
      "created_at": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/products/:id`

Récupérer un produit par ID.

**Authentification** : Non requise

**Paramètres** :
- `id` : ID du produit

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "category_id": 1,
    "category_name": "Entrées",
    "name": "Foie Gras Maison",
    "description": "Foie gras de canard mi-cuit...",
    "price": 28.00,
    "image_url": "https://...",
    "is_available": true,
    "preparation_time": 10,
    "allergens": null,
    "is_vegetarian": false,
    "is_vegan": false
  }
}
```

---

### POST `/api/products`

Créer un nouveau produit.

**Authentification** : Requise (ADMIN)

**Body** :
```json
{
  "category_id": 1,
  "name": "Tartare de Saumon",
  "description": "Saumon frais, avocat, citron vert",
  "price": 18.50,
  "image_url": "https://...",
  "preparation_time": 12,
  "allergens": ["poisson"],
  "is_vegetarian": false,
  "is_vegan": false
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Produit créé avec succès",
  "data": {
    "id": 16,
    "name": "Tartare de Saumon",
    ...
  }
}
```

---

### PUT `/api/products/:id`

Mettre à jour un produit.

**Authentification** : Requise (ADMIN)

**Paramètres** :
- `id` : ID du produit

**Body** : (tous les champs sont optionnels)
```json
{
  "price": 19.50,
  "is_available": false
}
```

---

### DELETE `/api/products/:id`

Supprimer un produit.

**Authentification** : Requise (ADMIN)

**Paramètres** :
- `id` : ID du produit

---

## Commandes

### GET `/api/orders`

Récupérer les commandes.

**Authentification** : Requise

**Query Parameters** :
- `status` (optionnel) : Filtrer par statut (PENDING, PREPARING, READY, DELIVERED, CANCELLED)

**Comportement** :
- **CUSTOMER** : Voit uniquement ses propres commandes
- **WAITER/ADMIN** : Voit toutes les commandes

**Réponse** :
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "order_id": 1,
      "order_number": "ORD-2026-0001",
      "status": "PENDING",
      "total_amount": 45.50,
      "customer_name": "John Doe",
      "customer_email": "user@example.com",
      "table_number": "T01",
      "order_date": "2026-01-20T11:30:00.000Z",
      "items": [
        {
          "product_name": "Foie Gras Maison",
          "quantity": 1,
          "unit_price": 28.00,
          "subtotal": 28.00
        }
      ]
    }
  ]
}
```

---

### GET `/api/orders/:id`

Récupérer une commande par ID.

**Authentification** : Requise

**Paramètres** :
- `id` : ID de la commande

**Permissions** :
- **CUSTOMER** : Peut voir uniquement ses propres commandes
- **WAITER/ADMIN** : Peut voir toutes les commandes

**Réponse** :
```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "order_number": "ORD-2026-0001",
    "status": "PREPARING",
    "total_amount": 45.50,
    "customer_name": "John Doe",
    "table_number": "T01",
    "order_date": "2026-01-20T11:30:00.000Z",
    "items": [...]
  }
}
```

**Erreurs** :
- `403` : Accès non autorisé
- `404` : Commande non trouvée

---

### POST `/api/orders`

Créer une nouvelle commande.

**Authentification** : Requise

**Body** :
```json
{
  "table_id": 1,
  "notes": "Sans oignons dans la salade",
  "items": [
    {
      "product_id": 2,
      "quantity": 1,
      "special_instructions": "Cuisson à point"
    },
    {
      "product_id": 5,
      "quantity": 2
    }
  ]
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Commande créée avec succès",
  "data": {
    "id": 15,
    "order_number": "ORD-2026-1705751234567",
    "status": "PENDING",
    "total_amount": 92.00,
    "user_id": 3,
    "table_id": 1,
    "notes": "Sans oignons dans la salade",
    "created_at": "2026-01-20T12:00:34.567Z"
  }
}
```

**Validation** :
- Au moins un produit requis
- Produits doivent exister et être disponibles
- Quantités > 0

**Erreurs** :
- `400` : Données invalides
- `404` : Produit non trouvé

---

### PATCH `/api/orders/:id/status`

Mettre à jour le statut d'une commande.

**Authentification** : Requise (WAITER ou ADMIN)

**Paramètres** :
- `id` : ID de la commande

**Body** :
```json
{
  "status": "PREPARING"
}
```

**Statuts valides** :
- `PENDING` : En attente
- `PREPARING` : En préparation
- `READY` : Prêt
- `DELIVERED` : Livré
- `CANCELLED` : Annulé

**Réponse** :
```json
{
  "success": true,
  "message": "Statut de la commande mis à jour",
  "data": {
    "id": 1,
    "status": "PREPARING",
    ...
  }
}
```

---

### GET `/api/orders/stats/summary`

Récupérer les statistiques des commandes du jour.

**Authentification** : Requise (ADMIN)

**Réponse** :
```json
{
  "success": true,
  "data": {
    "total_orders": 25,
    "pending_orders": 3,
    "preparing_orders": 5,
    "ready_orders": 2,
    "delivered_orders": 14,
    "total_revenue": 1250.50,
    "average_order_value": 50.02
  }
}
```

---

## Tables

### GET `/api/tables`

Récupérer toutes les tables.

**Authentification** : Non requise

**Query Parameters** :
- `status` (optionnel) : Filtrer par statut (AVAILABLE, OCCUPIED, RESERVED)

**Réponse** :
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "table_number": "T01",
      "capacity": 2,
      "status": "AVAILABLE",
      "qr_code": null,
      "created_at": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/tables/:id`

Récupérer une table par ID.

**Authentification** : Non requise

**Paramètres** :
- `id` : ID de la table

---

### POST `/api/tables`

Créer une nouvelle table.

**Authentification** : Requise (ADMIN)

**Body** :
```json
{
  "table_number": "T09",
  "capacity": 4
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Table créée avec succès",
  "data": {
    "id": 9,
    "table_number": "T09",
    "capacity": 4,
    "status": "AVAILABLE"
  }
}
```

---

### PATCH `/api/tables/:id/status`

Mettre à jour le statut d'une table.

**Authentification** : Requise (WAITER ou ADMIN)

**Paramètres** :
- `id` : ID de la table

**Body** :
```json
{
  "status": "OCCUPIED"
}
```

**Statuts valides** :
- `AVAILABLE` : Disponible
- `OCCUPIED` : Occupée
- `RESERVED` : Réservée

---

### DELETE `/api/tables/:id`

Supprimer une table.

**Authentification** : Requise (ADMIN)

**Paramètres** :
- `id` : ID de la table

---

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Accès refusé |
| 404 | Not Found - Ressource non trouvée |
| 409 | Conflict - Conflit (ex: email déjà utilisé) |
| 500 | Internal Server Error - Erreur serveur |

---

## Exemples d'utilisation

### cURL

#### Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartcafe.com","password":"admin123"}'
```

#### Récupérer les produits
```bash
curl -X GET http://localhost:3000/api/products
```

#### Créer une commande (avec auth)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "table_id": 1,
    "items": [
      {"product_id": 2, "quantity": 1}
    ]
  }'
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Connexion
const { data } = await api.post('/auth/login', {
  email: 'admin@smartcafe.com',
  password: 'admin123'
});

// Utiliser le token
api.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;

// Créer une commande
const order = await api.post('/orders', {
  table_id: 1,
  items: [{ product_id: 2, quantity: 1 }]
});
```

---

## Rate Limiting

**À implémenter en production** :

- 100 requêtes par minute par IP
- 1000 requêtes par heure
- Headers de réponse :
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Changelog

### v1.0.0 (2026-01-20)
- Version initiale
- Authentification JWT
- CRUD catégories
- CRUD produits
- CRUD commandes
- CRUD tables
- Statistiques basiques
