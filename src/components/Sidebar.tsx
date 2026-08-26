import React from 'react';
import {
  LayoutDashboard,
  Compass,
  User,
  CheckSquare,
  Award,
  TrendingDown,
  Building2,
  Briefcase,
  BookOpen,
  FileCheck,
  FolderGit2,
  MessageSquare,
  Settings,
  ChevronRight,
  Sparkles,
  Users2,
  Trophy,
  PlayCircle,
  PlusCircle,
  HelpCircle,
  Calendar,
  Star,
  Video,
  LineChart,
  ShieldCheck,
  Landmark,
  FileSpreadsheet,
  Target,
  BarChart3,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const {
    currentUserRole,
    activeTab,
    setActiveTab,
    activeApplicationsCount,
    topSkillGap,
    careerJourneyOverview,
    messages,
    mentorDoubts,
    mentorTasks,
    recruiterCandidates,
    recruiterJobs,
    interviewSchedules,
    profile,
    mentorProfile,
    recruiterProfile,
    institutionProfile,
    institutionSkills,
  } = useApp();

  const unreadMessagesCount = messages.filter((m) => m.unread).length;
  const pendingDoubtsCount = mentorDoubts.filter((d) => d.status === 'Pending').length;
  const shortlistedCount = recruiterCandidates.filter((c) => c.shortlisted).length;
  const criticalGapsCount = institutionSkills.filter((s) => s.gapSeverity === 'High Gap').length;

  // Student Navigation Items
  const studentNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'journey',
      label: 'Career Journey',
      icon: Compass,
      badge: `${careerJourneyOverview.journeyProgress}%`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'mentorship',
      label: 'My Mentor & Doubts',
      icon: Users2,
      badge: 'Dr. Rao',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'assessment',
      label: 'Skill Assessment',
      icon: CheckSquare,
      badge: 'Tests',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'skills',
      label: 'My Skills',
      icon: Award,
    },
    {
      id: 'gaps',
      label: 'Skill Gaps',
      icon: TrendingDown,
      badge: topSkillGap ? '1 Major' : undefined,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'internships',
      label: 'Internships',
      icon: Building2,
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
    },
    {
      id: 'learning',
      label: 'Learning Roadmaps',
      icon: BookOpen,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileCheck,
      badge: activeApplicationsCount > 0 ? `${activeApplicationsCount}` : undefined,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'portfolio',
      label: 'Portfolio & Projects',
      icon: FolderGit2,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  // Mentor Navigation Items
  const mentorNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'students',
      label: 'My Students',
      icon: Users2,
      badge: 'Cohort 2026',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'top_students',
      label: 'Top Students',
      icon: Trophy,
      badge: 'Leaderboard',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'start_test',
      label: 'Start a Test',
      icon: PlayCircle,
    },
    {
      id: 'assign_task',
      label: 'Assign Task',
      icon: PlusCircle,
      badge: `${mentorTasks.length}`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'doubts',
      label: 'Student Doubts',
      icon: HelpCircle,
      badge: pendingDoubtsCount > 0 ? `${pendingDoubtsCount} New` : undefined,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'profile',
      label: 'Mentor Profile',
      icon: User,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  // Recruiter Navigation Items
  const recruiterNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'find_students',
      label: 'Find Students',
      icon: Users2,
      badge: 'Filter',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'talent_pool',
      label: 'Talent Pool',
      icon: Award,
    },
    {
      id: 'jobs',
      label: 'Job Postings',
      icon: Briefcase,
      badge: `${recruiterJobs.length}`,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted Candidates',
      icon: Star,
      badge: shortlistedCount > 0 ? `${shortlistedCount}` : undefined,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: Video,
      badge: `${interviewSchedules.length}`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'profile',
      label: 'Company Profile',
      icon: Building2,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  // Institution Navigation Items
  const institutionNavItems = [
    {
      id: 'dashboard',
      label: 'Institution Hub',
      icon: LayoutDashboard,
      badge: 'Overview',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'students',
      label: 'Student Cohort',
      icon: Users2,
      badge: `${institutionProfile.totalStudents}`,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'skills',
      label: 'Skill Analytics',
      icon: BarChart3,
      badge: `${institutionProfile.averageSkillScore}% Avg`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'gaps',
      label: 'Skill Gap Alerts',
      icon: TrendingDown,
      badge: criticalGapsCount > 0 ? `${criticalGapsCount} Critical` : undefined,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'readiness',
      label: 'Placement Readiness',
      icon: Target,
      badge: '68% Ready',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'internships',
      label: 'Internships & Placements',
      icon: Building2,
      badge: `${institutionProfile.placementRate}% Rate`,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'demand',
      label: 'Industry Demand',
      icon: Flame,
      badge: 'Live Market',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'reports',
      label: 'Reports & NAAC',
      icon: FileSpreadsheet,
      badge: 'Audits',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'settings',
      label: 'Campus Settings',
      icon: Settings,
    },
  ];

  const currentNavItems =
    currentUserRole === 'mentor'
      ? mentorNavItems
      : currentUserRole === 'recruiter'
      ? recruiterNavItems
      : currentUserRole === 'institution'
      ? institutionNavItems
      : studentNavItems;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-16 bottom-0 lg:bottom-auto left-0 z-40 lg:z-10 w-64 lg:h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out shrink-0 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Active Role Indicator Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentUserRole === 'mentor'
                    ? 'bg-emerald-500 ring-2 ring-emerald-200'
                    : currentUserRole === 'recruiter'
                    ? 'bg-amber-500 ring-2 ring-amber-200'
                    : currentUserRole === 'institution'
                    ? 'bg-purple-600 ring-2 ring-purple-200'
                    : 'bg-indigo-600 ring-2 ring-indigo-200'
                }`}
              />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {currentUserRole === 'mentor'
                  ? 'Mentor Portal'
                  : currentUserRole === 'recruiter'
                  ? 'Recruiter Hub'
                  : currentUserRole === 'institution'
                  ? 'Institution Hub'
                  : 'Student Portal'}
              </span>
            </div>

            {/* Authenticated Status Indicator */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Active</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 truncate font-medium">
            {currentUserRole === 'mentor'
              ? mentorProfile.name
              : currentUserRole === 'recruiter'
              ? recruiterProfile.companyName
              : currentUserRole === 'institution'
              ? institutionProfile.name
              : profile.name}
          </p>
        </div>

        {/* Navigation Item Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? currentUserRole === 'mentor'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                      : currentUserRole === 'recruiter'
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200/80 shadow-2xs'
                      : currentUserRole === 'institution'
                      ? 'bg-purple-50 text-purple-800 font-bold border border-purple-200/80 shadow-2xs'
                      : 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200/80 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? currentUserRole === 'mentor'
                          ? 'text-emerald-700'
                          : currentUserRole === 'recruiter'
                          ? 'text-amber-700'
                          : currentUserRole === 'institution'
                          ? 'text-purple-700'
                          : 'text-indigo-700'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                      item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
