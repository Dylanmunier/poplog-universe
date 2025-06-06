// Point d'entrée principal du backend
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir le dashboard statique
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
