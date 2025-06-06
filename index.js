// Point d'entrée principal du backend (CommonJS)
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const binance = require('binance-api-node').default;
const { analyzeMarket } = require('./analyze-market');
const { saveAnalysis } = require('./logAnalysis');
const { runBacktest } = require('./backtest');
const { sendTelegramAlert } = require('./notifications');

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

// Endpoint pour récupérer les soldes Binance
app.get('/api/balance', async (req, res) => {
  try {
    const account = await client.accountInfo();
    const balances = account.balances.filter(b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0);
    res.json({ balances });
  } catch (e) {
    res.status(500).json({ error: 'Erreur Binance', details: e.message });
  }
});

// Endpoint pour passer un ordre d'achat/vente (simulation si DISABLE_REAL_TRADES=true)
app.post('/api/order', express.json(), async (req, res) => {
  const { symbol, side, quantity } = req.body;
  if (!symbol || !side || !quantity) return res.status(400).json({ error: 'Paramètres manquants' });
  if (process.env.DISABLE_REAL_TRADES === 'true') {
    // Simulation
    saveAnalysis({
      symbol, side, quantity, simulated: true, timestamp: new Date().toISOString(), source: 'SimuOrder'
    });
    return res.json({ status: 'simulated', symbol, side, quantity });
  }
  try {
    const order = await client.order({ symbol, side, quantity });
    saveAnalysis({ symbol, side, quantity, orderId: order.orderId, timestamp: new Date().toISOString(), source: 'Order' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: 'Erreur envoi ordre', details: e.message });
  }
});

// Endpoint pour récupérer l'historique des transactions Binance (trades)
app.get('/api/trades', async (req, res) => {
  const symbol = req.query.symbol || 'BTCUSDT';
  try {
    const trades = await client.myTrades({ symbol });
    res.json({ trades });
  } catch (e) {
    res.status(500).json({ error: 'Erreur Binance', details: e.message });
  }
});

// Endpoint pour lancer un backtest simple sur les logs d'analyse
app.get('/api/backtest', (req, res) => {
  const { symbol = 'BTCUSDT', date, takeProfit = 5, stopLoss = 2 } = req.query;
  if (!date) return res.status(400).json({ error: 'Date requise (YYYY-MM-DD)' });
  const result = runBacktest({ symbol, date, takeProfit: Number(takeProfit), stopLoss: Number(stopLoss) });
  res.json(result);
});

// Endpoint pour envoyer une alerte Telegram (test manuel)
app.post('/api/alert', express.json(), async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message requis' });
  const result = await sendTelegramAlert(message);
  res.json(result);
});

app.get('/api/ping', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
