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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { SkillProgress } from '../../components/SkillProgress';
import { SkillGapCard } from '../../components/SkillGapCard';
import { OpportunityCard } from '../../components/OpportunityCard';
import { CourseCard } from '../../components/CourseCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { ProfileCompletionModal } from '../../components/ProfileCompletionModal';
import { MarketInsightsWidget } from '../../components/MarketInsightsWidget';
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
    <div className="space-y-8 pb-12">
      
      {/* 1. Welcome & Role-Adaptive Header */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-slate-800/80 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Role-Specific Dashboard & Career Navigation</span>
            </div>
            
            <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Good morning, {profile.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Viewing dashboard tailored for <strong className="text-white font-bold">{careerGoal}</strong>. Switch roles anytime to view dedicated assessments, roadmaps, and readiness.
            </p>
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                id="btn-reopen-welcome-assessment"
                onClick={openWelcomeModal}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 border border-indigo-400/40 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Switch Goal / Onboarding Dialog</span>
              </button>
            </div>
          </div>

          {/* Active Goal Readiness Summary Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col gap-2 shrink-0 sm:min-w-[200px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              Active Goal Status
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-['Outfit'] font-extrabold text-white">
                {skillReadinessScore}%
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                isAssessmentCompletedForActiveRole
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                  : 'bg-amber-500/30 text-amber-200 border border-amber-400/30'
              }`}>
                {isAssessmentCompletedForActiveRole ? 'Diagnostic Assessed' : 'Assessment Pending'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isAssessmentCompletedForActiveRole
                ? `Scale: ${activeRoleAssessmentResult?.grandReadiness.cumulativeRating}/5.0 (${activeRoleAssessmentResult?.grandReadiness.readinessTier})`
                : 'Take 50-Q assessment to benchmark'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Current Job Role Focus Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-['Outfit'] text-lg font-bold text-slate-900">
              Current Job Role Focus
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Dashboard metrics, diagnostics, and roadmaps are tailored to this role
          </span>
        </div>

        {/* Current Job Role Chosen Spotlight Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-500/30 shadow-xs relative overflow-hidden bg-gradient-to-r from-indigo-50/50 via-white to-slate-50/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              {(() => {
                const ActiveIcon = getRoleIcon(careerGoal);
                return (
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                );
              })()}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-2xs">
                    <Check className="w-3 h-3" />
                    Current Job Role Chosen
                  </span>
                  {isAssessmentCompletedForActiveRole ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Assessed: {activeRoleAssessmentResult?.grandReadiness.cumulativeRating}/5.0 ({activeRoleAssessmentResult?.grandReadiness.readinessTier})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      50-Q Assessment Pending
                    </span>
                  )}
                </div>

                <h3 className="font-['Outfit'] text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeGoalConfig?.title || careerGoal}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {activeGoalConfig?.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500">Benchmark Departments:</span>
                  {activeRoleDepartments.map((dept) => (
                    <span
                      key={dept}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {dept}
                    </span>
                  ))}
                  {activeGoalConfig?.averageSalary && (
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 ml-auto">
                      💰 Avg {activeGoalConfig.averageSalary} ({activeGoalConfig.growthRate})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Readiness Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-['Outfit'] text-3xl font-extrabold text-indigo-600">
                  {skillReadinessScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Beneath it: Switch / Choose Other Job Roles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Select or Switch Job Role Focus:
            </span>
            <span className="text-[11px] text-slate-500">
              Click any role to switch your active focus
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CAREER_GOALS.map((g) => {
              const isSelected = g.role === careerGoal;
              const completed = hasCompletedAssessmentForRole(g.role);
              const roleResult = getRoleAssessmentResult(g.role);
              const Icon = getRoleIcon(g.role);

              return (
                <button
                  key={g.role}
                  id={`btn-role-tab-${g.role.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setCareerGoal(g.role)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {completed ? (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                            isSelected
                              ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                          title="50-Question Diagnostic Assessment Completed"
                        >
                          <Check className="w-2.5 h-2.5" />
                          <span>{roleResult?.totalScorePercent}%</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-amber-400/20 text-amber-200 border border-amber-300/30'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          Pending
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-['Outfit'] font-bold text-xs leading-snug truncate ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {g.title}
                    </h3>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-current/10 flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-indigo-100 font-semibold' : 'text-slate-500'}>
                      {isSelected ? 'Active Focus' : completed ? `${roleResult?.grandReadiness.cumulativeRating}/5.0` : '50 Qs Test'}
                    </span>
                    <ChevronRight
                      className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
                        isSelected ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Dedicated Role Diagnostic Assessment Status Section */}
      <section>
        {!isAssessmentCompletedForActiveRole ? (
          /* Need to Take Skill Test Alert Banner for Active Role */
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Skill Assessment Required for {careerGoal}</span>
                </div>
                <h3 className="font-['Outfit'] text-xl sm:text-2xl font-extrabold text-slate-900">
                  Standardized 50-Question Diagnostic Assessment Pending
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  You have not yet taken the diagnostic questionnaire for <strong>{careerGoal}</strong>. It benchmarks your proficiency across 5 key departments ({activeRoleDepartments.join(', ')}) with 50 questions in 100 minutes.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-800">
                    ⏱️ 100 Minutes
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-800">
                    📝 50 Curated Questions
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-slate-800">
                    🎯 5-Point Grand Scale of Readiness
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  id="btn-start-role-diagnostic-dash"
                  onClick={() => startComprehensiveRoleTest(careerGoal)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Let's Test (50 Questions)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Assessment Validated Summary Card for Active Role */
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-indigo-50/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-5">
              <div className="space-y-1 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Diagnostic Assessment Validated for {careerGoal}</span>
                </div>
                <h3 className="font-['Outfit'] text-xl font-extrabold text-slate-900">
                  Grand Scale of Readiness: {activeRoleAssessmentResult?.grandReadiness.cumulativeRating} / 5.0 ({activeRoleAssessmentResult?.grandReadiness.readinessTier})
                </h3>
                <p className="text-xs text-slate-600">
                  Overall Score: <strong>{activeRoleAssessmentResult?.totalScorePercent}%</strong> ({activeRoleAssessmentResult?.correctCount} / {activeRoleAssessmentResult?.totalQuestions} correct) • Tested on {activeRoleAssessmentResult?.completedAt ? new Date(activeRoleAssessmentResult.completedAt).toLocaleDateString() : 'Recent'}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  id="btn-view-full-report-dash"
                  onClick={() => setActiveTab('assessment')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shadow-indigo-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Full Analysis & Review</span>
                </button>

                <button
                  id="btn-retake-role-test-dash"
                  onClick={() => startComprehensiveRoleTest(careerGoal)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Retake Test</span>
                </button>
              </div>
            </div>

            {/* 5-Department Scorecard Mini-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
              {activeRoleAssessmentResult?.departmentBreakdowns.map((dept) => (
                <div key={dept.department} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block truncate">
                    {dept.department}
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-['Outfit'] font-extrabold text-base text-slate-900">
                      {dept.scorePercent}%
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600">
                      {dept.rating}/5.0
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dept.rating >= 4
                          ? 'bg-emerald-500'
                          : dept.rating === 3
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${dept.scorePercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                    {dept.ratingLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. Career Journey & Next Best Action Bento Block */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Next Best Action Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-xs flex flex-col justify-between bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${nextBestAction.badgeColor}`}>
                  {nextBestAction.badge}
                </span>
                <span className="text-xs font-bold text-slate-500">Next Best Step</span>
              </div>
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Stage {currentJourneyStage.stageNumber}: {currentJourneyStage.title}
              </span>
            </div>

            <h3 className="font-['Outfit'] font-extrabold text-xl text-slate-900">
              {nextBestAction.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {nextBestAction.description}
            </p>

            <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex items-center gap-2 text-xs text-indigo-950 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{nextBestAction.detail}</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            {nextBestAction.secondaryActionLabel ? (
              <button
                id="btn-dash-secondary-action"
                onClick={() => setActiveTab(nextBestAction.secondaryTargetTab || 'gaps')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                {nextBestAction.secondaryActionLabel}
              </button>
            ) : (
              <span className="text-xs text-slate-600 font-medium">
                Goal: {careerGoal}
              </span>
            )}

            <button
              id="btn-dash-next-action"
              onClick={handleNextActionClick}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shadow-indigo-200 transition-all hover:gap-2.5 cursor-pointer"
            >
              <span>{nextBestAction.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 8-Stage Interactive Career Journey Peek Look Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <h3 className="font-['Outfit'] font-extrabold text-base text-slate-900">
                  Career Journey Peek ({careerGoal})
                </h3>
              </div>
              <span className="font-['Outfit'] font-extrabold text-sm text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {careerJourneyOverview.journeyProgress}% Done
              </span>
            </div>

            {/* Visual Progress Bar in Peek */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Stage Progress</span>
                <span className="font-bold text-slate-700">
                  {journeyStages.filter((s) => s.status === 'Completed').length} of {journeyStages.length} Stages Completed
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${careerJourneyOverview.journeyProgress}%` }}
                />
              </div>
            </div>

            {/* 8-Stage Interactive Grid Pills (Clicking previews requirements inside peek) */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {journeyStages.map((st) => {
                const isCurrent = st.id === (peekStageId || currentJourneyStage.id);
                return (
                  <button
                    key={st.id}
                    onClick={() => setPeekStageId(st.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer relative ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-300'
                        : st.status === 'Completed'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                        : st.status === 'Ready'
                        ? 'bg-blue-50/70 border-blue-200 text-blue-800 hover:bg-blue-100/70'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title={`${st.title} (${st.progress}%) - Click to peek details`}
                  >
                    <span className={`text-[10px] block font-extrabold ${isCurrent ? 'text-indigo-200' : 'opacity-70'}`}>
                      0{st.stageNumber}
                    </span>
                    <span className="text-[11px] font-bold block truncate">
                      {st.title.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Peek Stage Requirements Drawer / Preview */}
            {(() => {
              const activePeekStage = journeyStages.find((s) => s.id === (peekStageId || currentJourneyStage.id)) || currentJourneyStage;
              return (
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Stage {activePeekStage.stageNumber}: {activePeekStage.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activePeekStage.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activePeekStage.status === 'Ready'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {activePeekStage.status} ({activePeekStage.progress}%)
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                    {activePeekStage.summary || activePeekStage.subtitle || activePeekStage.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {activePeekStage.requirements.slice(0, 2).map((req, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium ${
                          req.isComplete
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {req.isComplete ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Clock className="w-2.5 h-2.5 text-slate-400" />}
                        <span className="truncate max-w-[130px]">{req.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Interactive Career Route
            </span>
            <button
              id="btn-dash-view-more-journey"
              onClick={() => setActiveTab('journey')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shadow-indigo-200 transition-all cursor-pointer transform hover:scale-105"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* 5. Top Statistics Section (4 Summary Cards) */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Skill Readiness */}
          <StatCard
            id="stat-card-skill-readiness"
            title="Skill Readiness"
            value={`${skillReadinessScore}%`}
            subtitle={`Overall compatibility with ${careerGoal} role requirements`}
            badgeText={skillReadinessScore >= 75 ? 'Ready' : 'In Progress'}
            badgeType={skillReadinessScore >= 75 ? 'success' : 'info'}
            icon={TrendingUp}
            iconBgColor="bg-indigo-50"
            iconTextColor="text-indigo-600"
            progressValue={skillReadinessScore}
            onClickAction={() => setActiveTab('gaps')}
            actionLabel="View Skill Gaps"
          />

          {/* Card 2: Profile Completion */}
          <StatCard
            id="stat-card-profile-completion"
            title="Profile Completion"
            value={`${profileCompletion.percentage}%`}
            subtitle="7 of 7 core portfolio credentials verified"
            badgeText={profileCompletion.percentage >= 80 ? 'Good' : 'Needs Action'}
            badgeType={profileCompletion.percentage >= 80 ? 'success' : 'warning'}
            icon={UserCheck}
            iconBgColor="bg-emerald-50"
            iconTextColor="text-emerald-600"
            progressValue={profileCompletion.percentage}
            onClickAction={() => setShowProfileModal(true)}
            actionLabel="View Completion Checklist"
          />

          {/* Card 3: Recommended Opportunities */}
          <StatCard
            id="stat-card-recommended-opps"
            title="Recommended Opportunities"
            value={recommendedOpportunitiesCount}
            subtitle="Internships & roles with high skill compatibility"
            badgeText="Updated Daily"
            badgeType="info"
            icon={Briefcase}
            iconBgColor="bg-purple-50"
            iconTextColor="text-purple-600"
            onClickAction={() => setActiveTab('internships')}
            actionLabel="Explore Internships"
          />

          {/* Card 4: Active Applications */}
          <StatCard
            id="stat-card-active-applications"
            title="Active Applications"
            value={activeApplicationsCount}
            subtitle="1 Shortlisted, 1 Interview, 2 Under Review"
            badgeText="Active"
            badgeType="info"
            icon={Clock}
            iconBgColor="bg-blue-50"
            iconTextColor="text-blue-600"
            onClickAction={() => setActiveTab('applications')}
            actionLabel="Track Applications"
          />

        </div>
      </section>

      {/* 6. Skill Profile & Skill Gap Analysis (Two-Column Master Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column: Skill Profile (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                  Target Role Skills ({careerGoal})
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Proficiencies across required competencies
                </p>
              </div>
              <button
                id="btn-view-all-skills"
                onClick={() => setActiveTab('skills')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>My Skills ({profile.skills.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal progress bars for top skills */}
            <SkillProgress
              skills={profile.skills}
              maxDisplay={5}
              onTakeAssessment={handleTakeAssessmentForSkill}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">
              {profile.skills.filter((s) => s.verified).length} verified via assessments
            </span>
            <button
              onClick={() => setActiveTab('assessment')}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Skill Assessment</span>
            </button>
          </div>
        </div>

        {/* Right Column: Skill Gap Section (7 cols) */}
        <div className="lg:col-span-7">
          <SkillGapCard
            gaps={skillGaps}
            careerGoal={careerGoal}
            onViewAllGaps={() => setActiveTab('gaps')}
            onTakeAssessment={handleTakeAssessmentForSkill}
            onEnrollCourse={handleEnrollCourse}
          />
        </div>

      </section>

      {/* 7. Live Market Insights & Industry Intelligence (Google Search Grounded) */}
      <section id="section-market-insights">
        <MarketInsightsWidget
          careerGoal={careerGoal}
          onExploreCourses={handleEnrollCourse}
          onViewSkillGaps={() => setActiveTab('gaps')}
        />
      </section>

      {/* 8. Recommended Opportunities Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Outfit'] font-bold text-xl text-slate-900">
                Recommended Opportunities ({careerGoal})
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {recommendedOpportunitiesCount} Matches
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Personalized internships and jobs weighted against your verified skills
            </p>
          </div>

          <button
            id="btn-see-all-internships"
            onClick={() => setActiveTab('internships')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRecommendedOpps.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onViewDetails={(selected) => setSelectedOpportunity(selected)}
              onApply={(selected) => setApplyingOpportunity(selected)}
            />
          ))}
        </div>
      </section>

      {/* 8. Learning Recommendations (Driven by Skill Gaps) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Outfit'] font-bold text-xl text-slate-900">
                Learning Recommendations for {careerGoal}
              </h3>
              {topSkillGap && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Because you need to improve {topSkillGap.name}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Targeted courses from top institutions to eliminate skill gaps and boost readiness
            </p>
          </div>

          <button
            id="btn-see-all-courses"
            onClick={() => setActiveTab('learning')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Explore Course Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isGapTargeted={topSkillGap?.name.toLowerCase() === course.skillName.toLowerCase()}
            />
          ))}
        </div>
      </section>

      {/* 9. Recent Applications & Digital Portfolio Snapshot */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left: Application Tracking (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                Recent Applications
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Real-time tracking of employer reviews and interview rounds
              </p>
            </div>
            <button
              id="btn-view-all-apps"
              onClick={() => setActiveTab('applications')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All ({applications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recentApplications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </div>

        {/* Right: Digital Portfolio Summary (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-['Outfit'] font-bold text-lg text-white">
                  My Digital Portfolio
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/20">
                Verified
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your comprehensive academic, project, and certification credentials packaged for partner recruiters.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-xl font-extrabold text-white font-['Outfit']">
                  {profile.projects.length}
                </span>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Projects Built</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-xl font-extrabold text-white font-['Outfit']">
                  {profile.certifications.length}
                </span>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Certifications</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-xl font-extrabold text-white font-['Outfit']">
                  {profile.internships.length}
                </span>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Prior Internships</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-xl font-extrabold text-white font-['Outfit']">
                  {profile.achievements.length}
                </span>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Achievements</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-indigo-200 font-semibold">
              Public Link Active
            </span>
            <button
              id="btn-view-portfolio"
              onClick={() => setActiveTab('portfolio')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <ProfileCompletionModal onClose={() => setShowProfileModal(false)} />
      )}

    </div>
  );
};
