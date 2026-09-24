import React from 'react';
import {
  LayoutDashboard,
  Users,
  ScanFace,
  ShieldAlert,
  BarChart3,
  FileText,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  Radio,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationScreen } from '../../types';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { currentScreen, setCurrentScreen, userRole, securityEvents, accessEvents } = useApp();

  const unreviewedSecurityCount = securityEvents.filter(e => e.status === 'Under Review').length;

  const navItems: {
    screen: NavigationScreen;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    adminOnly?: boolean;
  }[] = [
    {
      screen: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      screen: 'identity',
      label: 'Identity Management',
      icon: Users,
    },
    {
      screen: 'access-intel',
      label: 'Access Intelligence',
      icon: ScanFace,
      badge: 'LIVE',
    },
    {
      screen: 'security-events',
      label: 'Security Events',
      icon: ShieldAlert,
      badge: unreviewedSecurityCount > 0 ? unreviewedSecurityCount : undefined,
    },
    {
      screen: 'analytics',
      label: 'Analytics & Insights',
      icon: BarChart3,
    },
    {
      screen: 'reports',
      label: 'Reports',
      icon: FileText,
    },
    {
      screen: 'admin',
      label: 'Administration',
      icon: Sliders,
      adminOnly: true,
    },
  ];

  const handleNavClick = (screen: NavigationScreen) => {
    setCurrentScreen(screen);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#151E2E] bg-[#06080F]/95 backdrop-blur-xl text-slate-300 transition-all duration-300 ease-in-out lg:static ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Logo & Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#151E2E] px-4">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex cursor-pointer items-center gap-3 overflow-hidden"
          >
            {/* Custom NetraVision Aperture Symbol */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-[#E64A00] text-white shadow-lg shadow-orange-500/30">
              <Eye className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-none">
                  Netra<span className="text-[#FF6B00]">Vision</span>
                </span>
                <span className="mt-1 text-[10px] font-normal text-slate-400 tracking-normal">
                  AI Enabled Access Control System
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1.5">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {!isCollapsed ? 'Navigation' : '•••'}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.screen;
            const isRestrictedForRole = item.adminOnly && userRole !== 'admin';

            return (
              <div key={item.screen} className="relative">
                {/* Left Orange Active Strip Bar like in Tablet Design */}
                {isActive && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-[#FF6B00] shadow-[0_0_12px_#FF6B00]" />
                )}

                <button
                  onClick={() => {
                    handleNavClick(item.screen);
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'border border-[#FF6B00]/50 bg-gradient-to-r from-[#FF6B00]/25 via-[#FF6B00]/15 to-[#FF6B00]/5 text-white shadow-[0_0_20px_rgba(255,107,0,0.22)] font-semibold'
                      : 'text-slate-300 hover:bg-[#101625] hover:text-white border border-transparent'
                  } ${isRestrictedForRole ? 'opacity-60' : ''}`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-[#FF7A1A] drop-shadow-[0_0_6px_rgba(255,122,26,0.6)]'
                        : 'text-slate-400 group-hover:text-orange-400'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="truncate text-left flex-1">{item.label}</span>
                  )}

                  {/* Badge indicator */}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`ml-auto font-mono text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Admin lock tag if restricted */}
                  {!isCollapsed && isRestrictedForRole && (
                    <span className="text-[10px] text-slate-400 font-normal ml-auto">
                      Admin
                    </span>
                  )}

                  {/* Collapsed dot for alerts */}
                  {isCollapsed && item.badge && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-400" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Brand Motto from Tablet Design */}
        {!isCollapsed && (
          <div className="mx-3 mb-2 px-3 py-2">
            <div className="h-0.5 w-6 rounded-full bg-[#FF6B00] mb-2" />
            <p className="text-[11px] font-medium text-slate-400 leading-tight">
              Smarter Security.
              <br />
              <span className="text-slate-300">A Safer Tomorrow.</span>
            </p>
          </div>
        )}

        {/* Active System Status Dossier */}
        {!isCollapsed && (
          <div className="mx-3 mb-3 rounded-xl border border-[#182335] bg-[#0A0E18]/80 p-3 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300">Biometric Engine</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                v4.8 Ready
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Role:{' '}
              <span className="font-semibold text-white">
                {userRole === 'admin' ? 'Administrator' : 'Security Operator'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-[#182335]">
              <span>Throughput Today</span>
              <span className="font-mono text-slate-300 tabular-nums">
                {accessEvents.length * 142 + 84} ops
              </span>
            </div>
          </div>
        )}

        {/* Footer with Collapse Toggle and Profile */}
        <div className="border-t border-[#151E2E] p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavClick('user-profile')}
              className="flex items-center gap-2.5 overflow-hidden text-left hover:opacity-90 transition-opacity"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6B00] font-semibold text-white text-xs shadow-sm shadow-orange-500/30">
                RS
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="truncate text-xs font-semibold text-white">Rahul Sharma</div>
                  <div className="text-[10px] text-slate-400 font-mono">NV-1082</div>
                </div>
              )}
            </button>

            {/* Collapse / Expand Desktop Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden h-7 w-7 items-center justify-center rounded-md border border-[#182335] text-slate-400 hover:bg-[#101625] hover:text-white transition-colors lg:flex"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
