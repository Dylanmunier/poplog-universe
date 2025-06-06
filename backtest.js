// backtest.js — module de backtest simple (simulation sur logs d'analyse)
const fs = require('fs');
const path = require('path');

function runBacktest({ symbol = 'BTCUSDT', date, takeProfit = 5, stopLoss = 2 }) {
  const logPath = path.join(__dirname, 'logs', 'analysis', `${date}.log`);
  if (!fs.existsSync(logPath)) return { error: 'Aucun log pour cette date' };
  const raw = fs.readFileSync(logPath, 'utf-8');
  const analyses = JSON.parse('[' + raw.trim().replace(/,$/, '') + ']');
  let position = null;
  let pnl = 0;
  let nbTrades = 0;
  let nbWin = 0;
  let nbLoss = 0;
  analyses.forEach(a => {
    if (a.symbol !== symbol) return;
    if (!position && a.ordre?.type === 'buy') {
      position = parseFloat(a.price);
    } else if (position && a.ordre?.type === 'sell') {
      const diff = (parseFloat(a.price) - position) / position * 100;
      pnl += diff;
      nbTrades++;
      if (diff >= takeProfit) nbWin++;
      else if (diff <= -stopLoss) nbLoss++;
      position = null;
    }
  });
  return { symbol, date, pnl, nbTrades, nbWin, nbLoss };
}

module.exports = { runBacktest };
