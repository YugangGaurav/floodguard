import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { SensorData, RiverStation, AlertRecord } from '../../types';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Map as MapIcon } from 'lucide-react';

interface LeafletMapProps {
  height?: string;
  onMarkerClick?: (item: SensorData | RiverStation | AlertRecord) => void;
  selectedStationId?: string;
  isMiniMap?: boolean;
}

export const LeafletMapComponent: React.FC<LeafletMapProps> = ({
  height = '540px',
  onMarkerClick,
  selectedStationId,
  isMiniMap = false,
}) => {
  const { sensors, riverStations, alerts, regionSettings } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [tileLayerType, setTileLayerType] = useState<'streets' | 'satellite' | 'topo'>('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Center on India or Global
    const centerLatLng: [number, number] =
      regionSettings.mode === 'global' ? [20.0, 0.0] : [22.5937, 78.9629];
    const initialZoom = isMiniMap ? 4 : regionSettings.mode === 'global' ? 2 : 5;

    const map = L.map(mapContainerRef.current, {
      center: centerLatLng,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: !isMiniMap,
    });

    mapInstanceRef.current = map;

    // Tile layers (Free, reliable, no API key needed)
    const streetTile = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    );

    const satelliteTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri &copy; Earthstar Geographics',
        maxZoom: 18,
      }
    );

    const topoTile = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors, SRTM',
        maxZoom: 17,
      }
    );

    if (tileLayerType === 'satellite') {
      satelliteTile.addTo(map);
    } else if (tileLayerType === 'topo') {
      topoTile.addTo(map);
    } else {
      streetTile.addTo(map);
    }

    // Add Layer Group for Markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Invalidate size after rendering to avoid gray tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [tileLayerType, isMiniMap, regionSettings.mode]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Add Sensor Markers
    sensors.forEach((sensor) => {
      const isCritical = sensor.status === 'CRITICAL';
      const isWarning = sensor.status === 'WARNING';
      const color = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            position: relative;
            width: ${isMiniMap ? '18px' : '26px'};
            height: ${isMiniMap ? '18px' : '26px'};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${
              isCritical
                ? `<div style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: ${color};
                    opacity: 0.4;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></div>`
                : ''
            }
            <div style="
              width: ${isMiniMap ? '12px' : '18px'};
              height: ${isMiniMap ? '12px' : '18px'};
              background: ${color};
              border: 2px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="width: 4px; height: 4px; background: #ffffff; border-radius: 50%;"></div>
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([sensor.coordinates.lat, sensor.coordinates.lng], {
        icon: customIcon,
      });

      if (!isMiniMap) {
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; min-width: 180px;">
            <div style="font-size: 10px; font-weight: 800; color: ${color}; text-transform: uppercase;">
              ${sensor.status} STAGE
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-top: 2px;">
              ${sensor.name}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              ${sensor.location} • ${sensor.riverBasin}
            </div>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
              <span style="color: #475569;">Stage Level:</span>
              <span style="font-weight: 800; color: #0f172a;">${sensor.waterLevel.toFixed(2)} m</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 3px;">
              <span style="color: #64748b;">Danger Mark:</span>
              <span style="font-weight: 700; color: #e11d48;">${sensor.dangerLevel} m</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 3px;">
              <span style="color: #64748b;">24h Rain:</span>
              <span style="font-weight: 700; color: #0284c7;">${sensor.rainfall} mm</span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(sensor);
        });
      }

      marker.addTo(markersLayerRef.current!);
    });

    // 2. Add Active Alerts Warning Markers
    alerts
      .filter((a) => a.active && a.coordinates)
      .forEach((alert) => {
        const alertIcon = L.divIcon({
          className: 'custom-alert-marker',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              background: #dc2626;
              border: 2px solid #ffffff;
              border-radius: 6px;
              box-shadow: 0 2px 5px rgba(220,38,38,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            ">
              !
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([alert.coordinates!.lat, alert.coordinates!.lng], {
          icon: alertIcon,
        });

        if (!isMiniMap) {
          marker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; min-width: 190px;">
              <div style="font-size: 10px; font-weight: 800; color: #dc2626; text-transform: uppercase;">
                ${alert.severity} • ${alert.type}
              </div>
              <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-top: 2px;">
                ${alert.title}
              </div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                ${alert.location}
              </div>
              <div style="font-size: 11px; color: #334155; margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                ${alert.feedback}
              </div>
            </div>
          `);

          marker.on('click', () => {
            if (onMarkerClick) onMarkerClick(alert);
          });
        }

        marker.addTo(markersLayerRef.current!);
      });
  }, [sensors, alerts, isMiniMap, onMarkerClick]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-inner bg-slate-100 flex flex-col"
      style={{ height }}
    >
      {/* Map Tile Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Controls Overlay (Only on Full Map) */}
      {!isMiniMap && (
        <>
          {/* Zoom and Reset Controls */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 p-1 flex items-center gap-1">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  mapInstanceRef.current?.setView(
                    regionSettings.mode === 'global' ? [20.0, 0.0] : [22.5937, 78.9629],
                    regionSettings.mode === 'global' ? 2 : 5
                  )
                }
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                title="Reset Center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Tile Layer Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className="bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <MapIcon className="w-4 h-4 text-sky-600" />
                <span className="capitalize">{tileLayerType} View</span>
              </button>

              {showLayerMenu && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 text-xs">
                  <div className="font-bold text-slate-800 px-2 py-1 text-[11px] uppercase tracking-wider text-slate-400">
                    Tile Source
                  </div>
                  <button
                    onClick={() => {
                      setTileLayerType('streets');
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      tileLayerType === 'streets' ? 'bg-sky-50 text-sky-800 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    Clean Carto (Google-like)
                  </button>
                  <button
                    onClick={() => {
                      setTileLayerType('satellite');
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      tileLayerType === 'satellite' ? 'bg-sky-50 text-sky-800 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    Esri Satellite Imagery
                  </button>
                  <button
                    onClick={() => {
                      setTileLayerType('topo');
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      tileLayerType === 'topo' ? 'bg-sky-50 text-sky-800 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    OpenTopo Watershed
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Top Right Status Badge */}
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2 text-[11px] text-slate-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Static Telemetry Map • {sensors.length} Stations Active</span>
            </div>
          </div>
        </>
      )}

      {/* Mini-map bottom legend */}
      <div className="absolute bottom-2 right-2 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-slate-600 flex items-center gap-3 border border-slate-200/80 shadow-xs">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Normal
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Warning
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> High / Critical
        </span>
      </div>
    </div>
  );
};
