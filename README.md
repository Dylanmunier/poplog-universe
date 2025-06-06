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

Pour suivre l'évolution, consultez le fichier `roadmap.md`.

**Projet personnel sous licence privée, à ne pas utiliser en production sans vérification.**
