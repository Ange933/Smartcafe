/**
 * Configuration de la connexion à la base de données PostgreSQL
 * Utilise le pattern Singleton pour garantir une seule instance de connexion
 */

import { Pool } from 'pg';

// Configuration de la connexion à partir des variables d'environnement
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'smartcafe_db',
  user: process.env.DB_USER || 'smartcafe',
  password: process.env.DB_PASSWORD || 'smartcafe123',
  max: 20, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('Erreur inattendue avec le client PostgreSQL', err);
  process.exit(-1);
});

// Test de connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
  } else {
    console.log('Connexion à PostgreSQL établie avec succès');
    release();
  }
});

export default pool;
