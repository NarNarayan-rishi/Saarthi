import React from 'react';
import {
  TrendingDown,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_GOALS } from '../../data/mockData';
import { CareerGoalRole, SkillGapItem } from '../../types';

export const SkillGapsPage: React.FC = () => {
  const {
    careerGoal,
    setCareerGoal,
    skillGaps,
    topSkillGap,
    skillReadinessScore,
    setActiveTab,
    startComprehensiveRoleTest,
    hasCompletedAssessmentForRole,
  } = useApp();

  const handleAssessSkill = (_skillName?: string) => {
    if (!hasCompletedAssessmentForRole(careerGoal)) {
      startComprehensiveRoleTest(careerGoal);
    } else {
      setActiveTab('assessment');
    }
  };

  const getStatusBadge = (status: SkillGapItem['status']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Ready
          </span>
        );
      case 'Improve':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Improve (-{Math.abs(skillGaps.find(g => g.status === 'Improve')?.gap || 0)}%)
          </span>
        );
      case 'Major Gap':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            Major Gap
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-xs font-semibold text-rose-200">
            <TrendingDown className="w-3.5 h-3.5 text-rose-300" />
            <span>Gap Analysis & Career Bridge</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold tracking-tight">
            Skill Gap Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Comparing your assessed abilities against industry benchmark requirements for <strong className="text-white font-semibold">{careerGoal}</strong>.
          </p>
        </div>

        {/* Goal Switcher */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 w-full md:w-auto">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-200 mb-1.5">
            Evaluate Against Role
          </label>
          <select
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value as CareerGoalRole)}
            className="w-full bg-white text-slate-900 font-bold text-xs sm:text-sm px-3 py-2 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-400 cursor-pointer shadow-xs"
          >
            {CAREER_GOALS.map((g) => (
              <option key={g.role} value={g.role}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Gap Priority Banner */}
      {topSkillGap && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50 to-indigo-50 border border-rose-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Priority Focus Area
                </span>
                <h3 className="font-['Outfit'] font-bold text-xl text-slate-900 mt-0.5">
                  Your biggest gap is {topSkillGap.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
                  {topSkillGap.recommendedAction}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setActiveTab('learning')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Recommended Courses</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Gaps Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-['Outfit'] font-bold text-xl text-slate-900">
            Competency Benchmark Matrix
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Student Score vs. Industry Required Threshold for {careerGoal}
          </p>
        </div>

        <div className="space-y-5">
          {skillGaps.map((item) => {
            const isReady = item.status === 'Ready';
            const progressColor = isReady ? 'bg-emerald-500' : item.status === 'Improve' ? 'bg-amber-500' : 'bg-rose-500';

            return (
              <div
                key={item.skillId}
                id={`gap-item-${item.skillId}`}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-bold text-base text-slate-900">{item.name}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="font-bold text-slate-900">{item.studentScore}%</span>
                      <span className="text-slate-600"> / {item.requiredScore}% req</span>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
                    {/* Required marker */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-900 z-10 opacity-70"
                      style={{ left: `${item.requiredScore}%` }}
                      title={`Target requirement: ${item.requiredScore}%`}
                    />
                    {/* Student proficiency bar */}
                    <div
                      className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                      style={{ width: `${item.studentScore}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold px-0.5">
                    <span>0%</span>
                    <span>Industry Benchmark: {item.requiredScore}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Actionable recommendation */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <p className="text-slate-600 font-medium leading-relaxed">
                    💡 <strong className="text-slate-800">Action Plan:</strong> {item.recommendedAction}
                  </p>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAssessSkill(item.name)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-bold text-[11px] flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Assess Skill</span>
                    </button>
                    {!isReady && (
                      <button
                        onClick={() => setActiveTab('learning')}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-[11px] flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Courses</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
