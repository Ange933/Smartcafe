/**
 * Contrôleur d'authentification
 * Gère l'inscription, la connexion et la vérification des utilisateurs
 * Principe SRP : une seule responsabilité = gestion de l'authentification
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { generateToken } from '../utils/jwt';
import { UserRole } from '../types';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, first_name, last_name, phone, role } = req.body;

    // Validation basique
    if (!email || !password || !first_name || !last_name) {
      res.status(400).json({
        success: false,
        message: 'Email, mot de passe, prénom et nom sont requis'
      });
      return;
    }

    // Vérifier si l'email existe déjà
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
      return;
    }

    // Hasher le mot de passe (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email, hashedPassword, first_name, last_name, phone, role || 'CUSTOMER']
    );

    const user = result.rows[0];

    // Générer le token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte'
    });
  }
};

/**
 * Création d'un serveur par un admin (prénom + nom uniquement)
 */
export const registerWaiter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, phone } = req.body;

    if (!first_name || !last_name) {
      res.status(400).json({
        success: false,
        message: 'Prénom et nom sont requis'
      });
      return;
    }

    const slugify = (value: string) =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '')
        .trim();

    const base = `${slugify(first_name)}.${slugify(last_name)}` || 'serveur';
    let email = `${base}@smartcafe.com`;
    let counter = 1;

    // Assurer un email unique
    while (true) {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (exists.rows.length === 0) break;
      email = `${base}${counter}@smartcafe.com`;
      counter += 1;
    }

    // Mot de passe temporaire simple
    const tempPassword = `serveur${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'WAITER')
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email, hashedPassword, first_name, last_name, phone || null]
    );

    const user = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Serveur créé avec succès',
      data: {
        user,
        credentials: {
          email,
          password: tempPassword
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du serveur'
    });
  }
};

/**
 * Connexion d'un utilisateur existant
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
      return;
    }

    // Récupérer l'utilisateur
    const result = await pool.query(
      'SELECT id, email, password, first_name, last_name, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
      return;
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
      return;
    }

    // Générer le token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, phone, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};
