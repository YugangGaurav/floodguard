import React, { useState } from 'react';
import {
  CloudRain,
  Radio,
  RefreshCw,
  Search,
  AlertTriangle,
  Droplets,
  Wind,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';

export const Rainfall: React.FC = () => {
  const { rainfallStations, refreshData, lastSyncTime } = useApp();
  const [selectedStation, setSelectedStation] = useState(rainfallStations[0]);

  // Hourly rainfall trend data
  const hourlyRadarTrend = [
    { hour: '00:00', rain: 2.1, accumulated: 2.1 },
    { hour: '03:00', rain: 6.4, accumulated: 8.5 },
    { hour: '06:00', rain: 14.8, accumulated: 23.3 },
    { hour: '09:00', rain: 28.5, accumulated: 51.8 },
    { hour: '12:00', rain: 35.2, accumulated: 87.0 },
    { hour: '15:00', rain: 42.0, accumulated: 129.0 },
    { hour: '18:00', rain: 64.5, accumulated: 193.5 },
    { hour: '21:00', rain: 48.0, accumulated: 241.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Doppler Precipitation & Rainfall Monitoring</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              IMD Radar Mesh
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time automated rain gauge (ARG) stations, X-band Doppler weather radar reflections, and cloudburst early warning alerts.
          </p>
        </div>

        <button
          onClick={refreshData}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Radar Feeds</span>
        </button>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Highest 24h Rainfall</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">312.6 mm</div>
          <div className="text-xs text-rose-600 font-semibold mt-1">
            Cherrapunji / Sohra Radar
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Active Doppler Radars</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">6 / 6 Operational</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            100% Antenna Sweep Uptime
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Extreme Weather Alerts</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">2 Stations</div>
          <div className="text-xs text-rose-600 font-semibold mt-1">
            Extremely Heavy Rainfall (&gt;200mm)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Regional Monsoon Anomaly</span>
          <div className="text-2xl font-extrabold text-sky-700 mt-1">+48% Excess</div>
          <div className="text-xs text-slate-500 mt-1">Above long-period average</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rainfall by Doppler Radar Station */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                24-Hour Cumulative Rainfall Across Radar Stations
              </h3>
              <p className="text-xs text-slate-400">Total precipitation measured in millimeters (mm)</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">{lastSyncTime}</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallStations}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="stationName"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                  tickFormatter={(val) => val.split(' ')[0]}
                />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} mm`, 'Rainfall']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rainfallPast24h" name="24h Rainfall (mm)" fill="#0284C7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Station Hourly Hyetograph */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Hourly Hyetograph</h3>
              <select
                value={selectedStation.id}
                onChange={(e) =>
                  setSelectedStation(
                    rainfallStations.find((s) => s.id === e.target.value) || rainfallStations[0]
                  )
                }
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              >
                {rainfallStations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.stationName.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl mb-4 text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedStation.stationName}</div>
              <div className="text-slate-500">{selectedStation.district}, {selectedStation.state}</div>
              <div className="pt-2 flex justify-between font-semibold">
                <span>Past 1h Rate: <b className="text-sky-600">{selectedStation.rainfallPast1h} mm/hr</b></span>
                <span>Category: <b className="text-rose-600">{selectedStation.category}</b></span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyRadarTrend}>
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="rain" name="Rain (mm)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Radar Doppler Reflectivity: 52 dBZ (Cloudburst threshold)
          </div>
        </div>
      </div>

      {/* Radar Station Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Doppler Weather Radar Station Observations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3">Station Name</th>
                <th className="pb-3">District / State</th>
                <th className="pb-3">Past 1h Intensity</th>
                <th className="pb-3">Past 24h Total</th>
                <th className="pb-3">Departure from Normal</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Radar Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rainfallStations.map((station) => (
                <tr key={station.id} className="hover:bg-slate-50">
                  <td className="py-3.5 font-bold text-slate-900">{station.stationName}</td>
                  <td className="py-3.5 text-slate-600">{station.district}, {station.state}</td>
                  <td className="py-3.5 font-semibold text-sky-700">{station.rainfallPast1h} mm</td>
                  <td className="py-3.5 font-extrabold text-slate-900">{station.rainfallPast24h} mm</td>
                  <td className="py-3.5 font-semibold text-rose-600">+{station.departureFromNormal}% Excess</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        station.category === 'Extremely Heavy'
                          ? 'bg-rose-100 text-rose-700'
                          : station.category === 'Heavy'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {station.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
