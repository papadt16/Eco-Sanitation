import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { latest, connectionState } = useTelemetryContext();

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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
