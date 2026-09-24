/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { IdentityManagementScreen } from './components/screens/IdentityManagementScreen';
import { UserProfileScreen } from './components/screens/UserProfileScreen';
import { AccessIntelligenceScreen } from './components/screens/AccessIntelligenceScreen';
import { SecurityEventsScreen } from './components/screens/SecurityEventsScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { AdministrationScreen } from './components/screens/AdministrationScreen';
import { AddEditUserModal } from './components/modals/AddEditUserModal';
import { RecaptureFaceModal } from './components/modals/RecaptureFaceModal';
import { SecurityEventDetailModal } from './components/modals/SecurityEventDetailModal';
import { AppBackground } from './components/common/AppBackground';

const MainLayout: React.FC = () => {
  const { currentScreen } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'identity':
        return <IdentityManagementScreen />;
      case 'user-profile':
        return <UserProfileScreen />;
      case 'access-intel':
        return <AccessIntelligenceScreen />;
      case 'security-events':
        return <SecurityEventsScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'admin':
        return <AdministrationScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#05070D] text-slate-100 antialiased font-sans selection:bg-[#FF6B00]/30 selection:text-[#FF8526]">
      {/* Luminous Orange Corner Gradient Background Effect matching tablet wallpaper */}
      <AppBackground />

      {/* Navigation Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden bg-transparent">
        {/* Top Header */}
        <Header onToggleSidebarMobile={() => setIsMobileNavOpen(true)} />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-transparent">
          <div className="max-w-7xl mx-auto">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AddEditUserModal />
      <RecaptureFaceModal />
      <SecurityEventDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
