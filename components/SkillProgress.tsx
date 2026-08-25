import React from 'react';
import { CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';
import { Skill } from '../types';
import { useApp } from '../context/AppContext';

interface SkillProgressProps {
  skills: Skill[];
  onTakeAssessment?: (skillName: string) => void;
  maxDisplay?: number;
  showCategory?: boolean;
}

export const SkillProgress: React.FC<SkillProgressProps> = ({
  skills,
  onTakeAssessment,
  maxDisplay,
  showCategory = true,
}) => {
  const { setActiveTab } = useApp();
  const displaySkills = maxDisplay ? skills.slice(0, maxDisplay) : skills;

  const getProgressColor = (proficiency: number) => {
    if (proficiency >= 80) return 'bg-emerald-500';
    if (proficiency >= 65) return 'bg-indigo-500';
    if (proficiency >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Data & AI':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Web & Cloud':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Soft Skills':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {displaySkills.map((skill) => (
        <div
          key={skill.id}
          id={`skill-item-${skill.id}`}
          className="p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/90 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-slate-900">{skill.name}</span>
              {showCategory && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeColor(
                    skill.category
                  )}`}
                >
                  {skill.category}
                </span>
              )}
              {skill.verified ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  Self-Rated
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-['Outfit'] font-extrabold text-xs text-slate-800">
                {skill.proficiency}%
              </span>
              {onTakeAssessment && (
                <button
                  id={`btn-assess-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onTakeAssessment(skill.name)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Assess
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(skill.proficiency)} rounded-full transition-all duration-500`}
              style={{ width: `${skill.proficiency}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
