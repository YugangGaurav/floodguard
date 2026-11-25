import React, { useState } from 'react';
import {
  Waves,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Compass,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_RIVERS } from '../data/mockData';
import { RiverStation } from '../types';

export const RiverMonitoring: React.FC = () => {
  const { riverStations } = useApp();
  const [selectedRiver, setSelectedRiver] = useState<string>('All Rivers');

  const filteredStations = riverStations.filter(
    (station) => selectedRiver === 'All Rivers' || station.riverName === selectedRiver
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>River Basins & Hydraulic Gauge Monitoring</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              Central Water Commission (CWC)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking stage discharge, all-time record flood levels (HFL), barrage outflows, and crest propagation across major Indian river systems.
          </p>
        </div>

        {/* River Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedRiver}
            onChange={(e) => setSelectedRiver(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="All Rivers">All Indian River Basins</option>
            {INDIAN_RIVERS.map((r) => (
              <option key={r} value={r}>
                {r} River System
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary River Basins Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map((station) => {
          const isCritical = station.status === 'CRITICAL';
          const isWarning = station.status === 'WARNING';
          const percentToDanger = Math.min(
            100,
            (station.currentLevel / station.dangerLevel) * 100
          );

          return (
            <div
              key={station.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">
                      {station.riverName} River Basin
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {station.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{station.state}</span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {station.status}
                  </span>
                </div>

                {/* Level Display */}
                <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Current Water Level</span>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {station.currentLevel.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-slate-500">m</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Trend</span>
                    <div className="flex items-center gap-1 font-bold text-xs mt-1">
                      {station.trend === 'RISING' ? (
                        <span className="text-rose-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-0.5" /> Rising
                        </span>
                      ) : station.trend === 'FALLING' ? (
                        <span className="text-emerald-600 flex items-center">
                          <TrendingDown className="w-4 h-4 mr-0.5" /> Falling
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center">
                          <Minus className="w-4 h-4 mr-0.5" /> Steady
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Danger Level Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Proximity to Danger Level:</span>
                    <span className={`font-bold ${isCritical ? 'text-rose-600' : 'text-slate-700'}`}>
                      {percentToDanger.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentToDanger}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Warning: {station.warningLevel} m</span>
                    <span className="text-rose-600 font-semibold">Danger: {station.dangerLevel} m</span>
                  </div>
                </div>

                {/* Additional Hydrological Stats */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Discharge Flow Rate:</span>
                    <div className="font-bold text-slate-800">
                      {station.dischargeRate.toLocaleString()} m³/s
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">All-time High (HFL):</span>
                    <div className="font-bold text-rose-600">
                      {station.highestFloodLevel} m
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Last updated {station.lastUpdated}</span>
                <span className="font-medium text-sky-600 hover:text-sky-800 cursor-pointer">
                  View Basin Telemetry →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indian River Basin Flood Defense Reference */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          River Basin Regulatory Framework & Dam Gates
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Central Water Commission guidelines stipulate mandatory reservoir rule curve compliance across major barrages. 
          Real-time coordination is maintained between upstream barrages (e.g., Hathnikund on Yamuna, Bhakra on Sutlej, Farakka on Ganga, and Dowleswaram on Godavari) 
          and emergency disaster management authorities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">Brahmaputra & Barak Basins</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Prone to severe braided river morphology shifts and heavy monsoon precipitation in Assam & Meghalaya hills.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">Ganga & Yamuna Plain</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              High risk of river backflow into urban storm drainage during coordinated upstream reservoir spills.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">Peninsular Rivers (Godavari & Kaveri)</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Delta inundation during cyclonic depressions in the Bay of Bengal requiring emergency barrage gates discharge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
