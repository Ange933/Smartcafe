/**
 * Contrôleur des produits
 * Gère les opérations CRUD sur les produits du menu
 */

import { Request, Response } from 'express';
import pool from '../config/database';

/**
 * Récupérer tous les produits disponibles
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id } = req.query;

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true
    `;
    const params: any[] = [];

    // Filtrer par catégorie si spécifié
    if (category_id) {
      params.push(category_id);
      query += ` AND p.category_id = $${params.length}`;
    }

    query += ' ORDER BY c.display_order, p.name';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits'
    });
  }
};

/**
 * Récupérer un produit par ID
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit'
    });
  }
};

/**
 * Créer un nouveau produit (ADMIN uniquement)
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      image_url,
      preparation_time,
      allergens,
      is_vegetarian,
      is_vegan
    } = req.body;

    // Validation
    if (!category_id || !name || !price) {
      res.status(400).json({
        success: false,
        message: 'Catégorie, nom et prix sont requis'
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO products (
        category_id, name, description, price, image_url,
        preparation_time, allergens, is_vegetarian, is_vegan
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        category_id,
        name,
        description,
        price,
        image_url,
        preparation_time || 15,
        allergens,
        is_vegetarian || false,
        is_vegan || false
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit'
    });
  }
};

/**
 * Mettre à jour un produit (ADMIN uniquement)
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      category_id,
      name,
      description,
      price,
      image_url,
      is_available,
      preparation_time,
      allergens,
      is_vegetarian,
      is_vegan
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET category_id = COALESCE($1, category_id),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           image_url = COALESCE($5, image_url),
           is_available = COALESCE($6, is_available),
           preparation_time = COALESCE($7, preparation_time),
           allergens = COALESCE($8, allergens),
           is_vegetarian = COALESCE($9, is_vegetarian),
           is_vegan = COALESCE($10, is_vegan)
       WHERE id = $11
       RETURNING *`,
      [
        category_id,
        name,
        description,
        price,
        image_url,
        is_available,
        preparation_time,
        allergens,
        is_vegetarian,
        is_vegan,
        id
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit'
    });
  }
};

/**
 * Supprimer un produit (ADMIN uniquement)
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit'
    });
  }
};
