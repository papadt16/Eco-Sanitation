// ============================================================================
// useTelemetry
// ----------------------------------------------------------------------------
// Subscribes to the live MQTT topic, keeps the latest reading plus a rolling
// history buffer (for the chart), and derives an alert log whenever the
// status flag transitions into WARNING or CRITICAL.
// ============================================================================
import { useEffect, useRef, useState } from 'react';
import { getMqttClient, parseTelemetryPayload } from '../utils/mqttClient';

const HISTORY_LIMIT = 40; // number of points retained for the live chart
const ALERTS_LIMIT = 25; // number of rows retained in the alerts panel

const CONNECTION_STATES = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
};

export function useTelemetry() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [connectionState, setConnectionState] = useState(CONNECTION_STATES.CONNECTING);
  const previousStatusRef = useRef('NORMAL');

  useEffect(() => {
    const topic = import.meta.env.VITE_MQTT_TOPIC || 'sewage/nodes/+/telemetry';
    const mqttClient = getMqttClient();

    const handleConnect = () => {
      setConnectionState(CONNECTION_STATES.CONNECTED);
      mqttClient.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('[mqtt] Subscribe error:', err);
        }
      });
    };

    const handleMessage = (_topic, messageBuffer) => {
      const reading = parseTelemetryPayload(messageBuffer);
      if (!reading) return;

      setLatest(reading);

      setHistory((prev) => {
        const next = [...prev, reading];
        return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
      });

      // Log a new alert row only on a transition INTO Warning/Critical,
      // not on every message while the node stays in that state.
      const isAlertState = reading.status === 'WARNING' || reading.status === 'CRITICAL';
      const changedIntoAlert = isAlertState && reading.status !== previousStatusRef.current;

      if (changedIntoAlert) {
        setAlerts((prev) => {
          const entry = {
            id: `${reading.nodeId}-${reading.receivedAt.getTime()}`,
            nodeId: reading.nodeId,
            status: reading.status,
            levelPct: reading.levelPct,
            methanePpm: reading.methanePpm,
            timestamp: reading.receivedAt,
          };
          const next = [entry, ...prev];
          return next.length > ALERTS_LIMIT ? next.slice(0, ALERTS_LIMIT) : next;
        });
      }

      previousStatusRef.current = reading.status;
    };

    const handleError = (err) => {
      // eslint-disable-next-line no-console
      console.error('[mqtt] Connection error:', err);
      setConnectionState(CONNECTION_STATES.ERROR);
    };

    const handleClose = () => setConnectionState(CONNECTION_STATES.DISCONNECTED);

    mqttClient.on('connect', handleConnect);
    mqttClient.on('message', handleMessage);
    mqttClient.on('error', handleError);
    mqttClient.on('close', handleClose);

    // If the client already connected before this effect ran (e.g. hook
    // remounted), sync state immediately instead of waiting for the event.
    if (mqttClient.connected) handleConnect();

    return () => {
      mqttClient.off('connect', handleConnect);
      mqttClient.off('message', handleMessage);
      mqttClient.off('error', handleError);
      mqttClient.off('close', handleClose);
      mqttClient.unsubscribe(topic);
    };
  }, []);

  return { latest, history, alerts, connectionState };
}

export { CONNECTION_STATES };
