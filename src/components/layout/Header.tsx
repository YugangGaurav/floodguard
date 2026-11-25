import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Globe,
  Radio,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const {
    alerts,
    regionSettings,
    updateRegionSettings,
    appConfig,
    searchQuery,
    setSearchQuery,
    lastSyncTime,
    refreshData,
    isSimulationActive,
    toggleSimulation,
  } = useApp();

  const navigate = useNavigate();
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const activeAlerts = alerts.filter((a) => a.active);
  const criticalCount = activeAlerts.filter((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;

  return (
    <header className="bg-navy-800 text-white border-b border-navy-900 sticky top-0 z-30 shadow-md">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Identity */}
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Water Drop Logo */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Flood<span className="text-sky-400">Guard</span>
              </span>
              <span className="text-xs font-normal text-slate-400 hidden sm:inline-block border-l border-slate-600 pl-2">
                Agency Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search & Region Switcher */}
        <div className="flex-1 max-w-xl mx-2 hidden lg:flex items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search river basins, gauge stations, districts (e.g. Brahmaputra, Delhi, Patna)..."
              className="w-full bg-navy-900/80 text-sm text-slate-200 placeholder-slate-400 rounded-lg pl-9 pr-4 py-1.5 border border-slate-700/60 focus:outline-none focus:border-sky-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Region Switch, Mode Indicator, Live Telemetry, Alerts & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* India / Global Region Toggle */}
          <div className="hidden sm:flex items-center bg-navy-900/90 rounded-lg p-0.5 border border-slate-700/70 text-xs font-medium">
            <button
              onClick={() => updateRegionSettings({ mode: 'india' })}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                regionSettings.mode === 'india'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Focus on India National River Basins & Central Water Commission stations"
            >
              <span>🇮🇳</span>
              <span>India</span>
            </button>
            <button
              onClick={() => updateRegionSettings({ mode: 'global' })}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                regionSettings.mode === 'global'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Global basin overview and transboundary monitoring"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global</span>
            </button>
          </div>

          {/* Data Mode Indicator */}
          <div className="flex items-center">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              title="Self-contained static dataset with authentic Central Water Commission & IMD hydrological telemetry"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline">STATIC TELEMETRY</span>
              <span className="sm:hidden font-mono text-[10px]">STATIC</span>
            </span>
          </div>

          {/* Realtime Stream Toggle & Sync */}
          <button
            onClick={toggleSimulation}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isSimulationActive
                ? 'border-sky-500/50 bg-sky-500/10 text-sky-400'
                : 'border-slate-700 bg-navy-900 text-slate-400 hover:text-white'
            }`}
            title={isSimulationActive ? 'Real-time telemetry stream active (click to pause)' : 'Telemetry paused'}
          >
            <Radio className={`w-4 h-4 ${isSimulationActive ? 'animate-pulse text-sky-400' : ''}`} />
          </button>

          <button
            onClick={refreshData}
            className="p-1.5 rounded-lg border border-slate-700 bg-navy-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={`Last synced at ${lastSyncTime}. Click to refresh feeds.`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Alerts Notification Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAlertMenu(!showAlertMenu);
                setShowProfileMenu(false);
              }}
              className="relative p-1.5 rounded-lg border border-slate-700 bg-navy-900 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              aria-label="Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="text-xs font-medium hidden md:inline">Alerts</span>
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {criticalCount}
                </span>
              )}
            </button>

            {showAlertMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Active Flood Alerts ({activeAlerts.length})</span>
                  </div>
                  <Link
                    to="/alerts"
                    onClick={() => setShowAlertMenu(false)}
                    className="text-xs text-sky-600 hover:underline font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {activeAlerts.slice(0, 4).map((alert) => (
                    <div key={alert.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700'
                              : alert.severity === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[11px] text-slate-400">{alert.sent.slice(11)}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{alert.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{alert.location}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <button
                    onClick={() => {
                      setShowAlertMenu(false);
                      navigate('/alerts');
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium w-full py-1"
                  >
                    Open Early Warning Console →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowAlertMenu(false);
              }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg border border-slate-700 bg-navy-900 hover:bg-slate-800 text-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 border border-sky-500/40 flex items-center justify-center font-semibold text-xs">
                A
              </div>
              <span className="text-xs font-medium hidden sm:inline">Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Dr. Yugang Gaurav</p>
                  <p className="text-[11px] text-slate-500">Chief Hydrological Officer</p>
                  <span className="inline-block mt-1 text-[10px] bg-sky-100 text-sky-800 font-medium px-2 py-0.5 rounded">
                    Central Water Commission (CWC)
                  </span>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile & Agency Credentials</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    <span>System Settings & API Keys</span>
                  </Link>
                </div>
                <div className="border-t border-slate-100 pt-1 mt-1">
                  <div className="px-4 py-1.5 text-[11px] text-slate-400">
                    Version 1.0.0 • GitHub Pages
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
