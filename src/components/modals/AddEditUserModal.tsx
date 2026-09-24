import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Shield, Key } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserItem, UserStatus, BiometricStatus } from '../../types';

export const AddEditUserModal: React.FC = () => {
  const { isAddUserModalOpen, setIsAddUserModalOpen, editingUser, setEditingUser, addUser, updateUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Security Engineer',
    department: 'Cyber Physical SecOps',
    status: 'Active' as UserStatus,
    accessGroup: 'Tier 2 - Facilities & Floor 2 Wings',
    biometricStatus: 'Registered' as BiometricStatus,
    biometricMatchRate: 98.5,
    rfidBadgeId: `RFID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}X`,
    emergencyContact: '',
    clearanceLevel: 'Level 3 (Standard)',
    lastAuthentication: 'Never',
    lastAuthDate: 'Pending',
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        department: editingUser.department,
        status: editingUser.status,
        accessGroup: editingUser.accessGroup,
        biometricStatus: editingUser.biometricStatus,
        biometricMatchRate: editingUser.biometricMatchRate,
        rfidBadgeId: editingUser.rfidBadgeId,
        emergencyContact: editingUser.emergencyContact || '',
        clearanceLevel: editingUser.clearanceLevel,
        lastAuthentication: editingUser.lastAuthentication,
        lastAuthDate: editingUser.lastAuthDate,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Security Engineer',
        department: 'Cyber Physical SecOps',
        status: 'Active',
        accessGroup: 'Tier 2 - Facilities & Floor 2 Wings',
        biometricStatus: 'Registered',
        biometricMatchRate: 98.5,
        rfidBadgeId: `RFID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}X`,
        emergencyContact: '',
        clearanceLevel: 'Level 3 (Standard)',
        lastAuthentication: 'Never',
        lastAuthDate: 'Pending',
      });
    }
  }, [editingUser, isAddUserModalOpen]);

  if (!isAddUserModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }

    setIsAddUserModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-xl border border-[#263449] bg-[#172033] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#263449] px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {editingUser ? 'Edit Identity Record' : 'Register New Identity'}
            </h3>
            <p className="text-xs text-slate-400">
              {editingUser ? `Updating parameters for ${editingUser.id}` : 'Enroll new credentialed user into access directory'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsAddUserModalOpen(false);
              setEditingUser(null);
            }}
            className="rounded p-1 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className="w-full rounded-lg border border-[#263449] bg-[#111827] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@netravision.internal"
                  className="w-full rounded-lg border border-[#263449] bg-[#111827] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98200 00000"
                  className="w-full rounded-lg border border-[#263449] bg-[#111827] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="Administrator">Administrator</option>
                <option value="Security Engineer">Security Engineer</option>
                <option value="Systems Operator">Systems Operator</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Research Associate">Research Associate</option>
                <option value="Hardware Architect">Hardware Architect</option>
                <option value="External Contractor">External Contractor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="Security Operations">Security Operations</option>
                <option value="Cyber Physical SecOps">Cyber Physical SecOps</option>
                <option value="Facilities & Hardware">Facilities & Hardware</option>
                <option value="Risk & Audit">Risk & Audit</option>
                <option value="AI & Sensor R&D">AI & Sensor R&D</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="HVAC Maintenance">HVAC Maintenance</option>
                <option value="Leadership">Leadership</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Access Clearance Level</label>
              <select
                value={formData.clearanceLevel}
                onChange={e => setFormData({ ...formData, clearanceLevel: e.target.value })}
                className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="Level 5 (Super Admin)">Level 5 (Super Admin)</option>
                <option value="Level 4 (Engineer Lead)">Level 4 (Engineer Lead)</option>
                <option value="Level 3 (Operator)">Level 3 (Operator)</option>
                <option value="Level 3 (Standard)">Level 3 (Standard)</option>
                <option value="Level 2 (Specialist)">Level 2 (Specialist)</option>
                <option value="Level 1 (Restricted Escort)">Level 1 (Restricted Escort)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Credential Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as UserStatus })}
                className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Restricted">Restricted</option>
                <option value="Disabled">Disabled</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Physical Access Group</label>
            <select
              value={formData.accessGroup}
              onChange={e => setFormData({ ...formData, accessGroup: e.target.value })}
              className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="Tier 1 - Master Clearance & Server Room">Tier 1 - Master Clearance & Server Room</option>
              <option value="Tier 2 - Facilities & Floor 2 Wings">Tier 2 - Facilities & Floor 2 Wings</option>
              <option value="Tier 2 - Admin Wing & Archives">Tier 2 - Admin Wing & Archives</option>
              <option value="Tier 3 - Research Lab Alpha only">Tier 3 - Research Lab Alpha only</option>
              <option value="Contractor Limited - Escorted Only">Contractor Limited - Escorted Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Emergency Contact Info</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="+91 98200 00000 (Spouse / Guardian)"
              className="w-full rounded-lg border border-[#263449] bg-[#111827] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263449]">
            <button
              type="button"
              onClick={() => {
                setIsAddUserModalOpen(false);
                setEditingUser(null);
              }}
              className="rounded-lg border border-[#263449] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-[#1E293B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
            >
              {editingUser ? 'Save Identity Changes' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
