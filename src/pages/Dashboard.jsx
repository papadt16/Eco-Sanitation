import StatusHeader from '../components/StatusHeader.jsx';
import WaterLevelGauge from '../components/WaterLevelGauge.jsx';
import GasGauge from '../components/GasGauge.jsx';
import HistoricalChart from '../components/HistoricalChart.jsx';
import AlertsPanel from '../components/AlertsPanel.jsx';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

export default function Dashboard() {
  const { latest, history, alerts } = useTelemetryContext();
  const { thresholds } = useSettings();

  return (
    <>
      <StatusHeader latest={latest} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WaterLevelGauge
          levelPct={latest?.levelPct}
          warningAt={thresholds.levelWarning}
          criticalAt={thresholds.levelCritical}
        />
        <GasGauge
          methanePpm={latest?.methanePpm}
          warningAt={thresholds.methaneWarning}
          criticalAt={thresholds.methaneCritical}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <HistoricalChart history={history} />
        </div>
        <AlertsPanel alerts={alerts.slice(0, 8)} />
      </div>
    </>
  );
}
