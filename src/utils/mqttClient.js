// ============================================================================
// MQTT broker connection utility
// ----------------------------------------------------------------------------
// Browsers cannot open raw TCP MQTT sockets, so this connects over MQTT-over-
// WebSockets (wss://). The broker host/port/credentials are environment
// variables so the underlying broker vendor is never hardcoded or exposed
// in the UI (see white-label requirement).
//
// Expected ESP32 payload on VITE_MQTT_TOPIC:
//   { "node_id": "Manhole_01", "level_pct": 78, "methane_ppm": 450, "status": "WARNING" }
// ============================================================================
import mqtt from 'mqtt';

let client = null;

/**
 * Lazily creates (or returns the existing) singleton MQTT client so multiple
 * components/hooks can share a single live connection instead of each
 * opening its own socket.
 */
export function getMqttClient() {
  if (client) return client;

  const url = import.meta.env.VITE_MQTT_URL; // e.g. wss://<cluster>.s1.eu.hivemq.cloud:8884/mqtt
  const username = import.meta.env.VITE_MQTT_USERNAME;
  const password = import.meta.env.VITE_MQTT_PASSWORD;

  client = mqtt.connect(url, {
    username,
    password,
    clientId: `ecosanitation_web_${Math.random().toString(16).slice(2, 10)}`,
    clean: true,
    reconnectPeriod: 4000, // ms between reconnect attempts on drop
    connectTimeout: 10000,
    protocolVersion: 4,
  });

  return client;
}

/** Gracefully tears down the shared connection (e.g. on logout). */
export function disconnectMqttClient() {
  if (client) {
    client.end(true);
    client = null;
  }
}

/**
 * Safely parses an incoming MQTT message buffer into the expected telemetry
 * shape, guarding against malformed payloads from the field device.
 */
export function parseTelemetryPayload(messageBuffer) {
  try {
    const raw = JSON.parse(messageBuffer.toString());
    const level = Number(raw.level_pct);
    const methane = Number(raw.methane_ppm);

    if (!raw.node_id || Number.isNaN(level) || Number.isNaN(methane)) {
      throw new Error('Payload missing required fields');
    }

    return {
      nodeId: String(raw.node_id),
      levelPct: Math.min(100, Math.max(0, level)),
      methanePpm: Math.max(0, methane),
      status: (raw.status || 'NORMAL').toUpperCase(),
      receivedAt: new Date(),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[mqtt] Failed to parse telemetry payload:', err);
    return null;
  }
}
