import React, { useState } from 'react';
import { X, Send, AlertTriangle, ShieldCheck, MapPin, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AlertRecord } from '../../types';
import { INDIAN_STATES, INDIAN_RIVERS } from '../../data/mockData';

interface SendAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation?: string;
}

export const SendAlertModal: React.FC<SendAlertModalProps> = ({
  isOpen,
  onClose,
  defaultLocation = '',
}) => {
  const { sendNewAlert } = useApp();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(defaultLocation);
  const [state, setState] = useState('Assam');
  const [district, setDistrict] = useState('');
  const [riverBasin, setRiverBasin] = useState('Brahmaputra');
  const [type, setType] = useState<AlertRecord['type']>('Alert');
  const [severity, setSeverity] = useState<AlertRecord['severity']>('HIGH');
  const [affectedPopulation, setAffectedPopulation] = useState('25000');
  const [evacuationStatus, setEvacuationStatus] = useState<AlertRecord['evacuationStatus']>('Mandatory');
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    sendNewAlert({
      title,
      location,
      state,
      district: district || location,
      riverBasin,
      type,
      severity,
      feedback: feedback || 'Emergency alert dispatched to district magistrate and SDRF dispatchers.',
      affectedPopulation: parseInt(affectedPopulation) || 10000,
      evacuationStatus,
      active: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-navy-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Broadcast Emergency Flood Alert</h3>
              <p className="text-xs text-slate-300">Push early warning notification to civil defense & public channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alert Headline / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rapid Water Surge Threat on Lower Embankment"
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / Region
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {INDIAN_STATES.filter((s) => s !== 'All States').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                River Basin
              </label>
              <select
                value={riverBasin}
                onChange={(e) => setRiverBasin(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {INDIAN_RIVERS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Location / Sector *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pandu Port, Guwahati"
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Affected Population
              </label>
              <input
                type="number"
                value={affectedPopulation}
                onChange={(e) => setAffectedPopulation(e.target.value)}
                placeholder="25000"
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alert Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Alert">Alert</option>
                <option value="Warning">Warning</option>
                <option value="Evacuation">Evacuation</option>
                <option value="Advisory">Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evacuation
              </label>
              <select
                value={evacuationStatus}
                onChange={(e) => setEvacuationStatus(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Mandatory">Mandatory</option>
                <option value="Recommended">Recommended</option>
                <option value="Not Required">Not Required</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Feedback & Directives
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Rising waters approaching highway km 14. NDRF unit 1 en route."
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
