// Point d'entrée principal du backend (CommonJS)
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const binance = require('binance-api-node').default;

dotenv.config({ path: path.join(__dirname, 'config/.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir le dashboard statique
app.use(express.static(path.join(__dirname, 'public')));

const client = binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// Endpoint pour obtenir le prix spot d'une paire (ex: BTCUSDT)
app.get('/api/price', async (req, res) => {
  const symbol = req.query.symbol || 'BTCUSDT';
  try {
    const ticker = await client.prices({ symbol });
    res.json({ symbol, price: ticker[symbol] });
  } catch (e) {
    res.status(500).json({ error: 'Erreur Binance', details: e.message });
  }
});

app.get('/api/ping', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
