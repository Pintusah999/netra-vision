import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  XCircle,
  FileWarning,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecurityEvent, SecuritySeverity, SecurityEventCategory } from '../../types';

export const SecurityEventsScreen: React.FC = () => {
  const { securityEvents, setSelectedSecurityEvent, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // KPI calculations
  const totalEvents = securityEvents.length;
  const failedAuthCount = securityEvents.filter(e => e.eventType === 'Failed Authentication').length;
  const accessDeniedCount = securityEvents.filter(e => e.eventType === 'Access Denied').length;
  const criticalCount = securityEvents.filter(e => e.severity === 'Critical').length;

  // Filtering
  const filteredEvents = useMemo(() => {
    return securityEvents
      .filter(ev => {
        const matchesSearch =
          ev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.accessPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.details.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSeverity = severityFilter === 'All' || ev.severity === severityFilter;
        const matchesCategory = categoryFilter === 'All' || ev.eventType === categoryFilter;
        const matchesStatus = statusFilter === 'All' || ev.status === statusFilter;

        return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
      })
      .sort((a, b) => (sortOrder === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)));
  }, [securityEvents, searchQuery, severityFilter, categoryFilter, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const severityStyles: Record<SecuritySeverity, string> = {
    Critical: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    High: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    Low: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  };

  const handleExportCSV = () => {
    const headers = ['Event ID,Category,User,Access Point,Timestamp,Severity,Status,Details'];
    const rows = filteredEvents.map(e =>
      `"${e.id}","${e.eventType}","${e.userName}","${e.accessPoint}","${e.timestamp}","${e.severity}","${e.status}","${e.details.replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NetraVision-Security-Incidents-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Audit Log Exported',
      description: `${filteredEvents.length} security events compiled to CSV.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Security Events</h2>
          <p className="text-xs text-slate-400">
            Monitor security-related events across the access-control environment.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-lg border border-[#263449] bg-[#111827] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-[#1E293B] hover:text-white transition-colors"
        >
          <Download className="h-4 w-4 text-orange-400" />
          <span>Export Forensic Audit CSV</span>
        </button>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Events</span>
            <ShieldAlert className="h-4 w-4 text-orange-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {totalEvents}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Recorded physical exceptions</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Failed Authentication</span>
            <FileWarning className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
            {failedAuthCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Biometric score thresholds</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Access Denied</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-rose-400 tabular-nums">
            {accessDeniedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Role clearance unauthorized</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Critical Incidents</span>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-red-400 tabular-nums">
            {criticalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Immediate triage required</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-[#263449] bg-[#172033] p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search incident ID, user, reader, or details..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-[#263449] bg-[#111827] py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Severity */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Severity:</span>
              <select
                value={severityFilter}
                onChange={e => {
                  setSeverityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Event Category */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Category:</span>
              <select
                value={categoryFilter}
                onChange={e => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Failed Authentication">Failed Authentication</option>
                <option value="Access Denied">Access Denied</option>
                <option value="Tailgating Detection">Tailgating Detection</option>
                <option value="Door Forced Open">Door Forced Open</option>
                <option value="Biometric Liveness Failed">Biometric Liveness Failed</option>
                <option value="Update User Event">Update User Event</option>
                <option value="Delete Event">Delete Event</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Under Review">Under Review</option>
                <option value="Investigated">Investigated</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(s => (s === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-1 rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs text-slate-300 hover:bg-[#1E293B]"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>

        {/* Main Event Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Event & ID</th>
                <th className="pb-3 px-2">Subject User</th>
                <th className="pb-3 px-2">Access Point</th>
                <th className="pb-3 px-2">Date / Time</th>
                <th className="pb-3 px-2">Severity</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Forensic Details</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]/60">
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No security events matching current criteria.
                  </td>
                </tr>
              ) : (
                paginatedEvents.map(event => (
                  <tr
                    key={event.id}
                    onClick={() => setSelectedSecurityEvent(event)}
                    className="group cursor-pointer hover:bg-[#1E293B]/70 transition-colors"
                  >
                    <td className="py-3 pl-2 pr-2">
                      <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {event.eventType}
                      </div>
                      <div className="font-mono text-[10px] text-orange-400">{event.id}</div>
                    </td>

                    <td className="py-3 px-2">
                      <div className="font-medium text-white">{event.userName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{event.userId}</div>
                    </td>

                    <td className="py-3 px-2 font-medium text-white">{event.accessPoint}</td>

                    <td className="py-3 px-2 font-mono text-slate-400 tabular-nums">
                      {event.timestamp}
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                          severityStyles[event.severity]
                        }`}
                      >
                        {event.severity}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <span className="rounded bg-slate-800 border border-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {event.status}
                      </span>
                    </td>

                    <td className="py-3 px-2 max-w-xs truncate text-[11px] text-slate-300">
                      {event.details}
                    </td>

                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedSecurityEvent(event);
                        }}
                        className="rounded p-1.5 text-slate-400 hover:bg-[#1E293B] hover:text-orange-400 transition-colors"
                        title="Inspect Incident Dossier"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#263449] pt-3 text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-white">{paginatedEvents.length}</span> of{' '}
            <span className="font-semibold text-white">{filteredEvents.length}</span> security events
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 items-center gap-1 rounded border border-[#263449] px-2.5 text-xs text-slate-300 hover:bg-[#1E293B] disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>

            <span className="font-mono text-xs px-2 text-slate-300 tabular-nums">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 items-center gap-1 rounded border border-[#263449] px-2.5 text-xs text-slate-300 hover:bg-[#1E293B] disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
