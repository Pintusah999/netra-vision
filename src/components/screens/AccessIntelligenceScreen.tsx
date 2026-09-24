import React, { useState, useMemo } from 'react';
import {
  ScanFace,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Search,
  Filter,
  Eye,
  Server,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessResultStatus } from '../../types';

export const AccessIntelligenceScreen: React.FC = () => {
  const {
    accessPoints,
    toggleAccessPointLock,
    accessEvents,
    navigateToUserProfile,
    isLiveFeedActive,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [pointFilter, setPointFilter] = useState('All');
  const [resultFilter, setResultFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // KPIs
  const totalEventsCount = accessEvents.length * 110 + 420;
  const successfulCount = accessEvents.filter(e => e.status === 'Granted').length * 105 + 402;
  const deniedCount = accessEvents.filter(e => e.status !== 'Granted').length * 18 + 18;
  const activePointsCount = accessPoints.filter(p => p.status === 'Active').length;

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return accessEvents.filter(evt => {
      const matchesSearch =
        evt.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.accessPoint.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPoint = pointFilter === 'All' || evt.accessPoint === pointFilter;
      const matchesResult = resultFilter === 'All' || evt.status === resultFilter;

      return matchesSearch && matchesPoint && matchesResult;
    });
  }, [accessEvents, searchQuery, pointFilter, resultFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusBadgeStyles: Record<AccessResultStatus, string> = {
    Granted: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Denied: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Failed: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    Restricted: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Access Intelligence</h2>
          <p className="text-xs text-slate-400">
            Monitor and manage physical access operations across connected security environments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#111827] px-3 py-1.5 text-xs text-slate-300">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">
              {accessPoints.length} Checkpoints Monitored
            </span>
          </span>
        </div>
      </div>

      {/* Top KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Access Events</span>
            <Activity className="h-4 w-4 text-orange-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {totalEventsCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">24-hour total transactions</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Successful Access</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {successfulCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {((successfulCount / totalEventsCount) * 100).toFixed(1)}% verified compliance
          </div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Denied / Rejected</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-rose-400 tabular-nums">
            {deniedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Blocked by policy or mismatch</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Active Access Points</span>
            <Server className="h-4 w-4 text-sky-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-sky-400 tabular-nums">
            {activePointsCount} / {accessPoints.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {accessPoints.filter(p => p.status === 'Offline').length} offline nodes
          </div>
        </div>
      </div>

      {/* Connected Access Points Overview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Connected Access Points Overview</h3>
          <span className="text-xs text-slate-400">Door Controllers & Sensor Arrays</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessPoints.map(point => {
            const isOnline = point.status !== 'Offline';
            const isRestricted = point.status === 'Restricted';

            return (
              <div
                key={point.id}
                className="rounded-xl border border-[#263449] bg-[#172033] p-4.5 shadow-sm transition-all hover:border-slate-600"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{point.name}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                          point.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : point.status === 'Restricted'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {point.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{point.zone}</div>
                  </div>

                  {/* Manual Lock / Unlock Trigger */}
                  <button
                    onClick={() => toggleAccessPointLock(point.id)}
                    disabled={!isOnline}
                    title={
                      !isOnline
                        ? 'Point is offline'
                        : point.isLocked
                        ? 'Unlock Door Controller'
                        : 'Engage Lockdown'
                    }
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      !isOnline
                        ? 'border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed'
                        : point.isLocked
                        ? 'border-rose-500/50 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25'
                        : 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                    }`}
                  >
                    {point.isLocked ? (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>Locked</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3.5 w-3.5" />
                        <span>Unlocked</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#263449] pt-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Authentication Method</span>
                    <span className="font-medium text-slate-200">{point.authenticationMethod}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Last Reader Pulse</span>
                    <span className="font-mono text-slate-300 tabular-nums">
                      {point.lastActivity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Today's Throughput</span>
                    <span className="font-mono text-white font-semibold tabular-nums">
                      {point.todayThroughput} entries
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-[#263449]/50">
                    <span>IP: {point.ipAddress}</span>
                    <span>FW: {point.firmware}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Events Monitoring Table & Filter Toolbar */}
      <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user identity, ID, or access point..."
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
            <div className="flex items-center gap-1.5 text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Checkpoint:</span>
              <select
                value={pointFilter}
                onChange={e => {
                  setPointFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="All">All Checkpoints</option>
                {accessPoints.map(p => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Result:</span>
              <select
                value={resultFilter}
                onChange={e => {
                  setResultFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="All">All Results</option>
                <option value="Granted">Granted</option>
                <option value="Denied">Denied</option>
                <option value="Failed">Failed</option>
                <option value="Restricted">Restricted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Subject User</th>
                <th className="pb-3 px-2">User ID</th>
                <th className="pb-3 px-2">Access Point</th>
                <th className="pb-3 px-2">Date / Time</th>
                <th className="pb-3 px-2">Authentication Method</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]/60">
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No access events matched current filters.
                  </td>
                </tr>
              ) : (
                paginatedEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-[#1E293B]/70 transition-colors">
                    <td className="py-3 pl-2 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${evt.avatarColor} text-xs font-bold text-white shadow-xs`}
                        >
                          {evt.userInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{evt.userName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{evt.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-2">
                      <span className="font-mono text-orange-400 font-medium tabular-nums">
                        {evt.userId}
                      </span>
                    </td>

                    <td className="py-3 px-2 font-medium text-white">{evt.accessPoint}</td>

                    <td className="py-3 px-2 font-mono text-slate-400 tabular-nums">
                      {evt.timestamp}
                    </td>

                    <td className="py-3 px-2">
                      <div className="text-slate-300 font-medium">{evt.authenticationType}</div>
                      {evt.confidenceScore ? (
                        <div className="text-[10px] font-mono text-emerald-400">
                          {evt.confidenceScore}% confidence
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500">Contactless token</div>
                      )}
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${
                          statusBadgeStyles[evt.status]
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>

                    <td className="py-3 pr-2 text-right">
                      {evt.userId !== 'UNREGISTERED' ? (
                        <button
                          onClick={() => navigateToUserProfile(evt.userId)}
                          className="rounded p-1.5 text-slate-400 hover:bg-[#1E293B] hover:text-orange-400 transition-colors"
                          title="View Identity Dossier"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">Unregistered</span>
                      )}
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
            <span className="font-semibold text-white">{filteredEvents.length}</span> access events
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
