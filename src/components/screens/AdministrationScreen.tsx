import React, { useState } from 'react';
import {
  Sliders,
  ShieldAlert,
  Users,
  Lock,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Key,
  Database,
  Save,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdministrationScreen: React.FC = () => {
  const { userRole, setUserRole, accessPoints, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'roles' | 'policies' | 'devices' | 'retention'>('roles');

  // Policy state
  const [antiPassbackStrict, setAntiPassbackStrict] = useState(true);
  const [mfaForServerRoom, setMfaForServerRoom] = useState(true);
  const [tailgateDetection, setTailgateDetection] = useState(true);
  const [livenessSensitivity, setLivenessSensitivity] = useState<'Standard' | 'Strict' | 'Paranoid'>('Strict');
  const [doorHeldTimeout, setDoorHeldTimeout] = useState('30');
  const [retentionPeriod, setRetentionPeriod] = useState('365');

  const handleSavePolicies = () => {
    addToast({
      title: 'Access Control Policies Committed',
      description: 'Rules deployed to all connected edge readers and door controllers.',
      type: 'success',
    });
  };

  const handleRebootDevice = (pointName: string) => {
    addToast({
      title: 'Reader Controller Signal Sent',
      description: `Initiated warm reboot & cryptographic key rotation on ${pointName}.`,
      type: 'info',
    });
  };

  // If operator view
  if (userRole !== 'admin') {
    return (
      <div className="space-y-6 pb-12">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Settings & Administration</h2>
          <p className="text-xs text-slate-400">
            System configuration, access control policies, and hardware controller topology.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-[#0D1424]/90 backdrop-blur-md p-6 text-center max-w-xl mx-auto space-y-4 shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Administrative Privilege Required</h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              You are currently viewing NetraVision with <strong>Security Operator</strong> privileges.
              Device configurations, master cryptographic keys, and user role policies require
              <strong> Administrator</strong> elevation.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setUserRole('admin');
                addToast({
                  title: 'Elevated to Administrator',
                  description: 'Granted full dashboard and administrative control.',
                  type: 'success',
                });
              }}
              className="rounded-xl bg-[#FF6B00] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-[#EA580C] transition-colors"
            >
              Switch to Administrator Persona
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Administration & Governance</h2>
          <p className="text-xs text-slate-400">
            System policies, role-based access control, cryptographic settings, and reader topology.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Root Administrator Authenticated</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#182337]">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 text-xs font-semibold transition-all ${
            activeTab === 'roles'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          1. Roles & Permissions Matrix
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`pb-3 text-xs font-semibold transition-all ${
            activeTab === 'policies'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          2. Physical Access Policies
        </button>

        <button
          onClick={() => setActiveTab('devices')}
          className={`pb-3 text-xs font-semibold transition-all ${
            activeTab === 'devices'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          3. Connected Edge Hardware ({accessPoints.length})
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`pb-3 text-xs font-semibold transition-all ${
            activeTab === 'retention'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          4. Security & Audit Retention
        </button>
      </div>

      {/* Tab 1: Roles Matrix */}
      {activeTab === 'roles' && (
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400">Granular operational permissions per role tier</p>
            </div>
            <button
              onClick={handleSavePolicies}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-600"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Permissions</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">System Permission Scope</th>
                  <th className="pb-3 px-3 text-center">Administrator</th>
                  <th className="pb-3 px-3 text-center">Security Operator</th>
                  <th className="pb-3 px-3 text-center">Compliance Auditor</th>
                  <th className="pb-3 px-3 text-center">Facility Guard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {[
                  { name: 'Register & Enroll Identities', admin: true, operator: true, auditor: false, guard: false },
                  { name: 'Modify Biometric Facial Templates', admin: true, operator: false, auditor: false, guard: false },
                  { name: 'Remote Door Controller Override (Unlock/Lock)', admin: true, operator: true, auditor: false, guard: true },
                  { name: 'Review & Triage Security Incidents', admin: true, operator: true, auditor: true, guard: false },
                  { name: 'Export Cryptographic Audit Logs', admin: true, operator: false, auditor: true, guard: false },
                  { name: 'Delete Identity Records & Credentials', admin: true, operator: false, auditor: false, guard: false },
                  { name: 'Calibrate Edge Sensor & AI Confidence Thresholds', admin: true, operator: false, auditor: false, guard: false },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#1E293B]/70 transition-colors">
                    <td className="py-3 pl-2 text-white font-medium">{row.name}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          row.operator ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          row.auditor ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          row.guard ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Access Policies */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rules Configuration */}
          <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-orange-400" />
              Security Enforcement Rules
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#263449] pb-3">
                <div>
                  <div className="font-semibold text-white">Strict Anti-Passback (APB)</div>
                  <div className="text-[11px] text-slate-400">
                    Prevents badge sharing by enforcing strict exit-before-entry sequence.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={antiPassbackStrict}
                  onChange={e => setAntiPassbackStrict(e.target.checked)}
                  className="h-4 w-4 accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-3">
                <div>
                  <div className="font-semibold text-white">Enforce Multi-Factor for High Security</div>
                  <div className="text-[11px] text-slate-400">
                    Mandates Face + PIN on Zone D (Server Room & Vault) checkpoints.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={mfaForServerRoom}
                  onChange={e => setMfaForServerRoom(e.target.checked)}
                  className="h-4 w-4 accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-3">
                <div>
                  <div className="font-semibold text-white">Tailgating Camera AI Detection</div>
                  <div className="text-[11px] text-slate-400">
                    Stereoscopic depth sensors trigger alarm if multiple persons enter single swipe.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tailgateDetection}
                  onChange={e => setTailgateDetection(e.target.checked)}
                  className="h-4 w-4 accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Biometric Liveness Verification Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Standard', 'Strict', 'Paranoid'] as const).map(sens => (
                    <button
                      key={sens}
                      type="button"
                      onClick={() => setLivenessSensitivity(sens)}
                      className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${
                        livenessSensitivity === sens
                          ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                          : 'border-[#263449] bg-[#111827] text-slate-400 hover:text-white'
                      }`}
                    >
                      {sens}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSavePolicies}
                className="w-full rounded-lg bg-orange-500 py-2 text-xs font-semibold text-white hover:bg-orange-600"
              >
                Apply Security Rules
              </button>
            </div>
          </div>

          {/* Time Schedules */}
          <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-400" />
              Access Window Schedules
            </h3>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-[#263449] bg-[#111827] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">Tier 2 Standard Business Access</span>
                  <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Monday – Friday · 07:00 – 20:00 (All standard wings)
                </div>
              </div>

              <div className="rounded-lg border border-[#263449] bg-[#111827] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">Critical Infrastructure 24/7 Window</span>
                  <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Monday – Sunday · Unrestricted for Tier 1 Credentials
                </div>
              </div>

              <div className="rounded-lg border border-[#263449] bg-[#111827] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">Weekend Facility Quarantine</span>
                  <span className="text-amber-400 font-mono text-[11px]">SCHEDULED</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Saturday 22:00 – Monday 05:00 · Admin pass required
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-white mb-1">
                  Door Held Open Alert Delay (Seconds)
                </label>
                <select
                  value={doorHeldTimeout}
                  onChange={e => setDoorHeldTimeout(e.target.value)}
                  className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="15">15 Seconds (High Security)</option>
                  <option value="30">30 Seconds (Default Standard)</option>
                  <option value="60">60 Seconds (Loading Bays)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Connected Edge Hardware */}
      {activeTab === 'devices' && (
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Edge Reader Terminals & Relays</h3>
              <p className="text-xs text-slate-400">Network health, firmware version, and diagnostic status</p>
            </div>
            <button
              onClick={() => {
                addToast({
                  title: 'Network Sync Completed',
                  description: 'All 6 edge terminals synchronized with master credential database.',
                  type: 'success',
                });
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#111827] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-[#1E293B]"
            >
              <RefreshCw className="h-3.5 w-3.5 text-orange-400" />
              <span>Poll All Terminals</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Device Name & Zone</th>
                  <th className="pb-3 px-2">Terminal ID</th>
                  <th className="pb-3 px-2">Network IP</th>
                  <th className="pb-3 px-2">Firmware</th>
                  <th className="pb-3 px-2">Telemetry</th>
                  <th className="pb-3 px-2">Lock Status</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {accessPoints.map(point => (
                  <tr key={point.id} className="hover:bg-[#1E293B]/70 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="font-semibold text-white">{point.name}</div>
                      <div className="text-[10px] text-slate-400">{point.zone}</div>
                    </td>

                    <td className="py-3 px-2 font-mono text-orange-400">{point.id}</td>

                    <td className="py-3 px-2 font-mono text-slate-300">{point.ipAddress}</td>

                    <td className="py-3 px-2 font-mono text-slate-400">{point.firmware}</td>

                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${
                          point.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {point.status}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`font-semibold ${
                          point.isLocked ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {point.isLocked ? 'Locked' : 'Unlocked'}
                      </span>
                    </td>

                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => handleRebootDevice(point.name)}
                        className="rounded border border-[#263449] bg-[#111827] px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-orange-400 hover:border-orange-500/40 transition-colors"
                      >
                        Reboot Node
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Audit Retention */}
      {activeTab === 'retention' && (
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#263449] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Cryptographic Data Governance</h3>
              <p className="text-xs text-slate-400">
                Compliance storage lifecycle, hardware security modules (HSM), and biometric encryption
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400">FIPS 140-3 Certified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg border border-[#263449] bg-[#111827] p-4 space-y-2">
              <div className="text-slate-400 text-[11px]">Audit Retention Period</div>
              <div className="font-mono text-xl font-bold text-white">365 Days</div>
              <p className="text-slate-400 text-[11px]">
                Access records maintained in immutable write-once read-many (WORM) storage.
              </p>
            </div>

            <div className="rounded-lg border border-[#263449] bg-[#111827] p-4 space-y-2">
              <div className="text-slate-400 text-[11px]">Biometric Template Security</div>
              <div className="font-mono text-xl font-bold text-emerald-400">AES-256-GCM</div>
              <p className="text-slate-400 text-[11px]">
                Raw images discarded post-vectorization. Only irreversibly hashed embeddings stored.
              </p>
            </div>

            <div className="rounded-lg border border-[#263449] bg-[#111827] p-4 space-y-2">
              <div className="text-slate-400 text-[11px]">Tamper Response Mode</div>
              <div className="font-mono text-xl font-bold text-orange-400">Immediate Lockdown</div>
              <p className="text-slate-400 text-[11px]">
                Physical enclosure breach zeroes volatile cryptographic keys immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
