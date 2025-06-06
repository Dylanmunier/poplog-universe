// API frontend pour requêter le backend Express
// Utilisable dans le navigateur ou dans des scripts front

export async function getPrice(symbol = 'BTCUSDT') {
  const res = await fetch(`/api/price?symbol=${symbol}`);
  return await res.json();
}

export async function getAnalysis(symbol = 'BTCUSDT') {
  const res = await fetch(`/api/analyze?symbol=${symbol}`);
  return await res.json();
}
