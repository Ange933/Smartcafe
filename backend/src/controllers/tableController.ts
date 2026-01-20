/**
 * Contrôleur des tables du restaurant
 * Gère les opérations CRUD sur les tables
 */

import { Request, Response } from 'express';
import pool from '../config/database';

/**
 * Récupérer toutes les tables
 */
export const getAllTables = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM restaurant_tables';
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` WHERE status = $${params.length}`;
    }

    query += ' ORDER BY table_number';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tables:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tables'
    });
  }
};

/**
 * Récupérer une table par ID
 */
export const getTableById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM restaurant_tables WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Table non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la table:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la table'
    });
  }
};

/**
 * Créer une nouvelle table (ADMIN)
 */
export const createTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { table_number, capacity } = req.body;

    if (!table_number || !capacity) {
      res.status(400).json({
        success: false,
        message: 'Numéro de table et capacité requis'
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO restaurant_tables (table_number, capacity)
       VALUES ($1, $2)
       RETURNING *`,
      [table_number, capacity]
    );

    res.status(201).json({
      success: true,
      message: 'Table créée avec succès',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de la table:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la table'
    });
  }
};

/**
 * Mettre à jour le statut d'une table (WAITER/ADMIN)
 */
export const updateTableStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
      return;
    }

    const result = await pool.query(
      'UPDATE restaurant_tables SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Table non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Statut de la table mis à jour',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};

/**
 * Supprimer une table (ADMIN)
 */
export const deleteTable = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM restaurant_tables WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Table non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Table supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la table:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la table'
    });
  }
};
