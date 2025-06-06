// rapport.js — Génération d’un rapport utilisateur à partir des logs d’analyse et d’alertes
const fs = require('fs');
const path = require('path');

function generateReport({ symbol = 'BTCUSDT', date }) {
  const logPath = path.join(__dirname, 'logs', 'analysis', `${date}.log`);
  if (!fs.existsSync(logPath)) return { error: 'Aucun log pour cette date' };
  const raw = fs.readFileSync(logPath, 'utf-8');
  const analyses = JSON.parse('[' + raw.trim().replace(/,$/, '') + ']');
  let nbOrders = 0, nbTP = 0, nbSL = 0, nbDCA = 0, pnl = 0;
  let tableAnalyses = '', tableAlertes = '';
  analyses.forEach(a => {
    if (a.symbol !== symbol) return;
    if (a.ordre) {
      nbOrders++;
      if (a.ordre.take_profit) nbTP++;
      if (a.ordre.stop_loss) nbSL++;
      if (a.ordre.dca) nbDCA++;
    }
    tableAnalyses += `| ${a.timestamp} | ${a.tendance||a.trend||'-'} | ${a.confiance||a.confidence||'-'} | ${a.risque||a.risk||'-'} | ${a.ordre?.type||a.recommendation||'-'} | ${a.ordre?.volume||'-'} |\n`;
    if (a.source && a.source.toLowerCase().includes('alert')) {
      tableAlertes += `- ${a.timestamp} : ${a.source} — ${JSON.stringify(a)}\n`;
    }
    if (a.ordre && a.ordre.type === 'sell' && a.price && a.ordre.entry) {
      pnl += ((parseFloat(a.price) - parseFloat(a.ordre.entry)) / parseFloat(a.ordre.entry)) * 100;
    }
  });
  return {
    symbol,
    date,
    nbAnalyses: analyses.length,
    nbOrders,
    nbTP,
    nbSL,
    nbDCA,
    pnl: pnl.toFixed(2),
    tableAnalyses,
    tableAlertes
  };
}

module.exports = { generateReport };
