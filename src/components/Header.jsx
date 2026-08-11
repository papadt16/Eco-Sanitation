import { CONNECTION_STATES } from '../hooks/useTelemetry.js';

export default function Header({ onMenuClick, connectionState, latest }) {
  return (
    <header className="sticky top-0 z-20 h-16 shrink-0 border-b border-white/5 bg-slate-925/90 backdrop-blur">
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:bg-white/5"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <div>
            <h1 className="font-display font-semibold text-white text-base sm:text-lg">
              Live Telemetry
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              {latest ? `Node ${latest.nodeId}` : 'Awaiting first reading'}
            </p>
          </div>
        </div>

        <ConnectionBadge state={connectionState} />
      </div>
    </header>
  );
}

function ConnectionBadge({ state }) {
  const config = {
    [CONNECTION_STATES.CONNECTED]: { label: 'Live', dot: 'bg-status-normal', pulse: true },
    [CONNECTION_STATES.CONNECTING]: { label: 'Connecting', dot: 'bg-status-warning', pulse: true },
    [CONNECTION_STATES.DISCONNECTED]: { label: 'Disconnected', dot: 'bg-slate-500', pulse: false },
    [CONNECTION_STATES.ERROR]: { label: 'Connection error', dot: 'bg-status-critical', pulse: true },
    [CONNECTION_STATES.NOT_CONFIGURED]: { label: 'Broker not configured', dot: 'bg-slate-500', pulse: false },
  }[state] || { label: 'Unknown', dot: 'bg-slate-500', pulse: false };

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-60 animate-ping`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`} />
      </span>
      <span className="text-xs font-mono text-slate-300">{config.label}</span>
    </div>
  );
}
