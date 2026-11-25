import React, { useState } from 'react';
import {
  TrendingUp,
  CloudRain,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  Droplets,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { INDIAN_RIVERS } from '../data/mockData';

export const Forecast: React.FC = () => {
  const { forecastTimeline, sensors } = useApp();
  const [forecastHorizon, setForecastHorizon] = useState<'24H' | '48H' | '7D'>('24H');
  const [selectedBasin, setSelectedBasin] = useState('Brahmaputra');

  // Multi-day extended projection
  const multiDayData = [
    { day: 'Day 1 (Today)', peakRisk: 94, rainfallTotal: 145, waterLevelMax: 2.72, affectedEst: 142000 },
    { day: 'Day 2 (+24h)', peakRisk: 86, rainfallTotal: 98, waterLevelMax: 2.65, affectedEst: 125000 },
    { day: 'Day 3 (+48h)', peakRisk: 72, rainfallTotal: 62, waterLevelMax: 2.48, affectedEst: 88000 },
    { day: 'Day 4 (+72h)', peakRisk: 55, rainfallTotal: 35, waterLevelMax: 2.30, affectedEst: 42000 },
    { day: 'Day 5 (+96h)', peakRisk: 42, rainfallTotal: 20, waterLevelMax: 2.15, affectedEst: 15000 },
    { day: 'Day 6 (+120h)', peakRisk: 30, rainfallTotal: 12, waterLevelMax: 2.05, affectedEst: 6000 },
    { day: 'Day 7 (+144h)', peakRisk: 22, rainfallTotal: 8, waterLevelMax: 1.95, affectedEst: 2500 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ensemble Flood Propagation Forecast</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              AI Hydro-Model v3.4
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Machine learning early warning predictions combining IMD Doppler rainfall forecasts, snowmelt runoff, and hydraulic Manning stream routing.
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['24H', '48H', '7D'] as const).map((hz) => (
            <button
              key={hz}
              onClick={() => setForecastHorizon(hz)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                forecastHorizon === hz
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {hz}
            </button>
          ))}
        </div>
      </div>

      {/* Model Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Predicted Peak Crest Time</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">20:00 IST</div>
          <div className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated in ~5 hours</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Peak Surge Height</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">2.72 m</div>
          <div className="text-xs text-rose-600 font-semibold mt-1">
            +0.37m above Danger Mark
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Catchment Rainfall Outlook</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">145 mm</div>
          <div className="text-xs text-sky-600 font-semibold mt-1">
            Upper catchment cloudburst
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Population At Inundation Risk</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">142,000</div>
          <div className="text-xs text-amber-600 font-semibold mt-1">
            4 Districts on High Precaution
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Hydrograph & Probability */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">24-Hour Stage & Flood Risk Hydrograph</h3>
              <p className="text-xs text-slate-400">Simulated water stage (m) vs ensemble risk probability index</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
              Guwahati Reach
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastTimeline}>
                <defs>
                  <linearGradient id="foreRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'riskScore' ? `${val}% Risk` : `${val} m`,
                    name === 'riskScore' ? 'Probability' : 'Water Level',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#foreRiskGrad)"
                  name="riskScore"
                />
                <Line
                  type="monotone"
                  dataKey="waterLevel"
                  stroke="#0284C7"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="waterLevel"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Cumulative Inundation Projection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">7-Day Rainfall & Exposure Timeline</h3>
              <p className="text-xs text-slate-400">Total expected daily precipitation (mm) and affected population</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
              Basin Wide
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={multiDayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="rainfallTotal" name="Rainfall (mm)" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="peakRisk" name="Max Risk Index (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Flood Propagation Inundation Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Downstream Arrival Times & Inundation Propagation
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">Downstream Sector</th>
                <th className="pb-3">Estimated Crest Time</th>
                <th className="pb-3">Projected Height</th>
                <th className="pb-3">Vulnerability Status</th>
                <th className="pb-3 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 font-semibold text-slate-900">Guwahati Urban Embankment</td>
                <td className="py-3 font-mono text-slate-600">Today 20:00 IST</td>
                <td className="py-3 font-bold text-rose-600">49.85 m (breach alert)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                    CRITICAL
                  </span>
                </td>
                <td className="py-3 text-right text-rose-700 font-semibold">
                  Execute Mandatory Evacuation
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 font-semibold text-slate-900">Morigaon Lowland Sector</td>
                <td className="py-3 font-mono text-slate-600">Tonight 23:30 IST</td>
                <td className="py-3 font-bold text-amber-600">48.20 m (at warning level)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                    HIGH
                  </span>
                </td>
                <td className="py-3 text-right text-amber-700 font-semibold">
                  Reinforce Sandbag Dykes
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 font-semibold text-slate-900">Goalpara Riverfront</td>
                <td className="py-3 font-mono text-slate-600">Tomorrow 06:00 IST</td>
                <td className="py-3 font-bold text-slate-700">46.50 m (rising steady)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700">
                    MONITORED
                  </span>
                </td>
                <td className="py-3 text-right text-slate-600">
                  Pre-position Inflatable Flotillas
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
