const TONE = {
  WARNING: { text: 'text-status-warning', dot: 'bg-status-warning', label: 'Warning' },
  CRITICAL: { text: 'text-status-critical', dot: 'bg-status-critical', label: 'Critical' },
};

export default function AlertsPanel({ alerts }) {
  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Event Log</p>
          <h3 className="font-display text-white font-semibold">Recent alerts</h3>
        </div>
        <span className="text-xs font-mono text-slate-500">{alerts.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-96 divide-y divide-white/5">
        {alerts.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-sm text-slate-500 font-mono px-4 text-center">
            No warning or critical events logged yet.
          </div>
        ) : (
          alerts.map((alert) => {
            const tone = TONE[alert.status] || TONE.WARNING;
            return (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3">
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${tone.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium ${tone.text}`}>{tone.label} — {alert.nodeId}</p>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Level {alert.levelPct.toFixed(0)}% · CH₄ {alert.methanePpm.toFixed(0)} ppm
                    {alert.airQualityPpm != null ? ` · AQ ${alert.airQualityPpm.toFixed(0)} ppm` : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
