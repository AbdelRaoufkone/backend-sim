// src/api.js
import express from 'express';
import { generateFullData } from './dataGenerator.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Endpoint pour générer des données
app.get('/api/:type', (req, res) => {
  const { type } = req.params;
  const { count } = req.query;

  try {
    const data = generateFullData(type, parseInt(count, 10) || 1);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Fonction pour démarrer le serveur
export function simApiServer() {
  app.listen(PORT, () => {
    console.log(`API server is running at http://localhost:${PORT}`);
  });
}
