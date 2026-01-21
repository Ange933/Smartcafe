/**
 * Contrôleur des commandes
 * Gère la création et le suivi des commandes
 */

import { Request, Response } from 'express';
import pool from '../config/database';

/**
 * Récupérer toutes les commandes (filtrable par statut)
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const user = (req as any).user;

    let query = 'SELECT * FROM order_details';
    const params: any[] = [];

    // Si client, ne voir que ses propres commandes
    if (user.role === 'CUSTOMER') {
      params.push(user.id);
      query += ` WHERE customer_email = (SELECT email FROM users WHERE id = $${params.length})`;
    }

    // Filtrer par statut si spécifié
    if (status) {
      params.push(status);
      if (params.length === 1) {
        query += ` WHERE status = $${params.length}`;
      } else {
        query += ` AND status = $${params.length}`;
      }
    }

    query += ' ORDER BY order_date DESC';

    const result = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    });
  }
};

/**
 * Récupérer une commande par ID
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const result = await pool.query(
      'SELECT * FROM order_details WHERE order_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
      return;
    }

    const order = result.rows[0];

    // Vérifier les permissions (client ne peut voir que ses commandes)
    if (user.role === 'CUSTOMER' && order.customer_email !== user.email) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette commande'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    });
  }
};

/**
 * Créer une nouvelle commande
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { table_id, items, notes } = req.body;
    const user = (req as any).user;

    // Validation
    if (!items || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'La commande doit contenir au moins un produit'
      });
      await client.query('ROLLBACK');
      return;
    }

    // Générer un numéro de commande unique
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now()}`;

    // Calculer le montant total
    let totalAmount = 0;
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price, is_available FROM products WHERE id = $1',
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `Produit ${item.product_id} non trouvé`
        });
        await client.query('ROLLBACK');
        return;
      }

      if (!productResult.rows[0].is_available) {
        res.status(400).json({
          success: false,
          message: `Produit ${item.product_id} non disponible`
        });
        await client.query('ROLLBACK');
        return;
      }

      const price = parseFloat(productResult.rows[0].price);
      totalAmount += price * item.quantity;
    }

    // Créer la commande
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, table_id, order_number, total_amount, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user.id, table_id, orderNumber, totalAmount, notes]
    );

    const order = orderResult.rows[0];

    // Créer les items de commande
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );

      const unitPrice = parseFloat(productResult.rows[0].price);
      const subtotal = unitPrice * item.quantity;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, special_instructions)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.quantity, unitPrice, subtotal, item.special_instructions]
      );
    }

    // Mettre à jour le statut de la table si spécifiée
    if (table_id) {
      await client.query(
        "UPDATE restaurant_tables SET status = 'OCCUPIED' WHERE id = $1",
        [table_id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: order
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    });
  } finally {
    client.release();
  }
};

/**
 * Mettre à jour le statut d'une commande (WAITER/ADMIN)
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
    
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
      return;
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Statut de la commande mis à jour',
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
 * Récupérer les statistiques des commandes (ADMIN)
 */
export const getOrderStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const filters: string[] = ['created_at >= CURRENT_DATE'];
    const params: any[] = [];

    if (user?.role === 'WAITER') {
      params.push(user.id);
      filters.push(`user_id = $${params.length}`);
    }

    const statsResult = await pool.query(`
      SELECT
        SUM(CASE WHEN status != 'CANCELLED' THEN 1 ELSE 0 END) as total_orders,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'PREPARING' THEN 1 ELSE 0 END) as preparing_orders,
        SUM(CASE WHEN status = 'READY' THEN 1 ELSE 0 END) as ready_orders,
        SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status = 'READY' THEN total_amount ELSE 0 END) as total_revenue,
        AVG(total_amount) as average_order_value
      FROM orders
      WHERE ${filters.join(' AND ')}
    `, params);

    res.status(200).json({
      success: true,
      data: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};
