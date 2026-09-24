import React, { useState } from 'react';
import {
  ArrowLeft,
  Scan,
  Edit,
  Power,
  Trash2,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Building,
  Key,
  Fingerprint,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeleteConfirmDialog } from '../modals/DeleteConfirmDialog';

export const UserProfileScreen: React.FC = () => {
  const {
    users,
    selectedUserId,
    setCurrentScreen,
    setEditingUser,
    setIsAddUserModalOpen,
    setIsRecaptureModalOpen,
    toggleUserStatus,
    deleteUser,
    accessEvents,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'history'>('info');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Retrieve selected user or fallback to first
  const user = users.find(u => u.id === selectedUserId) || users[0];

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-400">
        User record not found.{' '}
        <button
          onClick={() => setCurrentScreen('identity')}
          className="text-orange-400 underline"
        >
          Return to Identity Management
        </button>
      </div>
    );
  }

  // Filter user's specific events
  const userEvents = accessEvents.filter(
    e => e.userId === user.id || e.userName.toLowerCase() === user.name.toLowerCase()
  );

  // Generate some realistic historical access events if user has few live ones
  const historicalEvents = [
    ...userEvents,
    {
      id: `HIST-${user.id}-1`,
      userName: user.name,
      userId: user.id,
      userInitials: user.initials,
      avatarColor: user.avatarColor,
      accessPoint: 'Main Entrance',
      accessPointId: 'AP-101',
      timestamp: 'Yesterday 08:31:14',
      timeRaw: '2026-09-23 08:31:14',
      authenticationType: 'Face Recognition' as const,
      status: 'Granted' as const,
      confidenceScore: user.biometricMatchRate || 99.1,
    },
    {
      id: `HIST-${user.id}-2`,
      userName: user.name,
      userId: user.id,
      userInitials: user.initials,
      avatarColor: user.avatarColor,
      accessPoint: 'Floor 2',
      accessPointId: 'AP-102',
      timestamp: 'Yesterday 09:12:05',
      timeRaw: '2026-09-23 09:12:05',
      authenticationType: 'Face Recognition' as const,
      status: 'Granted' as const,
      confidenceScore: user.biometricMatchRate || 98.9,
    },
    {
      id: `HIST-${user.id}-3`,
      userName: user.name,
      userId: user.id,
      userInitials: user.initials,
      avatarColor: user.avatarColor,
      accessPoint: 'Server Room',
      accessPointId: 'AP-103',
      timestamp: '2026-09-22 16:45:20',
      timeRaw: '2026-09-22 16:45:20',
      authenticationType: 'Multi-Factor Biometric' as const,
      status: user.accessGroup.includes('Server') ? ('Granted' as const) : ('Denied' as const),
      confidenceScore: 97.4,
      reason: user.accessGroup.includes('Server') ? undefined : 'Zone D clearance restriction',
    },
  ];

  const statusBadgeClass =
    user.status === 'Active'
      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
      : user.status === 'Restricted'
      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30';

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar with Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('identity')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263449] bg-[#111827] text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
            title="Back to Identity Directory"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-white">{user.name}</h2>
              <span className="font-mono text-xs text-orange-400 font-semibold">{user.id}</span>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass}`}>
                {user.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {user.role} · {user.department} · {user.clearanceLevel}
            </p>
          </div>
        </div>

        {/* Action button toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Recapture Face */}
          <button
            onClick={() => setIsRecaptureModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/20 transition-colors"
          >
            <Scan className="h-3.5 w-3.5" />
            <span>Recapture Face</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => {
              setEditingUser(user);
              setIsAddUserModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#111827] px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-[#1E293B] transition-colors"
          >
            <Edit className="h-3.5 w-3.5 text-slate-400" />
            <span>Edit Profile</span>
          </button>

          {/* Toggle status */}
          <button
            onClick={() => toggleUserStatus(user.id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              user.status === 'Active'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            <span>{user.status === 'Active' ? 'Disable Access' : 'Enable Access'}</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Dossier Card */}
      <div className="rounded-xl border border-[#263449] bg-[#172033] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Large Avatar & Biometric status ring */}
          <div className="relative">
            <div
              className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${user.avatarColor} text-3xl font-bold text-white shadow-xl`}
            >
              {user.initials}
            </div>
            <div
              className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#172033] ${
                user.biometricStatus === 'Registered'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}
              title={`Biometric Status: ${user.biometricStatus}`}
            >
              <Fingerprint className="h-4 w-4" />
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> Corporate Email
              </span>
              <span className="font-semibold text-white break-all">{user.email}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> Contact Phone
              </span>
              <span className="font-semibold text-white">{user.phone}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Enrolled Since
              </span>
              <span className="font-mono text-white tabular-nums">{user.createdDate}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Last Authentication
              </span>
              <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                {user.lastAuthentication}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center gap-2 border-b border-[#263449]">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 text-xs font-semibold transition-all relative ${
            activeTab === 'info'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          1. Profile Information & Clearance
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 text-xs font-semibold transition-all relative ${
            activeTab === 'activity'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          2. Recent Access Activity ({userEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-xs font-semibold transition-all relative ${
            activeTab === 'history'
              ? 'text-orange-400 border-b-2 border-orange-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          3. Authentication History & Scores
        </button>
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Credentials Card */}
          <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-400" />
              Access Group & Clearances
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Assigned Clearance Tier</span>
                <span className="font-semibold text-white text-right">{user.accessGroup}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Role Classification</span>
                <span className="font-medium text-white">{user.role}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Physical Department</span>
                <span className="font-medium text-white">{user.department}</span>
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Security Clearance Level</span>
                <span className="font-medium text-orange-400">{user.clearanceLevel}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Emergency Contact</span>
                <span className="font-medium text-white">
                  {user.emergencyContact || 'None on file'}
                </span>
              </div>
            </div>
          </div>

          {/* Biometric & Token Credentials Card */}
          <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-orange-400" />
              Biometrics & RFID Hardware Tokens
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Facial Biometric Status</span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {user.biometricStatus}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Biometric Similarity Index</span>
                <span className="font-mono text-white tabular-nums">
                  {user.biometricMatchRate}% confidence
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Physical RFID Badge ID</span>
                <span className="font-mono text-orange-400 tabular-nums">
                  {user.rfidBadgeId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#263449] pb-2.5">
                <span className="text-slate-400">Liveness Detection Mode</span>
                <span className="font-medium text-white">3D Infrared & Blink Mesh Active</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Anti-Passback Enforcement</span>
                <span className="font-medium text-emerald-400">Enabled (Strict 15m window)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Activity */}
      {activeTab === 'activity' && (
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Physical Access Events</h3>
            <span className="text-xs text-slate-400">Live operational checkpoint logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">Event ID</th>
                  <th className="pb-2.5">Access Point</th>
                  <th className="pb-2.5">Timestamp</th>
                  <th className="pb-2.5">Auth Mode</th>
                  <th className="pb-2.5">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {historicalEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-[#1E293B]/70 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] text-orange-400 tabular-nums">
                      {evt.id}
                    </td>
                    <td className="py-2.5 font-medium text-white">{evt.accessPoint}</td>
                    <td className="py-2.5 font-mono text-slate-400 tabular-nums">
                      {evt.timestamp}
                    </td>
                    <td className="py-2.5 text-slate-300">{evt.authenticationType}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${
                          evt.status === 'Granted'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Authentication History */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Detailed Biometric & Credential Log
              </h3>
              <p className="text-xs text-slate-400">
                Audit records of successful and denied identity verification attempts
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-emerald-400">
                Avg Similarity: {user.biometricMatchRate}%
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">Date & Time</th>
                  <th className="pb-2.5">Checkpoint Reader</th>
                  <th className="pb-2.5">Sensor Match Index</th>
                  <th className="pb-2.5">Evaluation Result</th>
                  <th className="pb-2.5">Forensic Diagnostics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {historicalEvents.map(evt => (
                  <tr key={evt.id} className="hover:bg-[#1E293B]/70 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] text-slate-300 tabular-nums">
                      {evt.timestamp}
                    </td>
                    <td className="py-2.5 font-medium text-white">{evt.accessPoint}</td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-300 tabular-nums">
                      {evt.confidenceScore ? `${evt.confidenceScore}% match` : 'N/A (Card token)'}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${
                          evt.status === 'Granted'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-[11px] text-slate-400">
                      {evt.reason || 'Biometric embeddings matched registered model template'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteUser(user.id)}
        title="Revoke and Delete Identity Dossier"
        description={`This action permanently invalidates ${user.name}'s biometric embeddings and access keys. All access points will deny this identity immediately.`}
        confirmLabel="Confirm Permanent Revocation"
      />
    </div>
  );
};
