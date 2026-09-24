import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserItem, UserStatus } from '../../types';
import { DeleteConfirmDialog } from '../modals/DeleteConfirmDialog';

export const IdentityManagementScreen: React.FC = () => {
  const {
    users,
    toggleUserStatus,
    deleteUser,
    navigateToUserProfile,
    setIsAddUserModalOpen,
    setEditingUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  // Stats calculation
  const totalCount = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const disabledCount = users.filter(u => u.status === 'Disabled' || u.status === 'Inactive').length;
  const recentAddedCount = users.filter(u => u.createdDate >= '2025-06-01').length;

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusBadges: Record<UserStatus, string> = {
    Active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    Restricted: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Disabled: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    Inactive: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Identity Management</h2>
          <p className="text-xs text-slate-400">
            Manage registered identities, biometric enrollment status, and access permissions.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setIsAddUserModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Identity</span>
        </button>
      </div>

      {/* 4 Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Users</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {totalCount + 1230}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Directory credentials issued</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Active Users</span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            {activeCount + 1160}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Fully credentialed & verified</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Disabled Users</span>
            <UserX className="h-4 w-4 text-rose-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-rose-400 tabular-nums">
            {disabledCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Revoked / Suspended tokens</div>
        </div>

        <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Recently Added</span>
            <UserPlus className="h-4 w-4 text-orange-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {recentAddedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Enrolled past 90 days</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-xl border border-[#263449] bg-[#172033] p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, user ID, department, or email..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-[#263449] bg-[#111827] py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Role:</span>
              <select
                value={roleFilter}
                onChange={e => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Security Engineer">Security Engineer</option>
                <option value="Systems Operator">Systems Operator</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Research Associate">Research Associate</option>
                <option value="External Contractor">External Contractor</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
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
                <option value="Active">Active</option>
                <option value="Restricted">Restricted</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#263449] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">User Identity</th>
                <th className="pb-3 px-2">User ID</th>
                <th className="pb-3 px-2">Role & Department</th>
                <th className="pb-3 px-2">Biometrics</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Last Authentication</th>
                <th className="pb-3 px-2">Created Date</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]/60">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No matching users found for current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map(user => {
                  const isActive = user.status === 'Active';

                  return (
                    <tr
                      key={user.id}
                      className="group hover:bg-[#1E293B]/70 transition-colors"
                    >
                      {/* Avatar & Name */}
                      <td className="py-3 pl-2 pr-3">
                        <button
                          onClick={() => navigateToUserProfile(user.id)}
                          className="flex items-center gap-3 text-left"
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${user.avatarColor} text-xs font-bold text-white shadow-xs`}
                          >
                            {user.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-slate-400">{user.email}</div>
                          </div>
                        </button>
                      </td>

                      {/* User ID */}
                      <td className="py-3 px-2">
                        <span className="font-mono text-orange-400 font-medium tabular-nums">
                          {user.id}
                        </span>
                      </td>

                      {/* Role & Dept */}
                      <td className="py-3 px-2">
                        <div className="text-white font-medium">{user.role}</div>
                        <div className="text-[11px] text-slate-400">{user.department}</div>
                      </td>

                      {/* Biometrics */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck
                            className={`h-3.5 w-3.5 ${
                              user.biometricStatus === 'Registered'
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                            }`}
                          />
                          <span className="text-slate-300">{user.biometricStatus}</span>
                        </div>
                        {user.biometricMatchRate > 0 && (
                          <span className="font-mono text-[10px] text-slate-400">
                            {user.biometricMatchRate}% match index
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${
                            statusBadges[user.status]
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Last Authentication */}
                      <td className="py-3 px-2 text-slate-300 font-mono text-[11px] tabular-nums">
                        {user.lastAuthentication}
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-2 text-slate-400 font-mono text-[11px] tabular-nums">
                        {user.createdDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Dossier */}
                          <button
                            onClick={() => navigateToUserProfile(user.id)}
                            title="View Complete Profile Dossier"
                            className="rounded p-1.5 text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setIsAddUserModalOpen(true);
                            }}
                            title="Edit Credentials"
                            className="rounded p-1.5 text-slate-400 hover:bg-[#1E293B] hover:text-orange-400 transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          {/* Toggle status */}
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            title={isActive ? 'Disable Access' : 'Re-enable Access'}
                            className={`rounded p-1.5 transition-colors hover:bg-[#1E293B] ${
                              isActive
                                ? 'text-amber-400 hover:text-amber-300'
                                : 'text-emerald-400 hover:text-emerald-300'
                            }`}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setUserToDelete(user)}
                            title="Delete Identity Record"
                            className="rounded p-1.5 text-slate-400 hover:bg-rose-500/15 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#263449] pt-3 text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-white">{paginatedUsers.length}</span> of{' '}
            <span className="font-semibold text-white">{filteredUsers.length}</span> matching users
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 items-center gap-1 rounded border border-[#263449] px-2.5 text-xs text-slate-300 hover:bg-[#1E293B] disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>

            <span className="font-mono text-xs px-2 text-slate-300 tabular-nums">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 items-center gap-1 rounded border border-[#263449] px-2.5 text-xs text-slate-300 hover:bg-[#1E293B] disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUser(userToDelete.id);
          }
        }}
        title="Revoke and Delete Identity"
        description={`Are you sure you want to permanently remove ${userToDelete?.name} (${userToDelete?.id}) from NetraVision? All associated biometric embeddings and RFID tokens will be permanently revoked.`}
        confirmLabel="Confirm Deletion"
      />
    </div>
  );
};
