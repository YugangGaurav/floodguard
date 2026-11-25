import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  TrendingUp,
  Activity,
  Waves,
  CloudRain,
  History,
  BellRing,
  LifeBuoy,
  FileBarChart,
  Settings,
  UserCheck,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { alerts, sensors } = useApp();

  const criticalSensors = sensors.filter((s) => s.status === 'CRITICAL').length;
  const activeAlerts = alerts.filter((a) => a.active).length;

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/map', label: 'Live Flood Map', icon: MapPin },
    { to: '/forecast', label: 'Flood Forecast', icon: TrendingUp },
    {
      to: '/sensors',
      label: 'Sensors & Stations',
      icon: Activity,
      badge: criticalSensors > 0 ? `${criticalSensors} Crit` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    { to: '/rivers', label: 'River Monitoring', icon: Waves },
    { to: '/rainfall', label: 'Rainfall & Radar', icon: CloudRain },
    { to: '/historical', label: 'Historical Analysis', icon: History },
    {
      to: '/alerts',
      label: 'Alerts & Warnings',
      icon: BellRing,
      badge: activeAlerts > 0 ? `${activeAlerts}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    { to: '/emergency', label: 'Emergency Response', icon: LifeBuoy },
    { to: '/reports', label: 'Reports & Analytics', icon: FileBarChart },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/profile', label: 'Agency Profile', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[57px] h-full md:h-[calc(100vh-57px)] w-64 bg-white border-r border-slate-200/90 z-40 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Monitoring & Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold shadow-sm border border-sky-100/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-500" />}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Status Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-700">Central Telemetry Mesh</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Monitoring 12 River Basins across India. Doppler radars and ultrasonic transducers active.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>NDMA / CWC Feeds</span>
              <span className="text-emerald-600 font-semibold">99.8% Uptime</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
