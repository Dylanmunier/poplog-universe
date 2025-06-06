// Module d'appel à Google Gemini (Vertex AI ou Gemini API)
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/config/.env' });

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_MODEL = process.env.GOOGLE_AI_MODEL || 'gemini-2.0-flash';

async function analyzeMarket({ symbol, price }) {
  // Prompt simple, à enrichir selon la stratégie
  const fetch = (...args) => import('node-fetch').then(mod => mod.default)(...args);
  const prompt = `Analyse la tendance crypto pour ${symbol} (prix actuel: ${price}). Donne une tendance (haussière/baissière/neutre), un score de confiance (0-100), un risque (0-10), et une suggestion d'ordre (buy/sell/hold). Réponds en JSON compact.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await response.json();
  // Extraction du JSON Gemini (format textuel)
  try {
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  } catch (e) {
    return { error: 'Analyse Gemini invalide', details: data };
  }
}

module.exports = { analyzeMarket };
