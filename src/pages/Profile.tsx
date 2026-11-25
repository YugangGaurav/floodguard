import React from 'react';
import {
  User,
  Shield,
  Award,
  Building,
  Mail,
  Phone,
  Calendar,
  Lock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Profile: React.FC = () => {
  const { regionSettings } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-600 to-navy-800 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0 tracking-wider">
          YG
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Yugang Gaurav</h1>
              <p className="text-xs text-slate-500 font-medium">Lead System Architect & National Operations Director</p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              Agency Administrator
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>FloodGuard Command Network • Central Water Commission (CWC) Grid</span>
            </span>
            <a
              href="mailto:gauravyugang@gmail.com"
              className="flex items-center gap-1.5 hover:text-sky-600 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>gauravyugang@gmail.com</span>
            </a>
            <a
              href="https://github.com/YugangGaurav"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-sky-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>github.com/YugangGaurav</span>
            </a>
          </div>
        </div>
      </div>

      {/* Operational Credentials & Access Clearances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Dispatch Authorization Tier</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">CAP Broadcast Level:</span>
              <span className="font-bold text-rose-600">Tier 1 (National Sirens & Cell Blast)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">Reservoir Gate Override:</span>
              <span className="font-bold text-emerald-700">Authorized Signatory</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">NDRF Liaison Desk:</span>
              <span className="font-bold text-sky-700">Level 4 Operations Coordinator</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Active Security Session</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Authentication Method:</span>
              <span className="font-semibold">FIDO2 WebAuthn / PKI Token</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Default Region:</span>
              <span className="font-semibold uppercase">{regionSettings.mode} Monitoring</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">System Timezone:</span>
              <span className="font-mono">{regionSettings.timezone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Telemetry Sign-in:</span>
              <span className="font-mono text-slate-800">2026-11-25 08:30:14 IST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
