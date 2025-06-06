# Module de journalisation d’analyse — `logAnalysis.js`

Ce module permet de sauvegarder et relire automatiquement les analyses de marché générées par l’IA ou d’autres scripts, dans des fichiers `.log` horodatés (un fichier par jour).

## Fonctions principales

- `saveAnalysis(data)` :
  - Enregistre une analyse (objet JS) dans le fichier du jour (`logs/analysis/YYYY-MM-DD.log`).
  - Ajoute automatiquement un timestamp ISO.

- `loadRecentAnalyses(daysBack = 3)` :
  - Charge les analyses des `daysBack` derniers jours (par défaut 3).
  - Retourne un tableau d’objets JS.

## Exemple d’utilisation

```js
const { saveAnalysis, loadRecentAnalyses } = require('./logAnalysis');

saveAnalysis({
  pair: 'BTC/USDT',
  trend: 'bullish',
  risk_score: 0.15,
  recommendation: 'BUY',
  confidence: 89,
  source: 'Gemini-Pro-V1'
});

const recent = loadRecentAnalyses(2);
console.log(recent);
```

## Format des logs

Chaque fichier `.log` contient une liste d’objets JSON, séparés par des virgules, exemple :

```json
[
  { "timestamp": "2025-06-06T12:10:45Z", "pair": "BTC/USDT", ... },
  { "timestamp": "2025-06-06T12:25:10Z", "pair": "ETH/USDT", ... }
]
```

## Sécurité & bonnes pratiques
- Ne jamais stocker de données sensibles dans les logs.
- Les logs servent uniquement à l’analyse stratégique et à l’amélioration continue.

---

**Module autonome, aucune dépendance externe requise.**
