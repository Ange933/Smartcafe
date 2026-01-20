# Documentation Base de Données - Smart Café

## Vue d'ensemble

Base de données **PostgreSQL 15+** relationnelle pour gérer l'ensemble des données du système Smart Café.

## Schéma de la base de données

### Diagramme relationnel

```
┌──────────────┐         ┌──────────────┐
│   users      │         │ categories   │
│──────────────│         │──────────────│
│ id (PK)      │         │ id (PK)      │
│ email        │         │ name         │
│ password     │         │ description  │
│ first_name   │         │ image_url    │
│ last_name    │         │ display_order│
│ role         │         │ is_active    │
│ phone        │         │ created_at   │
│ created_at   │         │ updated_at   │
│ updated_at   │         └──────┬───────┘
└──────┬───────┘                │
       │                        │
       │ 1                      │ 1
       │                        │
       │ N                      │ N
       │               ┌────────▼────────┐
       │               │   products      │
       │               │─────────────────│
       │               │ id (PK)         │
       │               │ category_id (FK)│
       │               │ name            │
       │               │ description     │
       │               │ price           │
       │               │ image_url       │
       │               │ is_available    │
       │               │ preparation_time│
       │               │ allergens       │
       │               │ is_vegetarian   │
       │               │ is_vegan        │
       │               │ created_at      │
       │               │ updated_at      │
       │               └────────┬────────┘
       │                        │
       │                        │ 1
       │                        │
       │                        │ N
       │               ┌────────▼────────┐
       │               │ order_items     │
       │               │─────────────────│
       │               │ id (PK)         │
       │               │ order_id (FK)   │
       │               │ product_id (FK) │
       │               │ quantity        │
       │               │ unit_price      │
       │               │ subtotal        │
       │               │ special_instr.  │
       │               │ created_at      │
       │               └────────▲────────┘
       │                        │
       │                        │ N
       │                        │
       │                        │ 1
       │               ┌────────┴────────┐
       └──────────────►│    orders       │
                       │─────────────────│
                       │ id (PK)         │
                       │ user_id (FK)    │
                       │ table_id (FK)   │
                       │ order_number    │
                       │ status          │
                       │ total_amount    │
                       │ notes           │
                       │ created_at      │
                       │ updated_at      │
                       └────────▲────────┘
                                │
                                │ N
                                │
                                │ 1
                       ┌────────┴─────────────┐
                       │ restaurant_tables    │
                       │──────────────────────│
                       │ id (PK)              │
                       │ table_number         │
                       │ capacity             │
                       │ status               │
                       │ qr_code              │
                       │ created_at           │
                       │ updated_at           │
                       └──────────────────────┘
```

---

## Tables

### 1. users

Stocke tous les utilisateurs du système (clients, serveurs, admins).

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email de connexion |
| password | VARCHAR(255) | NOT NULL | Mot de passe hashé (bcrypt) |
| first_name | VARCHAR(100) | NOT NULL | Prénom |
| last_name | VARCHAR(100) | NOT NULL | Nom de famille |
| role | user_role | NOT NULL | Rôle (CUSTOMER/WAITER/ADMIN) |
| phone | VARCHAR(20) | NULL | Numéro de téléphone |
| created_at | TIMESTAMP | DEFAULT NOW | Date de création |
| updated_at | TIMESTAMP | DEFAULT NOW | Date de modification |

**Index** :
- `idx_users_email` sur `email`
- `idx_users_role` sur `role`

**Exemple** :
```sql
INSERT INTO users (email, password, first_name, last_name, role, phone)
VALUES ('admin@smartcafe.com', '$2b$10$SN/wQaCn8tDl6U16206KR.EF65GdeKVGJZZUbb/VWUWqpDdY0BvuK', 'Admin', 'Système', 'ADMIN', '+33612345678');
```

> **Note** : Le mot de passe `admin123` est hashé avec bcrypt (10 rounds). Le hash ci-dessus est le vrai hash utilisé dans `database/init.sql`.

---

### 2. categories

Catégories pour organiser les produits du menu.

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| name | VARCHAR(100) | NOT NULL | Nom de la catégorie |
| description | TEXT | NULL | Description |
| image_url | VARCHAR(500) | NULL | URL de l'image |
| display_order | INTEGER | DEFAULT 0 | Ordre d'affichage |
| is_active | BOOLEAN | DEFAULT TRUE | Actif/Inactif |
| created_at | TIMESTAMP | DEFAULT NOW | Date de création |
| updated_at | TIMESTAMP | DEFAULT NOW | Date de modification |

**Exemple** :
```sql
INSERT INTO categories (name, description, display_order)
VALUES ('Entrées', 'Découvrez nos entrées raffinées', 1);
```

---

### 3. products

Produits du menu du restaurant.

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INTEGER DEFAULT 15,
    allergens TEXT[],
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| category_id | INTEGER | FK, NOT NULL | Catégorie du produit |
| name | VARCHAR(200) | NOT NULL | Nom du produit |
| description | TEXT | NULL | Description détaillée |
| price | DECIMAL(10,2) | NOT NULL, >= 0 | Prix en euros |
| image_url | VARCHAR(500) | NULL | URL de l'image |
| is_available | BOOLEAN | DEFAULT TRUE | Disponible/Rupture |
| preparation_time | INTEGER | DEFAULT 15 | Temps de préparation (min) |
| allergens | TEXT[] | NULL | Liste des allergènes |
| is_vegetarian | BOOLEAN | DEFAULT FALSE | Produit végétarien |
| is_vegan | BOOLEAN | DEFAULT FALSE | Produit vegan |
| created_at | TIMESTAMP | DEFAULT NOW | Date de création |
| updated_at | TIMESTAMP | DEFAULT NOW | Date de modification |

**Index** :
- `idx_products_category` sur `category_id`
- `idx_products_available` sur `is_available`

**Exemple** :
```sql
INSERT INTO products (category_id, name, description, price, preparation_time, allergens)
VALUES (1, 'Foie Gras Maison', 'Foie gras de canard mi-cuit', 28.00, 10, ARRAY['gluten']);
```

---

### 4. restaurant_tables

Tables physiques du restaurant.

```sql
CREATE TABLE restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    status table_status DEFAULT 'AVAILABLE',
    qr_code VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| table_number | VARCHAR(10) | UNIQUE, NOT NULL | Numéro de table (ex: T01) |
| capacity | INTEGER | NOT NULL, > 0 | Nombre de places |
| status | table_status | DEFAULT 'AVAILABLE' | Statut de la table |
| qr_code | VARCHAR(500) | NULL | URL du QR code |
| created_at | TIMESTAMP | DEFAULT NOW | Date de création |
| updated_at | TIMESTAMP | DEFAULT NOW | Date de modification |

**Exemple** :
```sql
INSERT INTO restaurant_tables (table_number, capacity, status)
VALUES ('T01', 2, 'AVAILABLE');
```

---

### 5. orders

Commandes passées par les clients.

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    table_id INTEGER REFERENCES restaurant_tables(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status order_status DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| user_id | INTEGER | FK, NULL | Client ayant passé commande |
| table_id | INTEGER | FK, NULL | Table associée |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | Numéro de commande |
| status | order_status | DEFAULT 'PENDING' | Statut de la commande |
| total_amount | DECIMAL(10,2) | NOT NULL, >= 0 | Montant total |
| notes | TEXT | NULL | Notes spéciales |
| created_at | TIMESTAMP | DEFAULT NOW | Date de création |
| updated_at | TIMESTAMP | DEFAULT NOW | Date de modification |

**Index** :
- `idx_orders_user` sur `user_id`
- `idx_orders_table` sur `table_id`
- `idx_orders_status` sur `status`
- `idx_orders_created` sur `created_at DESC`

**Exemple** :
```sql
INSERT INTO orders (user_id, table_id, order_number, total_amount, notes)
VALUES (3, 1, 'ORD-2026-0001', 45.50, 'Sans oignons');
```

---

### 6. order_items

Détails des produits dans chaque commande.

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Identifiant unique |
| order_id | INTEGER | FK, NOT NULL | Commande associée |
| product_id | INTEGER | FK, NOT NULL | Produit commandé |
| quantity | INTEGER | NOT NULL, > 0 | Quantité |
| unit_price | DECIMAL(10,2) | NOT NULL, >= 0 | Prix unitaire à la commande |
| subtotal | DECIMAL(10,2) | NOT NULL, >= 0 | Sous-total (prix × quantité) |
| special_instructions | TEXT | NULL | Instructions spéciales |
| created_at | TIMESTAMP | DEFAULT NOW | Date de création |

**Index** :
- `idx_order_items_order` sur `order_id`
- `idx_order_items_product` sur `product_id`

**Exemple** :
```sql
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
VALUES (1, 2, 1, 16.00, 16.00);
```

---

## Types énumérés (ENUM)

### user_role

Rôles des utilisateurs.

```sql
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'WAITER', 'ADMIN');
```

| Valeur | Description |
|--------|-------------|
| CUSTOMER | Client (accès app mobile) |
| WAITER | Serveur (accès app web, gestion commandes) |
| ADMIN | Administrateur (accès complet) |

---

### order_status

Statuts des commandes.

```sql
CREATE TYPE order_status AS ENUM ('PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');
```

| Valeur | Description |
|--------|-------------|
| PENDING | En attente de traitement |
| PREPARING | En cours de préparation |
| READY | Prêt à être servi |
| DELIVERED | Servi au client |
| CANCELLED | Commande annulée |

---

### table_status

Statuts des tables.

```sql
CREATE TYPE table_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED');
```

| Valeur | Description |
|--------|-------------|
| AVAILABLE | Table disponible |
| OCCUPIED | Table occupée |
| RESERVED | Table réservée |

---

## Vue matérialisée

### order_details

Vue combinant informations de commande et items.

```sql
CREATE VIEW order_details AS
SELECT 
    o.id AS order_id,
    o.order_number,
    o.status,
    o.total_amount,
    o.created_at AS order_date,
    u.first_name || ' ' || u.last_name AS customer_name,
    u.email AS customer_email,
    rt.table_number,
    json_agg(
        json_build_object(
            'product_name', p.name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
        )
    ) AS items
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
GROUP BY o.id, o.order_number, o.status, o.total_amount, o.created_at,
         u.first_name, u.last_name, u.email, rt.table_number;
```

**Utilisation** :
```sql
SELECT * FROM order_details WHERE status = 'PENDING';
```

---

## Triggers

### Mise à jour automatique de updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- (similaire pour categories, products, restaurant_tables, orders)
```

---

## Contraintes d'intégrité

### Clés étrangères

1. **products.category_id → categories.id**
   - `ON DELETE CASCADE` : Supprime les produits si catégorie supprimée

2. **orders.user_id → users.id**
   - `ON DELETE SET NULL` : Garde la commande même si utilisateur supprimé

3. **orders.table_id → restaurant_tables.id**
   - `ON DELETE SET NULL` : Garde la commande même si table supprimée

4. **order_items.order_id → orders.id**
   - `ON DELETE CASCADE` : Supprime les items si commande supprimée

5. **order_items.product_id → products.id**
   - `ON DELETE RESTRICT` : Empêche suppression produit si commandé

### Contraintes CHECK

```sql
-- Prix positifs
CHECK (price >= 0)
CHECK (total_amount >= 0)

-- Quantités positives
CHECK (quantity > 0)
CHECK (capacity > 0)
```

---

## Requêtes courantes

### Récupérer tous les produits avec leur catégorie

```sql
SELECT p.*, c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_available = true
ORDER BY c.display_order, p.name;
```

### Récupérer les commandes d'aujourd'hui

```sql
SELECT * FROM order_details
WHERE DATE(order_date) = CURRENT_DATE
ORDER BY order_date DESC;
```

### Statistiques du jour

```sql
SELECT
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_orders,
    SUM(CASE WHEN status = 'PREPARING' THEN 1 ELSE 0 END) as preparing_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value
FROM orders
WHERE created_at >= CURRENT_DATE;
```

### Produits les plus commandés

```sql
SELECT 
    p.name,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY times_ordered DESC
LIMIT 10;
```

---

## Performance

### Index créés

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order Items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

### Optimisations

1. **Pool de connexions** : 20 connexions maximum
2. **Requêtes préparées** : Protection SQL injection + cache
3. **Transactions** : Pour opérations complexes (création commande)
4. **VACUUM** : Maintenance automatique PostgreSQL

---

## Backup et Restauration

### Backup

```bash
# Backup complet
pg_dump -U smartcafe smartcafe_db > backup.sql

# Backup avec compression
pg_dump -U smartcafe -Fc smartcafe_db > backup.dump
```

### Restauration

```bash
# Depuis SQL
psql -U smartcafe smartcafe_db < backup.sql

# Depuis dump compressé
pg_restore -U smartcafe -d smartcafe_db backup.dump
```

---

## Sécurité

### Bonnes pratiques appliquées

1. **Mots de passe hashés** : bcrypt avec 10 rounds
2. **Requêtes paramétrées** : Protection SQL injection
3. **Connexion sécurisée** : SSL en production
4. **Utilisateur dédié** : Pas de superuser
5. **Principe du moindre privilège** : Permissions minimales

### Permissions

```sql
-- Utilisateur de l'application
CREATE USER smartcafe_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE smartcafe_db TO smartcafe_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO smartcafe_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO smartcafe_app;
```

---

## Maintenance

### Commandes utiles

```sql
-- Taille de la base
SELECT pg_size_pretty(pg_database_size('smartcafe_db'));

-- Tables les plus volumineuses
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Nombre de lignes par table
SELECT 
    schemaname,
    relname,
    n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

---

## Migration

Pour ajouter de nouvelles fonctionnalités, créer des scripts de migration :

```sql
-- migrations/001_add_loyalty_program.sql
CREATE TABLE loyalty_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Conclusion

La base de données est conçue pour être :
- **Performante** : Index sur colonnes critiques
- **Sécurisée** : Contraintes d'intégrité strictes
- **Maintenable** : Structure claire et documentée
- **Évolutive** : Facile à étendre avec nouvelles tables
