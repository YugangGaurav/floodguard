import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  Printer,
  Share2,
  FileBarChart,
  ArrowDownToLine,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Reports: React.FC = () => {
  const { addToast, sensors, riverStations, alerts } = useApp();
  const [reportType, setReportType] = useState('ALL');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportsList = [
    {
      id: 'REP-2026-1125',
      title: 'Daily National Hydrological Situation Report (SITREP)',
      date: '2026-11-25',
      type: 'Daily SITREP',
      fileSize: '2.8 MB',
      status: 'Ready',
      summary: 'Comprehensive stage discharge across 12 river basins with Brahmaputra and Yamuna flood crest propagation logs.',
    },
    {
      id: 'REP-2026-1124',
      title: 'Doppler Radar Precipitation & Monsoon Anomaly Audit',
      date: '2026-11-24',
      type: 'Rainfall Audit',
      fileSize: '4.1 MB',
      status: 'Ready',
      summary: 'Cumulative 72-hour precipitation records across Meghalaya, Assam, West Bengal, and Kerala IMD radar stations.',
    },
    {
      id: 'REP-2026-1123',
      title: 'Emergency Evacuation & NDRF Deployment Audit Report',
      date: '2026-11-23',
      type: 'Response Audit',
      fileSize: '1.9 MB',
      status: 'Ready',
      summary: 'Analysis of 142,000 citizens notified under CAP alert protocol and relief shelter food/medical inventory status.',
    },
    {
      id: 'REP-2026-1120',
      title: 'Post-Monsoon Reservoir Rule Curve & Dam Spill Compliance',
      date: '2026-11-20',
      type: 'Engineering',
      fileSize: '6.4 MB',
      status: 'Ready',
      summary: 'Evaluation of peak inflows and emergency spillway discharges at Hathnikund, Farakka, and Dowleswaram barrages.',
    },
  ];

  const handleDownload = (title: string, format: string) => {
    addToast({
      type: 'success',
      title: `Export Started: ${format.toUpperCase()}`,
      message: `Generating ${title} in ${format.toUpperCase()} format...`,
    });

    // Simulate CSV or Text file download
    const dummyContent = `JALSETU SITUATION REPORT\nTitle: ${title}\nGenerated: ${new Date().toISOString()}\nActive Sensors: ${sensors.length}\nRiver Stations: ${riverStations.length}\nActive Alerts: ${alerts.filter((a) => a.active).length}`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateNewBulletin = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast({
        type: 'success',
        title: 'New SITREP Compiled',
        message: 'Current hour hydrological bulletin compiled from live CWC sensor telemetry.',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hydrological Reports & Automated SITREPs</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
              CWC / NDMA Format
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated compilation of daily flood bulletins, stage hydrographs, risk audits, and disaster mitigation summaries.
          </p>
        </div>

        <button
          onClick={generateNewBulletin}
          disabled={isGenerating}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <FileBarChart className="w-4 h-4" />
          <span>{isGenerating ? 'Compiling Live SITREP...' : 'Compile Live SITREP'}</span>
        </button>
      </div>

      {/* Reports Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Archived Situation Reports & Meteorological Summaries
          </h3>
          <span className="text-xs text-slate-400">Official Government Release Series</span>
        </div>

        <div className="space-y-4">
          {reportsList.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl border border-slate-200/70 hover:border-sky-300 hover:bg-sky-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {report.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-700">
                    {report.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{report.date}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{report.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{report.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(report.title, 'csv')}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                  title="Export raw tabular telemetry data as CSV"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-slate-500" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleDownload(report.title, 'pdf')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  title="Download signed Situation Report PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF ({report.fileSize})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
