// ============================================================================
// Node registry
// ----------------------------------------------------------------------------
// There is no backend/database in this project, so the list of manhole
// nodes that SHOULD exist on the network is maintained here as static
// config. Live status for each node is merged in at render time from
// whatever telemetry has actually arrived over MQTT (see NodeRegistry.jsx).
//
// Add a row here for every ESP32 node you deploy in the field — nodeId
// must exactly match the "node_id" value that node publishes in its
// JSON payload.
// ============================================================================
export const NODE_REGISTRY = [
  { nodeId: 'Manhole_01', label: 'Manhole 01', zone: 'Zone A — Market Road' },
  { nodeId: 'Manhole_02', label: 'Manhole 02', zone: 'Zone B — Industrial Estate' },
  { nodeId: 'Manhole_03', label: 'Manhole 03', zone: 'Zone C — Residential Sector' },
];
