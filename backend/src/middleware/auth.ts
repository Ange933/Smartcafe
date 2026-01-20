/**
 * Middleware d'authentification et d'autorisation
 * Vérifie le token JWT et les rôles utilisateurs
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '../types';

/**
 * Middleware pour vérifier l'authentification
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Récupère le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
      return;
    }

    const token = authHeader.substring(7); // Enlève "Bearer "
    const decoded = verifyToken(token);

    // Attache les infos utilisateur à la requête
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

/**
 * Middleware pour vérifier les rôles autorisés
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé pour votre rôle'
      });
      return;
    }

    next();
  };
};
