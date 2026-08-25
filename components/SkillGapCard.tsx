import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { SkillGapItem } from '../types';
import { useApp } from '../context/AppContext';

interface SkillGapCardProps {
  gaps: SkillGapItem[];
  careerGoal: string;
  onViewAllGaps?: () => void;
  onTakeAssessment?: (skillName: string) => void;
  onEnrollCourse?: (skillName: string) => void;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({
  gaps,
  careerGoal,
  onViewAllGaps,
  onTakeAssessment,
  onEnrollCourse,
}) => {
  const { topSkillGap, setActiveTab } = useApp();

  const getStatusBadge = (status: SkillGapItem['status']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Ready
          </span>
        );
      case 'Improve':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Improve
          </span>
        );
      case 'Major Gap':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            Major Gap
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between h-full">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Outfit'] text-lg font-bold text-slate-900">Skill Gap Analysis</h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                vs. {careerGoal}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Benchmarks your assessed skills against industry job expectations
            </p>
          </div>

          {onViewAllGaps && (
            <button
              id="btn-view-all-skill-gaps"
              onClick={onViewAllGaps}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Top Gap Highlight Callout Box */}
        {topSkillGap && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/80 via-amber-50/40 to-indigo-50/40 border border-rose-200/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wide">
                    Priority Skill Gap
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {topSkillGap.name} ({topSkillGap.studentScore}% vs {topSkillGap.requiredScore}% required)
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  <strong>Your biggest gap is {topSkillGap.name}.</strong> {topSkillGap.recommendedAction}
                </p>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-2.5 mt-3 flex-wrap">
                  <button
                    id="btn-top-gap-course"
                    onClick={() => {
                      if (onEnrollCourse) onEnrollCourse(topSkillGap.name);
                      else setActiveTab('learning');
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Recommended Courses
                  </button>
                  <button
                    id="btn-top-gap-assessment"
                    onClick={() => {
                      if (onTakeAssessment) onTakeAssessment(topSkillGap.name);
                      else setActiveTab('assessment');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Take Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                <th className="pb-2.5 font-bold">Skill</th>
                <th className="pb-2.5 font-bold text-center">Student Level</th>
                <th className="pb-2.5 font-bold text-center">Required</th>
                <th className="pb-2.5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.slice(0, 5).map((item) => (
                <tr key={item.skillId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="font-['Outfit'] font-bold text-slate-800">
                      {item.studentScore}%
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="font-['Outfit'] font-bold text-slate-600">
                      {item.requiredScore}%
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
