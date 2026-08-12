const DEFAULT_THRESHOLDS = { warning: 300, critical: 600 };

function toneFor(ppm, thresholds) {
  if (ppm >= thresholds.critical) return { stroke: '#ef4444', text: 'text-status-critical', label: 'Critical' };
  if (ppm >= thresholds.warning) return { stroke: '#f59e0b', text: 'text-status-warning', label: 'Warning' };
  return { stroke: '#22c55e', text: 'text-status-normal', label: 'Normal' };
}

/**
 * Reusable radial gauge for any single ppm-scale gas reading. Originally
 * built for MQ-4 methane; also used for MQ-135 general air quality by
 * passing different label/title/value/threshold props.
 */
export default function GasGauge({
  value,
  warningAt,
  criticalAt,
  maxScale = 1000,
  eyebrow = 'Gas Concentration',
  title = 'Methane (CH₄)',
  unitLabel = 'ppm',
  unavailableNote = 'sensor not reporting yet',
}) {
  const hasReading = value !== null && value !== undefined;
  const ppm = hasReading ? value : 0;
  const thresholds = {
    warning: warningAt ?? DEFAULT_THRESHOLDS.warning,
    critical: criticalAt ?? DEFAULT_THRESHOLDS.critical,
  };
  const tone = hasReading
    ? toneFor(ppm, thresholds)
    : { stroke: '#475569', text: 'text-slate-500', label: 'No data' };

  const radius = 70;
  const circumference = Math.PI * radius; // half-circle arc length
  const progress = Math.min(ppm / maxScale, 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="panel flex flex-col">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="font-display text-white font-semibold">{title}</h3>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-md border ${tone.text} border-current/30`}>
          {tone.label}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <svg viewBox="0 0 180 100" className="w-full max-w-[240px]">
          {/* Track */}
          <path
            d="M10 90 A80 80 0 0 1 170 90"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d="M10 90 A80 80 0 0 1 170 90"
            fill="none"
            stroke={tone.stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1), stroke 0.4s' }}
          />
        </svg>

        <div className="-mt-8 text-center">
          <p className="font-mono text-4xl font-semibold text-white tabular-nums">
            {hasReading ? ppm.toFixed(0) : '—'}
            <span className="text-lg text-slate-500 ml-1">{unitLabel}</span>
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {hasReading ? `airborne ${title.toLowerCase()} concentration` : unavailableNote}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-4 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-status-warning/70" /> ≥ {thresholds.warning} {unitLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-status-critical/70" /> ≥ {thresholds.critical} {unitLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
