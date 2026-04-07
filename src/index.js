// src/index.js
import 'dotenv/config';
import { generateFullData, SUPPORTED_TYPES } from './dataGenerator.js';
import { simApiServer } from './api.js';

if (process.argv.includes('--start-api')) {
  simApiServer();
} else if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  console.log('Use --start-api flag to start the API server.');
  console.log(`Supported types: ${SUPPORTED_TYPES.join(', ')}`);
}

export { generateFullData, simApiServer, SUPPORTED_TYPES };
