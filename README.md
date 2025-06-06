# poplog-universe
 Universe – Planification du développement

# 📘 README - Exchange Personnel Automatisé (Node.js + Binance API + Google AI)

## 🔍 Présentation du projet

Ce projet a pour but de créer une **application d’échange crypto personnelle** capable de :

* Se connecter à Binance via son API pour lire les soldes, les prix et envoyer des ordres.
* Utiliser les capacités de **Google AI** (Gemini API, Vertex AI...) pour analyser les tendances du marché.
* Exécuter des **stratégies de trading automatisées**, le tout sans base de données locale.
* Rester **local et sécurisé**, avec une configuration simple à travers `.env` ou des fichiers JSON.

## 🧠 Méthodologie de développement

### ✔️ Ce qu'on fait

* Utilisation de **Node.js** pour toute la logique applicative.
* Frontend statique avec **HTML + TailwindCSS** pour une interface simple.
* Backend **Express** avec endpoints protégés (via un identifiant/mot de passe issu de `.env`).
* Toutes les données sont récupérées en **temps réel depuis les APIs** (Binance, Google AI).

### ❌ Ce qu'on NE fait PAS

* **Aucune base de données** interne ou externe : pas de MongoDB, PostgreSQL, etc.
* Pas de stockage des utilisateurs ni des historiques dans des tables persistantes.
* Pas d’hébergement cloud externe avec exposition publique.

### 🧾 Règles d’or du projet

1. **Simplicité** : code lisible, modulaire, sans surcouche inutile.
2. **Sécurité** : jamais exposer les clés API, tout passe par un `.env` local.
3. **Temps réel uniquement** : aucune donnée ne doit être persistée au-delà de la session.
4. **Contrôle humain possible** : l'utilisateur peut désactiver/activer l'automatisation à tout moment.

## 🎨 Thème et interface

* L’interface utilisateur est minimaliste, claire et en mode sombre (via TailwindCSS).
* Possibilité d’intégrer un thème clair si besoin.

## 🧩 Configuration & paramétrages via `.env`

```env
USERNAME=admin
PASSWORD=monmotdepasse
SESSION_SECRET=supersecret
BINANCE_API_KEY=cle_binance
BINANCE_API_SECRET=secret_binance
GOOGLE_AI_API_KEY=cle_google_ai
PORT=3000
STRATEGY_TAKE_PROFIT=5
STRATEGY_STOP_LOSS=2
```

## 📂 Structure du projet

```
backend/           # Serveur Express.js (logique API)
frontend/          # Interface HTML + TailwindCSS
.env               # Variables d’environnement locales
README.md          # Présentation du projet
roadmap.md         # Plan de développement détaillé
package.json       # Dépendances Node.js
```

## 🎛️ Stratégies de trading configurables

* `TAKE_PROFIT` : niveau cible de bénéfice en %
* `STOP_LOSS` : niveau de perte max acceptable
* `DCA_INTERVAL` : temps entre deux achats en DCA (si activé)
* `AI_MODE` : mode d’analyse (agressif, modéré, conservateur)

Toutes ces options peuvent être modifiées via fichier de configuration `.env` ou `config.json` à venir.

## 🛡️ Sécurité

* Le projet ne doit jamais exposer ses clés, ni être déployé sur un serveur public sans chiffrement.
* Une protection basique par identifiant/mot de passe est activée par défaut.
* Le backend est strictement local sauf tunnel privé (type `localhost.run`, `ngrok` pour test).

## 🧠 Modules d’analyse IA

* Deux fichiers de scripts IA sont prévus :

  1. `analyze-market.js` : envoie les données à Google AI pour analyse.
  2. `generate-strategy.js` : génère des décisions de trading à partir de l’analyse.

Ces fichiers seront utilisés comme **copilotes de décision** pour la stratégie automatisée.

---

## ✨ À venir

* Interface de configuration dynamique.
* Ajout de presets de stratégie (défensif, agressif, équilibré).
* Option d’historique local chiffré pour logs stratégiques.

---

module de journalisation d’analyse intelligente avec stockage en temps réel dans des fichiers .log et réutilisation automatique dans tes stratégies.

✅ Objectif du module
Créer un système qui :

📥 Récolte toutes les analyses de marché générées (via Google AI ou autres),

📝 Les sauvegarde dans des fichiers .log horodatés en temps réel,

♻️ Les relit automatiquement pour les intégrer dans les stratégies de trading,

📊 Permet un suivi et une amélioration continue (profits, patterns, risques, etc.).

🔧 Structure proposée
bash
Copier le code
logs/
  └── analysis/
       ├── 2025-06-05.log
       ├── 2025-06-06.log
       └── ...
Chaque fichier .log contiendra les analyses complètes du jour sous forme JSON ou texte formaté.

📂 Exemple de contenu logs/analysis/2025-06-05.log
json
Copier le code
[
  {
    "timestamp": "2025-06-05T12:10:45Z",
    "pair": "BTC/USDT",
    "trend": "bullish",
    "risk_score": 0.23,
    "recommendation": "BUY",
    "confidence": 92,
    "source": "Gemini-Pro-V1"
  },
  {
    "timestamp": "2025-06-05T12:25:10Z",
    "pair": "ETH/USDT",
    "trend": "bearish",
    "risk_score": 0.66,
    "recommendation": "SELL",
    "confidence": 74,
    "source": "Gemini-Pro-V1"
  }
]
⚙️ Script Node.js : logAnalysis.js
js
Copier le code
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

module.exports = { saveAnalysis };
📥 Tu peux l'utiliser comme ceci dans ton code principal :

js
Copier le code
const { saveAnalysis } = require('./logAnalysis');

saveAnalysis({
  pair: 'BTC/USDT',
  trend: 'bullish',
  risk_score: 0.15,
  recommendation: 'BUY',
  confidence: 89,
  source: 'Gemini-Pro-V1'
});
♻️ Relecture automatique pour l’IA / Stratégies
Ajoute une fonction pour charger les logs récents :

js
Copier le code
function loadRecentAnalyses(daysBack = 3) {
  const analyses = [];
  const logDir = path.join(__dirname, 'logs', 'analysis');
  for (let i = 0; i < daysBack; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const logPath = path.join(logDir, `${date}.log`);
    if (fs.existsSync(logPath)) {
      const raw = fs.readFileSync(logPath, 'utf-8');
      const entries = JSON.parse(`[${raw.trim().slice(0, -1)}]`); // Format JSON array
      analyses.push(...entries);
    }
  }
  return analyses;
}
🎯 Résultat
Tu as un système autonome qui archive tout.

Tu peux visualiser les logs dans une future UI (chart historique, table, etc.).

Tu bases tes décisions sur l’historique d’analyse de ton IA pour booster ton ROI.

## ✅ Avancement Roadmap (checklist automatique)

- [x] Créer un dépôt Git pour le projet.
- [x] Choisir un langage principal (Node.js)
- [x] Configurer un `.env` sécurisé pour les clés API Binance.
- [x] Installer les SDK/API nécessaires :
  - [x] Binance API
  - [x] Google AI (Gemini)
- [x] Créer un fichier de config pour les stratégies (JSON)
- [x] Authentification via API Key/Secret.
- [x] Endpoint pour récupérer :
  - [x] Solde actuel
  - [x] Prix en temps réel
  - [ ] Historique des transactions (à faire)
- [x] Test d’envoi d’un ordre d’achat et de vente (simulation OK)
- [x] Envoyer les données de marché à Google AI pour analyse :
  - [x] Tendance
  - [x] Risque estimé
  - [x] Suggestions de position
- [x] Intégrer un système de requêtes régulières (UI + backend)
- [x] Afficher la stratégie recommandée (UI)
- [x] Créer un moteur de stratégie local (brique IA + logs)
- [x] Journalisation des actions locales dans un fichier `.log`.
- [x] Interface locale avec contrôle manuel (dashboard web)
- [ ] Historique des transactions (à faire)
- [ ] Alertes (à faire)
- [ ] Notifications (à faire)
- [ ] Backtest en live (à faire)
- [ ] Simulation multi-paires (à faire)
- [ ] Audit des performances (à faire)
- [ ] Packaging final (à faire)
- [ ] Documentation utilisateur (à faire)

## Prochaine étape Roadmap

- Ajouter un endpoint pour l’historique des transactions Binance (`/api/trades`)
- Préparer la structure pour alertes et notifications (Telegram/mail/Discord)
- Préparer le backtest et l’audit de performance

---

## 🚀 Roadmap                  
### Étapes de développement
Toujours mettre à jour le fichier `roadmap.md` pour suivre l'évolution du projet.

Pour suivre l'évolution, consultez le fichier `roadmap.md`. 'copilot' de trading personnel, ce projet est conçu pour être un outil d'apprentissage et de test personnel, pas un produit commercial.

---

## ⚠️ Avertissement

SECURISER LES FONDS AVANT TOUTE UTILISATION !
Les fonds doivent être sécurisés avant toute utilisation de ce projet. Ne jamais utiliser des clés API avec des permissions de trading sur des fonds importants sans avoir testé le système en profondeur.

## ⚠️ Avertissement

NE JAMAIS FAIRE CONFIANCE À UN SYSTÈME AUTOMATISÉ SANS TESTS APPROFONDIS !
Faites toujours vos propres recherches et tests avant de déployer des stratégies de trading automatisées. Ce projet est un **outil d'apprentissage** et ne doit pas être utilisé pour des transactions réelles sans validation approfondie. 

## ⚠️ Avertissement           
Testez des transaction en mode démo avant de passer en production réelle. 

## ⚠️ Avertissement
Utilisez testnet pour les tests avant de passer en production réelle.

Projet personnel, festiné à un usage commercial. **Utilisez-le à vos risques et périls.**

**Projet personnel sous licence privée, à ne pas utiliser en production sans vérification.**
