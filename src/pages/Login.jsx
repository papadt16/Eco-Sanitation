import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.1fr_1fr] bg-slate-925">
      {/* Left rail — network signature panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-40" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <NodeMark />
          <div>
            <p className="font-display font-semibold tracking-tight text-lg text-white">
              EcoSanitation
            </p>
            <p className="eyebrow">Node Dashboard</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="font-display text-4xl leading-[1.1] font-semibold text-white max-w-md">
            Municipal sewage network,
            <span className="text-brand-400"> monitored in real time.</span>
          </h1>
          <p className="text-slate-400 max-w-sm leading-relaxed">
            Live fill-level and gas telemetry from every manhole node across the
            collection network, streamed straight to your control room.
          </p>

          <div className="flex items-center gap-6 pt-4 font-mono text-xs text-slate-500">
            <MetricPreview label="Level" value="78%" tone="warning" />
            <MetricPreview label="CH₄" value="450 ppm" tone="warning" />
            <MetricPreview label="Nodes online" value="—" tone="normal" />
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-600 font-mono">
          Authorized personnel only · Access is logged
        </p>
      </div>

      {/* Right — auth form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <NodeMark />
            <div>
              <p className="font-display font-semibold text-white">EcoSanitation</p>
              <p className="eyebrow">Node Dashboard</p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-semibold text-white mb-1">
            Admin access
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            Sign in with your operator credentials to view live telemetry.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wide text-slate-400 mb-1.5">
                Admin email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@municipality.gov"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wide text-slate-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="input-field"
              />
            </div>

            {authError && (
              <div className="flex items-start gap-2 rounded-lg border border-status-critical/30 bg-status-critical/10 px-3 py-2.5">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-status-critical shrink-0" />
                <p className="text-sm text-red-300">{authError}</p>
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
              {submitting ? 'Verifying…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-slate-600 font-mono mt-8 text-center">
            System access is restricted to authorized municipal staff.
          </p>
        </div>
      </div>
    </div>
  );
}

function NodeMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="9" className="fill-brand-600" />
      <path
        d="M17 7c-4 4.2-6.5 7.7-6.5 11a6.5 6.5 0 1013 0c0-3.3-2.5-6.8-6.5-11z"
        fill="white"
        fillOpacity="0.92"
      />
    </svg>
  );
}

function MetricPreview({ label, value, tone }) {
  const toneClass =
    tone === 'warning' ? 'text-status-warning' : tone === 'critical' ? 'text-status-critical' : 'text-status-normal';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}
