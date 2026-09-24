import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const {
    users,
    accessPoints,
    accessEvents,
    securityEvents,
    setCurrentScreen,
    navigateToUserProfile,
    setSelectedSecurityEvent,
    isLiveFeedActive,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'today' | '7d' | '30d'>('today');

  const totalUsersCount = users.length + 1238;
  const activeUsersCount = users.filter(u => u.status === 'Active').length + 1172;
  const todayAccessCount = accessEvents.length * 92 + 540;
  const criticalEventsCount = securityEvents.filter(e => e.severity === 'Critical').length;

  // Chart data simulation based on timeFilter
  const chartPoints =
    timeFilter === 'today'
      ? [
          { label: '00:00', success: 42, denied: 2 },
          { label: '02:00', success: 28, denied: 1 },
          { label: '04:00', success: 35, denied: 3 },
          { label: '06:00', success: 110, denied: 4 },
          { label: '08:00', success: 420, denied: 12 },
          { label: '10:00', success: 380, denied: 9 },
          { label: '12:00', success: 310, denied: 6 },
          { label: '14:00', success: 345, denied: 8 },
          { label: '16:00', success: 290, denied: 5 },
          { label: '18:00', success: 180, denied: 4 },
        ]
      : timeFilter === '7d'
      ? [
          { label: 'Mon', success: 1420, denied: 38 },
          { label: 'Tue', success: 1580, denied: 42 },
          { label: 'Wed', success: 1690, denied: 29 },
          { label: 'Thu', success: 1620, denied: 34 },
          { label: 'Fri', success: 1740, denied: 45 },
          { label: 'Sat', success: 610, denied: 11 },
          { label: 'Sun', success: 480, denied: 8 },
        ]
      : [
          { label: 'Week 1', success: 8200, denied: 180 },
          { label: 'Week 2', success: 8900, denied: 210 },
          { label: 'Week 3', success: 9400, denied: 165 },
          { label: 'Week 4', success: 9150, denied: 195 },
        ];

  // Max value for SVG scaling
  const maxSuccess = Math.max(...chartPoints.map(p => p.success));
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const pointsSuccess = chartPoints.map((pt, i) => {
    const x = paddingX + (i / (chartPoints.length - 1)) * (svgWidth - 2 * paddingX);
    const y = svgHeight - paddingY - (pt.success / (maxSuccess * 1.15)) * (svgHeight - 2 * paddingY);
    return { x, y, ...pt };
  });

  const pointsDenied = chartPoints.map((pt, i) => {
    const x = paddingX + (i / (chartPoints.length - 1)) * (svgWidth - 2 * paddingX);
    // scale denied values up for visibility on same chart
    const scaledDenied = pt.denied * 12;
    const y = svgHeight - paddingY - (scaledDenied / (maxSuccess * 1.15)) * (svgHeight - 2 * paddingY);
    return { x, y, ...pt };
  });

  const pathSuccess = pointsSuccess.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  const areaSuccess = `${pathSuccess} L ${pointsSuccess[pointsSuccess.length - 1].x} ${
    svgHeight - paddingY
  } L ${pointsSuccess[0].x} ${svgHeight - paddingY} Z`;

  const pathDenied = pointsDenied.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  // Activity trend bar heights
  const hourlyBars = [
    { hour: '06h', val: 45 },
    { hour: '07h', val: 82 },
    { hour: '08h', val: 96 },
    { hour: '09h', val: 100 },
    { hour: '10h', val: 78 },
    { hour: '11h', val: 65 },
    { hour: '12h', val: 84 },
    { hour: '13h', val: 72 },
    { hour: '14h', val: 88 },
    { hour: '15h', val: 76 },
    { hour: '16h', val: 68 },
    { hour: '17h', val: 92 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
            Security Overview & Access Activity
          </h2>
          <p className="text-xs text-slate-400">
            Real-time biometric throughput, perimeter access telemetry, and active threat signals
          </p>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-md border border-[#263449] bg-[#111827] px-2.5 py-1 text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                isLiveFeedActive ? 'bg-emerald-500 animate-live-dot' : 'bg-amber-500'
              }`}
            />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {isLiveFeedActive ? 'Live Stream Active' : 'Feed Paused'}
            </span>
          </span>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Users */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-slate-600">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Users</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">
              {totalUsersCount.toLocaleString()}
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> +3.8%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Registered access credentials</div>
        </div>

        {/* Card 2: Active Users */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-slate-600">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Users</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">
              {activeUsersCount.toLocaleString()}
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> 94.6%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Valid clearance badges</div>
        </div>

        {/* Card 3: Today's Access */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-slate-600">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Today's Access</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
              <KeyRound className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">
              {todayAccessCount.toLocaleString()}
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> +12.4%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Door & turnstile passages</div>
        </div>

        {/* Card 4: Authentication Activity */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-slate-600">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Authentication</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">98.9%</span>
            <span className="text-[11px] font-mono text-slate-400">18ms latency</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Biometric match precision</div>
        </div>

        {/* Card 5: Security Events */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4 transition-all hover:border-slate-600">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Security Events</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-rose-400 tabular-nums">
              {securityEvents.length}
            </span>
            <span className="rounded bg-rose-500/15 px-1.5 py-0.2 text-[10px] font-bold text-rose-400">
              {criticalEventsCount} Critical
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Flagged access anomalies</div>
        </div>
      </div>

      {/* Main Dashboard Content Grid: Left Access Activity (Chart) + Right Security Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Large Section: Access Activity Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                Access Activity
                <span className="text-[11px] font-normal text-slate-400">
                  (Authorized Passages vs Denied Attempts)
                </span>
              </h3>
            </div>

            {/* Time filter segmented control */}
            <div className="flex items-center gap-1 rounded-lg border border-[#263449] bg-[#111827] p-1">
              {(['today', '7d', '30d'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setTimeFilter(tab)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    timeFilter === tab
                      ? 'bg-orange-500 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'today' ? 'Today' : tab === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-6 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              <span className="text-slate-300">Successful Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">Denied / Mismatched (Scaled)</span>
            </div>
          </div>

          {/* Responsive SVG Line / Area Chart */}
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56 overflow-visible"
            >
              <defs>
                <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = svgHeight - paddingY - ratio * (svgHeight - 2 * paddingY);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#263449"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Success Area */}
              <path d={areaSuccess} fill="url(#successGrad)" />

              {/* Success Line */}
              <path d={pathSuccess} fill="none" stroke="#F97316" strokeWidth="2.5" />

              {/* Denied Line */}
              <path
                d={pathDenied}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="4 3"
              />

              {/* Dots and Labels */}
              {pointsSuccess.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#172033"
                    stroke="#F97316"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#263449] pt-3 text-[11px] text-slate-400">
            <span>Peak throughput recorded at 08:45 AM (480 entries / hr)</span>
            <span className="font-mono text-emerald-400 font-semibold">99.1% Compliance</span>
          </div>
        </div>

        {/* Right Section: Security Events feed (1 col) */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Recent Security Events
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                {securityEvents.filter(e => e.status === 'Under Review').length} Actionable
              </span>
            </h3>
            <button
              onClick={() => setCurrentScreen('security-events')}
              className="text-xs font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {securityEvents.slice(0, 5).map(ev => {
              const isCritical = ev.severity === 'Critical';
              const isHigh = ev.severity === 'High';

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedSecurityEvent(ev)}
                  className="group cursor-pointer rounded-lg border border-[#263449] bg-[#111827] p-3 transition-all hover:border-orange-500/50 hover:bg-[#1E293B]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-sky-500'
                        }`}
                      />
                      <span className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {ev.eventType}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{ev.timestamp.split(' ')[0]}</span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-slate-300 font-medium">{ev.userName}</span>
                    <span className="font-mono text-slate-400">{ev.accessPoint}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-[#263449]/60 pt-1.5 text-[10px]">
                    <span
                      className={`font-semibold ${
                        isCritical
                          ? 'text-rose-400'
                          : isHigh
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {ev.severity} Severity
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                      {ev.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentScreen('security-events')}
            className="mt-3 w-full rounded-lg border border-[#263449] py-2 text-center text-xs font-medium text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
          >
            Investigate Incident Feed →
          </button>
        </div>
      </div>

      {/* Bottom Section: Activity Trend (Bar Chart) + Recent Access Activity Compact Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bottom Left: Activity Trend (1 col) */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Activity Trend</h3>
              <p className="text-xs text-slate-400">Hourly authentication volume</p>
            </div>
            <span className="text-xs font-mono text-orange-400">Peak: 09:00</span>
          </div>

          {/* Bar chart visualization */}
          <div className="flex h-36 items-end justify-between gap-1.5 pt-4">
            {hourlyBars.map((bar, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="group relative w-full flex items-end justify-center">
                  <div
                    style={{ height: `${bar.val}%` }}
                    className={`w-full max-w-[18px] rounded-t transition-all ${
                      bar.val > 90
                        ? 'bg-orange-500'
                        : bar.val > 75
                        ? 'bg-orange-500/80'
                        : 'bg-orange-500/40 hover:bg-orange-500'
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 hidden rounded bg-black/90 px-1.5 py-0.5 font-mono text-[9px] text-white group-hover:block whitespace-nowrap z-20">
                    {bar.val * 4} auths
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{bar.hour}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-[#263449] pt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Sensor load distribution</span>
            <span className="font-medium text-slate-200">Balanced · 6 readers active</span>
          </div>
        </div>

        {/* Bottom Right: Recent Access Activity Table with Live Indicator (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Recent Access Activity</h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <button
              onClick={() => setCurrentScreen('access-intel')}
              className="text-xs font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Access Intelligence Hub <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#263449] text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Access Point</th>
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Authentication</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {accessEvents.slice(0, 6).map(item => {
                  const isGranted = item.status === 'Granted';
                  const isDenied = item.status === 'Denied';
                  const isFailed = item.status === 'Failed';

                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-[#1E293B] transition-colors"
                    >
                      <td className="py-2.5 pr-3">
                        <button
                          onClick={() => {
                            if (item.userId !== 'UNREGISTERED') {
                              navigateToUserProfile(item.userId);
                            }
                          }}
                          className="flex items-center gap-2 text-left"
                        >
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${item.avatarColor} text-xs font-bold text-white shadow-xs`}
                          >
                            {item.userInitials}
                          </div>
                          <div>
                            <div className="font-medium text-white group-hover:text-orange-400 transition-colors">
                              {item.userName}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400">
                              {item.userId}
                            </div>
                          </div>
                        </button>
                      </td>

                      <td className="py-2.5 px-2 text-slate-300 font-medium">
                        {item.accessPoint}
                      </td>

                      <td className="py-2.5 px-2 font-mono text-slate-400 tabular-nums">
                        {item.timestamp}
                      </td>

                      <td className="py-2.5 px-2">
                        <span className="text-slate-300">{item.authenticationType}</span>
                        {item.confidenceScore && (
                          <span className="block font-mono text-[10px] text-slate-400">
                            {item.confidenceScore}% confidence
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-semibold text-[10px] ${
                            isGranted
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : isDenied
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-2.5 pl-2 text-right">
                        {item.userId !== 'UNREGISTERED' ? (
                          <button
                            onClick={() => navigateToUserProfile(item.userId)}
                            className="rounded px-2 py-1 text-[11px] font-medium text-orange-400 hover:bg-orange-500/10 transition-colors"
                          >
                            Dossier
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
