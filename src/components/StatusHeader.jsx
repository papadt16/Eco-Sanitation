const STATUS_CONFIG = {
  NORMAL: {
    label: 'Normal operation',
    detail: 'All monitored parameters within safe thresholds.',
    ring: 'border-status-normal/40',
    glow: 'shadow-[0_0_40px_-12px_rgba(34,197,94,0.5)]',
    text: 'text-status-normal',
    dot: 'bg-status-normal',
  },
  WARNING: {
    label: 'Elevated readings',
    detail: 'One or more nodes require attention within the shift.',
    ring: 'border-status-warning/40',
    glow: 'shadow-[0_0_40px_-12px_rgba(245,158,11,0.5)]',
    text: 'text-status-warning',
    dot: 'bg-status-warning',
  },
  CRITICAL: {
    label: 'Critical alert',
    detail: 'Immediate field inspection required — toxic gas or overflow risk.',
    ring: 'border-status-critical/40',
    glow: 'shadow-[0_0_40px_-12px_rgba(239,68,68,0.6)]',
    text: 'text-status-critical',
    dot: 'bg-status-critical',
  },
};

export default function StatusHeader({ latest }) {
  const status = latest?.status in STATUS_CONFIG ? latest.status : 'NORMAL';
  const cfg = STATUS_CONFIG[status];

  return (
    <div className={`panel border ${cfg.ring} ${cfg.glow} px-5 py-4 flex items-center justify-between flex-wrap gap-4`}>
      <div className="flex items-center gap-4">
        <span className="relative flex h-3.5 w-3.5">
          <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-50 animate-pulseRing`} />
          <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${cfg.dot}`} />
        </span>
        <div>
          <p className={`font-display font-semibold text-lg ${cfg.text}`}>{cfg.label}</p>
          <p className="text-sm text-slate-400">{cfg.detail}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 font-mono text-xs text-slate-400">
        <span>
          Active node: <span className="text-slate-200">{latest?.nodeId || '—'}</span>
        </span>
        <span>
          Last update:{' '}
          <span className="text-slate-200">
            {latest ? latest.receivedAt.toLocaleTimeString() : '—'}
          </span>
        </span>
      </div>
    </div>
  );
}
