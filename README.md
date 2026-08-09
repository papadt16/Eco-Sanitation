# EcoSanitation Node Dashboard

A real-time IoT telemetry dashboard for a municipal sewage/manhole monitoring
network. Built with React + Vite + Tailwind CSS, authenticated with
Firebase, and fed live sensor data over MQTT (WebSockets) from ESP32 field
nodes.

## 1. Project initialization

```bash
# Scaffold (already done for you in this deliverable — for reference only)
npm create vite@latest ecosanitation-dashboard -- --template react
cd ecosanitation-dashboard

# Install runtime dependencies
npm install firebase mqtt chart.js react-chartjs-2 react-router-dom

# Install Tailwind + tooling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Local dev
cp .env.example .env   # then fill in your real credentials
npm run dev

# Push to GitHub
git init
git add .
git commit -m "Initial commit — EcoSanitation Node Dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. Deploying to Vercel

1. Import the GitHub repo in the Vercel dashboard.
2. Framework preset: **Vite**.
3. Add every variable from `.env.example` under
   **Project → Settings → Environment Variables** (Production + Preview).
4. Deploy. `vercel.json` is already included so client-side routes
   (`/login`, `/dashboard`) resolve correctly on refresh.

## 3. Folder structure

```
ecosanitation/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ components/
│  │  ├─ Sidebar.jsx
│  │  ├─ Header.jsx
│  │  ├─ StatusHeader.jsx
│  │  ├─ WaterLevelGauge.jsx
│  │  ├─ GasGauge.jsx
│  │  ├─ HistoricalChart.jsx
│  │  ├─ AlertsPanel.jsx
│  │  └─ ProtectedRoute.jsx
│  ├─ context/
│  │  └─ AuthContext.jsx        # Firebase auth session, white-labeled
│  ├─ hooks/
│  │  └─ useTelemetry.js        # MQTT subscription + rolling history/alerts
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  └─ Dashboard.jsx
│  ├─ utils/
│  │  ├─ firebase.js            # Firebase app/auth init
│  │  └─ mqttClient.js          # MQTT singleton + payload parsing
│  ├─ App.jsx                   # Routes
│  ├─ main.jsx                  # Entry point
│  └─ index.css                 # Tailwind + design tokens
├─ .env.example
├─ .eslintrc.cjs
├─ .gitignore
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vercel.json
└─ vite.config.js
```

## 4. Firebase setup (Admin auth)

1. Create a Firebase project at console.firebase.google.com.
2. **Build → Authentication → Sign-in method** → enable **Email/Password**.
3. **Authentication → Users** → add your admin account(s) manually
   (this is an internal ops dashboard — self-signup is intentionally not
   exposed in the UI).
4. Copy the web app config values into `.env` (`VITE_FIREBASE_*`).

## 5. MQTT / HiveMQ setup

1. Create a free cluster at HiveMQ Cloud (or use any broker that supports
   MQTT over WebSockets/TLS).
2. Create broker credentials (username/password) for the web app **and**
   a separate set for the ESP32 publisher.
3. Copy the **WebSocket** connection URL (port `8884`, path `/mqtt`) into
   `VITE_MQTT_URL`. Do not use the raw TCP port (`8883`) — browsers cannot
   open raw TCP sockets.
4. Set `VITE_MQTT_TOPIC` to match what your ESP32 publishes to, e.g.
   `sewage/nodes/+/telemetry` (the `+` wildcard lets one dashboard listen
   to every manhole node at once).

### Expected ESP32 payload

```json
{
  "node_id": "Manhole_01",
  "level_pct": 78,
  "methane_ppm": 450,
  "status": "WARNING"
}
```

`status` should be one of `NORMAL`, `WARNING`, or `CRITICAL` — the
dashboard drives all color-coding and the alerts log off this field, so
keep the thresholds on the firmware side (see `WaterLevelGauge.jsx` and
`GasGauge.jsx` for the matching frontend thresholds: level ≥ 60% /
≥ 85%, methane ≥ 300 ppm / ≥ 600 ppm — adjust both sides together).

## 6. White-label notes

No vendor name (Firebase, HiveMQ, Vercel) appears anywhere in the UI —
`AuthContext.jsx` translates Firebase's raw error codes into plain
operator-facing messages, and the MQTT broker is referred to only as
"the network" / "live telemetry" throughout the interface copy.
