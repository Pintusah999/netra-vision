import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  Shield,
  ShieldAlert,
  ChevronDown,
  Check,
  Radio,
  Wifi,
  LogOut,
  User,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationScreen } from '../../types';

export const Header: React.FC<{ onToggleSidebarMobile: () => void }> = ({
  onToggleSidebarMobile,
}) => {
  const {
    currentScreen,
    setCurrentScreen,
    userRole,
    setUserRole,
    themeMode,
    setThemeMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    globalSearchQuery,
    setGlobalSearchQuery,
    isLiveFeedActive,
    setIsLiveFeedActive,
    users,
    navigateToUserProfile,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(target)) {
        setIsRoleMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(target)) {
        setIsThemeMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results preview
  const searchResults = globalSearchQuery.trim()
    ? users.filter(
        u =>
          u.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
          u.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
          u.department.toLowerCase().includes(globalSearchQuery.toLowerCase())
      )
    : [];

  const screenTitles: Record<NavigationScreen, { title: string; crumb: string }> = {
    dashboard: { title: 'Dashboard', crumb: 'Security Operations / Overview' },
    identity: { title: 'Identity Management', crumb: 'Directory / Registered Identities' },
    'user-profile': { title: 'User Profile & Credentials', crumb: 'Directory / Profile Dossier' },
    'access-intel': { title: 'Access Intelligence', crumb: 'Monitoring / Connected Points' },
    'security-events': { title: 'Security Events', crumb: 'Incident Response / Live Logs' },
    analytics: { title: 'Analytics & Insights', crumb: 'Intelligence / Pattern Analysis' },
    reports: { title: 'Reports & Compliance', crumb: 'Governance / Audit Exports' },
    admin: { title: 'Administration', crumb: 'System / Policies & Readers' },
  };

  const currentMeta = screenTitles[currentScreen] || { title: 'Dashboard', crumb: 'Security Operations' };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#151E2E] bg-[#06080F]/85 px-4 backdrop-blur-xl transition-colors sm:px-6">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#182335] text-slate-300 hover:bg-[#101625] lg:hidden"
          aria-label="Toggle Navigation Drawer"
        >
          <Layers className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
            <span>NetraVision</span>
            <span className="text-slate-600">/</span>
            <span className="font-medium text-slate-300">
              {currentMeta.crumb}
            </span>
          </div>
          <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="relative mx-4 hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search identities, badges, access points..."
            value={globalSearchQuery}
            onChange={e => setGlobalSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="h-9 w-full rounded-xl border border-[#192437] bg-[#0A0E18] pl-9 pr-4 text-xs text-white placeholder-slate-400 transition-all focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/40"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Autocomplete dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 top-11 z-50 w-full overflow-hidden rounded-lg border border-[#263449] bg-[#172033] shadow-xl dark:border-[#263449] dark:bg-[#172033] light:border-slate-200 light:bg-white">
            <div className="border-b border-[#263449] px-3 py-1.5 text-[11px] font-medium text-slate-400 dark:border-[#263449] light:border-slate-100">
              Matching Identities ({searchResults.length})
            </div>
            <div className="max-h-64 overflow-y-auto">
              {searchResults.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    navigateToUserProfile(user.id);
                    setGlobalSearchQuery('');
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#1E293B] transition-colors dark:hover:bg-[#1E293B] light:hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${user.avatarColor} text-xs font-semibold text-white`}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white dark:text-white light:text-slate-900">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{user.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-orange-400 tabular-nums">
                      {user.id}
                    </span>
                    <div className="text-[10px] text-slate-400">{user.status}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time System Connectivity Indicator */}
        <div
          onClick={() => setIsLiveFeedActive(!isLiveFeedActive)}
          title={`Live Telemetry: ${isLiveFeedActive ? 'Connected & Streaming' : 'Paused'}. Click to toggle.`}
          className="hidden cursor-pointer items-center gap-2 rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 transition-colors hover:border-slate-600 sm:flex dark:border-[#263449] dark:bg-[#111827] light:border-slate-200 light:bg-slate-50"
        >
          <div className="relative flex h-2 w-2 items-center justify-center">
            {isLiveFeedActive ? (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
            {isLiveFeedActive ? 'System Online' : 'Stream Paused'}
          </span>
        </div>

        {/* Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#263449] bg-[#111827] px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-orange-500/50 hover:bg-[#172033] transition-all dark:border-[#263449] dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-[#172033] light:border-slate-200 light:bg-slate-50 light:text-slate-800 light:hover:bg-slate-100"
          >
            {userRole === 'admin' ? (
              <Shield className="h-3.5 w-3.5 text-orange-400" />
            ) : (
              <Radio className="h-3.5 w-3.5 text-sky-400" />
            )}
            <span className="hidden sm:inline">
              {userRole === 'admin' ? 'Administrator' : 'Security Operator'}
            </span>
            <span className="sm:hidden">{userRole === 'admin' ? 'Admin' : 'Operator'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border border-[#263449] bg-[#172033] p-1.5 shadow-xl dark:border-[#263449] dark:bg-[#172033] light:border-slate-200 light:bg-white">
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Active Perspective
              </div>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setIsRoleMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs transition-colors ${
                  userRole === 'admin'
                    ? 'bg-orange-500/15 text-orange-400 font-semibold'
                    : 'text-slate-300 hover:bg-[#1E293B] dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <div className="text-left">
                    <div>Administrator</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Full access & policy control
                    </div>
                  </div>
                </div>
                {userRole === 'admin' && <Check className="h-3.5 w-3.5" />}
              </button>

              <button
                onClick={() => {
                  setUserRole('operator');
                  setIsRoleMenuOpen(false);
                  if (currentScreen === 'admin') {
                    setCurrentScreen('dashboard');
                  }
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs transition-colors ${
                  userRole === 'operator'
                    ? 'bg-orange-500/15 text-orange-400 font-semibold'
                    : 'text-slate-300 hover:bg-[#1E293B] dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  <div className="text-left">
                    <div>Security Operator</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Live monitoring & events
                    </div>
                  </div>
                </div>
                {userRole === 'operator' && <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Switcher Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263449] bg-[#111827] text-slate-300 hover:bg-[#172033] transition-colors dark:border-[#263449] dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-[#172033] light:border-slate-200 light:bg-slate-50 light:text-slate-700 light:hover:bg-slate-100"
            title="Theme: Light / Dark / System"
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? (
              <Moon className="h-4 w-4 text-orange-400" />
            ) : themeMode === 'light' ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Laptop className="h-4 w-4 text-slate-300" />
            )}
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 top-10 z-50 w-36 rounded-lg border border-[#263449] bg-[#172033] p-1 shadow-xl dark:border-[#263449] dark:bg-[#172033] light:border-slate-200 light:bg-white">
              <button
                onClick={() => {
                  setThemeMode('dark');
                  setIsThemeMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-orange-500/15 text-orange-400 font-medium'
                    : 'text-slate-300 hover:bg-[#1E293B] dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => {
                  setThemeMode('light');
                  setIsThemeMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                  themeMode === 'light'
                    ? 'bg-orange-500/15 text-orange-400 font-medium'
                    : 'text-slate-300 hover:bg-[#1E293B] dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setThemeMode('system');
                  setIsThemeMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                  themeMode === 'system'
                    ? 'bg-orange-500/15 text-orange-400 font-medium'
                    : 'text-slate-300 hover:bg-[#1E293B] dark:text-slate-300 light:text-slate-700 light:hover:bg-slate-50'
                }`}
              >
                <Laptop className="h-3.5 w-3.5" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#263449] bg-[#111827] text-slate-300 hover:bg-[#172033] transition-colors dark:border-[#263449] dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-[#172033] light:border-slate-200 light:bg-slate-50 light:text-slate-700 light:hover:bg-slate-100"
            aria-label="Security notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 font-mono text-[10px] font-bold text-white tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-10 z-50 w-80 sm:w-96 rounded-lg border border-[#263449] bg-[#172033] shadow-2xl dark:border-[#263449] dark:bg-[#172033] light:border-slate-200 light:bg-white">
              <div className="flex items-center justify-between border-b border-[#263449] px-4 py-2.5 dark:border-[#263449] light:border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white dark:text-white light:text-slate-900">
                    Security Alerts
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded bg-orange-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-orange-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#263449]/60 dark:divide-[#263449]/60 light:divide-slate-100">
                {notifications.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markNotificationRead(item.id);
                      if (item.relatedScreen) {
                        setCurrentScreen(item.relatedScreen);
                        setIsNotificationsOpen(false);
                      }
                    }}
                    className={`cursor-pointer p-3 text-left transition-colors hover:bg-[#1E293B] dark:hover:bg-[#1E293B] light:hover:bg-slate-50 ${
                      !item.read ? 'bg-orange-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.type === 'critical' ? (
                          <span className="flex h-2 w-2 rounded-full bg-red-500" />
                        ) : item.type === 'warning' ? (
                          <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                        ) : (
                          <span className="flex h-2 w-2 rounded-full bg-sky-500" />
                        )}
                        <span className="text-xs font-semibold text-white dark:text-white light:text-slate-900">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#263449] p-2 text-center dark:border-[#263449] light:border-slate-100">
                <button
                  onClick={() => {
                    setCurrentScreen('security-events');
                    setIsNotificationsOpen(false);
                  }}
                  className="text-xs font-medium text-orange-400 hover:text-orange-300"
                >
                  View All Security Events →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar & dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#263449] bg-[#111827] p-1 pr-2 hover:bg-[#172033] transition-colors dark:border-[#263449] dark:bg-[#111827] dark:hover:bg-[#172033] light:border-slate-200 light:bg-slate-50 light:hover:bg-slate-100"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-amber-600 text-xs font-bold text-white shadow-sm">
              RS
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold text-white dark:text-[#F8FAFC] light:text-[#0F172A]">
                Rahul Sharma
              </div>
              <div className="text-[10px] text-slate-400 leading-none">
                {userRole === 'admin' ? 'Administrator' : 'Security Lead'}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-11 z-50 w-52 rounded-lg border border-[#263449] bg-[#172033] p-1.5 shadow-xl dark:border-[#263449] dark:bg-[#172033] light:border-slate-200 light:bg-white">
              <div className="border-b border-[#263449] px-3 py-2 text-left dark:border-[#263449] light:border-slate-100">
                <div className="text-xs font-semibold text-white dark:text-white light:text-slate-900">
                  Rahul Sharma
                </div>
                <div className="font-mono text-[10px] text-slate-400">ID: NV-1082 · Tier 1</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigateToUserProfile('NV-1082');
                    setIsProfileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-200 hover:bg-[#1E293B] dark:text-slate-200 dark:hover:bg-[#1E293B] light:text-slate-700 light:hover:bg-slate-50"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>My Identity Dossier</span>
                </button>
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      setCurrentScreen('admin');
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-200 hover:bg-[#1E293B] dark:text-slate-200 dark:hover:bg-[#1E293B] light:text-slate-700 light:hover:bg-slate-50"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                    <span>System Administration</span>
                  </button>
                )}
              </div>

              <div className="border-t border-[#263449] pt-1 dark:border-[#263449] light:border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    // role switch shortcut for demonstration
                    setUserRole(userRole === 'admin' ? 'operator' : 'admin');
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-orange-400 hover:bg-[#1E293B] dark:hover:bg-[#1E293B] light:hover:bg-slate-50"
                >
                  <span>Switch to {userRole === 'admin' ? 'Operator' : 'Admin'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
