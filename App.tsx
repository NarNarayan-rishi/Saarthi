import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/auth/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { CareerJourney } from './pages/student/CareerJourney';
import { MentorshipPage } from './pages/student/MentorshipPage';
import { StudentProfile } from './pages/student/StudentProfile';
import { SkillAssessmentPage } from './pages/student/SkillAssessmentPage';
import { MySkillsPage } from './pages/student/MySkillsPage';
import { SkillGapsPage } from './pages/student/SkillGapsPage';
import { InternshipsPage } from './pages/student/InternshipsPage';
import { JobsPage } from './pages/student/JobsPage';
import { LearningPage } from './pages/student/LearningPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { PortfolioPage } from './pages/student/PortfolioPage';
import { MessagesPage } from './pages/student/MessagesPage';
import { SettingsPage } from './pages/student/SettingsPage';
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { InstitutionDashboard } from './pages/institution/InstitutionDashboard';
import { AssessmentModal } from './components/AssessmentModal';
import { ApplyModal } from './components/ApplyModal';
import { OpportunityDetailsModal } from './components/OpportunityDetailsModal';
import { WelcomeAssessmentModal } from './components/WelcomeAssessmentModal';
import { ComprehensiveTestModal } from './components/ComprehensiveTestModal';
import { AchievementUnlockedModal } from './components/AchievementUnlockedModal';

const AppContent: React.FC = () => {
  const {
    currentUserRole,
    isAuthenticated,
    activeTab,
    setActiveTab,
    activeTestModal,
    setActiveTestModal,
    applyingOpportunity,
    setApplyingOpportunity,
    selectedOpportunity,
    setSelectedOpportunity,
    showWelcomeModal,
    closeWelcomeModal,
    startAssessmentFromWelcome,
    activeRoleTestMode,
    activeRoleTestRole,
    startComprehensiveRoleTest,
    exitComprehensiveRoleTest,
    activeAchievementUnlocked,
    dismissAchievementModal,
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 1. External URL & Role-Based Route Guard (Handles initial load, back/forward, manual URL edits)
  useEffect(() => {
    const handleHashNavigation = () => {
      // If unauthenticated, restrict URL to login
      if (!isAuthenticated || !currentUserRole) {
        if (typeof window !== 'undefined' && window.location.hash !== '#/login' && window.location.hash !== '#login') {
          window.location.hash = '#/login';
        }
        return;
      }

      const rawHash = window.location.hash.replace(/^#\/?/, '');
      const [routeRole, routeTab] = rawHash.split('/');
      const validRoles: UserRole[] = ['student', 'mentor', 'recruiter', 'institution'];

      // If user navigates to login or empty hash while authenticated:
      if (!rawHash || routeRole === 'login') {
        const targetTab = activeTab || 'dashboard';
        const target = `#/${currentUserRole}/${targetTab}`;
        if (window.location.hash !== target) {
          window.location.hash = target;
        }
        return;
      }

      // Check for cross-role unauthorized access attempt
      if (validRoles.includes(routeRole as UserRole) && routeRole !== currentUserRole) {
        console.warn(`Unauthorized route attempt: ${routeRole}. Restoring to authenticated role: ${currentUserRole}`);
        const targetTab = activeTab || 'dashboard';
        window.location.hash = `#/${currentUserRole}/${targetTab}`;
        return;
      }

      // If the route matches the current user's role:
      if (routeRole === currentUserRole) {
        const targetTab = routeTab || 'dashboard';
        setActiveTab(targetTab);
      } else {
        // Unknown route prefix - normalize to authenticated dashboard
        const targetTab = activeTab || 'dashboard';
        window.location.hash = `#/${currentUserRole}/${targetTab}`;
      }
    };

    // Run check on mount and when authentication or role changes
    handleHashNavigation();

    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [isAuthenticated, currentUserRole, setActiveTab]);

  // 2. Keep the URL hash in sync when activeTab is changed via sidebar or internal navigation
  useEffect(() => {
    if (isAuthenticated && currentUserRole && activeTab) {
      const targetHash = `#/${currentUserRole}/${activeTab}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }
  }, [activeTab, currentUserRole, isAuthenticated]);

  // If user is not authenticated or hasn't selected a role, show the Login/Role Selection page first
  if (!isAuthenticated || !currentUserRole) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    // 1. Mentor Role View
    if (currentUserRole === 'mentor') {
      return <MentorDashboard />;
    }

    // 2. Recruiter Role View
    if (currentUserRole === 'recruiter') {
      return <RecruiterDashboard />;
    }

    // 3. Institution Role View
    if (currentUserRole === 'institution') {
      return <InstitutionDashboard />;
    }

    // 4. Student Role Views
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'journey':
        return <CareerJourney />;
      case 'mentorship':
        return <MentorshipPage />;
      case 'profile':
        return <StudentProfile />;
      case 'assessment':
        return <SkillAssessmentPage />;
      case 'skills':
        return <MySkillsPage />;
      case 'gaps':
        return <SkillGapsPage />;
      case 'internships':
        return <InternshipsPage />;
      case 'jobs':
        return <JobsPage />;
      case 'learning':
        return <LearningPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'messages':
        return <MessagesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] antialiased">
      {/* Top Navigation Bar */}
      <Navbar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Persistent Desktop & Responsive Mobile Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Main View Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      {showWelcomeModal && currentUserRole === 'student' && (
        <WelcomeAssessmentModal
          onClose={closeWelcomeModal}
          onProceedToAssessment={(role) => {
            closeWelcomeModal();
            setActiveTab('assessment');
          }}
          onStartDirectTest={(role) => {
            closeWelcomeModal();
            startComprehensiveRoleTest(role);
          }}
        />
      )}

      {/* 50-Question Comprehensive Role Assessment Modal */}
      {activeRoleTestMode && activeRoleTestRole && (
        <ComprehensiveTestModal
          role={activeRoleTestRole}
          onClose={exitComprehensiveRoleTest}
        />
      )}

      {activeTestModal && (
        <AssessmentModal
          test={activeTestModal}
          onClose={() => setActiveTestModal(null)}
        />
      )}

      {applyingOpportunity && (
        <ApplyModal
          opportunity={applyingOpportunity}
          onClose={() => setApplyingOpportunity(null)}
        />
      )}

      {selectedOpportunity && (
        <OpportunityDetailsModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}

      {/* Positive Reinforcement Gamification Modal */}
      {activeAchievementUnlocked && (
        <AchievementUnlockedModal
          achievement={activeAchievementUnlocked}
          onClose={dismissAchievementModal}
          onViewJourney={() => {
            dismissAchievementModal();
            setActiveTab('journey');
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
