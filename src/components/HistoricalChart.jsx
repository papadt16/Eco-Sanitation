import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function HistoricalChart({ history }) {
  const displayWindow = useMemo(() => history.slice(-40), [history]);

  const data = useMemo(() => {
    const labels = displayWindow.map((r) => r.receivedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    return {
      labels,
      datasets: [
        {
          label: 'Fill level (%)',
          data: displayWindow.map((r) => r.levelPct),
          borderColor: '#33ac74',
          backgroundColor: 'rgba(51,172,116,0.12)',
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: 'Methane (ppm)',
          data: displayWindow.map((r) => r.methanePpm),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.08)',
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          yAxisID: 'y1',
        },
      ],
    };
  }, [displayWindow]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { color: '#94a3b8', boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle' },
        },
        tooltip: {
          backgroundColor: '#172033',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#cbd5e1',
          padding: 10,
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#64748b', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
        },
        y: {
          type: 'linear',
          position: 'left',
          min: 0,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#33ac74', callback: (v) => `${v}%` },
          title: { display: true, text: 'Fill level', color: '#33ac74', font: { size: 11 } },
        },
        y1: {
          type: 'linear',
          position: 'right',
          min: 0,
          suggestedMax: 1000,
          grid: { drawOnChartArea: false },
          ticks: { color: '#f59e0b' },
          title: { display: true, text: 'Methane (ppm)', color: '#f59e0b', font: { size: 11 } },
        },
      },
    }),
    []
  );

  return (
    <div className="panel flex flex-col">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Historical Trend</p>
          <h3 className="font-display text-white font-semibold">Level &amp; gas over time</h3>
        </div>
        <span className="text-xs font-mono text-slate-500">Last {displayWindow.length} readings</span>
      </div>

      <div className="p-5 h-72">
        {displayWindow.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500 font-mono">
            Waiting for telemetry…
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}
