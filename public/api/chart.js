// Simple graphique de tendance avec Chart.js
// À inclure dans le dashboard pour visualiser l'évolution du prix ou de la confiance IA

export function renderLineChart(ctx, labels, data, label = 'Valeur', color = 'rgba(255, 206, 86, 1)') {
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color.replace('1)', '0.2)'),
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { display: true }, y: { display: true } }
    }
  });
}
