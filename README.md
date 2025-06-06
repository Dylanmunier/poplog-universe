# poplog-universe
 Universe – Planification du développement

# 🗺️ README - Exchange Personnel Automatisé (Node.js + Binance API + Google AI)

## 🌟 Objectif du projet

Concevoir un exchange personnel qui permet :

* de s’authentifier localement (sans base de données),
* d'interagir avec l’API Binance pour lire les données et envoyer des ordres,
* d'utiliser Google AI (via Gemini API) pour analyser les marchés,
* et de déployer le tout facilement pour exécuter des tâches à distance via une interface simple.

---

## 📅 Roadmap de développement

### ✅ Phase 1 - Squelette de l'application

* [x] Initialiser projet Node.js
* [x] Configurer le backend Express (dossier `backend/`)
* [x] Créer une authentification basée sur `USERNAME` et `PASSWORD` (.env)
* [x] Ajouter les clés `BINANCE_API_KEY` et `GOOGLE_AI_API_KEY` dans `.env`
* [x] Créer le frontend avec HTML + TailwindCSS (dossier `frontend/`)

### 🔧 Phase 2 - Intégration des APIs

* [ ] Connecter l’API Binance (lecture solde, prix des actifs, exécution d’ordres)
* [ ] Intégrer Google AI (Gemini/Vertex AI) pour l’analyse de tendance
* [ ] Construire une fonction d’analyse automatisée qui utilise les données de Binance et Google AI

### ⚖️ Phase 3 - Stratege et automatisation

* [ ] Définir des stratégies simples (take profit, stop loss, DCA)
* [ ] Lancer automatiquement les ordres Binance selon ces règles
* [ ] Gérer l’exécution en asynchrone

### 🚨 Phase 4 - Interface de contrôle

* [ ] Créer un dashboard basique (HTML/Tailwind)
* [ ] Contrôler l’activation des stratégies depuis l’interface
* [ ] Ajouter un système de logs (fichier local .log)

### 🚀 Phase 5 - Déploiement et tests

* [ ] Tester les appels API avec sandbox Binance
* [ ] Lancer en condition réelle avec surveillance active
* [ ] Déployer sur serveur perso / cloud avec Node.js en mode service

---

## 📊 Structure du projet

```
backend/           # Serveur Express
frontend/          # Interface utilisateur en HTML + TailwindCSS
.env               # Fichier d’environnement (jamais versionné)
README.md          # Document actuel
package.json       # Dépendances Node.js
```

---

## 📁 Exemple de contenu `.env`

```
USERNAME=admin
PASSWORD=secretpassword
SESSION_SECRET=supersecretkey
BINANCE_API_KEY=ta_cle_api_binance
GOOGLE_AI_API_KEY=ta_cle_google_ai
PORT=3000
```

---

## ⛔️ Avertissement

Ce projet est strictement personnel et expérimental. Ne jamais exposer vos clés API. Prévoir une authentification sécurisée si vous envisagez une ouverture réseau.

---

## 🎓 Liens utiles

* [Binance API](https://binance-docs.github.io/apidocs/spot/en/)
* [Google Gemini API](https://ai.google.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [ExpressJS](https://expressjs.com/)
