#!/bin/bash
# Script de déploiement local pour Copilot Trading

# 1. Installation des dépendances
npm install

# 2. Compilation TypeScript si besoin (optionnel)
if [ -f tsconfig.json ]; then
  npx tsc || true
fi

# 3. Lancement du backend (Node.js)
nohup node index.js > logs/server.log 2>&1 &
echo "Copilot Trading déployé et lancé en arrière-plan."
echo "Dashboard accessible sur http://localhost:3000"
