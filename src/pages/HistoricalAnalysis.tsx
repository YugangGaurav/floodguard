import React, { useState } from 'react';
import {
  History,
  Calendar,
  Waves,
  MapPin,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  FileText,
  ChevronRight,
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
import { HistoricalFloodEvent } from '../types';

export const HistoricalAnalysis: React.FC = () => {
  const { historicalEvents } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<HistoricalFloodEvent>(historicalEvents[0]);

  // Chart comparison data
  const comparisonData = historicalEvents.map((evt) => ({
    name: evt.year.toString() + ' ' + evt.state,
    discharge: evt.peakDischarge,
    rainfall: evt.max24hRainfall,
    displacedThousands: Math.round(evt.peopleDisplaced / 1000),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Historical Flood Cataclysms & Benchmark Analytics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              NDMA Archives
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparative analysis of historic crests, return-period hydrological extremes, and structural lessons across Indian river basins.
          </p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Peak River Discharge Comparison (m³/s)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Volumetric peak stage outflow across historic Indian flood events
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()} m³/s`, 'Peak Discharge']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="discharge" fill="#0284C7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Extreme 24h Precipitation (mm)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Maximum single-day deluge recorded during corresponding deluge episodes
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} mm`, '24h Rainfall']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rainfall" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Event Details & Case Study Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event List Tabs (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-slate-100">
            Historic Deluge Archive
          </div>

          {historicalEvents.map((evt) => (
            <button
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs ${
                selectedEvent.id === evt.id
                  ? 'bg-sky-50 text-sky-950 font-bold border border-sky-200/80 shadow-xs'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <div className="font-semibold">{evt.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {evt.year} • {evt.state}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Detailed Case Study (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                Year {selectedEvent.year} • {selectedEvent.state}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedEvent.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary Rivers: {selectedEvent.primaryRivers.join(', ')}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Estimated People Displaced</span>
              <div className="text-lg font-extrabold text-rose-600">
                {selectedEvent.peopleDisplaced.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400">Peak Water Level</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedEvent.peakWaterLevel} m</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400">Max Discharge</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedEvent.peakDischarge.toLocaleString()} m³/s</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400">Max 24h Rainfall</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedEvent.max24hRainfall} mm</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
              Hydrological Overview & Genesis
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {selectedEvent.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Key Learnings & Structural Flood Mitigations</span>
            </h4>
            <div className="space-y-2">
              {selectedEvent.keyLearnings.map((learning, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/80 text-xs text-emerald-950"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-snug">{learning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
