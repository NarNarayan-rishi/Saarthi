import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  BookOpen,
  GraduationCap,
  Menu,
  X,
  Target,
  LogOut,
  Repeat,
  ShieldCheck,
  Building2,
  Users2,
  Landmark,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAREER_GOALS } from '../data/mockData';
import { CareerGoalRole, UserRole } from '../types';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar = () => {},
  isMobileSidebarOpen = false,
}) => {
  const {
    isDarkMode,
    toggleDarkMode,
    zoomLevel,
    setZoomLevel,
    currentUserRole,
    profile,
    mentorProfile,
    recruiterProfile,
    institutionProfile,
    careerGoal,
    setCareerGoal,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    profileCompletion,
    searchQuery,
    setSearchQuery,
    logout,
    switchRole,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (goalRef.current && !goalRef.current.contains(event.target as Node)) {
        setShowGoalDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = (notifId: string, linkTarget?: string) => {
    markNotificationRead(notifId);
    if (linkTarget) {
      if (linkTarget.startsWith('http')) {
        window.open(linkTarget, '_blank', 'noopener,noreferrer');
      } else {
        setActiveTab(linkTarget);
      }
      setShowNotifMenu(false);
    }
  };

  // Current display user info based on active role
  const displayName =
    currentUserRole === 'mentor'
      ? mentorProfile.name
      : currentUserRole === 'recruiter'
      ? recruiterProfile.name
      : currentUserRole === 'institution'
      ? institutionProfile.name
      : profile.name;

  const displayAvatar =
    currentUserRole === 'mentor'
      ? mentorProfile.avatar
      : currentUserRole === 'recruiter'
      ? recruiterProfile.companyLogo
      : currentUserRole === 'institution'
      ? institutionProfile.logo
      : profile.avatarUrl;

  const displayRoleLabel =
    currentUserRole === 'mentor'
      ? 'Mentor'
      : currentUserRole === 'recruiter'
      ? 'Recruiter'
      : currentUserRole === 'institution'
      ? 'Institution'
      : 'Student';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="btn-mobile-sidebar-toggle"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              id="brand-logo-container"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 ${
                  currentUserRole === 'mentor'
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                    : currentUserRole === 'recruiter'
                    ? 'bg-gradient-to-tr from-amber-600 to-orange-600'
                    : currentUserRole === 'institution'
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                    : 'bg-gradient-to-tr from-indigo-600 to-blue-600'
                }`}
              >
                {currentUserRole === 'institution' ? (
                  <Landmark className="w-5 h-5" />
                ) : (
                  <GraduationCap className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Outfit'] font-extrabold text-xl tracking-tight text-slate-900">
                    Saar<span className="text-indigo-600">thi</span>
                  </span>
                  <span
                    className={`hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      currentUserRole === 'mentor'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : currentUserRole === 'recruiter'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : currentUserRole === 'institution'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                    }`}
                  >
                    {displayRoleLabel}
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 font-medium leading-none">
                  {currentUserRole === 'mentor'
                    ? 'Student Progress & Task Guidance'
                    : currentUserRole === 'recruiter'
                    ? 'Campus Talent Sourcing Portal'
                    : currentUserRole === 'institution'
                    ? 'Student Outcomes & Placement Analytics'
                    : 'Career Roadmaps & Job Preparation'}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search Bar & Context Switcher */}
          <div className="flex-1 max-w-xl flex items-center gap-3 mx-2">
            {/* Global Search */}
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  currentUserRole === 'mentor'
                    ? 'Search students, doubts, tasks...'
                    : currentUserRole === 'recruiter'
                    ? 'Search candidate skills, CGPA, graduation year...'
                    : currentUserRole === 'institution'
                    ? 'Search students, skills, placements, audit reports...'
                    : 'Search internships, skills, courses, companies...'
                }
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Target Career Goal Selector (Student View) */}
            {currentUserRole === 'student' && (
              <div className="relative" ref={goalRef}>
                <button
                  id="btn-career-goal-dropdown"
                  onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Switch Career Goal to recalibrate gaps and opportunities"
                >
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden md:inline text-slate-600 font-normal">Goal:</span>
                  <span className="font-bold truncate max-w-[110px] md:max-w-[140px]">{careerGoal}</span>
                  <ChevronDown className="w-3 h-3 text-indigo-500" />
                </button>

                {showGoalDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                        Target Career Role
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Recalculates skill readiness and recommendations
                      </p>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {CAREER_GOALS.map((goal) => {
                        const isSelected = goal.role === careerGoal;
                        return (
                          <button
                            key={goal.role}
                            id={`goal-option-${goal.role.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => {
                              setCareerGoal(goal.role as CareerGoalRole);
                              setShowGoalDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <p className="font-medium text-slate-900">{goal.title}</p>
                              <p className="text-[10px] text-slate-500">{goal.averageSalary}</p>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Role Quick Switch, Notifications, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Accessibility Controls */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden h-8">
               <button 
                 onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))} 
                 className="px-2.5 h-full text-xs font-extrabold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border-r border-slate-200 flex items-center justify-center"
                 title="Zoom Out"
               >
                 A-
               </button>
               <button 
                 onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))} 
                 className="px-2.5 h-full text-sm font-extrabold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center"
                 title="Zoom In"
               >
                 A+
               </button>
            </div>
            
            <button
               onClick={toggleDarkMode}
               className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors bg-white border border-slate-200 shadow-2xs"
               title="Toggle Dark Mode"
            >
               {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Authenticated Role Badge */}
            <div
              id="navbar-auth-role-badge"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${
                currentUserRole === 'mentor'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : currentUserRole === 'recruiter'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : currentUserRole === 'institution'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{displayRoleLabel} Session</span>
            </div>

            {/* Quick Sign Out Action */}
            <button
              id="navbar-sign-out-btn"
              onClick={logout}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
              title="Sign out of current account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            {/* Notifications Drawer */}
            <div className="relative" ref={notifRef}>
              <button
                id="btn-notifications-toggle"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-hidden transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-center text-slate-500">No notifications right now.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotifClick(notif.id, notif.linkTarget)}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 shrink-0">
                              {notif.type === 'application' && <Briefcase className="w-4 h-4 text-emerald-600" />}
                              {notif.type === 'opportunity' && <Sparkles className="w-4 h-4 text-indigo-600" />}
                              {notif.type === 'assessment' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                              {notif.type === 'mentor' && <Users2 className="w-4 h-4 text-emerald-600" />}
                              {notif.type === 'interview' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                              {notif.type === 'task' && <BookOpen className="w-4 h-4 text-blue-600" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={userRef}>
              <div
                id="nav-profile-pill"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 cursor-pointer border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="relative">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <div className="hidden sm:block text-left pr-2">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {displayName}
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    {displayRoleLabel}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </div>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{displayName}</p>
                    <p className="text-[11px] text-slate-500">Signed in as {displayRoleLabel}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>Security & Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
