import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationScreen,
  UserRole,
  ThemeMode,
  UserItem,
  AccessPoint,
  AccessEvent,
  SecurityEvent,
  AppNotification,
  ToastMessage,
  GeneratedReportItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ACCESS_POINTS,
  INITIAL_ACCESS_EVENTS,
  INITIAL_SECURITY_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
} from '../data/mockData';

interface AppContextType {
  // Navigation & Role
  currentScreen: NavigationScreen;
  setCurrentScreen: (screen: NavigationScreen) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  navigateToUserProfile: (userId: string) => void;

  // Theme
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;

  // Data Collections
  users: UserItem[];
  addUser: (user: Omit<UserItem, 'id' | 'createdDate' | 'initials' | 'avatarColor'>) => void;
  updateUser: (id: string, updates: Partial<UserItem>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  accessPoints: AccessPoint[];
  toggleAccessPointLock: (id: string) => void;

  accessEvents: AccessEvent[];
  securityEvents: SecurityEvent[];
  updateSecurityEventStatus: (id: string, newStatus: SecurityEvent['status'], actionTaken?: string) => void;

  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Search & Global Filter
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Real-time Feed Simulation
  isLiveFeedActive: boolean;
  setIsLiveFeedActive: (active: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals & Selected Event Inspector
  selectedSecurityEvent: SecurityEvent | null;
  setSelectedSecurityEvent: (event: SecurityEvent | null) => void;
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (open: boolean) => void;
  editingUser: UserItem | null;
  setEditingUser: (user: UserItem | null) => void;
  isRecaptureModalOpen: boolean;
  setIsRecaptureModalOpen: (open: boolean) => void;

  // Reports
  generatedReports: GeneratedReportItem[];
  addGeneratedReport: (report: GeneratedReportItem) => void;
  deleteReport: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [selectedUserId, setSelectedUserId] = useState<string>('NV-1082');
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('netravision_theme') as ThemeMode;
    return saved || 'dark';
  });

  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>(INITIAL_ACCESS_POINTS);
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>(INITIAL_ACCESS_EVENTS);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(INITIAL_SECURITY_EVENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [selectedSecurityEvent, setSelectedSecurityEvent] = useState<SecurityEvent | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isRecaptureModalOpen, setIsRecaptureModalOpen] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReportItem[]>(INITIAL_REPORTS);

  const addGeneratedReport = (report: GeneratedReportItem) => {
    setGeneratedReports(prev => [report, ...prev]);
  };

  const deleteReport = (id: string) => {
    setGeneratedReports(prev => prev.filter(r => r.id !== id));
    addToast({
      title: 'Report Deleted',
      description: `Report record ${id} removed from archive.`,
      type: 'info',
    });
  };

  // Sync theme with HTML class
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('netravision_theme', mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [themeMode]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateToUserProfile = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentScreen('user-profile');
  };

  // User Actions
  const addUser = (userData: Omit<UserItem, 'id' | 'createdDate' | 'initials' | 'avatarColor'>) => {
    const newId = `NV-${Math.floor(1000 + Math.random() * 9000)}`;
    const initials = userData.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const colors = [
      'from-blue-600 to-indigo-700',
      'from-emerald-600 to-teal-700',
      'from-amber-600 to-orange-700',
      'from-purple-600 to-violet-700',
      'from-cyan-600 to-blue-700',
    ];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];
    const todayStr = new Date().toISOString().split('T')[0];

    const newUser: UserItem = {
      ...userData,
      id: newId,
      createdDate: todayStr,
      initials,
      avatarColor,
    };

    setUsers(prev => [newUser, ...prev]);
    addToast({
      title: 'Identity Registered',
      description: `${userData.name} successfully created with ID ${newId}`,
      type: 'success',
    });
  };

  const updateUser = (id: string, updates: Partial<UserItem>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          if (updates.name) {
            updated.initials = updates.name
              .split(' ')
              .map(p => p[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();
          }
          return updated;
        }
        return u;
      })
    );
    addToast({
      title: 'Identity Updated',
      description: `User record ${id} modified successfully`,
      type: 'info',
    });
  };

  const deleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    addToast({
      title: 'Identity Deleted',
      description: `${target?.name || id} was removed from the directory`,
      type: 'error',
    });
    if (currentScreen === 'user-profile' && selectedUserId === id) {
      setCurrentScreen('identity');
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
          addToast({
            title: `Identity ${nextStatus}`,
            description: `${u.name} is now marked as ${nextStatus}`,
            type: nextStatus === 'Active' ? 'success' : 'warning',
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Access Point Actions
  const toggleAccessPointLock = (id: string) => {
    setAccessPoints(prev =>
      prev.map(ap => {
        if (ap.id === id) {
          const newLockedState = !ap.isLocked;
          addToast({
            title: newLockedState ? 'Manual Lockdown Initiated' : 'Access Point Unlocked',
            description: `${ap.name} is now ${newLockedState ? 'LOCKED / RESTRICTED' : 'UNLOCKED / ACTIVE'}`,
            type: newLockedState ? 'warning' : 'success',
          });
          return {
            ...ap,
            isLocked: newLockedState,
            status: newLockedState ? 'Restricted' : 'Active',
          };
        }
        return ap;
      })
    );
  };

  // Security Event Status
  const updateSecurityEventStatus = (
    id: string,
    newStatus: SecurityEvent['status'],
    actionTaken?: string
  ) => {
    setSecurityEvents(prev =>
      prev.map(ev => {
        if (ev.id === id) {
          return {
            ...ev,
            status: newStatus,
            actionTaken: actionTaken || ev.actionTaken,
            investigator: ev.investigator || 'Security Team',
          };
        }
        return ev;
      })
    );
    addToast({
      title: 'Security Incident Updated',
      description: `Event ${id} status set to "${newStatus}"`,
      type: 'info',
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      title: 'Notifications Cleared',
      description: 'All alerts marked as reviewed',
      type: 'info',
    });
  };

  // Simulated live access stream (every 18 seconds when active)
  useEffect(() => {
    if (!isLiveFeedActive) return;

    const liveInterval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomPoint = accessPoints.filter(p => p.status !== 'Offline')[
        Math.floor(Math.random() * (accessPoints.length - 1))
      ];

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const isGranted = randomUser.status === 'Active' && !randomPoint.isLocked;
      const newEvent: AccessEvent = {
        id: `AE-${Math.floor(9000 + Math.random() * 999)}`,
        userName: randomUser.name,
        userId: randomUser.id,
        userInitials: randomUser.initials,
        avatarColor: randomUser.avatarColor,
        accessPoint: randomPoint.name,
        accessPointId: randomPoint.id,
        timestamp: timeStr,
        timeRaw: now.toISOString(),
        authenticationType: 'Face Recognition',
        status: isGranted ? 'Granted' : 'Denied',
        confidenceScore: isGranted ? +(97 + Math.random() * 2.8).toFixed(1) : 48.5,
        reason: isGranted ? undefined : 'Access point locked or user restricted',
      };

      setAccessEvents(prev => [newEvent, ...prev.slice(0, 49)]);

      // Update point throughput
      setAccessPoints(pts =>
        pts.map(p =>
          p.id === randomPoint.id
            ? {
                ...p,
                todayThroughput: p.todayThroughput + (isGranted ? 1 : 0),
                failedAttemptsToday: p.failedAttemptsToday + (isGranted ? 0 : 1),
                lastActivity: 'Just now',
              }
            : p
        )
      );
    }, 18000);

    return () => clearInterval(liveInterval);
  }, [isLiveFeedActive, users, accessPoints]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        userRole,
        setUserRole,
        selectedUserId,
        setSelectedUserId,
        navigateToUserProfile,
        themeMode,
        setThemeMode,
        users,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        accessPoints,
        toggleAccessPointLock,
        accessEvents,
        securityEvents,
        updateSecurityEventStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        globalSearchQuery,
        setGlobalSearchQuery,
        isLiveFeedActive,
        setIsLiveFeedActive,
        toasts,
        addToast,
        removeToast,
        selectedSecurityEvent,
        setSelectedSecurityEvent,
        isAddUserModalOpen,
        setIsAddUserModalOpen,
        editingUser,
        setEditingUser,
        isRecaptureModalOpen,
        setIsRecaptureModalOpen,
        generatedReports,
        addGeneratedReport,
        deleteReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
