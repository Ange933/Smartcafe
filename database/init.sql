-- Script d'initialisation de la base de données Smart Café
-- PostgreSQL 15+

-- Création des types énumérés
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'WAITER', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');
CREATE TYPE table_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED');

-- Table des utilisateurs
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

-- Table des catégories de produits
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

-- Table des produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INTEGER DEFAULT 15, -- en minutes
    allergens TEXT[], -- tableau d'allergènes
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tables du restaurant
CREATE TABLE restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    status table_status DEFAULT 'AVAILABLE',
    qr_code VARCHAR(500), -- URL du QR code pour commander
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes
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

-- Table des items de commande
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

-- Index pour améliorer les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_tables_updated_at BEFORE UPDATE ON restaurant_tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données de démonstration

-- Utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (email, password, first_name, last_name, role, phone) VALUES
('admin@smartcafe.com', '$2b$10$SN/wQaCn8tDl6U16206KR.EF65GdeKVGJZZUbb/VWUWqpDdY0BvuK', 'Admin', 'Système', 'ADMIN', '+33612345678'),
('waiter@smartcafe.com', '$2b$10$SN/wQaCn8tDl6U16206KR.EF65GdeKVGJZZUbb/VWUWqpDdY0BvuK', 'Jean', 'Serveur', 'WAITER', '+33612345679'),
('client@smartcafe.com', '$2b$10$SN/wQaCn8tDl6U16206KR.EF65GdeKVGJZZUbb/VWUWqpDdY0BvuK', 'Marie', 'Client', 'CUSTOMER', '+33612345680');

-- Catégories
INSERT INTO categories (name, description, display_order, image_url) VALUES
('Entrées', 'Découvrez nos entrées raffinées', 1, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'),
('Plats Principaux', 'Nos plats signatures', 2, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'),
('Desserts', 'Douceurs et gourmandises', 3, 'https://images.unsplash.com/photo-1551024506-0bccd828d307'),
('Boissons', 'Sélection de boissons premium', 4, 'https://images.unsplash.com/photo-1544145945-f90425340c7e'),
('Cafés', 'Nos spécialités café', 5, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93');

-- Produits (Entrées)
INSERT INTO products (category_id, name, description, price, is_available, preparation_time, is_vegetarian, image_url) VALUES
(1, 'Foie Gras Maison', 'Foie gras de canard mi-cuit, chutney de figues', 28.00, TRUE, 10, FALSE, 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9'),
(1, 'Salade César Revisitée', 'Laitue romaine, poulet grillé, parmesan, croûtons maison', 16.00, TRUE, 12, FALSE, 'https://images.unsplash.com/photo-1546793665-c74683f339c1'),
(1, 'Velouté de Champignons', 'Crème de cèpes, huile de truffe, croûtons', 14.00, TRUE, 8, TRUE, 'https://images.unsplash.com/photo-1547592166-23ac45744acd');

-- Produits (Plats Principaux)
INSERT INTO products (category_id, name, description, price, is_available, preparation_time, allergens, image_url) VALUES
(2, 'Filet de Bœuf Rossini', 'Filet de bœuf, foie gras poêlé, sauce périgueux', 42.00, TRUE, 25, ARRAY['gluten'], 'https://images.unsplash.com/photo-1558030006-450675393462'),
(2, 'Pavé de Saumon', 'Saumon sauvage, risotto aux asperges, beurre citronné', 32.00, TRUE, 20, ARRAY['poisson', 'lactose'], 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'),
(2, 'Risotto aux Truffes', 'Riz carnaroli, truffe noire, parmesan', 28.00, TRUE, 18, ARRAY['lactose'], 'https://images.unsplash.com/photo-1476124369491-c_75654cbf746');

-- Produits (Desserts)
INSERT INTO products (category_id, name, description, price, is_available, preparation_time, is_vegetarian, image_url) VALUES
(3, 'Tarte Tatin', 'Pommes caramélisées, glace vanille', 12.00, TRUE, 10, TRUE, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3'),
(3, 'Fondant au Chocolat', 'Cœur coulant, glace pistache', 14.00, TRUE, 12, TRUE, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51'),
(3, 'Tiramisu Maison', 'Recette traditionnelle italienne', 11.00, TRUE, 5, TRUE, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9');

-- Produits (Boissons)
INSERT INTO products (category_id, name, description, price, is_available, preparation_time, is_vegan, image_url) VALUES
(4, 'Eau Minérale Naturelle', 'Evian 50cl', 5.00, TRUE, 2, TRUE, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2'),
(4, 'Jus Frais du Jour', 'Orange ou pamplemousse pressé', 8.00, TRUE, 5, TRUE, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'),
(4, 'Vin Rouge - Bordeaux', 'Château Margaux, verre 12cl', 15.00, TRUE, 3, TRUE, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3');

-- Produits (Cafés)
INSERT INTO products (category_id, name, description, price, is_available, preparation_time, is_vegan, image_url) VALUES
(5, 'Espresso', 'Café italien pur arabica', 3.50, TRUE, 3, TRUE, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04'),
(5, 'Cappuccino', 'Espresso, lait mousseux, cacao', 5.00, TRUE, 5, FALSE, 'https://images.unsplash.com/photo-1534778101976-62847782c213'),
(5, 'Latte Macchiato', 'Lait chaud, espresso en couches', 5.50, TRUE, 5, FALSE, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735');

-- Tables du restaurant
INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
('T01', 2, 'AVAILABLE'),
('T02', 2, 'AVAILABLE'),
('T03', 4, 'AVAILABLE'),
('T04', 4, 'AVAILABLE'),
('T05', 6, 'AVAILABLE'),
('T06', 6, 'AVAILABLE'),
('T07', 8, 'AVAILABLE'),
('T08', 2, 'AVAILABLE');

-- Commande exemple
INSERT INTO orders (user_id, table_id, order_number, status, total_amount, notes) VALUES
(3, 1, 'ORD-2026-0001', 'PENDING', 45.50, 'Sans oignons dans la salade');

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 2, 1, 16.00, 16.00),
(1, 5, 1, 32.00, 32.00),
(1, 10, 1, 3.50, 3.50);

-- Vue pour faciliter les requêtes
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

-- Afficher les informations de connexion
SELECT 'Base de données Smart Café initialisée avec succès!' AS message;
SELECT 'Utilisateurs créés:' AS info;
SELECT email, role FROM users;
