import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  KeyRound,
  Database,
  Sliders,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES, INDIAN_RIVERS } from '../data/mockData';

export const Settings: React.FC = () => {
  const {
    regionSettings,
    updateRegionSettings,
    appConfig,
    updateAppConfig,
    addToast,
  } = useApp();

  const [mode, setMode] = useState(regionSettings.mode);
  const [selectedState, setSelectedState] = useState(regionSettings.selectedState);
  const [selectedBasin, setSelectedBasin] = useState(regionSettings.selectedBasin);
  const [timezone, setTimezone] = useState(regionSettings.timezone);
  const [waterUnit, setWaterUnit] = useState(regionSettings.units.waterLevel);
  const [rainUnit, setRainUnit] = useState(regionSettings.units.rainfall);
  const [tempUnit, setTempUnit] = useState(regionSettings.units.temperature);

  const [appMode, setAppMode] = useState(appConfig.appMode);
  const [googleMapsKey, setGoogleMapsKey] = useState(appConfig.googleMapsApiKey || '');
  const [supabaseUrl, setSupabaseUrl] = useState(appConfig.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(appConfig.supabaseAnonKey || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateRegionSettings({
      mode,
      selectedState,
      selectedBasin,
      timezone,
      units: {
        waterLevel: waterUnit,
        rainfall: rainUnit,
        temperature: tempUnit,
      },
    });

    updateAppConfig({
      appMode,
      googleMapsApiKey: googleMapsKey.trim(),
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
    });
  };

  const handleResetDefaults = () => {
    setMode('india');
    setSelectedState('All States');
    setSelectedBasin('All Basins');
    setTimezone('Asia/Kolkata');
    setWaterUnit('meters');
    setRainUnit('mm');
    setTempUnit('celsius');
    setAppMode('demo');
    addToast({
      type: 'info',
      title: 'Defaults Restored',
      message: 'Restored India-first baseline telemetry configuration.',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>System Configuration & API Settings</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              India-First
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure telemetry regional parameters, Google Maps JavaScript API keys, and optional Supabase backend synchronization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Regional & Hydrological Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Globe className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Regional Monitoring Domain</h3>
              <p className="text-xs text-slate-400">Set national vs international watershed focus</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Monitoring Scope
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('india')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    mode === 'india'
                      ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>🇮🇳</span>
                  <span>India National Focus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('global')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    mode === 'global'
                      ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Global Basins</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Hydrological Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST • UTC+05:30)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default State / Administrative Focus
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Primary River Basin
              </label>
              <select
                value={selectedBasin}
                onChange={(e) => setSelectedBasin(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All Basins">All River Basins</option>
                {INDIAN_RIVERS.map((r) => (
                  <option key={r} value={r}>
                    {r} River Basin
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit Preferences */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Measurement Metric Standards
            </label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Water Stage Level</span>
                <select
                  value={waterUnit}
                  onChange={(e) => setWaterUnit(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2 bg-white text-slate-800"
                >
                  <option value="meters">Meters (m) [India CWC Standard]</option>
                  <option value="feet">Feet (ft)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Precipitation Depth</span>
                <select
                  value={rainUnit}
                  onChange={(e) => setRainUnit(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2 bg-white text-slate-800"
                >
                  <option value="mm">Millimeters (mm) [IMD Standard]</option>
                  <option value="inches">Inches (in)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Surface Temperature</span>
                <select
                  value={tempUnit}
                  onChange={(e) => setTempUnit(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2 bg-white text-slate-800"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Operating Mode & API Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">API Credentials & Backend Integrations</h3>
              <p className="text-xs text-slate-400">Configure external map tiles and real-time database credentials</p>
            </div>
          </div>

          {/* Operating Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Operating Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  appMode === 'demo'
                    ? 'border-amber-400 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="appMode"
                  value="demo"
                  checked={appMode === 'demo'}
                  onChange={() => setAppMode('demo')}
                  className="mt-0.5 text-amber-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Demo Mode (Default)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Uses verified Indian hydrological sample data, CWC gauge models, and interactive vector maps without requiring any API keys.
                  </div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  appMode === 'live'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="appMode"
                  value="live"
                  checked={appMode === 'live'}
                  onChange={() => setAppMode('live')}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Live API Mode</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Connects to live Google Maps JavaScript API tiles and optional Supabase PostgreSQL real-time tables.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Google Maps API Key */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Google Maps JavaScript API Key (VITE_GOOGLE_MAPS_API_KEY)
              </label>
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              value={googleMapsKey}
              onChange={(e) => setGoogleMapsKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              <strong>Security Recommendation:</strong> Restrict your Google Maps browser key in Google Cloud Console using <em>HTTP referrers (web sites)</em>, e.g. <code>https://YOUR-USERNAME.github.io/jalsetu/*</code> and <code>http://localhost:3000/*</code>. Enable Maps JavaScript API and Geocoding API.
            </div>
          </div>

          {/* Supabase Integration (Optional) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-semibold text-slate-700">
                Supabase Integration (Optional)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">
                  Supabase Project URL (VITE_SUPABASE_URL)
                </span>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">
                  Supabase Anon Key (VITE_SUPABASE_ANON_KEY)
                </span>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5c..."
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Only provide the public anonymous key (anon key) with Row Level Security (RLS) enabled. Never put the Supabase service-role key in frontend configuration.
            </p>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration & Apply</span>
          </button>
        </div>
      </form>
    </div>
  );
};
