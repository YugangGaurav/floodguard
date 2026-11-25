export type RiskLevel = 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type SensorStatus = 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SensorData {
  id: string;
  name: string;
  code: string;
  location: string;
  state: string;
  district: string;
  riverBasin: string;
  coordinates: Coordinates;
  waterLevel: number; // in meters
  dangerLevel: number; // in meters
  warningLevel: number; // in meters
  rainfall: number; // 24h rainfall in mm
  humidity: number; // percentage
  temperature: number; // celsius
  batteryLevel: number; // percentage
  signalStrength: number; // percentage
  status: SensorStatus;
  lastUpdated: string;
  telemetryType: 'Ultrasonic' | 'Radar' | 'Pressure Transducer' | 'Doppler Streamflow';
}

export interface RiverStation {
  id: string;
  name: string;
  riverName: string;
  basin: string;
  state: string;
  location: string;
  currentLevel: number;
  warningLevel: number;
  dangerLevel: number;
  highestFloodLevel: number; // HFL
  dischargeRate: number; // m³/s
  trend: 'RISING' | 'FALLING' | 'STEADY';
  status: RiskLevel;
  coordinates: Coordinates;
  lastUpdated: string;
}

export interface AlertRecord {
  id: string;
  title: string;
  location: string;
  state: string;
  district: string;
  riverBasin: string;
  type: 'Alert' | 'Warning' | 'Evacuation' | 'Advisory';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sent: string;
  feedback: string;
  affectedPopulation: number;
  evacuationStatus: 'Mandatory' | 'Recommended' | 'Not Required' | 'Completed';
  active: boolean;
  coordinates?: Coordinates;
}

export interface ForecastPoint {
  time: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  waterLevel: number; // meters
  rainfall: number; // mm
  confidence: number; // percentage
  riskLevel: RiskLevel;
}

export interface RainfallStation {
  id: string;
  stationName: string;
  district: string;
  state: string;
  rainfallPast1h: number;
  rainfallPast24h: number;
  departureFromNormal: number; // percentage (+ or -)
  category: 'Normal' | 'Excess' | 'Heavy' | 'Extremely Heavy';
  coordinates: Coordinates;
  radarStatus: 'Active' | 'Calibrating';
}

export interface EmergencyResponseUnit {
  id: string;
  unitName: string;
  agency: 'NDRF' | 'SDRF' | 'Indian Coast Guard' | 'Civil Defence' | 'Quick Response Team';
  location: string;
  state: string;
  personnelCount: number;
  inflatableBoats: number;
  medicalKits: number;
  status: 'Deployed' | 'Standby' | 'En Route' | 'Resting';
  contactPerson: string;
  contactNumber: string;
  coordinates: Coordinates;
}

export interface ReliefCamp {
  id: string;
  name: string;
  district: string;
  state: string;
  capacity: number;
  currentOccupancy: number;
  foodStockDays: number;
  medicalOfficers: number;
  cleanWaterSupply: boolean;
  contactNumber: string;
}

export interface HistoricalFloodEvent {
  id: string;
  title: string;
  year: number;
  region: string;
  state: string;
  primaryRivers: string[];
  peakWaterLevel: number;
  peakDischarge: number;
  max24hRainfall: number;
  peopleDisplaced: number;
  summary: string;
  keyLearnings: string[];
}

export interface RegionSettings {
  mode: 'india' | 'global';
  selectedState: string;
  selectedBasin: string;
  selectedDistrict: string;
  timezone: string;
  units: {
    waterLevel: 'meters' | 'feet';
    rainfall: 'mm' | 'inches';
    temperature: 'celsius' | 'fahrenheit';
  };
}

export interface AppConfig {
  appMode: 'demo' | 'live';
  googleMapsApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}
