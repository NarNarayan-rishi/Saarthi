import React from 'react';
import { X, CheckCircle2, Circle, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfileCompletionModalProps {
  onClose: () => void;
}

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ onClose }) => {
  const { profileCompletion, setActiveTab } = useApp();

  const handleJumpToTab = (tabName: string) => {
    setActiveTab(tabName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-base text-slate-900">
                Profile Completion
              </h3>
              <p className="text-xs text-slate-600">
                {profileCompletion.percentage}% of your profile is complete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checklist Content */}
        <div className="p-6 space-y-4">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion.percentage}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Completing all 7 sections unlocks highest-tier recruiter discoverability and automatic weighted skill recommendations.
          </p>

          <div className="space-y-2 pt-2">
            {profileCompletion.completedItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  item.isComplete
                    ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <span className={item.isComplete ? 'font-semibold text-slate-900' : 'font-medium'}>
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-600">
                  +{item.weight}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end">
          <button
            onClick={() => handleJumpToTab('profile')}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Edit Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
