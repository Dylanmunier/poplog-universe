// Point d'entrée principal du backend (CommonJS)
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const binance = require('binance-api-node').default;
const { analyzeMarket } = require('./analyze-market');
const { saveAnalysis } = require('./logAnalysis');

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

// Endpoint d'analyse IA croisée Binance + Google Gemini
app.get('/api/analyze', async (req, res) => {
  const symbol = req.query.symbol || 'BTCUSDT';
  try {
    const ticker = await client.prices({ symbol });
    const price = ticker[symbol];
    const aiResult = await analyzeMarket({ symbol, price });
    // Journalisation automatique
    saveAnalysis({ symbol, price, ...aiResult, source: 'Gemini' });
    res.json({ symbol, price, ...aiResult });
  } catch (e) {
    res.status(500).json({ error: 'Erreur analyse IA', details: e.message });
  }
});

app.get('/api/ping', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
