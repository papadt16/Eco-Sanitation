const DEFAULT_THRESHOLDS = { warning: 60, critical: 85 };

function toneFor(pct, thresholds) {
  if (pct >= thresholds.critical) return { fill: '#ef4444', text: 'text-status-critical', label: 'Critical' };
  if (pct >= thresholds.warning) return { fill: '#f59e0b', text: 'text-status-warning', label: 'Warning' };
  return { fill: '#22c55e', text: 'text-status-normal', label: 'Normal' };
}

export default function WaterLevelGauge({ levelPct, warningAt, criticalAt }) {
  const pct = levelPct ?? 0;
  const thresholds = {
    warning: warningAt ?? DEFAULT_THRESHOLDS.warning,
    critical: criticalAt ?? DEFAULT_THRESHOLDS.critical,
  };
  const tone = toneFor(pct, thresholds);

  return (
    <div className="panel flex flex-col">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Fill Level</p>
          <h3 className="font-display text-white font-semibold">Manhole shaft</h3>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-md border ${tone.text} border-current/30`}>
          {tone.label}
        </span>
      </div>

      <div className="flex-1 flex items-center gap-8 p-6">
        {/* Shaft vessel */}
        <div className="relative w-16 h-48 shrink-0 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-white/10 bg-slate-925 overflow-hidden">
            <div
              className="absolute bottom-0 left-0 right-0 animate-rise"
              style={{
                '--fill-height': `${pct}%`,
                height: `${pct}%`,
                background: `linear-gradient(180deg, ${tone.fill}cc 0%, ${tone.fill} 100%)`,
              }}
            >
              <div className="absolute -top-1 left-0 right-0 h-2 bg-white/25 blur-[1px]" />
            </div>
          </div>
          {/* Threshold ticks */}
          {[thresholds.warning, thresholds.critical].map((t) => (
            <div
              key={t}
              className="absolute left-0 right-0 border-t border-dashed border-white/25"
              style={{ bottom: `${t}%` }}
            />
          ))}
        </div>

        <div className="flex-1">
          <p className="font-mono text-4xl font-semibold text-white tabular-nums">
            {pct.toFixed(0)}
            <span className="text-lg text-slate-500">%</span>
          </p>
          <p className="text-sm text-slate-400 mt-1">of shaft capacity filled</p>

          <div className="mt-4 space-y-1.5 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-warning/70" /> Warning ≥ {thresholds.warning}%
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-critical/70" /> Critical ≥ {thresholds.critical}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
