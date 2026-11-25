import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Filter,
  Search,
  AlertTriangle,
  Activity,
  Waves,
  Maximize2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoogleMapComponent } from '../components/maps/GoogleMapComponent';
import { SensorData, RiverStation, AlertRecord } from '../types';
import { INDIAN_RIVERS, INDIAN_STATES } from '../data/mockData';

export const FloodMap: React.FC = () => {
  const {
    sensors,
    riverStations,
    alerts,
    selectedStateFilter,
    setSelectedStateFilter,
    selectedBasinFilter,
    setSelectedBasinFilter,
  } = useApp();

  const [selectedItem, setSelectedItem] = useState<SensorData | RiverStation | AlertRecord | null>(sensors[0]);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'NORMAL'>('ALL');

  // Filtered sensors
  const filteredSensors = sensors.filter((s) => {
    const matchesState = selectedStateFilter === 'All States' || s.state === selectedStateFilter;
    const matchesBasin = selectedBasinFilter === 'All Basins' || s.riverBasin === selectedBasinFilter;
    const matchesSeverity = filterSeverity === 'ALL' || s.status === filterSeverity;
    return matchesState && matchesBasin && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Live Geospatial Flood Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time interactive monitoring of hydrological telemetry, river basins, and inundation risk zones across India.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* State Filter */}
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-sky-500"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Basin Filter */}
          <select
            value={selectedBasinFilter}
            onChange={(e) => setSelectedBasinFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="All Basins">All River Basins</option>
            {INDIAN_RIVERS.map((rb) => (
              <option key={rb} value={rb}>
                {rb} River
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {(['ALL', 'CRITICAL', 'WARNING', 'NORMAL'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterSeverity === sev
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map View & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Canvas (3 cols) */}
        <div className="lg:col-span-3">
          <GoogleMapComponent
            height="620px"
            onMarkerClick={(item) => setSelectedItem(item)}
            selectedStationId={selectedItem?.id}
          />
        </div>

        {/* Selected Sensor / Station Inspector (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Station Inspector
              </span>
              {selectedItem && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    'status' in selectedItem && selectedItem.status === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {'status' in selectedItem ? selectedItem.status : 'ACTIVE'}
                </span>
              )}
            </div>

            {selectedItem ? (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {'name' in selectedItem ? selectedItem.name : selectedItem.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedItem.location}</span>
                  </p>
                </div>

                {'waterLevel' in selectedItem && (
                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Water Stage:</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {selectedItem.waterLevel} m
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Danger Mark:</span>
                      <span className="font-bold text-rose-600">
                        {selectedItem.dangerLevel} m
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Warning Level:</span>
                      <span className="font-semibold text-amber-600">
                        {selectedItem.warningLevel} m
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">24h Rainfall:</span>
                      <span className="font-bold text-sky-700">
                        {selectedItem.rainfall} mm
                      </span>
                    </div>
                  </div>
                )}

                {'telemetryType' in selectedItem && (
                  <div className="text-xs space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Telemetry Sensor:</span>
                      <span className="font-semibold">{selectedItem.telemetryType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Battery Level:</span>
                      <span className="font-semibold text-emerald-600">{selectedItem.batteryLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Signal (Cellular/SAT):</span>
                      <span className="font-semibold">{selectedItem.signalStrength}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Telemetry Ping:</span>
                      <span className="font-mono text-[11px]">{selectedItem.lastUpdated}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Click any sensor or river station on the map to inspect live hydrological readings.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-700 mb-2">Stations In View ({filteredSensors.length})</div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-100">
              {filteredSensors.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedItem(s)}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedItem?.id === s.id ? 'bg-sky-50 text-sky-900 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">{s.location}</span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      s.status === 'CRITICAL' ? 'bg-rose-500' : s.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
