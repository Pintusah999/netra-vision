import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GeneratedReportItem } from '../../types';

export const ReportsScreen: React.FC = () => {
  const { generatedReports, addGeneratedReport, deleteReport, addToast } = useApp();

  const [reportType, setReportType] = useState('Access Logs Report');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [format, setFormat] = useState<'CSV' | 'PDF'>('CSV');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerate = (customTitle?: string, customType?: string) => {
    setIsGenerating(true);

    setTimeout(() => {
      const title =
        customTitle ||
        `${reportType.replace(' Report', '')} - ${dateRange} (${new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })})`;

      const type = customType || reportType;

      const newRep: GeneratedReportItem = {
        id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        type,
        generatedDate: 'Just now',
        generatedBy: 'Rahul Sharma (Admin)',
        fileSize: `${(1.2 + Math.random() * 3).toFixed(1)} MB`,
        status: 'Ready',
        format,
        downloadUrl: '#',
      };

      addGeneratedReport(newRep);
      setIsGenerating(false);

      addToast({
        title: 'Report Compiled Successfully',
        description: `"${newRep.title}" is ready for forensic download in ${format} format.`,
        type: 'success',
      });
    }, 1200);
  };

  const handleDownloadReport = (rep: GeneratedReportItem) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `NetraVision Formal Audit Dossier - ${rep.title}`,
        `Generated: ${new Date().toISOString()}`,
        `Compiled By: ${rep.generatedBy}`,
        `Verification Hash: SHA256-${Math.random().toString(36).substring(2, 15)}`,
        '',
        'Event ID,Timestamp,Subject User,Access Point,Authentication Mode,Result,Confidence Index',
        'NV-EVT-9001,2026-09-24 08:30:14,Rahul Sharma,Main Entrance,Face Recognition,Granted,99.4%',
        'NV-EVT-9002,2026-09-24 08:32:02,Ananya Singh,Floor 2,Face Recognition,Granted,98.9%',
        'NV-EVT-9003,2026-09-24 08:35:45,Vikram Patel,Server Room,Face Recognition,Granted,99.6%',
        'NV-EVT-9004,2026-09-24 08:38:11,Sunil Deshmukh,Perimeter Gate,RFID Badge,Granted,N/A',
        'NV-EVT-9005,2026-09-24 08:41:20,Sneha Roy,Research Lab,Face Recognition,Denied,98.2%',
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${rep.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${rep.format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Report Download Started',
      description: `${rep.title} saved to local device.`,
      type: 'info',
    });
  };

  const filteredReports = generatedReports.filter(
    r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subtitle */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Reports & Auditing</h2>
        <p className="text-xs text-slate-400">
          Generate, schedule, and export cryptographic audit reports for access, security, and user compliance.
        </p>
      </div>

      {/* Primary Report Generator Builder Card */}
      <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#263449] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-400" />
              Custom Report Generator
            </h3>
            <p className="text-xs text-slate-400">Specify data scope, parameters, and output format</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">ISO-27001 / SOC 2 Ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="Access Logs Report">Access Logs Report</option>
              <option value="Security Event Report">Security Event Report</option>
              <option value="User Activity Report">User Activity Report</option>
              <option value="Device / Access-Point Report">Device / Access-Point Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Audit Time Horizon</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="Today">Today (Past 24 Hours)</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Quarter-to-Date">Quarter-to-Date</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Export Format</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormat('CSV')}
                className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                  format === 'CSV'
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                    : 'border-[#263449] bg-[#111827] text-slate-400 hover:text-white'
                }`}
              >
                CSV (Data)
              </button>
              <button
                type="button"
                onClick={() => setFormat('PDF')}
                className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${
                  format === 'PDF'
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                    : 'border-[#263449] bg-[#111827] text-slate-400 hover:text-white'
                }`}
              >
                PDF (Formal)
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 px-4 text-xs font-semibold text-white shadow-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Compiling Dataset...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Generate / Pre-configured Audit Templates */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Pre-Configured Audit Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => handleGenerate('Daily Physical Access Summary', 'Daily Access Summary')}
            className="cursor-pointer rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-orange-500/50 hover:bg-[#1E293B] group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors">
                Daily Access Summary
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All checkpoint passages, peak hour throughput, and denied attempts for today.
            </p>
          </div>

          <div
            onClick={() => handleGenerate('Weekly Security Incident Audit', 'Weekly Security Audit')}
            className="cursor-pointer rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-orange-500/50 hover:bg-[#1E293B] group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors">
                Weekly Security Audit
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Consolidated triage of forced entries, liveness failures, and door held alarms.
            </p>
          </div>

          <div
            onClick={() => handleGenerate('Monthly Compliance & Biometric Quality', 'Monthly Compliance')}
            className="cursor-pointer rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-orange-500/50 hover:bg-[#1E293B] group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors">
                Monthly Compliance
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Executive compliance dossier with biometric accuracy, FAR, and FRR metrics.
            </p>
          </div>

          <div
            onClick={() => handleGenerate('High-Risk Activity Log', 'High-Risk Activity')}
            className="cursor-pointer rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-orange-500/50 hover:bg-[#1E293B] group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors">
                High-Risk Activity Log
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Filtered records of after-hours access attempts to critical server facilities.
            </p>
          </div>
        </div>
      </div>

      {/* Generated Reports History Section */}
      <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Generated Reports Archive</h3>
            <p className="text-xs text-slate-400">Cryptographically hashed historical exports</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#263449] bg-[#111827] py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Report Title & ID</th>
                <th className="pb-3 px-2">Type</th>
                <th className="pb-3 px-2">Date Generated</th>
                <th className="pb-3 px-2">Compiled By</th>
                <th className="pb-3 px-2">File Size</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]/60">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No generated reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map(rep => (
                  <tr key={rep.id} className="hover:bg-[#1E293B]/70 transition-colors">
                    <td className="py-3 pl-2 pr-3">
                      <div className="font-semibold text-white">{rep.title}</div>
                      <div className="font-mono text-[10px] text-orange-400">{rep.id}</div>
                    </td>

                    <td className="py-3 px-2 text-slate-300 font-medium">{rep.type}</td>

                    <td className="py-3 px-2 font-mono text-slate-400 tabular-nums">
                      {rep.generatedDate}
                    </td>

                    <td className="py-3 px-2 text-slate-300">{rep.generatedBy}</td>

                    <td className="py-3 px-2 font-mono text-slate-400 tabular-nums">
                      {rep.fileSize} ({rep.format})
                    </td>

                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {rep.status}
                      </span>
                    </td>

                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownloadReport(rep)}
                          className="flex items-center gap-1 rounded border border-[#263449] bg-[#111827] px-2.5 py-1 text-xs font-semibold text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/40 transition-colors"
                          title="Download report file"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>

                        <button
                          onClick={() => deleteReport(rep.id)}
                          className="rounded p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete report"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
