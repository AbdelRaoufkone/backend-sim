// src/index.js
import { generateFullData } from './dataGenerator.js';
import { simApiServer } from './api.js';

// Vérifier les arguments passés lors de l'exécution
if (process.argv.includes('--start-api')) {
  simApiServer(); // Démarrer l'API
} else {
  console.log('API non démarrée. Utilisez --start-api pour démarrer le serveur.');
}

// Exporter les fonctionnalités
export { generateFullData,simApiServer};
