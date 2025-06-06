"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Point d'entrée principal du backend
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { default: binance } = require('binance-api-node');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
// Correction __dirname pour CommonJS/ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
    }
    catch (e) {
        res.status(500).json({ error: 'Erreur Binance', details: e.message });
    }
});
// Correction du typage sur l'endpoint ping (suppression explicite des types, TS infère correctement)
app.get('/api/ping', (_req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
