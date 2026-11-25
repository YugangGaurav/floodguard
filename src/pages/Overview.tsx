import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingUp,
  Activity,
  Droplets,
  CloudRain,
  Thermometer,
  Wind,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Send,
  ArrowUpRight,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { SendAlertModal } from '../components/dashboard/SendAlertModal';
import { LeafletMapComponent } from '../components/maps/LeafletMapComponent';

export const Overview: React.FC = () => {
  const { sensors, alerts, forecastTimeline, riverStations } = useApp();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState(sensors[0]?.id || 'SENS-IND-01');

  // Currently focused sensor
  const activeSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  // Highest risk station
  const criticalSensors = sensors.filter((s) => s.status === 'CRITICAL');
  const highestRiskLevel = criticalSensors.length > 0 ? 'HIGH' : 'NORMAL';

  return (
    <div className="space-y-6">
      {/* Top Banner / System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hydrological Telemetry Overview</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              India National Grid
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time stage discharge, Doppler precipitation telemetry, and AI flood propagation modeling.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Alert</span>
          </button>
          <Link
            to="/map"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Live Map</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary Dashboard Grid (Reflecting the Visual Screenshot Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Flood Risk Level */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-card-hover transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Flood Risk Level</h2>
              <p className="text-xs text-slate-400 mt-0.5">AI prediction</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Brahmaputra Reach</span>
          </div>

          <div className="my-6">
            <div className="inline-block px-7 py-3 rounded-xl bg-[#EF4444] text-white font-extrabold text-2xl tracking-wider shadow-sm">
              HIGH
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Breach threshold probability: 88.4%</span>
            </span>
            <span className="text-slate-400">Peak expected ~20:00 IST</span>
          </div>
        </div>

        {/* Card 2: Predicted Flood Risk (Area Chart matching screenshot curve) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-card-hover transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Predicted Flood Risk</h2>
              <p className="text-xs text-slate-400 mt-0.5">Hydrological projection curve</p>
            </div>
            <Link
              to="/forecast"
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              <span>Full Model</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}% Risk Index`, 'Flood Probability']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 text-right">
            <span>Model confidence: 94.2% • Ensemble AI Forecaster</span>
          </div>
        </div>

        {/* Card 3: Live Sensor Data (Matching the 2x2 grid from screenshot) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-card-hover transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Sensor Data</h2>
              <p className="text-xs text-slate-400 mt-0.5">Station: {activeSensor.name}</p>
            </div>
            <select
              value={selectedSensorId}
              onChange={(e) => setSelectedSensorId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:border-sky-500"
            >
              {sensors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.location}
                </option>
              ))}
            </select>
          </div>

          {/* 2x2 Clean Metric Grid */}
          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Water Level</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {activeSensor.waterLevel.toFixed(2)} <span className="text-sm font-normal text-slate-500">m</span>
              </div>
              <div className="text-[11px] text-rose-500 font-semibold mt-1">
                Danger: {activeSensor.dangerLevel} m
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Rainfall</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {activeSensor.rainfall} <span className="text-sm font-normal text-slate-500">mm</span>
              </div>
              <div className="text-[11px] text-sky-600 font-semibold mt-1">
                24h cumulative
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Humidity</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {activeSensor.humidity} <span className="text-sm font-normal text-slate-500">%</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Atmospheric dew</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Temperature</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {activeSensor.temperature} <span className="text-sm font-normal text-slate-500">°C</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Ambient surface</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Telemetry: {activeSensor.telemetryType}</span>
            <span className="text-emerald-600 font-semibold">Live Battery: {activeSensor.batteryLevel}%</span>
          </div>
        </div>

        {/* Card 4: Map (Mini Interactive Map matching screenshot) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-card-hover transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Map</h2>
              <p className="text-xs text-slate-400 mt-0.5">Hydrological basins & telemetry beacons</p>
            </div>
            <Link
              to="/map"
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              <span>Expand Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-200">
            <LeafletMapComponent height="100%" isMiniMap={true} />
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active sensors: {sensors.length}</span>
            </span>
            <span className="text-rose-600 font-semibold">
              {criticalSensors.length} Critical warnings
            </span>
          </div>
        </div>
      </div>

      {/* Card 5: Alerts Table with Send Alert green button (Matching Screenshot) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-card-hover transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Alerts</h2>
            <p className="text-xs text-slate-400 mt-0.5">Emergency bulletins and civic broadcast logs</p>
          </div>
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Alert</span>
          </button>
        </div>

        {/* Alerts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Feedback / Observation</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.slice(0, 5).map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 font-semibold text-slate-900 pr-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{alert.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600 max-w-md pr-4">
                    {alert.feedback}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                        alert.type === 'Alert'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.type === 'Warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {alert.type}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400 text-right font-mono text-[11px] whitespace-nowrap">
                    {alert.sent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Modal Component */}
      <SendAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
};
