export type NavigationScreen = 
  | 'dashboard'
  | 'identity'
  | 'user-profile'
  | 'access-intel'
  | 'security-events'
  | 'analytics'
  | 'reports'
  | 'admin';

export type UserRole = 'admin' | 'operator';

export type ThemeMode = 'dark' | 'light' | 'system';

export type UserStatus = 'Active' | 'Inactive' | 'Restricted' | 'Disabled';

export type BiometricStatus = 'Registered' | 'Pending' | 'Verification Required';

export interface UserItem {
  id: string; // e.g. "NV-1082"
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: UserStatus;
  accessGroup: string;
  biometricStatus: BiometricStatus;
  biometricMatchRate: number; // e.g. 99.4
  rfidBadgeId: string;
  lastAuthentication: string;
  lastAuthDate: string;
  createdDate: string;
  initials: string;
  avatarColor: string;
  emergencyContact?: string;
  clearanceLevel: string;
}

export type AccessPointStatus = 'Active' | 'Restricted' | 'Offline';

export interface AccessPoint {
  id: string;
  name: string;
  zone: string;
  status: AccessPointStatus;
  lastActivity: string;
  authenticationMethod: string;
  readersCount: number;
  isLocked: boolean;
  firmware: string;
  ipAddress: string;
  todayThroughput: number;
  failedAttemptsToday: number;
}

export type AuthMethodType = 
  | 'Face Recognition'
  | 'RFID Badge'
  | 'Multi-Factor Biometric'
  | 'QR Visitor Pass'
  | 'PIN Code';

export type AccessResultStatus = 'Granted' | 'Denied' | 'Failed' | 'Restricted';

export interface AccessEvent {
  id: string;
  userName: string;
  userId: string;
  userInitials: string;
  avatarColor: string;
  accessPoint: string;
  accessPointId: string;
  timestamp: string;
  timeRaw: string;
  authenticationType: AuthMethodType;
  status: AccessResultStatus;
  confidenceScore?: number;
  reason?: string;
}

export type SecuritySeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type SecurityEventCategory = 
  | 'Authentication Event'
  | 'Access Event'
  | 'Failed Authentication'
  | 'Access Denied'
  | 'Delete Event'
  | 'Update User Event'
  | 'Tailgating Detection'
  | 'Door Forced Open'
  | 'Biometric Liveness Failed';

export type SecurityEventStatus = 'Under Review' | 'Resolved' | 'Investigated' | 'Escalated' | 'Logged' | 'Completed';

export interface SecurityEvent {
  id: string;
  eventType: SecurityEventCategory;
  userName: string;
  userId: string;
  accessPoint: string;
  timestamp: string;
  severity: SecuritySeverity;
  status: SecurityEventStatus;
  details: string;
  investigator?: string;
  actionTaken?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  relatedScreen?: NavigationScreen;
}

export type ReportType = 
  | 'User Report'
  | 'Access Report'
  | 'Authentication Report'
  | 'Security Event Report'
  | 'Activity Report';

export interface ReportFilter {
  reportType: ReportType;
  dateRange: 'today' | '7d' | '30d' | '90d';
  accessPoint: string;
  department: string;
  status: string;
}

export interface GeneratedReportItem {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  generatedBy: string;
  fileSize: string;
  status: 'Ready' | 'Processing' | 'Failed';
  format: 'CSV' | 'PDF';
  downloadUrl: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'warning' | 'error' | 'info';
}
