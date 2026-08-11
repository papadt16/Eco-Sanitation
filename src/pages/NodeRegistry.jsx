import { NODE_REGISTRY } from '../config/nodes.js';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const STATUS_STYLE = {
  NORMAL: { text: 'text-status-normal', dot: 'bg-status-normal', label: 'Normal' },
  WARNING: { text: 'text-status-warning', dot: 'bg-status-warning', label: 'Warning' },
  CRITICAL: { text: 'text-status-critical', dot: 'bg-status-critical', label: 'Critical' },
  UNKNOWN: { text: 'text-slate-500', dot: 'bg-slate-600', label: 'No data' },
};

export default function NodeRegistry() {
  const { nodes } = useTelemetryContext();
  const { thresholds } = useSettings();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Network</p>
          <h2 className="font-display text-xl font-semibold text-white">Node Registry</h2>
        </div>
        <p className="text-xs text-slate-500 font-mono max-w-sm text-right">
          Static list of registered field nodes. Add new manholes in{' '}
          <code className="text-slate-400">src/config/nodes.js</code>.
        </p>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs font-mono uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Node</th>
                <th className="px-5 py-3 font-medium">Zone</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Fill level</th>
                <th className="px-5 py-3 font-medium">Methane</th>
                <th className="px-5 py-3 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {NODE_REGISTRY.map((node) => {
                const reading = nodes[node.nodeId];
                const style = STATUS_STYLE[reading?.status] || STATUS_STYLE.UNKNOWN;

                return (
                  <tr key={node.nodeId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-slate-100 font-medium">{node.label}</p>
                      <p className="text-xs text-slate-500 font-mono">{node.nodeId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{node.zone}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${style.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-200">
                      {reading ? `${reading.levelPct.toFixed(0)}%` : '—'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-200">
                      {reading ? `${reading.methanePpm.toFixed(0)} ppm` : '—'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                      {reading ? reading.receivedAt.toLocaleTimeString() : 'Never'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-600 font-mono">
        Thresholds — Level: warning ≥ {thresholds.levelWarning}%, critical ≥ {thresholds.levelCritical}% ·
        {' '}Methane: warning ≥ {thresholds.methaneWarning} ppm, critical ≥ {thresholds.methaneCritical} ppm.
        Adjust these in System Settings.
      </p>
    </div>
  );
}
