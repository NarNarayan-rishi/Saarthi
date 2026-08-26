import React, { useState } from 'react';
import {
  TrendingUp,
  UserCheck,
  Briefcase,
  Clock,
  Sparkles,
  Target,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FolderGit2,
  AlertTriangle,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  Compass,
  AlertCircle,
  PlayCircle,
  Zap,
  RotateCcw,
  Check,
  Brain,
  Database,
  Code2,
  Cloud,
  Shield,
  Palette,
  Bell,
  XCircle,
  Calendar,
  Star,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { SkillProgress } from '../../components/SkillProgress';
import { SkillGapCard } from '../../components/SkillGapCard';
import { OpportunityCard } from '../../components/OpportunityCard';
import { CourseCard } from '../../components/CourseCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { ProfileCompletionModal } from '../../components/ProfileCompletionModal';
import { CAREER_GOALS } from '../../data/mockData';
import { getQuestionsForRole } from '../../data/roleAssessmentsData';
import { CareerGoalRole, JourneyStageId } from '../../types';

export const StudentDashboard: React.FC = () => {
  const {
    profile,
    careerGoal,
    setCareerGoal,
    skillReadinessScore,
    profileCompletion,
    skillGaps,
    topSkillGap,
    recommendedOpportunitiesCount,
    activeApplicationsCount,
    opportunities,
    applications,
    courses,
    setActiveTab,
    setActiveTestModal,
    assessmentTests,
    setSelectedOpportunity,
    setApplyingOpportunity,
    journeyStages,
    currentJourneyStage,
    nextBestAction,
    careerJourneyOverview,
    openWelcomeModal,
    comprehensiveResult,
    hasCompletedAssessmentForRole,
    getRoleAssessmentResult,
    startComprehensiveRoleTest,
  } = useApp();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [peekStageId, setPeekStageId] = useState<JourneyStageId | null>(null);
  const [isUpdatesCollapsed, setIsUpdatesCollapsed] = useState(true);

  // Active role configuration
  const activeGoalConfig = CAREER_GOALS.find((g) => g.role === careerGoal);
  const activeRoleQuestions = getQuestionsForRole(careerGoal);
  const activeRoleDepartments = Array.from(new Set(activeRoleQuestions.map((q) => q.department)));
  const isAssessmentCompletedForActiveRole = hasCompletedAssessmentForRole(careerGoal);
  const activeRoleAssessmentResult = getRoleAssessmentResult(careerGoal);

  // Helper for role icons
  const getRoleIcon = (role: CareerGoalRole) => {
    switch (role) {
      case 'Machine Learning Engineer':
        return Brain;
      case 'Data Scientist':
        return Database;
      case 'Full Stack Developer':
        return Code2;
      case 'Cloud Engineer':
        return Cloud;
      case 'Cybersecurity Analyst':
        return Shield;
      case 'UI/UX Designer':
        return Palette;
      default:
        return Target;
    }
  };

  // Recommended opportunities (top 3)
  const topRecommendedOpps = opportunities.slice(0, 3);

  // Filter courses related to top skill gap
  const gapCourses = courses.filter(
    (c) => topSkillGap && c.skillName.toLowerCase() === topSkillGap.name.toLowerCase()
  );
  const displayCourses = gapCourses.length > 0 ? gapCourses : courses.slice(0, 3);

  // Recent applications (top 3)
  const recentApplications = applications.slice(0, 3);

  const handleTakeAssessmentForSkill = (_skillName?: string) => {
    if (!isAssessmentCompletedForActiveRole) {
      startComprehensiveRoleTest(careerGoal);
    } else {
      setActiveTab('assessment');
    }
  };

  const handleEnrollCourse = (skillName: string) => {
    setActiveTab('learning');
  };

  const handleNextActionClick = () => {
    if (nextBestAction.targetTab === 'assessment') {
      if (!isAssessmentCompletedForActiveRole) {
        startComprehensiveRoleTest(careerGoal);
        return;
      }
    }
    setActiveTab(nextBestAction.targetTab);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* 1. HERO BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome & Role Card (Spans 2 columns) */}
        <section className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-indigo-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Role-Specific AI Navigation</span>
            </div>
            
            <div>
              <h1 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
                Good morning, {profile.name.split(' ')[0]} 👋
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                Your dashboard is actively tracking your journey toward becoming a <strong className="text-white font-bold">{careerGoal}</strong>. 
              </p>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={openWelcomeModal}
                className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30 cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>Switch Goal</span>
              </button>
            </div>
          </div>
        </section>

        {/* Readiness Snapshot Card (Spans 1 column) */}
        <section className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-md relative overflow-hidden flex flex-col justify-center items-center text-center">
           <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
           <Target className="w-8 h-8 text-indigo-600 mb-4" />
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Career Readiness</h3>
           <div className="font-['Outfit'] text-5xl font-black text-slate-900 mb-2">
             {skillReadinessScore}%
           </div>
           {isAssessmentCompletedForActiveRole ? (
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
               <CheckCircle2 className="w-3.5 h-3.5" /> Assessed ({activeRoleAssessmentResult?.grandReadiness.cumulativeRating}/5.0)
             </span>
           ) : (
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
               <AlertCircle className="w-3.5 h-3.5" /> Assessment Pending
             </span>
           )}
           <p className="text-xs text-slate-500 mt-4 leading-relaxed">
             Based on {activeRoleDepartments.length} verified departments.
           </p>
        </section>

      </div>

        {/* 2. NEXT BEST ACTION & DIAGNOSTIC GRID */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Main Col (Full width) */}
          <div className="space-y-6">
                    {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <StatCard
                  id="stat-1"
                  title="Profile Status"
                  value={`${profileCompletion.percentage}%`}
                  badgeText={profileCompletion.percentage >= 80 ? 'Good' : 'Action'}
                  badgeType={profileCompletion.percentage >= 80 ? 'success' : 'warning'}
                  icon={UserCheck}
                  iconBgColor="bg-blue-50"
                  iconTextColor="text-blue-600"
                  onClickAction={() => setShowProfileModal(true)}
                />
                <StatCard
                  id="stat-2"
                  title="Job Matches"
                  value={recommendedOpportunitiesCount}
                  badgeText="New"
                  badgeType="info"
                  icon={Briefcase}
                  iconBgColor="bg-purple-50"
                  iconTextColor="text-purple-600"
                  onClickAction={() => setActiveTab('jobs')}
                />
                <StatCard
                  id="stat-3"
                  title="Applications"
                  value={activeApplicationsCount}
                  badgeText="Tracking"
                  badgeType="info"
                  icon={FolderGit2}
                  iconBgColor="bg-emerald-50"
                  iconTextColor="text-emerald-600"
                  onClickAction={() => setActiveTab('applications')}
                />
                <StatCard
                  id="stat-4"
                  title="Skill Score"
                  value={`${skillReadinessScore}/100`}
                  badgeText="Rising"
                  badgeType="success"
                  icon={TrendingUp}
                  iconBgColor="bg-indigo-50"
                  iconTextColor="text-indigo-600"
                />
            </div>

            {/* Action / Diagnostics Box */}
            {!isAssessmentCompletedForActiveRole ? (
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-300 rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="space-y-2">
                   <h3 className="font-['Outfit'] text-xl font-extrabold text-slate-900">Take Your 50-Q Diagnostic Test</h3>
                   <p className="text-sm text-slate-700 max-w-lg">Unlock your AI roadmap by benchmarking your skills against the industry standards for {careerGoal}.</p>
                 </div>
                 <button
                    onClick={() => startComprehensiveRoleTest(careerGoal)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold shadow-md whitespace-nowrap flex items-center justify-center gap-2 transition-all cursor-pointer"
                 >
                    <Zap className="w-4 h-4" /> Start Assessment
                 </button>
              </div>
            ) : (
              nextBestAction && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/40 rounded-full blur-3xl" />
                   <div className="relative z-10 flex-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold mb-3">
                         <Zap className="w-3.5 h-3.5" />
                         Next Best Action
                      </div>
                      <h3 className="font-['Outfit'] text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                         {nextBestAction.title}
                      </h3>
                      <p className="text-sm text-slate-600 max-w-2xl">
                         {nextBestAction.description}
                      </p>
                   </div>
                   <button
                      onClick={handleNextActionClick}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md whitespace-nowrap flex items-center justify-center gap-2 transition-all cursor-pointer relative z-10"
                   >
                      {nextBestAction.actionLabel} <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              )
            )}

          {/* Top Job Matches */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="font-['Outfit'] text-lg font-extrabold text-slate-900 flex items-center gap-2">
                   <Briefcase className="w-5 h-5 text-indigo-600" />
                   Top Opportunities Near You
                </h3>
                <button 
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {topRecommendedOpps.slice(0, 4).map((opp) => (
                 <OpportunityCard 
                   key={opp.id}
                   opportunity={opp}
                   onClick={() => setSelectedOpportunity(opp)}
                   onApply={() => setApplyingOpportunity(opp)}
                 />
               ))}
             </div>
          </div>

          {/* Application Updates */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
             <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsUpdatesCollapsed(!isUpdatesCollapsed)}>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-['Outfit'] text-lg font-extrabold text-slate-900">
                     Application Updates
                  </h3>
                  <span className="text-xs text-slate-500 font-medium ml-2">
                     ({recentApplications.length} updates)
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${!isUpdatesCollapsed ? 'rotate-90' : ''}`} />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveTab('applications'); }} 
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
             </div>
             
             {!isUpdatesCollapsed && (
               <div className="space-y-3">
                 {recentApplications.map(app => {
                     let statusColor = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300';
                     let icon = <Bell className="w-4 h-4" />;
                     let message = `Update regarding your application at ${app.company}`;
                     if (app.status === 'Rejected') { statusColor = 'bg-red-50 border-red-200 text-red-700 hover:border-red-300'; icon = <XCircle className="w-4 h-4 text-red-600" />; message = `Your application for ${app.opportunityTitle} at ${app.company} was rejected.`; }
                     else if (app.status === 'Selected') { statusColor = 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300'; icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />; message = `Congratulations! You were selected for ${app.opportunityTitle} at ${app.company}.`; }
                     else if (app.status === 'Interview') { statusColor = 'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300'; icon = <Calendar className="w-4 h-4 text-blue-600" />; message = `Interview scheduled for ${app.opportunityTitle} at ${app.company}.`; }
                     else if (app.status === 'Shortlisted') { statusColor = 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300'; icon = <Star className="w-4 h-4 text-amber-600" />; message = `You were shortlisted for ${app.opportunityTitle} at ${app.company}.`; }
                     else { statusColor = 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-300'; icon = <Clock className="w-4 h-4 text-indigo-600" />; message = `Your application for ${app.opportunityTitle} at ${app.company} is currently under review.`; }
                     
                     return (
                         <div key={app.id} onClick={() => setActiveTab('applications')} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-xs transition-all ${statusColor}`}>
                            <div className="mt-0.5">{icon}</div>
                            <div>
                              <p className="text-sm font-bold">{app.company}</p>
                              <p className="text-xs mt-0.5 font-medium opacity-90">{message}</p>
                            </div>
                            <span className="ml-auto text-[10px] font-bold opacity-70">{app.appliedDate}</span>
                         </div>
                     )
                 })}
                 {recentApplications.length === 0 && <p className="text-sm text-slate-500">No recent application updates.</p>}
               </div>
             )}
          </div>

            {/* Portfolio & Projects Summary */}
            <div className="bg-[#18162e] rounded-3xl p-6 sm:p-8 shadow-xl mt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-white">
                  <FolderGit2 className="w-6 h-6 text-indigo-400" />
                  <h3 className="font-['Outfit'] text-xl font-bold">
                    My Digital Portfolio
                  </h3>
                </div>
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                  Verified
                </span>
              </div>
              
              <p className="text-sm text-slate-400 mb-6">
                Your comprehensive academic, project, and certification credentials packaged for partner recruiters.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white/10">
                  <span className="text-3xl font-black text-white">{profile.projects?.length || 0}</span>
                  <span className="text-sm text-slate-400 mt-1">Projects Built</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white/10">
                  <span className="text-3xl font-black text-white">{profile.certifications?.length || 0}</span>
                  <span className="text-sm text-slate-400 mt-1">Certifications</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white/10">
                  <span className="text-3xl font-black text-white">{profile.internships?.length || 0}</span>
                  <span className="text-sm text-slate-400 mt-1">Prior Internships</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center transition-colors hover:bg-white/10">
                  <span className="text-3xl font-black text-white">{profile.achievements?.length || 0}</span>
                  <span className="text-sm text-slate-400 mt-1">Achievements</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-5 border-t border-white/10">
                <span className="text-sm font-bold text-slate-300">
                  Public Link Active
                </span>
                <button 
                  onClick={() => setActiveTab('portfolio')} 
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  View Portfolio <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

        </div>

      </div>

      {showProfileModal && (
        <ProfileCompletionModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};
