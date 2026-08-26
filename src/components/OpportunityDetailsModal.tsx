import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Opportunity } from '../types';
import { useApp } from '../context/AppContext';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  onClose,
}) => {
  const { profile, hasApplied, setApplyingOpportunity } = useApp();
  const applied = hasApplied(opportunity.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {opportunity.type}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {opportunity.workMode}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{opportunity.matchScore}% Skill Match</span>
              </div>
            </div>

            <h3 className="font-['Outfit'] font-bold text-xl text-slate-900">
              {opportunity.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                {opportunity.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                {opportunity.location}
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold">
                <span>{opportunity.stipendOrSalary}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* About Position */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
              Role Overview
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
              Key Responsibilities
            </h4>
            <ul className="space-y-2">
              {opportunity.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Alignment Match Breakdown */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
              Your Skill Alignment for this Role
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              {opportunity.requiredSkills.map((req) => {
                const studentSkill = profile.skills.find(
                  (s) => s.name.toLowerCase() === req.skillName.toLowerCase()
                );
                const studentLevel = studentSkill ? studentSkill.proficiency : 20;
                const isMeeting = studentLevel >= req.requiredLevel;

                return (
                  <div key={req.skillName} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{req.skillName}</span>
                        <span className="text-[10px] text-slate-600 font-normal">
                          (Weight: {req.weight}x)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">
                          Yours: <strong className="text-slate-900">{studentLevel}%</strong> / Required: <strong>{req.requiredLevel}%</strong>
                        </span>
                        {isMeeting ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Meets
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Gap -{req.requiredLevel - studentLevel}%
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Comparison bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isMeeting ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full`}
                        style={{ width: `${Math.min(100, studentLevel)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline & Metadata */}
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Application Deadline: <strong>{opportunity.deadline}</strong>
            </span>
            <span>{opportunity.applicantsCount} active applicants</span>
          </div>

        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>

          {applied ? (
            <div className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Applied for this Position</span>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                setApplyingOpportunity(opportunity);
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-indigo-200 transition-colors"
            >
              Apply for {opportunity.title}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
