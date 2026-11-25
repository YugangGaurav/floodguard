import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Activity,
  AlertTriangle,
  Info,
  Waves,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SensorData, RiverStation, AlertRecord } from '../../types';

interface InteractiveFallbackMapProps {
  height?: string;
  showControls?: boolean;
  onMarkerClick?: (item: SensorData | RiverStation | AlertRecord) => void;
  selectedStationId?: string;
  isMiniMap?: boolean;
}

export const InteractiveFallbackMap: React.FC<InteractiveFallbackMapProps> = ({
  height = '500px',
  showControls = true,
  onMarkerClick,
  selectedStationId,
  isMiniMap = false,
}) => {
  const { sensors, riverStations, alerts, regionSettings } = useApp();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [layers, setLayers] = useState({
    sensors: true,
    rivers: true,
    alerts: true,
    radar: true,
  });
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [activeItem, setActiveItem] = useState<SensorData | RiverStation | AlertRecord | null>(null);

  // Geographic coordinate normalization to SVG viewBox:
  // India approx: Lat 8°N to 36°N (span 28°), Lng 68°E to 96°E (span 28°)
  const getCoordinates = (lat: number, lng: number) => {
    const minLat = 7.0;
    const maxLat = 36.5;
    const minLng = 67.0;
    const maxLng = 97.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    // Invert Y because lat increases northward
    const y = ((maxLat - lat) / (maxLat - minLat)) * 750;
    return { x, y };
  };

  const handleSelect = (item: SensorData | RiverStation | AlertRecord) => {
    setActiveItem(item);
    if (onMarkerClick) {
      onMarkerClick(item);
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#eaf2f8] to-[#e4eef6] border border-slate-200 shadow-inner select-none flex flex-col"
      style={{ height }}
    >
      {/* Map Control Bar (Hidden on mini-map) */}
      {!isMiniMap && showControls && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 p-1 flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.8))}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setActiveItem(null);
              }}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
              title="Reset India Center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Layer Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50"
            >
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Layers</span>
            </button>

            {showLayerMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 text-xs">
                <div className="font-bold text-slate-800 pb-1.5 border-b border-slate-100 mb-1">
                  Telemetry Layers
                </div>
                <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-slate-50 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={layers.sensors}
                    onChange={(e) => setLayers({ ...layers, sensors: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>Sensors ({sensors.length})</span>
                </label>
                <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-slate-50 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={layers.rivers}
                    onChange={(e) => setLayers({ ...layers, rivers: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>River Stations ({riverStations.length})</span>
                </label>
                <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-slate-50 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={layers.alerts}
                    onChange={(e) => setLayers({ ...layers, alerts: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>Active Warnings ({alerts.filter((a) => a.active).length})</span>
                </label>
                <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-slate-50 px-1 rounded">
                  <input
                    type="checkbox"
                    checked={layers.radar}
                    onChange={(e) => setLayers({ ...layers, radar: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span>Radar Rain Simulation</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Banner on Fallback Mode */}
      {!isMiniMap && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2 text-[11px] text-slate-600">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="font-medium">Hydrological Basin Vector Map</span>
          </div>
        </div>
      )}

      {/* Interactive SVG Canvas */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 800 750"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Water Linear Gradients */}
            <linearGradient id="gangaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="brahmaputraGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Radar precipitation overlay gradient */}
            <radialGradient id="rainRadarAssam" cx="80%" cy="32%" r="20%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </radialGradient>
            <radialGradient id="rainRadarDelhi" cx="35%" cy="26%" r="14%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* India Continental Landmass Base Silhouette */}
          <path
            d="M 230 110 
               L 310 95 L 340 135 L 390 145 L 430 180 L 510 185 L 560 215 
               L 660 210 L 730 240 L 740 280 L 680 320 L 630 330 L 610 380 
               L 520 400 L 490 470 L 460 540 L 380 670 L 350 710 L 320 660 
               L 260 520 L 220 460 L 150 400 L 170 330 L 130 300 L 160 240 
               L 200 200 Z"
            fill="#dbeafe"
            fillOpacity="0.5"
            stroke="#93c5fd"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Radar Rain Overlays */}
          {layers.radar && (
            <>
              <circle cx="680" cy="245" r="85" fill="url(#rainRadarAssam)" />
              <circle cx="280" cy="195" r="60" fill="url(#rainRadarDelhi)" />
            </>
          )}

          {/* Major Indian River Pathways */}
          {/* 1. Indus & Tributaries */}
          <path
            d="M 250 80 Q 240 120 230 150 T 200 210"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 2. Ganga River Mainstem */}
          <path
            d="M 280 160 Q 320 180 380 230 T 480 270 T 560 300 T 600 360"
            fill="none"
            stroke="url(#gangaGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Yamuna Tributary */}
          <path
            d="M 270 170 Q 290 220 360 240 T 430 260"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* 3. Brahmaputra River Basin */}
          <path
            d="M 520 170 Q 640 180 730 220 Q 720 250 670 260 T 610 330"
            fill="none"
            stroke="url(#brahmaputraGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Teesta */}
          <path
            d="M 570 220 Q 580 260 590 280"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 4. Narmada & Tapti */}
          <path
            d="M 390 340 Q 280 345 220 375"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* 5. Mahanadi */}
          <path
            d="M 440 360 Q 480 370 540 370"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 6. Godavari River */}
          <path
            d="M 260 410 Q 340 430 460 440 T 530 460"
            fill="none"
            stroke="#0284c7"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* 7. Krishna River */}
          <path
            d="M 280 470 Q 360 490 450 495 T 510 500"
            fill="none"
            stroke="#0369a1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 8. Kaveri River */}
          <path
            d="M 310 570 Q 370 580 430 585 T 465 595"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* River Labels */}
          {!isMiniMap && (
            <>
              <text x="360" y="220" fontSize="11" fontWeight="600" fill="#0369a1" opacity="0.8">
                Ganga Basin
              </text>
              <text x="635" y="225" fontSize="11" fontWeight="600" fill="#0369a1" opacity="0.8">
                Brahmaputra
              </text>
              <text x="245" y="240" fontSize="10" fontWeight="500" fill="#0284c7" opacity="0.8">
                Yamuna
              </text>
              <text x="360" y="425" fontSize="10" fontWeight="500" fill="#0369a1" opacity="0.8">
                Godavari
              </text>
              <text x="370" y="485" fontSize="10" fontWeight="500" fill="#0369a1" opacity="0.8">
                Krishna
              </text>
              <text x="360" y="575" fontSize="10" fontWeight="500" fill="#0369a1" opacity="0.8">
                Kaveri
              </text>
            </>
          )}

          {/* Sensor Pins */}
          {layers.sensors &&
            sensors.map((sensor) => {
              const { x, y } = getCoordinates(sensor.coordinates.lat, sensor.coordinates.lng);
              const isCritical = sensor.status === 'CRITICAL';
              const isWarning = sensor.status === 'WARNING';
              const isSelected = selectedStationId === sensor.id || activeItem?.id === sensor.id;

              const pinColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

              return (
                <g
                  key={sensor.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => handleSelect(sensor)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {isCritical && (
                    <circle r="14" fill="#ef4444" fillOpacity="0.25" className="animate-ping" />
                  )}
                  <circle
                    r={isSelected ? '9' : '6.5'}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                  {/* Pin center water icon */}
                  <circle r="2.5" fill="#ffffff" />
                  {!isMiniMap && (
                    <text
                      y="16"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill="#1e293b"
                      className="pointer-events-none drop-shadow-xs"
                    >
                      {sensor.name.split(' - ')[0]}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Active Alert Warning Pulse Markers */}
          {layers.alerts &&
            alerts
              .filter((a) => a.active && a.coordinates)
              .map((alert) => {
                const { x, y } = getCoordinates(alert.coordinates!.lat, alert.coordinates!.lng);
                return (
                  <g
                    key={alert.id}
                    transform={`translate(${x + 12}, ${y - 12})`}
                    onClick={() => handleSelect(alert)}
                    className="cursor-pointer"
                  >
                    <polygon
                      points="0,-8 7,5 -7,5"
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <circle r="1.5" cy="1" fill="#ffffff" />
                  </g>
                );
              })}
        </svg>
      </div>

      {/* Selected Item Floating Inspection Card */}
      {activeItem && !isMiniMap && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 z-30 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  'status' in activeItem && activeItem.status === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {'status' in activeItem ? activeItem.status : 'ACTIVE WARNING'}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {'name' in activeItem ? activeItem.name : activeItem.title}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeItem.location}</span>
              </p>
            </div>
            <button
              onClick={() => setActiveItem(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              ✕
            </button>
          </div>

          {'waterLevel' in activeItem && (
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-500">Water Level</div>
                <div className="text-sm font-bold text-slate-900">
                  {activeItem.waterLevel} m
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-500">Danger Mark</div>
                <div className="text-sm font-bold text-rose-600">
                  {activeItem.dangerLevel} m
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-500">24h Rain</div>
                <div className="text-sm font-bold text-sky-700">
                  {activeItem.rainfall} mm
                </div>
              </div>
            </div>
          )}

          {'affectedPopulation' in activeItem && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Affected Population:</span>
              <span className="font-bold text-slate-800">
                {activeItem.affectedPopulation.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mini-map legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-slate-600 flex items-center gap-3 border border-slate-200/60">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Normal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Warning
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> High / Critical
        </span>
      </div>
    </div>
  );
};
