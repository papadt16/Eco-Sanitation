import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import StatusHeader from '../components/StatusHeader.jsx';
import WaterLevelGauge from '../components/WaterLevelGauge.jsx';
import GasGauge from '../components/GasGauge.jsx';
import HistoricalChart from '../components/HistoricalChart.jsx';
import AlertsPanel from '../components/AlertsPanel.jsx';
import { useTelemetry } from '../hooks/useTelemetry.js';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { latest, history, alerts, connectionState } = useTelemetry();

  return (
    <div className="min-h-screen flex bg-slate-925 bg-grid-pattern bg-[size:36px_36px]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          connectionState={connectionState}
          latest={latest}
        />

        <main className="flex-1 p-4 sm:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
          <StatusHeader latest={latest} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <WaterLevelGauge levelPct={latest?.levelPct} />
            <GasGauge methanePpm={latest?.methanePpm} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <HistoricalChart history={history} />
            </div>
            <AlertsPanel alerts={alerts} />
          </div>
        </main>
      </div>
    </div>
  );
}
