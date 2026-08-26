import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  ShieldCheck,
  GraduationCap,
  FolderGit2,
  PlayCircle,
  HelpCircle,
  Zap,
  Lock,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Flame,
  Code2,
  Cpu,
  Layers,
  Database,
  Terminal,
  Server,
  Cloud,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_GOALS } from '../../data/mockData';
import { AdaptiveJourneyNode, CareerGoalRole, JourneyStageId } from '../../types';
import { CuratedCourseModal } from '../../components/CuratedCourseModal';
import { AchievementUnlockedModal } from '../../components/AchievementUnlockedModal';

export const CareerJourney: React.FC = () => {
  const {
    profile,
    careerGoal,
    setCareerGoal,
    setActiveTab,
    journeyStages,
    nextBestAction,
    careerJourneyOverview,
    skillGaps,
    topSkillGap,
    courses,
    opportunities,
    applications,
    setActiveTestModal,
    assessmentTests,
    userExp,
    curatedCareerPath,
    completeJourneyNode,
    resetJourneyNodes,
    startComprehensiveRoleTest,
    stageAchievements,
    unlockedAchievementIds,
    unlockStageAchievement,
    activeAchievementUnlocked,
    dismissAchievementModal,
  } = useApp();

  const [selectedStageId, setSelectedStageId] = useState<JourneyStageId | null>(null);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [activeCuratedNode, setActiveCuratedNode] = useState<AdaptiveJourneyNode | null>(null);
  const [activeTabSubView, setActiveTabSubView] = useState<'adaptive_roadmap' | 'stages_pipeline'>('adaptive_roadmap');
  const [showOnlyUnattemptedCourses, setShowOnlyUnattemptedCourses] = useState(false);

  const goalConfig = CAREER_GOALS.find((g) => g.role === careerGoal) || CAREER_GOALS[0];

  // Filter top internship matches
  const topInternshipMatches = opportunities
    .filter((o) => o.type === 'Internship')
    .slice(0, 2);

  const handleStageClick = (stageId: JourneyStageId) => {
    setSelectedStageId(stageId);
    const element = document.getElementById(`stage-section-${stageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextActionClick = () => {
    if (nextBestAction.targetTab === 'assessment' && nextBestAction.skillName) {
      const test = assessmentTests.find(
        (t) => t.skillName.toLowerCase() === nextBestAction.skillName?.toLowerCase()
      );
      if (test) {
        setActiveTestModal(test);
        return;
      }
    }
    setActiveTab(nextBestAction.targetTab);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Ready
          </span>
        );
      case 'Current':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 ring-2 ring-indigo-200/50 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Current Focus
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Needs Attention
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            Upcoming
          </span>
        );
    }
  };

  // Node icon helper
  const getNodeIcon = (nodeType: AdaptiveJourneyNode['nodeType'], status: string) => {
    if (status === 'completed') {
      return <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />;
    }
    if (status === 'locked') {
      return <Lock className="w-4 h-4 text-slate-400" />;
    }

    switch (nodeType) {
      case 'foundation':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'language':
        return <Code2 className="w-5 h-5 text-blue-600" />;
      case 'core_concept':
        return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'mini_project':
        return <FolderGit2 className="w-5 h-5 text-amber-600" />;
      case 'backend_service':
        return <Server className="w-5 h-5 text-indigo-600" />;
      case 'database_layer':
        return <Database className="w-5 h-5 text-cyan-600" />;
      case 'integration':
        return <Cloud className="w-5 h-5 text-sky-600" />;
      case 'major_project':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'assessment_checkpoint':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Gamification Level calculations
  const calculateUserRank = (exp: number) => {
    if (exp >= 3000) return { level: 5, rankTitle: 'Staff Architect', nextTarget: 5000 };
    if (exp >= 1800) return { level: 4, rankTitle: 'Senior Practitioner', nextTarget: 3000 };
    if (exp >= 900) return { level: 3, rankTitle: 'Full-Stack Craftsman', nextTarget: 1800 };
    if (exp >= 400) return { level: 2, rankTitle: 'Emerging Apprentice', nextTarget: 900 };
    return { level: 1, rankTitle: 'Novice Explorer', nextTarget: 400 };
  };

  const userRank = calculateUserRank(userExp);
  const expProgressToNext = Math.min(100, Math.round((userExp / userRank.nextTarget) * 100));

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Header & Dynamic Gamification Bento Bar (Inspired by Coddy.tech) */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Glowing atmospheric accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Top Bar: Title & Target Role Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black text-indigo-200 mb-2 tracking-wide uppercase">
                <Compass className="w-3.5 h-3.5 text-indigo-300" />
                <span>AI-Powered Adaptive Upskilling Engine</span>
              </div>
              <h1 className="font-['Outfit'] font-black text-2xl sm:text-3xl tracking-tight text-white">
                Personalized Career Journey
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal mt-1">
                Dynamic curriculum uniquely sculpted for <strong className="text-white font-bold">{careerGoal}</strong> based on your diagnostic assessment.
              </p>
            </div>

            {/* Target Role Selector */}
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md">
              <span className="text-xs text-slate-300 pl-2 font-medium">Target Role:</span>
              <select
                id="select-career-journey-goal"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value as CareerGoalRole)}
                aria-label="Target career role"
                className="bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                {CAREER_GOALS.map((goal) => (
                  <option key={goal.role} value={goal.role} className="bg-slate-900 text-white">
                    {goal.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gamification HUD Metrics (Coddy.tech Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            
            {/* Gamified EXP & Level Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Rank: Level {userRank.level}</span>
                </span>
                <span className="text-xs font-black text-amber-300 font-['Outfit']">
                  {userExp} EXP
                </span>
              </div>
              <p className="font-['Outfit'] font-black text-base text-white">
                {userRank.rankTitle}
              </p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-700"
                  style={{ width: `${expProgressToNext}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-300 block">
                {userRank.nextTarget - userExp} EXP to next tier rank
              </span>
            </div>

            {/* Pathway Nodes Completion Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curated Milestones</span>
                </span>
                <span className="text-xs font-black text-emerald-300 font-['Outfit']">
                  {curatedCareerPath.overallProgress}%
                </span>
              </div>
              <p className="font-['Outfit'] font-black text-base text-white">
                {curatedCareerPath.completedNodes} / {curatedCareerPath.totalNodes} Levels Done
              </p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700"
                  style={{ width: `${curatedCareerPath.overallProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-300 block">
                {curatedCareerPath.maxPossibleExp - curatedCareerPath.totalExpEarned} EXP remaining on this path
              </span>
            </div>

            {/* Assessment Benchmark Score Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  <span>Diagnostic Score</span>
                </span>
                <span className="text-xs font-black text-purple-300 font-['Outfit']">
                  {curatedCareerPath.candidateAssessmentScore}%
                </span>
              </div>
              <p className="font-['Outfit'] font-black text-base text-white">
                {curatedCareerPath.readinessTier.split('(')[0]}
              </p>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${curatedCareerPath.candidateAssessmentScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-300 block">
                Target Recruiter Benchmark: 85%
              </span>
            </div>

            {/* Streak & Consistency Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Learning Streak</span>
                </span>
                <span className="text-xs font-black text-rose-300 font-['Outfit']">
                  🔥 Active
                </span>
              </div>
              <p className="font-['Outfit'] font-black text-base text-white">
                5-Day Active Streak
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <span
                    key={idx}
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      idx < 5 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-slate-300 block">
                Consistent daily progress builds habits
              </span>
            </div>

          </div>

          {/* Dynamic AI Curation Insight Bar */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-1">
                <h4 className="font-['Outfit'] font-black text-sm text-white">
                  Dynamic Path Curation Architecture
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
                  {curatedCareerPath.diagnosticSummary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                id="btn-retest-skills"
                onClick={() => {
                  startComprehensiveRoleTest(careerGoal);
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Retake 50-Question Diagnostic Assessment"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Re-Test Skills</span>
              </button>

              {curatedCareerPath.completedNodes > 0 && (
                <button
                  id="btn-reset-roadmap-progress"
                  onClick={resetJourneyNodes}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  title="Reset completed levels on roadmap"
                >
                  Reset Path
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Sub-View Switcher: Adaptive Level Roadmap vs 8-Stage Career Lifecycle */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            id="tab-btn-adaptive-roadmap"
            onClick={() => setActiveTabSubView('adaptive_roadmap')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTabSubView === 'adaptive_roadmap'
                ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Interactive Level Roadmap (Coddy.tech Mode)</span>
          </button>

          <button
            id="tab-btn-stages-pipeline"
            onClick={() => setActiveTabSubView('stages_pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTabSubView === 'stages_pipeline'
                ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>8-Stage Career Lifecycle Pipeline</span>
          </button>
        </div>

        <button
          id="btn-view-benchmarks"
          onClick={() => setShowBenchmarkModal(true)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Industry Benchmark Matrix ({careerGoal})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: INTERACTIVE LEVEL ROADMAP (Coddy.tech Style Progressive Nodes)     */}
      {/* ========================================================================= */}
      {activeTabSubView === 'adaptive_roadmap' && (
        <section className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold">
                    Level-by-Level Tree
                  </span>
                  <h3 className="font-['Outfit'] font-extrabold text-xl text-slate-900">
                    Upskilling Path: {careerGoal}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Complete each level to earn EXP, unlock advanced modules, and prepare for recruiter verification.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>EXP Progression: Lowest at Level 1, Highest at Capstone</span>
              </div>
            </div>

            {/* Visual Connected Roadmap Tree */}
            <div className="relative pl-10 sm:pl-12 space-y-6 before:absolute before:top-4 before:bottom-4 before:left-4 sm:before:left-5 before:w-0.5 before:bg-slate-200">
              
              {curatedCareerPath.nodes.map((node, index) => {
                const isCompleted = node.status === 'completed';
                const isCurrent = node.status === 'current';
                const isLocked = node.status === 'locked';

                return (
                  <div key={node.id} className="relative group">
                    
                    {/* Node Dot / Level Badge on Timeline */}
                    <div
                      className={`absolute left-4 sm:left-5 -translate-x-1/2 top-5 w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center font-['Outfit'] font-black text-xs transition-all shadow-xs z-10 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-emerald-200'
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 animate-bounce'
                          : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                      }`}
                    >
                      {getNodeIcon(node.nodeType, node.status)}
                    </div>

                    {/* Node Card */}
                    <div
                      onClick={() => !isLocked && setActiveCuratedNode(node)}
                      className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 relative ${
                        isCompleted
                          ? 'bg-white border-emerald-200 shadow-xs hover:border-emerald-300 hover:shadow-md cursor-pointer'
                          : isCurrent
                          ? 'bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 border-indigo-300 shadow-md ring-2 ring-indigo-500/30 cursor-pointer'
                          : 'bg-slate-50/70 border-slate-200/70 opacity-80 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Content */}
                        <div className="space-y-2 max-w-2xl">
                          
                          {/* Top Tag Badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isCurrent
                                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                  : 'bg-slate-200 text-slate-600 border-slate-300'
                              }`}
                            >
                              Level {node.level} • {node.category}
                            </span>

                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                              +{node.expReward} EXP
                            </span>

                            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {node.estimatedHours}
                            </span>

                            {isCompleted && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>

                          {/* Level Title & Subtitle */}
                          <div>
                            <h4 className="font-['Outfit'] font-black text-lg sm:text-xl text-slate-900">
                              {node.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                              {node.subtitle}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {node.description}
                          </p>

                          {/* Skill Tags */}
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {node.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Algorithmic Reason Pill */}
                          <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>Curated Reason: </strong>
                              {node.reasonForInclusion}
                            </span>
                          </div>

                        </div>

                        {/* Right Action Button ("Start!") */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={() => setActiveCuratedNode(node)}
                              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <BookOpen className="w-4 h-4 text-indigo-600" />
                              <span>Review 3 Choices</span>
                            </button>
                          ) : isCurrent ? (
                            <button
                              id={`btn-start-level-${node.id}`}
                              type="button"
                              onClick={() => setActiveCuratedNode(node)}
                              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer animate-pulse"
                            >
                              <PlayCircle className="w-5 h-5 fill-white text-indigo-600" />
                              <span>Start!</span>
                            </button>
                          ) : (
                            <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center gap-1.5 border border-slate-200">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Locked (Level {node.level - 1} required)</span>
                            </div>
                          )}

                          <span className="text-[11px] text-slate-500 font-medium">
                            3 Curated Paths Available
                          </span>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: 8-STAGE CAREER LIFECYCLE PIPELINE (Detailed Pipeline Stages)      */}
      {/* ========================================================================= */}
      {activeTabSubView === 'stages_pipeline' && (
        <div className="space-y-8">
          
          {/* Next Best Action Card */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-xs relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${nextBestAction.badgeColor}`}>
                    {nextBestAction.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
                    YOUR NEXT BEST ACTION
                  </span>
                </div>
                <h2 className="font-['Outfit'] font-extrabold text-xl text-slate-900">
                  {nextBestAction.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {nextBestAction.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  id="btn-journey-primary-action"
                  onClick={handleNextActionClick}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs shadow-indigo-200 transition-all cursor-pointer"
                >
                  <span>{nextBestAction.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Visual Progress Bar & Positive Reinforcement System */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 relative overflow-hidden">
            {/* Top Stats & Positive Reinforcement Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-['Outfit'] font-extrabold text-xl text-slate-900">
                    Career Stage Progress & Milestones
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Track your progression across all 8 verified career readiness stages for <strong className="text-slate-800">{careerGoal}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 border border-indigo-200/70 rounded-2xl px-4 py-2 text-right">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Stages Completed</span>
                  <span className="font-['Outfit'] font-black text-lg text-indigo-900">
                    {journeyStages.filter((s) => s.status === 'Completed').length} / {journeyStages.length} Stages
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200/70 rounded-2xl px-4 py-2 text-right">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Career Readiness</span>
                  <span className="font-['Outfit'] font-black text-lg text-emerald-700">
                    {careerJourneyOverview.journeyProgress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Linear Milestone Progress Bar with Stage Nodes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Stage-by-Stage Completion Journey
                </span>
                <span className="text-slate-500 font-semibold">
                  Overall Journey Completion: <strong className="text-slate-900">{careerJourneyOverview.journeyProgress}%</strong>
                </span>
              </div>

              {/* Progress Track */}
              <div className="relative pt-4 pb-2">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${Math.max(8, careerJourneyOverview.journeyProgress)}%` }}
                  />
                </div>

                {/* 8 Milestone Points Along the Track */}
                <div className="grid grid-cols-8 gap-1 pt-3">
                  {journeyStages.map((st, idx) => {
                    const isDone = st.status === 'Completed';
                    const isCurrent = st.status === 'Current' || st.status === 'Needs Attention';
                    const isSelected = selectedStageId === st.id;

                    return (
                      <div key={st.id} className="flex flex-col items-center text-center">
                        <button
                          type="button"
                          onClick={() => handleStageClick(st.id)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 scale-110'
                              : isDone
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-200'
                              : isCurrent
                              ? 'bg-amber-500 text-white animate-bounce ring-2 ring-amber-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                          }`}
                          title={`Stage ${idx + 1}: ${st.title} (${st.status})`}
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                        </button>
                        <span className="text-[10px] font-bold text-slate-700 mt-1 truncate max-w-[65px] hidden sm:block">
                          {st.title.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dynamic Positive Reinforcement Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-emerald-50/80 border border-indigo-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-indigo-200 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-['Outfit'] font-black text-sm text-slate-900 flex items-center gap-2">
                    <span>Positive Reinforcement & Growth Milestones</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active Boost
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {journeyStages.filter((s) => s.status === 'Completed').length >= 4
                      ? `🎉 Phenomenal Dedication! You've verified ${journeyStages.filter((s) => s.status === 'Completed').length} key stages for ${careerGoal}. You're in the top 10% of prepared candidates!`
                      : journeyStages.filter((s) => s.status === 'Completed').length >= 2
                      ? `🚀 Solid Progress! You have completed foundational stages. Complete Targeted Learning & Portfolio to unlock priority recruiter applications!`
                      : `🌱 Excellent start! Work through your skill gap analysis and diagnostic tests to start unlocking prestigious industry achievements!`}
                  </p>
                </div>
              </div>

              {/* Quick Achievement Action / Test Notification Trigger */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => unlockStageAchievement('stage_1_profile')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-700 font-extrabold rounded-xl text-xs border border-indigo-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Test Achievement Notification</span>
                </button>
              </div>
            </div>

            {/* Unlocked Achievements Showcase Bar */}
            <div className="space-y-2.5 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Unlocked Stage Achievements ({stageAchievements.filter((a) => a.isUnlocked).length}/{stageAchievements.length})
                </span>
                <span className="text-xs font-bold text-amber-600">
                  +{stageAchievements.filter((a) => a.isUnlocked).reduce((sum, a) => sum + (a.rewardExp || a.expReward || 0), 0)} EXP Earned
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {stageAchievements.map((ach) => (
                  <button
                    key={ach.id}
                    onClick={() => unlockStageAchievement(ach.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                      ach.isUnlocked
                        ? 'bg-amber-50/60 border-amber-200 text-slate-800 hover:bg-amber-100/60 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                    }`}
                    title={ach.description}
                  >
                    <span className="text-xl mb-1">{ach.badgeEmoji || ach.icon || '🏆'}</span>
                    <span className="text-[10px] font-black truncate w-full block">{ach.title}</span>
                    <span className="text-[9px] font-bold text-amber-700 mt-1">+{ach.rewardExp || ach.expReward || 0} EXP</span>
                  </button>
                ))}
              </div>
            </div>

                      </section>

          {/* New Current Course & Upcoming Level Section */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-xs relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30 mt-8">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Currently in Progress Course */}
              <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <PlayCircle className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">Currently in Progress</h3>
                </div>
                {courses.filter(c => c.progress > 0 && c.progress < 100).slice(0, 1).map(course => (
                  <div key={course.id} className="space-y-3">
                    <h4 className="font-bold text-slate-800">{course.title}</h4>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span className="font-bold text-indigo-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <button onClick={() => setActiveTab('learning')} className="w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                      Resume Course
                    </button>
                  </div>
                ))}
                {courses.filter(c => c.progress > 0 && c.progress < 100).length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">No courses currently in progress.</p>
                )}
              </div>

              {/* Upcoming Level / Stage */}
              <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">Upcoming Level</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{journeyStages[2]?.title || 'Advanced Modules'}</h4>
                    <p className="text-xs text-slate-500 mt-1">Complete current milestones to unlock this level.</p>
                  </div>
                </div>
              </div>

            </div>
</section>

        </div>
      )}

      {/* 5. Formula Transparency Modal */}
      {showFormulaModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowFormulaModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                  Journey Progress Calculation
                </h3>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-600 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Overall Journey Progress is calculated dynamically through weighted contributions across key milestones:
            </p>

            <div className="space-y-2.5 divide-y divide-slate-100">
              {careerJourneyOverview.formulaBreakdown.map((item) => (
                <div key={item.component} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{item.component}</span>
                    <span className="text-[10px] text-slate-600 ml-1.5">({item.weight * 100}% weight)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-700">{item.score}% score</span>
                    <span className="font-extrabold text-indigo-600 ml-2 font-['Outfit']">
                      +{item.contribution}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Total Career Journey Progress:</span>
              <span className="text-base font-['Outfit'] font-extrabold text-indigo-600">
                {careerJourneyOverview.journeyProgress}%
              </span>
            </div>

            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 6. Benchmark Transparency Modal */}
      {showBenchmarkModal && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowBenchmarkModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                  {careerGoal} Industry Benchmarks
                </h3>
              </div>
              <button
                onClick={() => setShowBenchmarkModal(false)}
                className="text-slate-600 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Benchmarks synthesized from verified recruiter requirements across live tech job requisitions for {careerGoal}.
            </p>

            <div className="space-y-2">
              {goalConfig.requiredSkills.map((req) => (
                <div
                  key={req.skillName}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{req.skillName}</span>
                    <span className="text-[10px] text-slate-600 ml-1.5">({req.category})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-600">Weight: {req.weight}x</span>
                    <span className="font-extrabold text-indigo-600 font-['Outfit']">
                      {req.requiredScore}% benchmark
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
              <span className="font-bold">Average Compensation:</span> {goalConfig.averageSalary} • Growth: {goalConfig.growthRate}
            </div>

            <button
              onClick={() => setShowBenchmarkModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 7. Curated Course Modal Popup (3 Choices: Paid, YouTube, University) */}
      {activeCuratedNode && (
        <CuratedCourseModal
          node={activeCuratedNode}
          onClose={() => setActiveCuratedNode(null)}
          onCompleteLevel={(nodeId, expReward) => {
            completeJourneyNode(nodeId, expReward);
            setActiveCuratedNode(null);
          }}
          onTakeAssessment={() => {
            setActiveCuratedNode(null);
            startComprehensiveRoleTest(careerGoal);
          }}
        />
      )}

      {/* 8. Gamification Achievement Unlocked Modal Notification */}
      {activeAchievementUnlocked && (
        <AchievementUnlockedModal
          achievement={activeAchievementUnlocked}
          onClose={dismissAchievementModal}
          onViewJourney={() => setActiveTabSubView('stages_pipeline')}
        />
      )}

    </div>
  );
};
