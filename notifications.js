// notifications.js — module d'envoi d'alertes (exemple Telegram)
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/config/.env' });

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(message) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return { error: 'Config Telegram manquante' };
  // Import dynamique node-fetch compatible ESM/CommonJS/Node 20+
  const fetch = await import('node-fetch').then(mod => mod.default);
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
  });
  return await res.json();
}

module.exports = { sendTelegramAlert };
