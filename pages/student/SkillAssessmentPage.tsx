import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  HelpCircle,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  Zap,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Brain,
  ShieldAlert,
  Flame,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { CareerGoalRole } from '../../types';
import { CAREER_GOALS } from '../../data/mockData';
import { getQuestionsForRole } from '../../data/roleAssessmentsData';

export const SkillAssessmentPage: React.FC = () => {
  const {
    careerGoal,
    setCareerGoal,
    profile,
    skillReadinessScore,
    comprehensiveResult,
    comprehensiveResultsByRole,
    hasCompletedAssessmentForRole,
    getRoleAssessmentResult,
    startComprehensiveRoleTest,
    clearComprehensiveResult,
    setActiveTab,
  } = useApp();

  const [isDomainAnalysisOpen, setIsDomainAnalysisOpen] = useState(true);
  const [isChartsOpen, setIsChartsOpen] = useState(true);
  const [isQuestionReviewOpen, setIsQuestionReviewOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'All' | 'Incorrect' | 'Correct'>('All');

  const goalConfig = CAREER_GOALS.find((g) => g.role === careerGoal);
  const currentRoleResult = getRoleAssessmentResult(careerGoal);
  const roleQuestions =
    currentRoleResult?.questions && currentRoleResult.questions.length > 0
      ? currentRoleResult.questions
      : getQuestionsForRole(careerGoal);

  // 5 unique departments for this role
  const roleDepartments = Array.from(new Set(roleQuestions.map((q) => q.department)));
  const isAssessmentCompleted = hasCompletedAssessmentForRole(careerGoal);

  // Prepare chart data for comprehensive evaluation
  const chartData = currentRoleResult
    ? currentRoleResult.departmentBreakdowns.map((d) => ({
        department: d.department.length > 16 ? d.department.substring(0, 14) + '...' : d.department,
        fullName: d.department,
        score: d.scorePercent,
        benchmark: 85,
        rating: d.rating,
        gap: d.skillGapPercent,
      }))
    : [];

  const radarData = currentRoleResult
    ? currentRoleResult.departmentBreakdowns.map((d) => ({
        subject: d.department.split('&')[0].trim(),
        candidate: d.scorePercent,
        industryStandard: 85,
      }))
    : [];

  const getRatingBadgeClass = (rating: number) => {
    switch (rating) {
      case 5:
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/30';
      case 4:
        return 'bg-green-50 text-green-800 border-green-300 ring-1 ring-green-400/30';
      case 3:
        return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/30';
      case 2:
        return 'bg-orange-50 text-orange-800 border-orange-300 ring-1 ring-orange-400/30';
      case 1:
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400/30';
    }
  };

  const getRatingBarColor = (rating: number) => {
    switch (rating) {
      case 5:
        return '#059669'; // emerald-600
      case 4:
        return '#16a34a'; // green-600
      case 3:
        return '#d97706'; // amber-600
      case 2:
        return '#ea580c'; // orange-600
      case 1:
      default:
        return '#e11d48'; // rose-600
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto font-['Plus_Jakarta_Sans']">
      {/* ========================================================================= */}
      {/* 0. ROLE SELECTOR SWITCHER BAR */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-['Outfit'] text-sm font-bold text-slate-900">
              Current Job Role Focus &amp; Diagnostic Questionnaire
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Current Job Role Chosen:
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {careerGoal}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CAREER_GOALS.map((g) => {
            const isSelected = g.role === careerGoal;
            const completed = hasCompletedAssessmentForRole(g.role);
            const roleRes = getRoleAssessmentResult(g.role);

            return (
              <button
                key={g.role}
                onClick={() => setCareerGoal(g.role)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-600 ring-offset-2'
                    : 'bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-indigo-50/40 hover:border-indigo-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase opacity-80 truncate">
                      {g.title.split(' ')[0]}
                    </span>
                    {completed ? (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                        isSelected ? 'bg-emerald-400/20 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Check className="w-2.5 h-2.5" />
                        <span>{roleRes?.totalScorePercent}%</span>
                      </span>
                    ) : (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-amber-400/20 text-amber-200' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Pending
                      </span>
                    )}
                  </div>
                  <span className={`font-['Outfit'] font-bold text-xs leading-snug block truncate ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}>
                    {g.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* ========================================================================= */}
      {/* 1. CURATED 50-QUESTION NICHE BENCHMARK HERO & "LET'S TEST" ACTION */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Standardized {roleQuestions.length}-Question Diagnostic Calibration</span>
            </div>

            <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Skill Assessment for {careerGoal}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your curated assessment questionnaire is ready. It contains <strong>{roleQuestions.length} questions</strong> across{' '}
              <strong className="text-white">Easy, Moderate, and Hard</strong> levels covering all required skill categories for {careerGoal}.
            </p>

            {/* Department tags list */}
            <div className="flex flex-wrap gap-2 pt-1">
              {roleDepartments.map((dept, idx) => (
                <span
                  key={dept}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Right Action & Readiness Snapshot */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 w-full lg:w-auto shrink-0">
            {/* CTA Button "Let's Test" */}
            <button
              id="btn-lets-test"
              type="button"
              onClick={() => startComprehensiveRoleTest(careerGoal)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
              <span>Let's Test</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Quick Readiness Score Pill */}
            <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center flex items-center justify-between sm:justify-center gap-3">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 block">
                  Current Goal Readiness
                </span>
                <span className="font-['Outfit'] text-2xl font-extrabold text-white">
                  {comprehensiveResult
                    ? `${comprehensiveResult.grandReadiness.cumulativeRating}/5.0`
                    : `${skillReadinessScore}%`}
                </span>
              </div>
              {comprehensiveResult && (
                <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Assessed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. COMPREHENSIVE ASSESSMENT ANALYSIS REPORT & DEPARTMENT GAP CHART */}
      {/* ========================================================================= */}
      {comprehensiveResult && (
        <section
          id="comprehensive-analysis-report"
          className="space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md animate-in fade-in duration-300"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
                  Validated Diagnostic Results
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Completed on {new Date(comprehensiveResult.completedAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Skill Assessment Analysis &amp; Department Gaps
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Detailed evaluation for <strong className="text-slate-900">{comprehensiveResult.role}</strong> across all tested departments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-retake-comprehensive-assessment"
                type="button"
                onClick={() => startComprehensiveRoleTest(careerGoal)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>
            </div>
          </div>

          {/* GRAND SCALE OF READINESS CARD */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800/80 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Score Gauge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Grand Cumulative Scale of Readiness
                </span>

                <div className="flex items-baseline gap-1 font-['Outfit']">
                  <span className="text-5xl font-black text-white">
                    {comprehensiveResult.grandReadiness.cumulativeRating}
                  </span>
                  <span className="text-2xl font-bold text-slate-400">/ 5.0</span>
                </div>

                <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-600/40">
                  {comprehensiveResult.grandReadiness.readinessTier}
                </div>

                <p className="text-[11px] text-slate-300 pt-1">
                  Overall Score: <strong>{comprehensiveResult.totalScorePercent}%</strong> ({comprehensiveResult.correctCount}/{comprehensiveResult.totalQuestions || roleQuestions.length} correct)
                </p>

                {(comprehensiveResult.strongestSkill || comprehensiveResult.weakestSkill) && (
                  <div className="w-full pt-2 flex flex-col gap-1.5 text-[11px]">
                    {comprehensiveResult.strongestSkill && (
                      <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                        <span className="font-medium">Strongest Skill:</span>
                        <strong className="text-white">{comprehensiveResult.strongestSkill}</strong>
                      </div>
                    )}
                    {comprehensiveResult.weakestSkill && (
                      <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300">
                        <span className="font-medium">Improvement Area:</span>
                        <strong className="text-white">{comprehensiveResult.weakestSkill}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Summary & Next Action */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>Evaluation Diagnostic Summary</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {comprehensiveResult.grandReadiness.summary}
                </p>

                <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 text-xs text-indigo-100 flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Recommended Next Step:</strong>
                    <span>{comprehensiveResult.grandReadiness.nextBestStep}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-POINT SCALE REFERENCE LEGEND */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Department Performance Grading Scale (1 to 5):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                <strong className="block text-emerald-700 font-bold">5 - Outstanding</strong>
                Mastered, exceeds entry benchmarks (85%+)
              </div>
              <div className="p-2 rounded-xl bg-green-50 border border-green-200 text-green-900 font-medium">
                <strong className="block text-green-700 font-bold">4 - Very Good</strong>
                Needs just more practice (70-84%)
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                <strong className="block text-amber-700 font-bold">3 - Good</strong>
                Needs more concept clarity &amp; experience (50-69%)
              </div>
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 font-medium">
                <strong className="block text-orange-700 font-bold">2 - Needs a Course</strong>
                Structured course required (30-49%)
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-medium">
                <strong className="block text-rose-700 font-bold">1 - Needs Action</strong>
                Start acting on this subject (&lt;30%)
              </div>
            </div>
          </div>

          {/* DOMAIN / DEPARTMENT BREAKDOWN CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Domain Competency &amp; Skill Lack Analysis</span>
              </h3>
              <button
                id="btn-toggle-domain-analysis"
                type="button"
                onClick={() => setIsDomainAnalysisOpen(!isDomainAnalysisOpen)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center transition-colors cursor-pointer border border-slate-200 shadow-xs"
                title={isDomainAnalysisOpen ? 'Collapse Domain Competency Analysis' : 'Expand Domain Competency Analysis'}
                aria-label={isDomainAnalysisOpen ? 'Collapse Domain Competency Analysis' : 'Expand Domain Competency Analysis'}
              >
                {isDomainAnalysisOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            {isDomainAnalysisOpen && (
              <div className="grid grid-cols-1 gap-4">
                {comprehensiveResult.departmentBreakdowns.map((dept) => (
                  <div
                    key={dept.department}
                    id={`dept-analysis-${dept.department.replace(/\s+/g, '-').toLowerCase()}`}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-['Outfit'] font-bold text-base text-slate-900">
                            {dept.department}
                          </h4>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getRatingBadgeClass(
                              dept.rating
                            )}`}
                          >
                            Rank {dept.rating}/5 • {dept.ratingLabel}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          Associated Course: <strong className="text-slate-700">{dept.courseName}</strong>
                        </span>
                      </div>

                      {/* Score & Lack delta */}
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Assessed Score
                          </span>
                          <span className="font-['Outfit'] text-xl font-extrabold text-slate-900">
                            {dept.scorePercent}%
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            ({dept.correctCount}/{dept.totalQuestions} correct)
                          </span>
                        </div>

                        {/* Skill lack indicator */}
                        <div className="pl-4 border-l border-slate-200 text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Skill Lack / Gap
                          </span>
                          <span
                            className={`font-['Outfit'] text-xl font-extrabold ${
                              dept.skillGapPercent > 0 ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {dept.skillGapPercent > 0 ? `-${dept.skillGapPercent}%` : '0%'}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {dept.skillGapPercent > 0 ? 'Lacks from 85% goal' : 'Benchmark Met'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600">Domain Performance</span>
                        <span className="text-slate-900 font-bold">{dept.scorePercent}% / 100%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${dept.scorePercent}%`,
                            backgroundColor: getRatingBarColor(dept.rating),
                          }}
                        />
                      </div>
                    </div>

                    {/* Feedback & Recommended Action */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1">
                        <p className="text-slate-700 leading-relaxed">
                          <strong className="text-slate-900">Diagnostic:</strong> {dept.feedback}
                        </p>
                        <p className="text-indigo-700 font-semibold leading-relaxed">
                          <strong className="text-indigo-900">Action Plan:</strong> {dept.recommendedAction}
                        </p>
                      </div>

                      {dept.skillGapPercent > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('courses')}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Bridge Gap in Courses</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INTERACTIVE COMPARISON CHARTS */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Performance &amp; Competency Comparison Charts</span>
              </h3>
              <button
                id="btn-toggle-charts-analysis"
                type="button"
                onClick={() => setIsChartsOpen(!isChartsOpen)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center transition-colors cursor-pointer border border-slate-200 shadow-xs"
                title={isChartsOpen ? 'Collapse Comparison Charts' : 'Expand Comparison Charts'}
                aria-label={isChartsOpen ? 'Collapse Comparison Charts' : 'Expand Comparison Charts'}
              >
                {isChartsOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            {isChartsOpen && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
                {/* Bar Chart: Score vs 85% Benchmark */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-['Outfit'] font-bold text-sm text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Domain Score vs Industry Benchmark (85%)</span>
                    </h4>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <XAxis dataKey="department" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip
                          formatter={(val: any, name: string) => [
                            `${val}%`,
                            name === 'score' ? 'Candidate Score' : 'Hiring Benchmark',
                          ]}
                          labelFormatter={(label) => `Domain: ${label}`}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="score" name="Your Score" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getRatingBarColor(entry.rating)} />
                          ))}
                        </Bar>
                        <Bar dataKey="benchmark" name="Benchmark (85%)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar / Spider Chart: Skill Matrix */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-['Outfit'] font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span>Multi-Domain Readiness Radar</span>
                    </h4>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius="75%">
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569' }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar
                          name="Your Competency"
                          dataKey="candidate"
                          stroke="#4f46e5"
                          fill="#6366f1"
                          fillOpacity={0.5}
                        />
                        <Radar
                          name="Industry Benchmark"
                          dataKey="industryStandard"
                          stroke="#94a3b8"
                          fill="#cbd5e1"
                          fillOpacity={0.2}
                        />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* QUESTION REVIEW COLLAPSIBLE ZONE */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <span>Question-by-Question Diagnostic Review</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect all {roleQuestions.length} questions, correct solutions, explanations, and skill category tags.
                </p>
              </div>

              <button
                id="btn-toggle-question-review"
                type="button"
                onClick={() => setIsQuestionReviewOpen(!isQuestionReviewOpen)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center transition-colors cursor-pointer border border-slate-200 shadow-xs shrink-0"
                title={isQuestionReviewOpen ? 'Collapse Question Review' : 'Expand Question Review'}
                aria-label={isQuestionReviewOpen ? 'Collapse Question Review' : 'Expand Question Review'}
              >
                {isQuestionReviewOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>

            {isQuestionReviewOpen && (
              <div className="space-y-4 pt-2">
                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  {(['All', 'Incorrect', 'Correct'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setReviewFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        reviewFilter === filter
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Questions List */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {roleQuestions
                    .filter((q) => {
                      const userChoice = comprehensiveResult.userAnswers[q.id];
                      const isCorrect = userChoice === q.correctIndex;
                      if (reviewFilter === 'Correct') return isCorrect;
                      if (reviewFilter === 'Incorrect') return !isCorrect;
                      return true;
                    })
                    .map((q) => {
                      const userChoice = comprehensiveResult.userAnswers[q.id];
                      const isCorrect = userChoice === q.correctIndex;
                      const hasAnswered = userChoice !== undefined;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                            isCorrect
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-white text-[11px]">
                                Q{q.id}
                              </span>
                              <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {q.department}
                              </span>
                              <span className="text-slate-500">{q.difficulty}</span>
                            </div>

                            <span
                              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isCorrect ? 'Correct (+1)' : hasAnswered ? 'Incorrect (0)' : 'Unanswered'}
                            </span>
                          </div>

                          <p className="font-semibold text-slate-900 text-sm">{q.question}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isThisCorrect = optIdx === q.correctIndex;
                              const isThisChosen = optIdx === userChoice;

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2 rounded-xl border flex items-center justify-between ${
                                    isThisCorrect
                                      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold'
                                      : isThisChosen
                                      ? 'bg-rose-100/70 border-rose-300 text-rose-950 font-bold'
                                      : 'bg-white border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <span>
                                    {['A', 'B', 'C', 'D'][optIdx]}. {opt}
                                  </span>
                                  {isThisCorrect && (
                                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                                      Correct
                                    </span>
                                  )}
                                  {isThisChosen && !isThisCorrect && (
                                    <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                                      Your Pick
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                            <strong className="text-slate-900">Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* REDIRECTION BANNER TO CAREER JOURNEY */}
          <div className="pt-6 border-t border-slate-200">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Compass className="w-5 h-5 text-indigo-300 animate-spin-slow" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Next Step in Your Career
                  </span>
                </div>
                <h4 className="font-['Outfit'] text-lg sm:text-xl font-bold text-white">
                  Ready to bridge your skill lack and advance your career?
                </h4>
                <p className="text-xs sm:text-sm text-indigo-100/80 max-w-xl">
                  Transform your assessment diagnostic insights into a personalized milestone roadmap with targeted projects, mentor guidance, and courses.
                </p>
              </div>

              <button
                id="btn-curate-path-upskill"
                type="button"
                onClick={() => setActiveTab('journey')}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer shrink-0"
              >
                <span>Curate the Path To Upskill</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
