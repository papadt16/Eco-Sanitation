import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { label: 'Telemetry', icon: PulseIcon, active: true },
  { label: 'Node Registry', icon: GridIcon, active: false },
  { label: 'Alert History', icon: BellIcon, active: false },
  { label: 'Reports', icon: DocIcon, active: false },
  { label: 'System Settings', icon: GearIcon, active: false },
];

export default function Sidebar({ open, onClose }) {
  const { adminUser, logout } = useAuth();

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-slate-850
          border-r border-white/5 flex flex-col transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
          <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
            <rect width="34" height="34" rx="9" className="fill-brand-600" />
            <path
              d="M17 7c-4 4.2-6.5 7.7-6.5 11a6.5 6.5 0 1013 0c0-3.3-2.5-6.8-6.5-11z"
              fill="white"
              fillOpacity="0.92"
            />
          </svg>
          <div className="leading-tight">
            <p className="font-display font-semibold text-white text-sm">EcoSanitation</p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Node Dashboard
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <p className="eyebrow px-2 mb-2">Operations</p>
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${
                  active
                    ? 'bg-brand-600/15 text-brand-300 border border-brand-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-brand-600/20 border border-brand-600/40 flex items-center justify-center text-brand-300 text-xs font-semibold shrink-0">
              {adminUser?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-200 truncate">{adminUser?.email}</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                Administrator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

/* --- Inline icon set (no external icon dependency) ------------------- */
function PulseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 8a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 004 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DocIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 3h9l3 3v15H6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h6" strokeLinecap="round" />
    </svg>
  );
}
function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
