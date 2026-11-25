import React, { useState } from 'react';
import {
  Activity,
  Battery,
  Wifi,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  AlertTriangle,
  CheckCircle,
  SlidersHorizontal,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INDIAN_STATES, INDIAN_RIVERS } from '../data/mockData';
import { SensorData } from '../types';

export const Sensors: React.FC = () => {
  const { sensors, isSimulationActive, toggleSimulation, refreshData, lastSyncTime } = useApp();

  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All States');
  const [basinFilter, setBasinFilter] = useState('All Basins');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'WARNING' | 'CRITICAL'>('ALL');
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(sensors[0] || null);

  const filteredSensors = sensors.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter === 'All States' || s.state === stateFilter;
    const matchesBasin = basinFilter === 'All Basins' || s.riverBasin === basinFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesState && matchesBasin && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hydrological Sensor Network & Telemetry</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              {sensors.length} Stations Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time stage sensors, ultrasonic depth transducers, radar level gauges, and Doppler streamflow meters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSimulation}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              isSimulationActive
                ? 'bg-sky-50 text-sky-700 border-sky-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulationActive ? 'animate-pulse text-sky-600' : ''}`} />
            <span>{isSimulationActive ? 'Live Telemetry Sim On' : 'Sim Paused'}</span>
          </button>
          <button
            onClick={refreshData}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search station name, code, or location..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-sky-500"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={basinFilter}
            onChange={(e) => setBasinFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="All Basins">All River Basins</option>
            {INDIAN_RIVERS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {(['ALL', 'CRITICAL', 'WARNING', 'ONLINE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Cards / Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Active Stations ({filteredSensors.length})
            </h3>
            <span className="text-[11px] text-slate-400">Auto-refresh every 15s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-3">Water Stage</th>
                  <th className="py-3 px-3">Danger Mark</th>
                  <th className="py-3 px-3">Rain (24h)</th>
                  <th className="py-3 px-3">Battery / Signal</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSensors.map((sensor) => {
                  const isSelected = selectedSensor?.id === sensor.id;
                  const isCritical = sensor.status === 'CRITICAL';
                  const isWarning = sensor.status === 'WARNING';

                  return (
                    <tr
                      key={sensor.id}
                      onClick={() => setSelectedSensor(sensor)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/90' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCritical ? 'bg-rose-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          <div>
                            <div className="font-bold text-slate-900">{sensor.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {sensor.code} • {sensor.location}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-extrabold text-sm ${
                            isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-900'
                          }`}
                        >
                          {sensor.waterLevel.toFixed(2)} m
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-slate-500">
                        {sensor.dangerLevel} m
                      </td>

                      <td className="py-3.5 px-3 font-bold text-sky-700">
                        {sensor.rainfall} mm
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Battery className="w-3.5 h-3.5 text-emerald-600" />
                            {sensor.batteryLevel}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5 text-sky-600" />
                            {sensor.signalStrength}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCritical
                              ? 'bg-rose-100 text-rose-700'
                              : isWarning
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sensor.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Sensor Detailed Telemetry Card (1 col) */}
        {selectedSensor && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-600 uppercase">
                  {selectedSensor.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedSensor.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedSensor.location}</span>
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedSensor.status === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-700'
                    : selectedSensor.status === 'WARNING'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {selectedSensor.status}
              </span>
            </div>

            {/* Gauge Stage Meter */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-600">Current Stage Level</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {selectedSensor.waterLevel.toFixed(2)} m
                </span>
              </div>

              {/* Progress bar relative to danger level */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    selectedSensor.waterLevel >= selectedSensor.dangerLevel
                      ? 'bg-rose-500'
                      : selectedSensor.waterLevel >= selectedSensor.warningLevel
                      ? 'bg-amber-500'
                      : 'bg-sky-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (selectedSensor.waterLevel / (selectedSensor.dangerLevel * 1.05)) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Warning: {selectedSensor.warningLevel} m</span>
                <span className="text-rose-600 font-semibold">Danger: {selectedSensor.dangerLevel} m</span>
              </div>
            </div>

            {/* Atmospheric Readings */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-slate-400 text-[10px]">24h Cumulative Rain</div>
                <div className="text-base font-bold text-sky-700 mt-1">{selectedSensor.rainfall} mm</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-slate-400 text-[10px]">Surface Temperature</div>
                <div className="text-base font-bold text-slate-800 mt-1">{selectedSensor.temperature} °C</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-slate-400 text-[10px]">Relative Humidity</div>
                <div className="text-base font-bold text-slate-800 mt-1">{selectedSensor.humidity} %</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-slate-400 text-[10px]">Telemetry Type</div>
                <div className="text-xs font-bold text-slate-800 mt-1">{selectedSensor.telemetryType}</div>
              </div>
            </div>

            {/* Hardware Health Status */}
            <div className="border-t border-slate-100 pt-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Solar Battery Storage:</span>
                <span className="font-semibold text-emerald-600">{selectedSensor.batteryLevel}% Charged</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Telemetry Uplink Signal:</span>
                <span className="font-semibold text-sky-600">{selectedSensor.signalStrength}% (4G / IRNSS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Geographic Coordinates:</span>
                <span className="font-mono text-[11px]">
                  {selectedSensor.coordinates.lat.toFixed(4)}°N, {selectedSensor.coordinates.lng.toFixed(4)}°E
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Telemetry Packet:</span>
                <span className="font-mono text-slate-700">{selectedSensor.lastUpdated}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
