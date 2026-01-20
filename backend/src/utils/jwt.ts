/**
 * Utilitaires pour la gestion des JWT (JSON Web Tokens)
 * Principe de Séparation des Responsabilités (SRP)
 */

import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_par_defaut_changez_moi';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
}

/**
 * Génère un token JWT pour un utilisateur
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};
