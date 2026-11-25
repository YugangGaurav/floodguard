import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toasts, removeToast } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-3.5 shadow-xl border flex items-start gap-3 transform transition-all duration-200 bg-white ${
              toast.type === 'error'
                ? 'border-rose-200 text-rose-900'
                : toast.type === 'warning'
                ? 'border-amber-200 text-amber-900'
                : toast.type === 'success'
                ? 'border-emerald-200 text-emerald-900'
                : 'border-sky-200 text-slate-900'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold">{toast.title}</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
              <span className="text-[9px] text-slate-400 mt-1 block">{toast.timestamp}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
