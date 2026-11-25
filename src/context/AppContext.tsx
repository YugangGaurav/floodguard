import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SensorData,
  RiverStation,
  AlertRecord,
  ForecastPoint,
  RainfallStation,
  EmergencyResponseUnit,
  ReliefCamp,
  HistoricalFloodEvent,
  RegionSettings,
  AppConfig,
} from '../types';
import {
  MOCK_SENSORS,
  MOCK_RIVER_STATIONS,
  MOCK_ALERTS,
  MOCK_FORECAST_TIMELINE,
  MOCK_RAINFALL_STATIONS,
  MOCK_EMERGENCY_UNITS,
  MOCK_RELIEF_CAMPS,
  MOCK_HISTORICAL_EVENTS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  // Data
  sensors: SensorData[];
  riverStations: RiverStation[];
  alerts: AlertRecord[];
  forecastTimeline: ForecastPoint[];
  rainfallStations: RainfallStation[];
  emergencyUnits: EmergencyResponseUnit[];
  reliefCamps: ReliefCamp[];
  historicalEvents: HistoricalFloodEvent[];

  // Settings & Configuration
  regionSettings: RegionSettings;
  updateRegionSettings: (settings: Partial<RegionSettings>) => void;
  appConfig: AppConfig;
  updateAppConfig: (config: Partial<AppConfig>) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStateFilter: string;
  setSelectedStateFilter: (state: string) => void;
  selectedBasinFilter: string;
  setSelectedBasinFilter: (basin: string) => void;

  // Actions
  sendNewAlert: (alert: Omit<AlertRecord, 'id' | 'sent'>) => void;
  dismissAlert: (id: string) => void;
  isSimulationActive: boolean;
  toggleSimulation: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;

  // Live vs Demo Stats
  lastSyncTime: string;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<SensorData[]>(MOCK_SENSORS);
  const [riverStations, setRiverStations] = useState<RiverStation[]>(MOCK_RIVER_STATIONS);
  const [alerts, setAlerts] = useState<AlertRecord[]>(MOCK_ALERTS);
  const [forecastTimeline] = useState<ForecastPoint[]>(MOCK_FORECAST_TIMELINE);
  const [rainfallStations, setRainfallStations] = useState<RainfallStation[]>(MOCK_RAINFALL_STATIONS);
  const [emergencyUnits] = useState<EmergencyResponseUnit[]>(MOCK_EMERGENCY_UNITS);
  const [reliefCamps] = useState<ReliefCamp[]>(MOCK_RELIEF_CAMPS);
  const [historicalEvents] = useState<HistoricalFloodEvent[]>(MOCK_HISTORICAL_EVENTS);

  const [regionSettings, setRegionSettings] = useState<RegionSettings>({
    mode: 'india',
    selectedState: 'All States',
    selectedBasin: 'All Basins',
    selectedDistrict: 'All Districts',
    timezone: 'Asia/Kolkata',
    units: {
      waterLevel: 'meters',
      rainfall: 'mm',
      temperature: 'celsius',
    },
  });

  const [appConfig, setAppConfig] = useState<AppConfig>({
    appMode: (import.meta.env.VITE_APP_MODE as 'demo' | 'live') || 'demo',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All States');
  const [selectedBasinFilter, setSelectedBasinFilter] = useState('All Basins');
  const [isSimulationActive, setIsSimulationActive] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateRegionSettings = (settings: Partial<RegionSettings>) => {
    setRegionSettings((prev) => ({ ...prev, ...settings }));
    addToast({
      type: 'info',
      title: 'Region Updated',
      message: `Switched region settings to ${settings.mode === 'global' ? 'Global Monitoring' : 'India Monitoring'}`,
    });
  };

  const updateAppConfig = (config: Partial<AppConfig>) => {
    setAppConfig((prev) => ({ ...prev, ...config }));
    addToast({
      type: 'success',
      title: 'Configuration Saved',
      message: 'Application settings and API credentials updated successfully.',
    });
  };

  const sendNewAlert = (alertData: Omit<AlertRecord, 'id' | 'sent'>) => {
    const newAlert: AlertRecord = {
      ...alertData,
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      sent: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    addToast({
      type: 'warning',
      title: `Emergency Broadcast Sent: ${newAlert.title}`,
      message: `Target Location: ${newAlert.location}. Population notified: ${newAlert.affectedPopulation.toLocaleString()}`,
    });
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === id ? { ...alt, active: false } : alt))
    );
    addToast({
      type: 'info',
      title: 'Alert Status Updated',
      message: `Alert ID ${id} marked as resolved.`,
    });
  };

  const toggleSimulation = () => {
    setIsSimulationActive((prev) => !prev);
    addToast({
      type: 'info',
      title: !isSimulationActive ? 'Telemetry Simulation Started' : 'Simulation Paused',
      message: !isSimulationActive
        ? 'Real-time hydrological stream data is now streaming every 12 seconds.'
        : 'Telemetry updates paused.',
    });
  };

  const refreshData = () => {
    setLastSyncTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
    addToast({
      type: 'success',
      title: 'Data Refreshed',
      message: 'Telemetry sensors, river gauges and radar feeds synchronized.',
    });
  };

  // Telemetry fluctuation simulation
  useEffect(() => {
    if (!isSimulationActive) return;

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          // slight random jitter (+/- 0.03m water level, +/- 1mm rain)
          const delta = (Math.random() - 0.48) * 0.04;
          const newLevel = Math.max(1, +(sensor.waterLevel + delta).toFixed(2));
          return {
            ...sensor,
            waterLevel: newLevel,
            lastUpdated: 'Just now',
          };
        })
      );
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
    }, 15000);

    return () => clearInterval(interval);
  }, [isSimulationActive]);

  return (
    <AppContext.Provider
      value={{
        sensors,
        riverStations,
        alerts,
        forecastTimeline,
        rainfallStations,
        emergencyUnits,
        reliefCamps,
        historicalEvents,
        regionSettings,
        updateRegionSettings,
        appConfig,
        updateAppConfig,
        searchQuery,
        setSearchQuery,
        selectedStateFilter,
        setSelectedStateFilter,
        selectedBasinFilter,
        setSelectedBasinFilter,
        sendNewAlert,
        dismissAlert,
        isSimulationActive,
        toggleSimulation,
        toasts,
        addToast,
        removeToast,
        lastSyncTime,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
