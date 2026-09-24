import React, { useState } from 'react';
import { X, ShieldAlert, Clock, MapPin, User, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecurityEventStatus } from '../../types';

export const SecurityEventDetailModal: React.FC = () => {
  const { selectedSecurityEvent, setSelectedSecurityEvent, updateSecurityEventStatus } = useApp();
  const [newStatus, setNewStatus] = useState<SecurityEventStatus>('Resolved');
  const [actionNotes, setActionNotes] = useState('');

  if (!selectedSecurityEvent) return null;

  const event = selectedSecurityEvent;

  const handleUpdate = () => {
    updateSecurityEventStatus(event.id, newStatus, actionNotes || event.actionTaken);
    setSelectedSecurityEvent(null);
  };

  const severityColors = {
    Critical: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    High: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    Medium: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
    Low: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-xl border border-[#263449] bg-[#172033] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#263449] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{event.eventType}</h3>
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                    severityColors[event.severity]
                  }`}
                >
                  {event.severity} SEVERITY
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">{event.id} · Logged at {event.timestamp}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedSecurityEvent(null)}
            className="rounded p-1 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#263449] bg-[#111827] p-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <User className="h-3.5 w-3.5 text-slate-400" /> Subject Identity
              </span>
              <span className="font-semibold text-white">{event.userName}</span>
              <span className="font-mono text-[11px] text-slate-400 block">{event.userId}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Access Point Reader
              </span>
              <span className="font-semibold text-white">{event.accessPoint}</span>
              <span className="text-[11px] text-slate-400 block">Secured Perimeter Node</span>
            </div>
          </div>

          {/* Incident Description */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-orange-400" /> Incident Forensic Summary
            </h4>
            <div className="rounded-lg border border-[#263449] bg-[#111827] p-3 text-xs leading-relaxed text-slate-200">
              {event.details}
            </div>
          </div>

          {/* Forensic Image Snapshot Simulation */}
          <div className="rounded-lg border border-[#263449] bg-[#0B1220] p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>Reader Camera Frame Snapshot</span>
              <span className="font-mono text-orange-400">IR SENSOR CAM-04</span>
            </div>
            <div className="relative aspect-video w-full rounded bg-[#111827] flex items-center justify-center border border-slate-800 overflow-hidden">
              <div className="absolute top-2 left-2 font-mono text-[10px] text-emerald-400">
                REC ● 30FPS · 1080P IR
              </div>
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-rose-500/80 flex items-center justify-center">
                <span className="font-mono text-[10px] text-rose-400 font-semibold">SUBJECT DETECT</span>
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-slate-400">
                Timestamp: {event.timestamp}
              </div>
            </div>
          </div>

          {/* Status & Resolution form */}
          <div className="space-y-3 pt-2 border-t border-[#263449]">
            <h4 className="text-xs font-semibold text-white">Incident Triage & Status Resolution</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as SecurityEventStatus)}
                  className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Investigated">Investigated</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Current Investigator</label>
                <div className="rounded-lg border border-[#263449] bg-[#111827] px-3 py-1.5 text-xs text-slate-300">
                  {event.investigator || 'Rahul Sharma (Admin)'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Corrective Action Taken</label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={e => setActionNotes(e.target.value)}
                placeholder={event.actionTaken || 'Document corrective action or containment steps...'}
                className="w-full rounded-lg border border-[#263449] bg-[#111827] p-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263449]">
            <button
              type="button"
              onClick={() => setSelectedSecurityEvent(null)}
              className="rounded-lg border border-[#263449] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-[#1E293B]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-orange-600 transition-colors"
            >
              Save Incident Disposition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
