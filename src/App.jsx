import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NodeRegistry from './pages/NodeRegistry.jsx';
import AlertHistory from './pages/AlertHistory.jsx';
import Reports from './pages/Reports.jsx';
import SystemSettings from './pages/SystemSettings.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { TelemetryProvider } from './context/TelemetryContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <SettingsProvider>
              <TelemetryProvider>
                <Layout />
              </TelemetryProvider>
            </SettingsProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nodes" element={<NodeRegistry />} />
        <Route path="/alerts" element={<AlertHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
