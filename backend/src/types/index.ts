/**
 * Définition des types TypeScript pour l'application
 */

// Rôles des utilisateurs
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  WAITER = 'WAITER',
  ADMIN = 'ADMIN'
}

// Statuts de commande
export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Statuts de table
export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED'
}

// Interface utilisateur
export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface catégorie
export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Interface produit
export interface Product {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  preparation_time: number;
  allergens?: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  created_at: Date;
  updated_at: Date;
}

// Interface table de restaurant
export interface RestaurantTable {
  id: number;
  table_number: string;
  capacity: number;
  status: TableStatus;
  qr_code?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface commande
export interface Order {
  id: number;
  user_id?: number;
  table_id?: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface item de commande
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions?: string;
  created_at: Date;
}

// Type pour les requêtes Express avec utilisateur authentifié
export interface AuthRequest extends Express.Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}
