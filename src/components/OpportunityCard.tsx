import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Users,
} from 'lucide-react';
import { Opportunity } from '../types';
import { useApp } from '../context/AppContext';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails?: (opp: Opportunity) => void;
  onApply?: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  onApply,
}) => {
  const { hasApplied, setApplyingOpportunity, setSelectedOpportunity } = useApp();
  const applied = hasApplied(opportunity.id);

  const getMatchBadgeStyle = (matchScore?: number) => {
    const score = matchScore || 70;
    if (score >= 85) return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20';
    if (score >= 70) return 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-1 ring-indigo-500/20';
    if (score >= 50) return 'bg-amber-50 text-amber-800 border-amber-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'Remote':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hybrid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id={`opp-card-${opportunity.id}`}
      className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-indigo-200/80 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        {/* Top bar: Type + Match score + Mode */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {opportunity.type}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getModeBadge(opportunity.workMode)}`}>
              {opportunity.workMode}
            </span>
            {opportunity.source && opportunity.source !== 'Internal' && (
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                opportunity.source === 'LinkedIn' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                opportunity.source === 'Naukri' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                opportunity.source === 'Internshala' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {opportunity.source}
              </span>
            )}
          </div>

          {/* Skill Match Percentage Badge */}
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border ${getMatchBadgeStyle(
              opportunity.matchScore
            )}`}
            title={`Weighted skill match based on your assessed skills: ${opportunity.matchScore}%`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{opportunity.matchScore}% Match</span>
          </div>
        </div>

        {/* Company & Title */}
        <div className="mb-3">
          <h4 className="font-['Outfit'] font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
            {opportunity.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{opportunity.company}</span>
          </div>
        </div>

        {/* Details row: Location, Salary/Stipend */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
            <span className="truncate">{opportunity.stipendOrSalary}</span>
          </div>
          {opportunity.openings && (
            <div className="flex items-center gap-1.5 col-span-2 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg w-max border border-emerald-100 mt-1">
              <Users className="w-3.5 h-3.5" />
              <span>{opportunity.openings} Openings Available</span>
            </div>
          )}
        </div>

        {/* Required Skills Tag Cloud */}
        <div className="mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {opportunity.requiredSkills.map((req) => (
              <span
                key={req.skillName}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80"
              >
                {req.skillName} ({req.requiredLevel}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Deadline & Action Buttons */}
      <div className="pt-3.5 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Deadline: {opportunity.deadline}
          </span>
          <span className="text-slate-600 font-semibold">
            {opportunity.applicantsCount} applicants
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`btn-view-details-${opportunity.id}`}
            onClick={() => {
              if (onViewDetails) onViewDetails(opportunity);
              else setSelectedOpportunity(opportunity);
            }}
            className="flex-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {applied ? (
            <button
              disabled
              className="flex-1 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-default"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied</span>
            </button>
          ) : (
            <button
              id={`btn-apply-${opportunity.id}`}
              onClick={() => {
                if (onApply) onApply(opportunity);
                else setApplyingOpportunity(opportunity);
              }}
              className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs shadow-indigo-200 transition-colors"
            >
              <span>Apply Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
