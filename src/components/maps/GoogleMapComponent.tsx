import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getGoogleMapsLoader, hasValidGoogleMapsKey } from '../../services/maps/googleMapsLoader';
import { InteractiveFallbackMap } from './InteractiveFallbackMap';
import { SensorData, RiverStation, AlertRecord } from '../../types';
import { Info, MapPin, KeyRound, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GoogleMapComponentProps {
  height?: string;
  onMarkerClick?: (item: SensorData | RiverStation | AlertRecord) => void;
  selectedStationId?: string;
  isMiniMap?: boolean;
}

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  height = '540px',
  onMarkerClick,
  selectedStationId,
  isMiniMap = false,
}) => {
  const { appConfig, sensors, alerts } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasKey = hasValidGoogleMapsKey(appConfig.googleMapsApiKey);

  useEffect(() => {
    if (!hasKey || isMiniMap) {
      return;
    }

    const loader = getGoogleMapsLoader(appConfig.googleMapsApiKey);
    if (!loader) {
      setLoadError('Google Maps API key not configured.');
      return;
    }

    let isMounted = true;

    loader
      .load()
      .then((google) => {
        if (!isMounted || !mapContainerRef.current) return;

        // Center on India: 22.5937° N, 78.9629° E
        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: 22.5937, lng: 78.9629 },
          zoom: 5,
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#a2daf2' }],
            },
            {
              featureType: 'landscape.natural.terrain',
              elementType: 'geometry',
              stylers: [{ color: '#e8f0e6' }],
            },
          ],
        });

        // Add Markers for Sensors
        sensors.forEach((sensor) => {
          const isCritical = sensor.status === 'CRITICAL';
          const markerColor = isCritical ? '#ef4444' : sensor.status === 'WARNING' ? '#f59e0b' : '#10b981';

          const marker = new google.maps.Marker({
            position: sensor.coordinates,
            map,
            title: sensor.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: isCritical ? 9 : 7,
              fillColor: markerColor,
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          const infoContent = `
            <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
              <div style="font-size: 11px; font-weight: bold; color: ${markerColor}; text-transform: uppercase;">
                ${sensor.status}
              </div>
              <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">
                ${sensor.name}
              </div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                ${sensor.location}
              </div>
              <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 12px; display: flex; justify-content: space-between;">
                <span>Water Level: <b>${sensor.waterLevel} m</b></span>
              </div>
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoContent,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
            if (onMarkerClick) {
              onMarkerClick(sensor);
            }
          });
        });

        setMapLoaded(true);
      })
      .catch((err) => {
        console.warn('Google Maps load error:', err);
        if (isMounted) {
          setLoadError('Failed to load Google Maps tiles. Switched to fallback vector map.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasKey, appConfig.googleMapsApiKey, sensors, isMiniMap]);

  // If no key or error occurred or isMiniMap, render rich InteractiveFallbackMap
  if (!hasKey || loadError || isMiniMap) {
    return (
      <div className="relative w-full flex flex-col">
        {!isMiniMap && !hasKey && (
          <div className="mb-3 px-4 py-2.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900 shadow-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Interactive Fallback Map Active:</strong> You can add your Google Maps API key in Settings or <code>.env.local</code> to activate satellite & terrain tiles.
              </span>
            </div>
            <Link
              to="/settings"
              className="font-semibold text-sky-700 hover:text-sky-900 underline flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Add Key</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}

        <InteractiveFallbackMap
          height={height}
          onMarkerClick={onMarkerClick}
          selectedStationId={selectedStationId}
          isMiniMap={isMiniMap}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
