import { useState } from 'react';
import { useSettings, DEFAULT_THRESHOLDS } from '../context/SettingsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';
import { CONNECTION_STATES } from '../hooks/useTelemetry.js';

export default function SystemSettings() {
  const { thresholds, updateThresholds, resetThresholds } = useSettings();
  const { adminUser } = useAuth();
  const { connectionState } = useTelemetryContext();
  const [draft, setDraft] = useState(thresholds);
  const [saved, setSaved] = useState(false);

  const handleChange = (key) => (e) => {
    const value = Number(e.target.value);
    setDraft((prev) => ({ ...prev, [key]: Number.isNaN(value) ? 0 : value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateThresholds(draft);
    setSaved(true);
  };

  const handleReset = () => {
    resetThresholds();
    setDraft(DEFAULT_THRESHOLDS);
    setSaved(false);
  };

  const connectionLabel = {
    [CONNECTION_STATES.CONNECTED]: 'Connected',
    [CONNECTION_STATES.CONNECTING]: 'Connecting…',
    [CONNECTION_STATES.DISCONNECTED]: 'Disconnected',
    [CONNECTION_STATES.ERROR]: 'Connection error',
    [CONNECTION_STATES.NOT_CONFIGURED]: 'Not configured',
  }[connectionState];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <p className="eyebrow">Configuration</p>
        <h2 className="font-display text-xl font-semibold text-white">System Settings</h2>
      </div>

      <form onSubmit={handleSave} className="panel p-5 space-y-5">
        <div>
          <h3 className="font-display text-white font-semibold mb-1">Alert thresholds</h3>
          <p className="text-sm text-slate-400">
            Controls the color-coding and alert logging used across the dashboard.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ThresholdField
            label="Fill level — warning at"
            suffix="%"
            value={draft.levelWarning}
            onChange={handleChange('levelWarning')}
          />
          <ThresholdField
            label="Fill level — critical at"
            suffix="%"
            value={draft.levelCritical}
            onChange={handleChange('levelCritical')}
          />
          <ThresholdField
            label="Methane — warning at"
            suffix="ppm"
            value={draft.methaneWarning}
            onChange={handleChange('methaneWarning')}
          />
          <ThresholdField
            label="Methane — critical at"
            suffix="ppm"
            value={draft.methaneCritical}
            onChange={handleChange('methaneCritical')}
          />
          <ThresholdField
            label="Air quality — warning at"
            suffix="ppm"
            value={draft.airQualityWarning}
            onChange={handleChange('airQualityWarning')}
          />
          <ThresholdField
            label="Air quality — critical at"
            suffix="ppm"
            value={draft.airQualityCritical}
            onChange={handleChange('airQualityCritical')}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary text-sm py-2">
            Save thresholds
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-slate-400 hover:text-slate-200 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            Reset to defaults
          </button>
          {saved && <span className="text-xs font-mono text-brand-400">Saved</span>}
        </div>

        <p className="text-xs text-slate-600 font-mono">
          Saved to this browser only — thresholds are not yet shared across admins or devices.
        </p>
      </form>

      <div className="panel p-5 space-y-3">
        <h3 className="font-display text-white font-semibold">Account</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Signed in as</span>
          <span className="text-slate-200 font-mono">{adminUser?.email}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Role</span>
          <span className="text-slate-200">Administrator</span>
        </div>
      </div>

      <div className="panel p-5 space-y-3">
        <h3 className="font-display text-white font-semibold">Network connection</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Live telemetry link</span>
          <span className="text-slate-200 font-mono">{connectionLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Subscribed topic</span>
          <span className="text-slate-200 font-mono text-xs">
            {import.meta.env.VITE_MQTT_TOPIC || 'sewage/nodes/+/telemetry'}
          </span>
        </div>
      </div>
    </div>
  );
}

function ThresholdField({ label, suffix, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wide text-slate-400 mb-1.5">{label}</span>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={onChange}
          min={0}
          className="input-field pr-14"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
          {suffix}
        </span>
      </div>
    </label>
  );
}
