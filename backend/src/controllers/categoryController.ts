/**
 * Contrôleur des catégories
 * Gère les opérations CRUD sur les catégories de produits
 */

import { Request, Response } from 'express';
import pool from '../config/database';

/**
 * Récupérer toutes les catégories actives
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE is_active = true ORDER BY display_order ASC'
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
};

/**
 * Récupérer une catégorie par ID
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie'
    });
  }
};

/**
 * Créer une nouvelle catégorie (ADMIN uniquement)
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image_url, display_order } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Le nom de la catégorie est requis'
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO categories (name, description, image_url, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, image_url, display_order || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie'
    });
  }
};

/**
 * Mettre à jour une catégorie (ADMIN uniquement)
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image_url, display_order, is_active } = req.body;

    const result = await pool.query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           image_url = COALESCE($3, image_url),
           display_order = COALESCE($4, display_order),
           is_active = COALESCE($5, is_active)
       WHERE id = $6
       RETURNING *`,
      [name, description, image_url, display_order, is_active, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie'
    });
  }
};

/**
 * Supprimer une catégorie (ADMIN uniquement)
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie'
    });
  }
};
