import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Scan,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsScreen: React.FC = () => {
  const { accessPoints } = useApp();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'quarter'>('7d');
  const [selectedPoint, setSelectedPoint] = useState('All');

  // Chart datasets
  const accessTrendData =
    timeRange === '24h'
      ? [
          { label: '02h', success: 24, failed: 2 },
          { label: '06h', success: 85, failed: 4 },
          { label: '10h', success: 390, failed: 9 },
          { label: '14h', success: 320, failed: 7 },
          { label: '18h', success: 210, failed: 5 },
          { label: '22h', success: 48, failed: 1 },
        ]
      : timeRange === '7d'
      ? [
          { label: 'Mon', success: 1420, failed: 28 },
          { label: 'Tue', success: 1590, failed: 32 },
          { label: 'Wed', success: 1680, failed: 24 },
          { label: 'Thu', success: 1610, failed: 29 },
          { label: 'Fri', success: 1750, failed: 38 },
          { label: 'Sat', success: 590, failed: 8 },
          { label: 'Sun', success: 460, failed: 6 },
        ]
      : [
          { label: 'W1', success: 8200, failed: 180 },
          { label: 'W2', success: 8900, failed: 210 },
          { label: 'W3', success: 9400, failed: 165 },
          { label: 'W4', success: 9150, failed: 195 },
        ];

  // Location Distribution
  const locationBreakdown = [
    { name: 'Main Entrance', percent: 46, color: '#F97316' },
    { name: 'Floor 2 Wings', percent: 23, color: '#38BDF8' },
    { name: 'Reception Kiosk', percent: 14, color: '#22C55E' },
    { name: 'Research Lab', percent: 10, color: '#A855F7' },
    { name: 'Server Room', percent: 7, color: '#EF4444' },
  ];

  // Authentication Method Share
  const authMethods = [
    { method: 'Facial Biometric (AI Liveness)', count: '74.2%', color: '#F97316', vol: '12,480' },
    { method: 'Contactless RFID Card', count: '18.5%', color: '#38BDF8', vol: '3,110' },
    { method: 'Multi-Factor (Biometric + PIN)', count: '7.3%', color: '#22C55E', vol: '1,228' },
  ];

  // Department Volume
  const departmentActivity = [
    { dept: 'Cyber Physical SecOps', entries: 4120, pct: 92 },
    { dept: 'Facilities & Engineering', entries: 3540, pct: 78 },
    { dept: 'AI & Sensor R&D', entries: 2890, pct: 64 },
    { dept: 'Risk, Audit & Legal', entries: 1420, pct: 32 },
    { dept: 'Executive Suite', entries: 840, pct: 18 },
  ];

  // SVG dimensions for trend chart
  const maxVal = Math.max(...accessTrendData.map(d => d.success));
  const svgW = 640;
  const svgH = 200;
  const padX = 45;
  const padY = 25;

  const points = accessTrendData.map((d, i) => ({
    x: padX + (i / (accessTrendData.length - 1)) * (svgW - 2 * padX),
    y: svgH - padY - (d.success / (maxVal * 1.15)) * (svgH - 2 * padY),
    ...d,
  }));

  const pathD = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgH - padY} L ${points[0].x} ${svgH - padY} Z`;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Global Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Analytics & Insights</h2>
          <p className="text-xs text-slate-400">
            Predictive access metrics, biometric precision analytics, and anomaly distribution patterns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Checkpoint selector */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Scope:</span>
            <select
              value={selectedPoint}
              onChange={e => setSelectedPoint(e.target.value)}
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

          {/* Time range segmented */}
          <div className="flex items-center gap-1 rounded-lg border border-[#263449] bg-[#111827] p-1">
            {(['24h', '7d', '30d', 'quarter'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="text-[11px] font-medium text-slate-400">Total Biometric Verifications</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">16,818</span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> +14.2%
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">Rolling period throughput</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="text-[11px] font-medium text-slate-400">Biometric Match Precision</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">99.14%</span>
            <span className="text-[11px] font-mono text-slate-400">0.02% FAR</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">False Acceptance Rate</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="text-[11px] font-medium text-slate-400">Peak Incident Response Time</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white tabular-nums">1.4m</span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-400">
              <ArrowDownRight className="h-3 w-3" /> -22s
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">Mean time to containment</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="text-[11px] font-medium text-slate-400">Anomalous Activity Index</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-orange-400 tabular-nums">0.38%</span>
            <span className="text-[11px] font-mono text-slate-400">Nominal</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">Within ISO-27001 safety margin</div>
        </div>
      </div>

      {/* Grid 1: Access Analytics & Trends (Left 2 cols) + Location Distribution (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Access Volume & Trend */}
        <div className="lg:col-span-2 rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Access Volume & Verification Curve</h3>
              <p className="text-xs text-slate-400">Authorized passages plotted over selected time horizon</p>
            </div>
            <span className="font-mono text-xs text-orange-400 font-semibold">
              Peak: 1,750 / day
            </span>
          </div>

          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-52 overflow-visible">
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((r, idx) => {
                const y = svgH - padY - r * (svgH - 2 * padY);
                return (
                  <line
                    key={idx}
                    x1={padX}
                    y1={y}
                    x2={svgW - padX}
                    y2={y}
                    stroke="#263449"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area */}
              <path d={areaD} fill="url(#analyticsGrad)" />

              {/* Line */}
              <path d={pathD} fill="none" stroke="#F97316" strokeWidth="2.5" />

              {/* Data points */}
              {points.map((pt, i) => (
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
                    y={svgH - 6}
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

          <div className="flex items-center justify-between border-t border-[#263449] pt-3 text-xs text-slate-400">
            <span>Aggregated compliance: 98.6%</span>
            <span>Total period volume: 16,818 authentications</span>
          </div>
        </div>

        {/* Location Distribution */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Location Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Volume breakdown across physical checkpoints</p>

            {/* Custom Horizontal Segment Bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex mb-4">
              {locationBreakdown.map((loc, idx) => (
                <div
                  key={idx}
                  style={{ width: `${loc.percent}%`, backgroundColor: loc.color }}
                  title={`${loc.name}: ${loc.percent}%`}
                />
              ))}
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 text-xs">
              {locationBreakdown.map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: loc.color }}
                    />
                    <span className="text-slate-300 font-medium">{loc.name}</span>
                  </div>
                  <span className="font-mono text-white font-semibold tabular-nums">
                    {loc.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#263449] pt-3 mt-4 text-[11px] text-slate-400">
            Main Entrance accounts for 46% of all daily facility entries.
          </div>
        </div>
      </div>

      {/* Grid 2: Authentication Analytics (Left 1 col) + Department Activity (Right 2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Authentication Modality Share */}
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Authentication Modalities</h3>
            <p className="text-xs text-slate-400">Distribution by sensor technology</p>
          </div>

          <div className="space-y-3">
            {authMethods.map((method, idx) => (
              <div key={idx} className="rounded-lg border border-[#263449] bg-[#111827] p-3 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-white">{method.method}</span>
                  <span className="font-mono font-bold text-orange-400 tabular-nums">
                    {method.count}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Throughput: {method.vol} checks</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#263449] pt-3 text-[11px] text-slate-400">
            Facial recognition latency averages 18ms with 99.4% confidence score.
          </div>
        </div>

        {/* Department Activity Bar Chart */}
        <div className="lg:col-span-2 rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Department Access Volume</h3>
              <p className="text-xs text-slate-400">Clearance utilization by organizational unit</p>
            </div>
            <span className="text-xs text-slate-400">Sorted by frequency</span>
          </div>

          <div className="space-y-3 pt-2">
            {departmentActivity.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{item.dept}</span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {item.entries.toLocaleString()} passages
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#111827] overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#263449] pt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Cyber Physical SecOps represents highest operational density</span>
            <span className="font-mono text-white font-semibold">12,810 Total Dept Entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};
