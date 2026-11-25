import React, { useState } from 'react';
import {
  BellRing,
  Send,
  AlertTriangle,
  MapPin,
  CheckCircle,
  Filter,
  Search,
  Users,
  ShieldAlert,
  Clock,
  Radio,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SendAlertModal } from '../components/dashboard/SendAlertModal';
import { AlertRecord } from '../types';

export const Alerts: React.FC = () => {
  const { alerts, dismissAlert } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesActive = !filterActiveOnly || a.active;
    return matchesSeverity && matchesActive;
  });

  const activeCount = alerts.filter((a) => a.active).length;
  const criticalCount = alerts.filter((a) => a.active && (a.severity === 'HIGH' || a.severity === 'CRITICAL')).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Early Warning & Emergency Alert Dispatcher</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {activeCount} Active Warnings
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Common Alerting Protocol (CAP) multichannel broadcast console for district authorities, SDRF, and public sirens.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Emergency Alert</span>
        </button>
      </div>

      {/* Filter and Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Critical High-Risk Alerts</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{criticalCount}</div>
          <div className="text-xs text-rose-600 mt-1 font-semibold">Immediate evacuation advised</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Total Citizens Covered</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {alerts
              .filter((a) => a.active)
              .reduce((acc, curr) => acc + curr.affectedPopulation, 0)
              .toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Via CAP SMS & Siren Hubs</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-medium">Broadcast Gateway</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">ONLINE</div>
          <div className="text-xs text-slate-500 mt-1">NDMA Cell Broadcast Active</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Severity:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filterActiveOnly}
            onChange={(e) => setFilterActiveOnly(e.target.checked)}
            className="rounded text-sky-600"
          />
          <span className="font-medium">Show Active Alerts Only</span>
        </label>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                alert.active
                  ? isCritical
                    ? 'border-rose-300 shadow-sm'
                    : 'border-slate-200/80 shadow-xs'
                  : 'border-slate-200/60 opacity-70 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.severity === 'HIGH'
                          ? 'bg-red-100 text-red-700'
                          : alert.severity === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {alert.severity} • {alert.type}
                    </span>
                    {!alert.active && (
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        RESOLVED
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.sent}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2.5">
                  {alert.title}
                </h3>

                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {alert.location}, {alert.state} ({alert.riverBasin} Basin)
                  </span>
                </p>

                <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {alert.feedback}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Affected: <b>{alert.affectedPopulation.toLocaleString()}</b></span>
                  </div>
                  <div>
                    <span>Evacuation: <b className="text-rose-600">{alert.evacuationStatus}</b></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">ID: {alert.id}</span>
                {alert.active && (
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Modal */}
      <SendAlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
