# FloodGuard – Intelligent Flood Monitoring & Early Warning System

[![Deploy to GitHub Pages](https://github.com/YOUR-USERNAME/floodguard/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR-USERNAME/floodguard/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**FloodGuard** is an enterprise-grade, responsive, static web application designed for real-time hydrological stage discharge monitoring, Doppler precipitation radar visualization, and early flood disaster warnings.

Built **India-First** with seamless transboundary and global river basin monitoring capabilities, FloodGuard requires **no permanently running Node.js backend** and deploys natively to **GitHub Pages** via automated GitHub Actions.

---

## Table of Contents

1. [Visual Design & User Interface](#visual-design--user-interface)
2. [Key Capabilities & Features](#key-capabilities--features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started (Local Development)](#getting-started-local-development)
6. [Environment Configuration](#environment-configuration)
7. [Operating Modes: Demo vs Live Mode](#operating-modes-demo-vs-live-mode)
8. [Google Maps API Setup & Security](#google-maps-api-setup--security)
9. [Supabase Integration (Optional)](#supabase-integration-optional)
10. [GitHub Pages Deployment Guide](#github-pages-deployment-guide)
11. [Troubleshooting & FAQ](#troubleshooting--faq)
12. [API Integration Architecture](#api-integration-architecture)
13. [Future Development Roadmap](#future-development-roadmap)

---

## Visual Design & User Interface

FloodGuard's user interface is styled with a deep navy agency header, responsive sidebar navigation, clean card elevations, and color-coded danger thresholds:

- **Top Agency Header**: Deep navy background (`#142338`), water drop identity branding, global basin search, India 🇮🇳 / Global 🌐 scope switcher, real-time telemetry stream controller, active emergency alerts badge, and Administrator credential menu.
- **Sidebar Navigation**: Persistent navigation featuring active state highlights with icons, telemetry count badges, and system uptime indicators.
- **Color-Coded Risk Signals**:
  - 🟢 **Teal / Emerald**: Normal river flow & stage within safe bounds.
  - 🟡 **Amber**: Warning level reached; dyke patrols activated.
  - 🔴 **Red / Rose**: High / Critical condition; mandatory evacuation & SDRF response.

---

## Key Capabilities & Features

### 1. Overview Dashboard
- High-visibility **Flood Risk Level** card featuring AI ensemble risk predictions.
- Smooth **Predicted Flood Risk** hydrograph curve (04:00 to 24:00 forecast).
- **Live Sensor Telemetry Grid**: Instant 2x2 readings (Water Stage, 24h Cumulative Rain, Humidity, Temperature).
- **Geospatial Mini-Map**: Live river stage status with clickable sensor beacons.
- **Alerts Table & Dispatcher**: One-click **Send Alert** broadcast modal.

### 2. Live Geospatial Flood Map
- Interactive map powered by Google Maps JavaScript API with full fallback vector map when no API key is present.
- Filter by Indian River Basins (Ganga, Brahmaputra, Yamuna, Godavari, Krishna, Kaveri, Mahanadi, Narmada, Teesta).
- Filter by Indian States (Assam, Bihar, Delhi, West Bengal, Kerala, Andhra Pradesh, Tamil Nadu, etc.).
- Interactive Station Inspector revealing battery, solar telemetry uplink, and stage thresholds.

### 3. Flood Forecast (AI Hydro-Model)
- Multi-horizon projections (24-Hour, 48-Hour, and 7-Day outlooks).
- Downstream arrival times, crest estimations, and population exposure forecasts.

### 4. Sensors & Monitoring Stations
- Telemetry telemetry health: Ultrasonic gauges, Doppler streamflow meters, radar level sensors, and pressure transducers.
- Real-time battery storage %, cellular/satellite signal strength, and simulated live stream telemetry.

### 5. River Basin Monitoring
- Deep monitoring of India's major river networks.
- Stage vs. Warning Level vs. Danger Level vs. All-Time Record Highest Flood Level (HFL).
- Discharge flow rates ($m^3/s$) and stage trend vectors (Rising, Falling, Steady).

### 6. Doppler Rainfall & Radar
- Integrated Indian Meteorological Department (IMD) radar station records.
- 24-hour cumulative precipitation, hourly hyetographs, and monsoon anomaly departures.

### 7. Historical Deluge Analysis
- Detailed case studies of historical flood benchmarks:
  - 2023 Yamuna Historic Crest in Delhi ($208.66\,\text{m}$)
  - 2022 Brahmaputra & Barak Valley Cataclysmic Inundation in Assam
  - 2018 Great Kerala Monsoon Deluge
  - 2015 Chennai Inundation
  - 2013 Kedarnath Himalayan Cloudburst in Uttarakhand
- Comparative peak discharge ($m^3/s$) and 24h extreme rainfall bar analytics.

### 8. Early Warning & Alert Dispatcher
- Common Alerting Protocol (CAP) compliant broadcast console.
- Filter by severity (Critical, High, Medium, Low) and status (Active vs. Resolved).
- Automated citizen count estimation for targeted municipal siren zones.

### 9. Emergency Response & Relief Flotillas
- Live tracking of National Disaster Response Force (NDRF) and State Disaster Response Force (SDRF) units.
- Motorized inflatable rescue boats, deployed personnel, and medical kit inventories.
- Multi-purpose relief camp occupancy tracking, food ration days remaining, and on-duty doctors.
- 24x7 National & State Emergency Operation Centre (SEOC) hotline directory.

### 10. Reports & Automated SITREPs
- Automated compilation of daily hydrological Situation Reports (SITREPs).
- Direct export simulation to signed PDF bulletins and raw CSV telemetry tables.

### 11. System Settings & Configuration
- Toggle between **India-First** national focus and **Global Basin** monitoring.
- Metric configuration: meters vs. feet, millimeters vs. inches, Celsius vs. Fahrenheit.
- In-browser API key management for Google Maps and Supabase without code rebuilding.

### 12. Agency Operator Profile
- Comprehensive profile for agency administrators with clearance verification and session audit logs.

### 13. Resilient 404 Routing
- Recovery interface with quick return paths to primary monitoring sections.

---

## Technology Stack

- **Core Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with custom agency color palette
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (using `HashRouter` for 100% resilient GitHub Pages navigation without server 404 rewrite requirements)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Mapping**: `@googlemaps/js-api-loader` + Standalone Interactive Vector SVG Fallback Engine
- **Backend Sync (Optional)**: `@supabase/supabase-js`
- **CI/CD Deployment**: GitHub Actions (`actions/deploy-pages@v4`)

---

## Project Structure

```text
floodguard/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── favicon.svg             # Water drop SVG favicon
│   ├── logo.svg                # Full FloodGuard brand logo
│   └── 404.html                # Single Page App redirect fallback
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── SendAlertModal.tsx     # Emergency broadcast modal
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx          # Master layout with floating toasts
│   │   │   ├── Header.tsx             # Navy agency header
│   │   │   └── Sidebar.tsx            # Left navigation bar
│   │   └── maps/
│   │       ├── GoogleMapComponent.tsx     # Google Maps loader with fallback
│   │       └── InteractiveFallbackMap.tsx # SVG vector map of Indian basins
│   ├── context/
│   │   └── AppContext.tsx             # Global state, telemetry simulation, alerts
│   ├── data/
│   │   └── mockData.ts                # Verified Indian river basin & telemetry dataset
│   ├── pages/
│   │   ├── Overview.tsx               # Main operational dashboard
│   │   ├── FloodMap.tsx               # Fullscreen geospatial flood map
│   │   ├── Forecast.tsx               # AI Ensemble flood propagation model
│   │   ├── Sensors.tsx                # Telemetry station registry & health
│   │   ├── RiverMonitoring.tsx        # CWC Indian river basins & stage monitoring
│   │   ├── Rainfall.tsx               # IMD Doppler weather radar feeds
│   │   ├── HistoricalAnalysis.tsx     # Historic flood event benchmarks
│   │   ├── Alerts.tsx                 # Early warning broadcast console
│   │   ├── EmergencyResponse.tsx      # NDRF/SDRF rescue & relief camps
│   │   ├── Reports.tsx                # Automated SITREPs & CSV/PDF export
│   │   ├── Settings.tsx               # System units, mode & API credentials
│   │   ├── Profile.tsx                # Agency operator credential profile
│   │   └── NotFound.tsx               # 404 Not Found recovery view
│   ├── services/
│   │   ├── maps/
│   │   │   └── googleMapsLoader.ts    # Safe Google Maps loader
│   │   └── supabase/
│   │       └── supabaseClient.ts      # Optional Supabase connection
│   ├── types/
│   │   └── index.ts                   # Strongly-typed hydrological schemas
│   ├── App.tsx                        # Router configuration
│   ├── index.css                      # Tailwind base & custom animations
│   ├── main.tsx                       # React root entry point
│   └── vite-env.d.ts                  # Vite environment type declarations
├── .env.example                       # Template for environment configuration
├── .gitignore                         # Standard git ignore definitions
├── index.html                         # HTML5 template with Inter typography
├── package.json                       # Dependencies and build scripts
├── postcss.config.js                  # PostCSS plugins
├── tailwind.config.js                 # Tailwind CSS theme customization
├── tsconfig.json                      # TypeScript project configuration
├── vite.config.ts                     # Vite base path & bundle chunking
└── README.md                          # Full system documentation
```

---

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or 20+ recommended)
- [npm](https://www.npmjs.com/) (Version 9 or 10+)

### Exact Terminal Commands

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/floodguard.git
   cd floodguard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Verify TypeScript static types**:
   ```bash
   npm run typecheck
   ```

5. **Build the production application**:
   ```bash
   npm run build
   ```

6. **Preview the production build locally**:
   ```bash
   npm run preview
   ```

---

## Environment Configuration

Create a `.env.local` file by copying `.env.example`:

```bash
cp .env.example .env.local
```

### Supported Environment Variables

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `VITE_GOOGLE_MAPS_API_KEY` | **Optional** | Google Maps JavaScript API key for live terrain and satellite tiles. If omitted, the interactive fallback map loads automatically. | `""` |
| `VITE_SUPABASE_URL` | **Optional** | Supabase project URL for live database synchronization. | `""` |
| `VITE_SUPABASE_ANON_KEY` | **Optional** | Supabase public anonymous API key (with Row Level Security enabled). | `""` |
| `VITE_APP_MODE` | **Optional** | Sets initial operating mode (`demo` or `live`). | `"demo"` |
| `VITE_DEFAULT_COUNTRY` | **Optional** | Baseline national monitoring domain. | `"India"` |
| `VITE_DEFAULT_TIMEZONE` | **Optional** | Default operational timezone. | `"Asia/Kolkata"` |

> [!NOTE]
> You can also enter and update your API credentials directly in the running application from the **Settings** page without editing local files.

---

## Operating Modes: Demo vs Live Mode

FloodGuard supports two distinct operating modes:

### 1. DEMO MODE (Default)
- **Zero Configuration Required**: Operates out of the box without any third-party credentials.
- **Realistic Hydrological Dataset**: Pre-loaded with authentic telemetry stations across India (Brahmaputra at Guwahati, Ganga at Patna, Yamuna at Delhi, Godavari at Rajahmundry, Krishna at Vijayawada, etc.).
- **Live Simulated Telemetry**: Includes a real-time data simulation ticker that fluctuates water stage levels and precipitation readings every 15 seconds to simulate active telemetry streams.
- **Interactive Fallback Map**: Features custom-drawn vector hydrological paths and sensor beacons with interactive inspection cards.

### 2. LIVE MODE
- Connects to external web services, Google Maps satellite/terrain vector layers, and optional Supabase databases.
- Displays live source metadata, telemetry timestamps, and real-time connectivity status.

---

## Google Maps API Setup & Security

FloodGuard is designed to gracefully load Google Maps when configured, and **never crash** if the key is missing or invalid.

### Obtaining a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a Google Cloud project.
3. Enable the **Maps JavaScript API** and **Geocoding API**.
4. Navigate to **APIs & Services > Credentials** and click **Create Credentials > API key**.

### Important Security Best Practices

Because this is a static frontend application running in the user's browser, the Google Maps API key is sent in web client requests. You **MUST** restrict your key in Google Cloud Console:

1. **Application Restrictions**:
   - Choose **Websites (HTTP referrers)**.
   - Add your local development URL: `http://localhost:3000/*` and `http://127.0.0.1:3000/*`.
   - Add your GitHub Pages URL: `https://YOUR-USERNAME.github.io/floodguard/*`.
2. **API Restrictions**:
   - Select **Restrict key**.
   - Choose only **Maps JavaScript API** and **Geocoding API**.
3. **Never expose backend secret keys** in frontend environment variables.

---

## Supabase Integration (Optional)

FloodGuard is ready for optional Supabase backend synchronization for persistent user telemetry, alerts, and incident reports.

### Supabase Table Schema (SQL)

If you wish to use Supabase, execute the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sensors Table
create table public.sensors (
  id text primary key,
  name text not null,
  code text not null,
  location text not null,
  state text not null,
  river_basin text not null,
  latitude double precision not null,
  longitude double precision not null,
  water_level double precision not null,
  danger_level double precision not null,
  warning_level double precision not null,
  rainfall_24h double precision default 0,
  humidity integer default 70,
  temperature double precision default 28,
  battery_level integer default 95,
  signal_strength integer default 90,
  status text check (status in ('ONLINE', 'WARNING', 'CRITICAL', 'OFFLINE')),
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- Alerts Table
create table public.alerts (
  id text primary key,
  title text not null,
  location text not null,
  state text not null,
  river_basin text not null,
  type text check (type in ('Alert', 'Warning', 'Evacuation', 'Advisory')),
  severity text check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  affected_population integer default 0,
  feedback text,
  evacuation_status text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.sensors enable row level security;
alter table public.alerts enable row level security;

-- Read-only policy for public anonymous access
create policy "Allow public read access on sensors" on public.sensors for select using (true);
create policy "Allow public read access on alerts" on public.alerts for select using (true);
```

Add your project credentials in `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
```

---

## GitHub Pages Deployment Guide

FloodGuard is pre-configured with official GitHub Actions workflows for seamless one-click continuous deployment.

### Step-by-Step Repository Setup

1. **Create a new repository on GitHub**:
   - Name it `floodguard`.
   - Set visibility to **Public** (or Private if using GitHub Enterprise / Pro).

2. **Initialize git and commit the codebase**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete FloodGuard application"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/floodguard.git
   git push -u origin main
   ```

3. **Configure GitHub Pages in Repository Settings**:
   - In your repository on GitHub, click **Settings**.
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.

4. **(Optional) Add Repository Secrets for Google Maps**:
   - In repository **Settings**, go to **Secrets and variables > Actions**.
   - Click **New repository secret**.
   - Name: `VITE_GOOGLE_MAPS_API_KEY`, Value: your restricted Google Maps API key.
   - Click **Add secret**.

5. **Deployment Trigger**:
   - Any commit pushed to the `main` branch will automatically trigger `.github/workflows/deploy.yml`.
   - The workflow compiles the production build, uploads the artifact, and publishes the live site at:
     ```text
     https://YOUR-USERNAME.github.io/floodguard/
     ```

---

## Troubleshooting & FAQ

### Q1: The map shows "Interactive Fallback Map Active". Is something broken?
No! This is the intended fallback behavior when no Google Maps API key is configured. The fallback map provides complete interactive functionality, including river basin geometries, sensor status pins, and telemetry inspection popups. To use live Google Maps satellite tiles, simply add your key on the **Settings** page or in `.env.local`.

### Q2: Why does refreshing pages on GitHub Pages sometimes give a 404 on single-page apps?
FloodGuard uses React Router's `HashRouter` (e.g. `#/map`, `#/rivers`), which guarantees that client-side routes will never 404 upon browser reload or direct URL sharing on static web hosts like GitHub Pages. A `404.html` SPA redirect fallback is also included in `public/`.

### Q3: How do I test the production build before pushing to GitHub?
Run:
```bash
npm run build
npm run preview
```
This serves the exact production output compiled in `dist/` over a local HTTP server.

---

## API Integration Architecture

When transitioning from Demo Mode to production enterprise deployment, FloodGuard uses modular service adapters:

```text
┌───────────────────────────────────────────────────────────┐
│                     FloodGuard UI Layer                   │
│   (Overview, Live Map, Forecast, Sensors, Alerts, Rivers)  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │    AppContext     │
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼───────────────────┐
         ▼                    ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│  Mock Hydrology  │ │  Google Maps JS  │ │  Supabase / API │
│   Data Adapter   │ │    API Loader    │ │  Gateway Client │
└──────────────────┘ └──────────────────┘ └─────────────────┘
```

External backends can stream telemetry data directly into `AppContext` via server-sent events (SSE), WebSockets, or scheduled polling intervals.

---

## Future Development Roadmap

- [ ] **Satellite Synthetic Aperture Radar (SAR) Inundation Masks**: Integration of Sentinel-1 radar imagery for automated water surface classification during dense cloud cover.
- [ ] **Cell Broadcast SMS Gateway (C-DOT Integration)**: Direct API integration with the Common Alerting Protocol (CAP) national early warning system.
- [ ] **Offline PWA Support**: Progressive Web App caching with service workers for field responders operating in areas with compromised network infrastructure.
- [ ] **Bilingual Localization**: Hindi (हिन्दी), Assamese (অসমীয়া), Bengali (বাংলা), and Malayalam (മലയാളം) interface translations.

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
