import React, { useState } from 'react';
import {
  X,
  Building2,
  FileText,
  Sparkles,
  CheckCircle2,
  Send,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { Opportunity } from '../types';
import { useApp } from '../context/AppContext';

interface ApplyModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ opportunity, onClose }) => {
  const { profile, applyToOpportunity } = useApp();
  const [coverNote, setCoverNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyToOpportunity(opportunity.id, coverNote);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              One-Click Application
            </span>
            <h3 className="font-['Outfit'] font-bold text-base text-slate-900 mt-1">
              Apply to {opportunity.company}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-['Outfit'] text-xl font-bold text-slate-900">
              Application Submitted!
            </h4>
            <p className="text-xs text-slate-600">
              Your profile, resume, and verified skills have been shared with {opportunity.company}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="p-6 space-y-4">
            {/* Position Summary */}
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{opportunity.title}</p>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  {opportunity.company} • {opportunity.location} ({opportunity.workMode})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-indigo-700">
                  {opportunity.matchScore}% Match
                </span>
                <p className="text-[10px] text-slate-600">{opportunity.stipendOrSalary}</p>
              </div>
            </div>

            {/* Profile Snapshot to be sent */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Application Package
              </label>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Candidate:</span>
                  <span className="text-slate-900 font-bold">{profile.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Education:</span>
                  <span className="text-slate-800">{profile.degree}, {profile.branch}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Resume Attached:</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {profile.resumeFileName}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Cover Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Candidate Note / Highlight (Optional)
              </label>
              <textarea
                id="apply-cover-note"
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Mention relevant projects (e.g. Churn Prediction Engine) or why you are excited about this role..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-apply"
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Submit</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
