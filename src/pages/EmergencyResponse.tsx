import React, { useState } from 'react';
import {
  LifeBuoy,
  ShieldAlert,
  Users,
  Anchor,
  PhoneCall,
  Home,
  CheckCircle2,
  MapPin,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmergencyResponse: React.FC = () => {
  const { emergencyUnits, reliefCamps } = useApp();
  const [activeTab, setActiveTab] = useState<'UNITS' | 'CAMPS' | 'DIRECTORY'>('UNITS');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Disaster Response & Rescue Flotilla Operations</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              NDRF / SDRF Integrated
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live deployment tracking of National Disaster Response Force battalions, motorboat flotillas, and multi-purpose relief camps.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('UNITS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'UNITS' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Rescue Units ({emergencyUnits.length})
          </button>
          <button
            onClick={() => setActiveTab('CAMPS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'CAMPS' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Relief Camps ({reliefCamps.length})
          </button>
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'DIRECTORY' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500'
            }`}
          >
            Emergency Directory
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Responders Deployed</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {emergencyUnits.reduce((acc, u) => acc + u.personnelCount, 0)} Personnel
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Active in field sectors</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Inflatable Motorized Boats</span>
          <div className="text-2xl font-extrabold text-sky-700 mt-1">
            {emergencyUnits.reduce((acc, u) => acc + u.inflatableBoats, 0)} Flotillas
          </div>
          <div className="text-xs text-sky-600 font-semibold mt-1">Equipped with OBM engines</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Relief Camp Occupancy</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {reliefCamps.reduce((acc, c) => acc + c.currentOccupancy, 0).toLocaleString()} /{' '}
            {reliefCamps.reduce((acc, c) => acc + c.capacity, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Safe shelter capacity</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Emergency Control Hotline</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">1070 / 1078</div>
          <div className="text-xs text-rose-600 font-semibold mt-1">National Disaster Toll-Free</div>
        </div>
      </div>

      {/* Tab 1: Emergency Rescue Units */}
      {activeTab === 'UNITS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {emergencyUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase">
                      {unit.agency}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {unit.unitName}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{unit.location}, {unit.state}</span>
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      unit.status === 'Deployed'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : unit.status === 'En Route'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400">Personnel</span>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {unit.personnelCount}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400">Boats</span>
                    <div className="text-base font-bold text-sky-700 mt-0.5">
                      {unit.inflatableBoats}
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400">Medical Kits</span>
                    <div className="text-base font-bold text-emerald-700 mt-0.5">
                      {unit.medicalKits}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commander:</span>
                    <span className="font-semibold text-slate-800">{unit.contactPerson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ops Hotline:</span>
                    <span className="font-mono font-bold text-sky-700">{unit.contactNumber}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Coordinates: {unit.coordinates.lat.toFixed(2)}°N, {unit.coordinates.lng.toFixed(2)}°E</span>
                <a
                  href={`tel:${unit.contactNumber}`}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Call Unit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Relief Camps */}
      {activeTab === 'CAMPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reliefCamps.map((camp) => {
            const occupancyPct = Math.round((camp.currentOccupancy / camp.capacity) * 100);

            return (
              <div
                key={camp.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      Official Relief Facility
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{camp.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{camp.district}, {camp.state}</span>
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {camp.currentOccupancy} / {camp.capacity} Occupied
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Shelter Occupancy:</span>
                    <span className="font-bold text-slate-800">{occupancyPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400">Ration Stock</span>
                    <div className="font-bold text-slate-900 mt-0.5">{camp.foodStockDays} Days</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400">Medical Doctors</span>
                    <div className="font-bold text-slate-900 mt-0.5">{camp.medicalOfficers} On-Duty</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400">Clean Water</span>
                    <div className="font-bold text-emerald-700 mt-0.5">Certified Safe</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Camp Coordinator:</span>
                  <span className="font-mono font-bold text-sky-700">{camp.contactNumber}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Emergency Contacts Directory */}
      {activeTab === 'DIRECTORY' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            National & State Emergency Operations Centres (SEOC)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">National Disaster Management Authority (NDMA)</h4>
              <p className="text-slate-500 text-[11px] mt-1">24x7 National Control Room, New Delhi</p>
              <div className="mt-3 font-mono text-sm font-bold text-rose-600">011-26701728 / 1078</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Assam State Disaster Management (ASDMA)</h4>
              <p className="text-slate-500 text-[11px] mt-1">Dispur SEOC Hotline</p>
              <div className="mt-3 font-mono text-sm font-bold text-sky-700">1070 / 1079</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Delhi Disaster Management Authority (DDMA)</h4>
              <p className="text-slate-500 text-[11px] mt-1">Revenue Department Control Room</p>
              <div className="mt-3 font-mono text-sm font-bold text-sky-700">1077</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Bihar State Disaster Authority</h4>
              <p className="text-slate-500 text-[11px] mt-1">Sardar Patel Bhawan, Patna</p>
              <div className="mt-3 font-mono text-sm font-bold text-sky-700">0612-2294204</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Kerala State Emergency Operations (KSEOC)</h4>
              <p className="text-slate-500 text-[11px] mt-1">Thiruvananthapuram Control</p>
              <div className="mt-3 font-mono text-sm font-bold text-sky-700">1077 / 0471-2364424</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900">Indian Meteorological Department (IMD)</h4>
              <p className="text-slate-500 text-[11px] mt-1">Mausam Bhawan National Weather Desk</p>
              <div className="mt-3 font-mono text-sm font-bold text-slate-800">1800-180-1717</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
