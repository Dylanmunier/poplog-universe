// Script de test rapide pour le module logAnalysis.js
const { saveAnalysis, loadRecentAnalyses } = require('./logAnalysis');

// Exemple d'analyse à sauvegarder
saveAnalysis({
  pair: 'BTC/USDT',
  trend: 'bullish',
  risk_score: 0.12,
  recommendation: 'BUY',
  confidence: 91,
  source: 'Test-Unit'
});

// Lecture des analyses récentes
const recent = loadRecentAnalyses(1);
console.log('Analyses récentes:', recent);
