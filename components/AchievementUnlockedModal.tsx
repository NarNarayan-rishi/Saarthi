import React, { useEffect } from 'react';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  Award,
  Zap,
} from 'lucide-react';
import { StageAchievement } from '../types';

interface AchievementUnlockedModalProps {
  achievement: StageAchievement | null;
  onClose: () => void;
  onViewJourney?: () => void;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  achievement,
  onClose,
  onViewJourney,
}) => {
  useEffect(() => {
    if (!achievement) return;
    // Auto-dismiss after 6 seconds if not closed
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-5 shadow-2xl text-white relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 flex items-start gap-4">
          {/* Animated Badge Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center text-2xl shadow-lg shadow-amber-400/30 shrink-0 transform hover:scale-105 transition-transform animate-bounce">
            {achievement.badgeEmoji || '🏆'}
          </div>

          <div className="space-y-1.5 flex-1 pr-6">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Achievement Unlocked!
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                +{achievement.rewardExp} EXP
              </span>
            </div>

            <h4 className="font-['Outfit'] font-extrabold text-base text-white tracking-tight">
              {achievement.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {achievement.description}
            </p>

            <div className="pt-2 flex items-center gap-2">
              {onViewJourney && (
                <button
                  onClick={() => {
                    onViewJourney();
                    onClose();
                  }}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View Career Journey</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
