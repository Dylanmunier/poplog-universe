// backtest.js — module de backtest simple (simulation sur logs d'analyse)
const fs = require('fs');
const path = require('path');

function runBacktest({ symbol = 'BTCUSDT', date, takeProfit = 5, stopLoss = 2, mode = 'ia' }) {
  const logPath = path.join(__dirname, 'logs', 'analysis', `${date}.log`);
  if (!fs.existsSync(logPath)) return { error: 'Aucun log pour cette date' };
  const raw = fs.readFileSync(logPath, 'utf-8');
  const analyses = JSON.parse('[' + raw.trim().replace(/,$/, '') + ']');
  let pnl = 0, nbTrades = 0, nbWin = 0, nbLoss = 0, maxDrawdown = 0, winrate = 0;
  let equity = 100, peak = 100, trough = 100;
  let position = null, entryPrice = null;
  if (mode === 'ia') {
    // Utilise les signaux IA (buy/sell dans les logs)
    analyses.forEach(a => {
      if (a.symbol !== symbol) return;
      if (!position && a.ordre?.type === 'buy') {
        position = parseFloat(a.price);
        entryPrice = position;
      } else if (position && a.ordre?.type === 'sell') {
        const exit = parseFloat(a.price);
        const diff = (exit - position) / position * 100;
        pnl += diff;
        equity *= (1 + diff / 100);
        peak = Math.max(peak, equity);
        trough = Math.min(trough, equity);
        const dd = (peak - equity) / peak * 100;
        maxDrawdown = Math.max(maxDrawdown, dd);
        nbTrades++;
        if (diff >= takeProfit) nbWin++;
        else if (diff <= -stopLoss) nbLoss++;
        position = null;
      }
    });
    winrate = nbTrades ? (nbWin / nbTrades * 100).toFixed(1) : 0;
    return { symbol, date, mode, pnl: pnl.toFixed(2), nbTrades, nbWin, nbLoss, winrate, maxDrawdown: maxDrawdown.toFixed(2) };
  }
  if (mode === 'manual') {
    // Buy&Hold : entrée sur premier prix, sortie sur dernier
    const prices = analyses.filter(a => a.symbol === symbol).map(a => parseFloat(a.price)).filter(Boolean);
    if (prices.length < 2) return { symbol, date, mode, error: 'Pas assez de données' };
    const diff = (prices[prices.length - 1] - prices[0]) / prices[0] * 100;
    pnl = diff;
    // Simule drawdown max sur la série de prix
    let localPeak = prices[0], localDD = 0;
    prices.forEach(p => {
      if (p > localPeak) localPeak = p;
      const dd = (localPeak - p) / localPeak * 100;
      if (dd > localDD) localDD = dd;
    });
    return { symbol, date, mode, pnl: pnl.toFixed(2), nbTrades: 1, nbWin: pnl > 0 ? 1 : 0, nbLoss: pnl <= 0 ? 1 : 0, winrate: pnl > 0 ? 100 : 0, maxDrawdown: localDD.toFixed(2) };
  }
  if (mode === 'real') {
    // Rejoue les ordres historiques (side/quantity dans les logs, sinon fallback buy&hold)
    const orders = analyses.filter(a => a.symbol === symbol && a.side && a.quantity);
    if (orders.length < 2) {
      // Fallback buy&hold
      return runBacktest({ symbol, date, takeProfit, stopLoss, mode: 'manual' });
    }
    let pos = null, entry = null;
    orders.forEach(o => {
      if (!pos && o.side.toLowerCase() === 'buy') {
        pos = parseFloat(o.price);
        entry = pos;
      } else if (pos && o.side.toLowerCase() === 'sell') {
        const exit = parseFloat(o.price);
        const diff = (exit - pos) / pos * 100;
        pnl += diff;
        equity *= (1 + diff / 100);
        peak = Math.max(peak, equity);
        trough = Math.min(trough, equity);
        const dd = (peak - equity) / peak * 100;
        maxDrawdown = Math.max(maxDrawdown, dd);
        nbTrades++;
        if (diff >= takeProfit) nbWin++;
        else if (diff <= -stopLoss) nbLoss++;
        pos = null;
      }
    });
    winrate = nbTrades ? (nbWin / nbTrades * 100).toFixed(1) : 0;
    return { symbol, date, mode, pnl: pnl.toFixed(2), nbTrades, nbWin, nbLoss, winrate, maxDrawdown: maxDrawdown.toFixed(2) };
  }
  return { symbol, date, mode, error: 'Mode inconnu' };
}

module.exports = { runBacktest };
