import { useMemo, useState } from 'react';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';
import { downloadCsv } from '../utils/csvExport.js';

const FILTERS = ['ALL', 'WARNING', 'CRITICAL'];

const TONE = {
  WARNING: { text: 'text-status-warning', dot: 'bg-status-warning', label: 'Warning' },
  CRITICAL: { text: 'text-status-critical', dot: 'bg-status-critical', label: 'Critical' },
};

export default function AlertHistory() {
  const { alerts } = useTelemetryContext();
  const [filter, setFilter] = useState('ALL');

  const filtered = useMemo(
    () => (filter === 'ALL' ? alerts : alerts.filter((a) => a.status === filter)),
    [alerts, filter]
  );

  const handleExport = () => {
    downloadCsv(
      `alert-history-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`,
      ['timestamp', 'nodeId', 'status', 'levelPct', 'methanePpm'],
      filtered.map((a) => ({
        timestamp: a.timestamp.toISOString(),
        nodeId: a.nodeId,
        status: a.status,
        levelPct: a.levelPct.toFixed(1),
        methanePpm: a.methanePpm.toFixed(0),
      }))
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Event Log</p>
          <h2 className="font-display text-xl font-semibold text-white">Alert History</h2>
        </div>
        <button type="button" onClick={handleExport} disabled={filtered.length === 0} className="btn-primary text-sm py-2">
          Export CSV
        </button>
      </div>

      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wide border transition-colors
              ${
                filter === f
                  ? 'bg-brand-600/15 text-brand-300 border-brand-600/30'
                  : 'text-slate-400 border-white/10 hover:bg-white/5'
              }`}
          >
            {f === 'ALL' ? `All (${alerts.length})` : `${f[0]}${f.slice(1).toLowerCase()} (${alerts.filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="panel divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-slate-500 font-mono px-4 text-center">
            No {filter !== 'ALL' ? filter.toLowerCase() : ''} alerts logged this session yet.
          </div>
        ) : (
          filtered.map((alert) => {
            const tone = TONE[alert.status] || TONE.WARNING;
            return (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5">
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${tone.dot}`} />
                <div className="min-w-0 flex-1 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className={`text-sm font-medium ${tone.text}`}>{tone.label} — {alert.nodeId}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      Level {alert.levelPct.toFixed(0)}% · CH₄ {alert.methanePpm.toFixed(0)} ppm
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {alert.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-slate-600 font-mono">
        This log reflects the current browser session only (last {alerts.length} of up to 200 events retained).
      </p>
    </div>
  );
}
