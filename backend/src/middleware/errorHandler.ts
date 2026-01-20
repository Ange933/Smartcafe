/**
 * Middleware de gestion centralisée des erreurs
 * Principe KISS : gestion simple et claire des erreurs
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Gestionnaire global d'erreurs
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erreur:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Gestionnaire pour les routes non trouvées
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
  });
};
