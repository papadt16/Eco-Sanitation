import { useMemo } from 'react';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';
import { downloadCsv } from '../utils/csvExport.js';

export default function Reports() {
  const { history, alerts } = useTelemetryContext();

  const stats = useMemo(() => {
    if (history.length === 0) {
      return { avgLevel: 0, peakLevel: 0, avgMethane: 0, peakMethane: 0, avgAirQuality: null, peakAirQuality: null };
    }
    const levels = history.map((r) => r.levelPct);
    const methane = history.map((r) => r.methanePpm);
    const airQuality = history.map((r) => r.airQualityPpm).filter((v) => v !== null);

    return {
      avgLevel: levels.reduce((a, b) => a + b, 0) / levels.length,
      peakLevel: Math.max(...levels),
      avgMethane: methane.reduce((a, b) => a + b, 0) / methane.length,
      peakMethane: Math.max(...methane),
      avgAirQuality: airQuality.length ? airQuality.reduce((a, b) => a + b, 0) / airQuality.length : null,
      peakAirQuality: airQuality.length ? Math.max(...airQuality) : null,
    };
  }, [history]);

  const warningCount = alerts.filter((a) => a.status === 'WARNING').length;
  const criticalCount = alerts.filter((a) => a.status === 'CRITICAL').length;

  const handleExportReadings = () => {
    downloadCsv(
      `telemetry-readings-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`,
      ['timestamp', 'nodeId', 'levelPct', 'methanePpm', 'airQualityPpm', 'status'],
      history.map((r) => ({
        timestamp: r.receivedAt.toISOString(),
        nodeId: r.nodeId,
        levelPct: r.levelPct.toFixed(1),
        methanePpm: r.methanePpm.toFixed(0),
        airQualityPpm: r.airQualityPpm != null ? r.airQualityPpm.toFixed(0) : '',
        status: r.status,
      }))
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2 className="font-display text-xl font-semibold text-white">Session Reports</h2>
        </div>
        <button
          type="button"
          onClick={handleExportReadings}
          disabled={history.length === 0}
          className="btn-primary text-sm py-2"
        >
          Export readings CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Avg. fill level" value={`${stats.avgLevel.toFixed(0)}%`} accent="text-brand-400" />
        <StatCard label="Avg. methane" value={`${stats.avgMethane.toFixed(0)} ppm`} accent="text-brand-400" />
        <StatCard
          label="Avg. air quality"
          value={stats.avgAirQuality != null ? `${stats.avgAirQuality.toFixed(0)} ppm` : 'No data'}
          accent="text-brand-400"
        />
        <StatCard label="Peak fill level" value={`${stats.peakLevel.toFixed(0)}%`} accent="text-status-warning" />
        <StatCard label="Peak methane" value={`${stats.peakMethane.toFixed(0)} ppm`} accent="text-status-warning" />
        <StatCard
          label="Peak air quality"
          value={stats.peakAirQuality != null ? `${stats.peakAirQuality.toFixed(0)} ppm` : 'No data'}
          accent="text-status-warning"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Warning events" value={warningCount} accent="text-status-warning" />
        <StatCard label="Critical events" value={criticalCount} accent="text-status-critical" />
      </div>

      <div className="panel p-5">
        <p className="eyebrow mb-2">Session scope</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Figures above are computed from telemetry received during this browser session
          ({history.length} readings buffered, most recent {Math.min(history.length, 300)} retained).
          This project does not yet persist readings to a database — export the CSV above to keep a
          permanent record, or connect a backend/database if long-term reporting is required.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="panel p-5">
      <p className="eyebrow mb-2">{label}</p>
      <p className={`font-mono text-3xl font-semibold tabular-nums ${accent}`}>{value}</p>
    </div>
  );
}
