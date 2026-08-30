import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
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
    currentUserRole, isAuthenticated, activeTab, setActiveTab,
    activeTestModal, setActiveTestModal, applyingOpportunity, setApplyingOpportunity,
    selectedOpportunity, setSelectedOpportunity, showWelcomeModal, closeWelcomeModal,
    startComprehensiveRoleTest, exitComprehensiveRoleTest,
    activeRoleTestMode, activeRoleTestRole,
    activeAchievementUnlocked, dismissAchievementModal,
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHashNavigation = () => {
      if (!isAuthenticated || !currentUserRole) {
        const hash = window.location.hash;
        const allowed = ['#/signup', '#/forgot-password'];
        if (typeof window !== 'undefined' && hash !== '#/login' && hash !== '#login' && !allowed.includes(hash)) {
          window.location.hash = '#/login';
        }
        return;
      }
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      const [routeRole, routeTab] = rawHash.split('/');
      
      if (!rawHash || routeRole === 'login' || routeRole === 'signup' || routeRole === 'forgot-password') {
        const targetTab = activeTab || 'dashboard';
        const target = `#/${currentUserRole}/${targetTab}`;
        if (window.location.hash !== target) window.location.hash = target;
        return;
      }
      if (routeRole === currentUserRole) {
        setActiveTab(routeTab || 'dashboard');
      } else {
        window.location.hash = `#/${currentUserRole}/${activeTab || 'dashboard'}`;
      }
    };
    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [isAuthenticated, currentUserRole, activeTab]);

  if (!isAuthenticated || !currentUserRole) {
    const hash = window.location.hash;
    if (hash === '#/signup') return <SignUpPage />;
    if (hash === '#/forgot-password') return <ForgotPasswordPage />;
    return <LoginPage />;
  }

  const renderActivePage = () => {
    if (currentUserRole === 'mentor') return <MentorDashboard />;
    if (currentUserRole === 'recruiter') return <RecruiterDashboard />;
    if (currentUserRole === 'institution') return <InstitutionDashboard />;
    switch (activeTab) {
      case 'dashboard': return <StudentDashboard />;
      case 'journey': return <CareerJourney />;
      case 'mentorship': return <MentorshipPage />;
      case 'profile': return <StudentProfile />;
      case 'assessment': return <SkillAssessmentPage />;
      case 'skills': return <MySkillsPage />;
      case 'gaps': return <SkillGapsPage />;
      case 'internships': return <InternshipsPage />;
      case 'jobs': return <JobsPage />;
      case 'learning': return <LearningPage />;
      case 'applications': return <ApplicationsPage />;
      case 'portfolio': return <PortfolioPage />;
      case 'messages': return <MessagesPage />;
      case 'settings': return <SettingsPage />;
      default: return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] antialiased">
      <Navbar isMobileSidebarOpen={isMobileSidebarOpen} onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isMobileOpen={isMobileSidebarOpen} onCloseMobile={() => setIsMobileSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
      {showWelcomeModal && currentUserRole === 'student' && (
        <WelcomeAssessmentModal onClose={closeWelcomeModal} onProceedToAssessment={() => { closeWelcomeModal(); setActiveTab('assessment'); }} onStartDirectTest={(role) => { closeWelcomeModal(); startComprehensiveRoleTest(role); }} />
      )}
      {activeRoleTestMode && activeRoleTestRole && <ComprehensiveTestModal role={activeRoleTestRole} onClose={exitComprehensiveRoleTest} />}
      {activeTestModal && <AssessmentModal test={activeTestModal} onClose={() => setActiveTestModal(null)} />}
      {applyingOpportunity && <ApplyModal opportunity={applyingOpportunity} onClose={() => setApplyingOpportunity(null)} />}
      {selectedOpportunity && <OpportunityDetailsModal opportunity={selectedOpportunity} onClose={() => setSelectedOpportunity(null)} />}
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
