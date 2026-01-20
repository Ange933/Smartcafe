/**
 * Point d'entrée principal de l'API Smart Café
 * Configure Express, les middlewares et démarre le serveur
 */

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Chargement des variables d'environnement
dotenv.config();

// Configuration de l'application Express
const app: Application = express();
const PORT = process.env.PORT || 3000;

/**
 * Configuration des Middlewares
 */

// CORS - Autoriser les requêtes cross-origin
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Parser JSON
app.use(express.json());

// Parser URL-encoded
app.use(express.urlencoded({ extended: true }));

// Logger simple pour le développement
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Routes de l'API
 */
app.use('/api', routes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API Smart Café',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

/**
 * Gestion des erreurs
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Démarrage du serveur
 */
app.listen(PORT, () => {
  console.log('========================================');
  console.log('Smart Café API démarrée avec succès');
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log('========================================');
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Arrêt du serveur...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app;
