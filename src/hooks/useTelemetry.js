// ============================================================================
// useTelemetry
// ----------------------------------------------------------------------------
// Subscribes to the live MQTT topic, keeps the latest reading plus a rolling
// history buffer (for the chart), and derives an alert log whenever the
// status flag transitions into WARNING or CRITICAL.
// ============================================================================
import { useEffect, useRef, useState } from 'react';
import { getMqttClient, parseTelemetryPayload } from '../utils/mqttClient';

const HISTORY_LIMIT = 300; // rolling buffer; chart components slice to their own display window
const ALERTS_LIMIT = 200; // enough for a full-session Alert History page

const CONNECTION_STATES = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
};

export function useTelemetry() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [nodes, setNodes] = useState({}); // nodeId -> latest reading for that node
  const [connectionState, setConnectionState] = useState(CONNECTION_STATES.CONNECTING);
  const previousStatusByNodeRef = useRef({});

  useEffect(() => {
    const topic = import.meta.env.VITE_MQTT_TOPIC || 'sewage/nodes/+/telemetry';
    const mqttClient = getMqttClient();

    // No broker URL set yet — show a clear "not configured" state instead
    // of letting mqtt.js guess a WebSocket URL from the page origin, which
    // throws an uncatchable SecurityError on an HTTPS-served site.
    if (!mqttClient) {
      setConnectionState(CONNECTION_STATES.NOT_CONFIGURED);
      return undefined;
    }

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

      setNodes((prev) => ({ ...prev, [reading.nodeId]: reading }));

      setHistory((prev) => {
        const next = [...prev, reading];
        return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
      });

      // Log a new alert row only on a transition INTO Warning/Critical for
      // THAT node, not on every message while it stays in that state, and
      // not when a different node's status happens to change.
      const isAlertState = reading.status === 'WARNING' || reading.status === 'CRITICAL';
      const previousStatusForNode = previousStatusByNodeRef.current[reading.nodeId] || 'NORMAL';
      const changedIntoAlert = isAlertState && reading.status !== previousStatusForNode;

      if (changedIntoAlert) {
        setAlerts((prev) => {
          const entry = {
            id: `${reading.nodeId}-${reading.receivedAt.getTime()}`,
            nodeId: reading.nodeId,
            status: reading.status,
            levelPct: reading.levelPct,
            methanePpm: reading.methanePpm,
            airQualityPpm: reading.airQualityPpm,
            timestamp: reading.receivedAt,
          };
          const next = [entry, ...prev];
          return next.length > ALERTS_LIMIT ? next.slice(0, ALERTS_LIMIT) : next;
        });
      }

      previousStatusByNodeRef.current[reading.nodeId] = reading.status;
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

  return { latest, history, alerts, nodes, connectionState };
}

export { CONNECTION_STATES };
