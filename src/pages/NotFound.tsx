import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home, MapPin, Bell } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 sm:p-12 max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-sky-600 uppercase tracking-widest">
            Error 404 • Hydrological Reach Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Sector Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The requested monitoring page or telemetry station coordinate could not be resolved in the national flood grid.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <Link
            to="/"
            className="p-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Overview</span>
          </Link>
          <Link
            to="/map"
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Flood Map</span>
          </Link>
          <Link
            to="/alerts"
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
