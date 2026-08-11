// ============================================================================
// TelemetryContext
// ----------------------------------------------------------------------------
// Wraps the useTelemetry hook in a Provider so the MQTT connection, history
// buffer, and alert log are created ONCE per authenticated session and
// shared across every route (Dashboard, Node Registry, Alert History,
// Reports) — instead of each page opening its own subscription and losing
// state the moment the user navigates away.
// ============================================================================
import { createContext, useContext } from 'react';
import { useTelemetry } from '../hooks/useTelemetry';

const TelemetryContext = createContext(null);

export function TelemetryProvider({ children }) {
  const telemetry = useTelemetry();
  return <TelemetryContext.Provider value={telemetry}>{children}</TelemetryContext.Provider>;
}

export function useTelemetryContext() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error('useTelemetryContext must be used within a TelemetryProvider');
  return ctx;
}
