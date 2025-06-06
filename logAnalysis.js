const fs = require('fs');
const path = require('path');

function saveAnalysis(data) {
  const logDir = path.join(__dirname, 'logs', 'analysis');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const today = new Date().toISOString().split('T')[0];
  const logPath = path.join(logDir, `${today}.log`);

  const logEntry = JSON.stringify({ ...data, timestamp: new Date().toISOString() }) + ',\n';
  fs.appendFileSync(logPath, logEntry);
}

function loadRecentAnalyses(daysBack = 3) {
  const analyses = [];
  const logDir = path.join(__dirname, 'logs', 'analysis');
  for (let i = 0; i < daysBack; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const logPath = path.join(logDir, `${date}.log`);
    if (fs.existsSync(logPath)) {
      const raw = fs.readFileSync(logPath, 'utf-8');
      const entries = JSON.parse(`[${raw.trim().slice(0, -1)}]`);
      analyses.push(...entries);
    }
  }
  return analyses;
}

module.exports = { saveAnalysis, loadRecentAnalyses };
