import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Brain,
  Code2,
  Cloud,
  ShieldCheck,
  Palette,
  LineChart,
  Layers,
  Award,
  Compass,
  Target,
  Zap,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CareerGoalRole } from '../types';
import { CAREER_GOALS } from '../data/mockData';

interface WelcomeAssessmentModalProps {
  onClose: () => void;
  onProceedToAssessment: (selectedRole: CareerGoalRole) => void;
  onStartDirectTest?: (selectedRole: CareerGoalRole) => void;
}

export const WelcomeAssessmentModal: React.FC<WelcomeAssessmentModalProps> = ({
  onClose,
  onProceedToAssessment,
  onStartDirectTest,
}) => {
  const { profile, careerGoal, setCareerGoal } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<CareerGoalRole>(
    (careerGoal as CareerGoalRole) || 'Machine Learning Engineer'
  );

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const roleIcons: Record<CareerGoalRole, React.ReactNode> = {
    'Machine Learning Engineer': <Brain className="w-5 h-5 text-indigo-400" />,
    'Data Scientist': <LineChart className="w-5 h-5 text-indigo-400" />,
    'Full Stack Developer': <Code2 className="w-5 h-5 text-blue-400" />,
    'Cloud Engineer': <Cloud className="w-5 h-5 text-cyan-400" />,
    'Cybersecurity Analyst': <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    'UI/UX Designer': <Palette className="w-5 h-5 text-purple-400" />,
  };

  const handleConfirmRoleAndProceed = () => {
    setCareerGoal(selectedRole);
    setStep(2);
  };

  const handleAssessSkillLevel = () => {
    setCareerGoal(selectedRole);
    onProceedToAssessment(selectedRole);
  };

  const handleStartDirectTest = () => {
    setCareerGoal(selectedRole);
    if (onStartDirectTest) {
      onStartDirectTest(selectedRole);
    } else {
      onProceedToAssessment(selectedRole);
    }
  };

  const selectedGoalConfig = CAREER_GOALS.find((g) => g.role === selectedRole);

  return (
    <div
      id="welcome-onboarding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id="welcome-onboarding-modal"
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient and prominent working Cross Button */}
        <div className="relative bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Cross Button */}
          <button
            id="welcome-modal-cross-btn"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close popup"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all duration-150 border border-white/25 hover:border-white/50 cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <X className="w-5 h-5 text-white stroke-[2.5]" />
          </button>

          <div className="relative z-10 pr-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Career Onboarding & Calibration</span>
            </div>

            <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome, {profile.name.split(' ')[0]}! 👋
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              {step === 1
                ? 'Select the career role you want to pursue to customize your skill benchmarks and opportunities.'
                : `Awesome choice! Ready to benchmark your skills for ${selectedRole} with our curated assessment?`}
            </p>

            {/* Step Progress Indicators */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 1
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {step === 2 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    step === 1 ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  1. Target Role
                </span>
              </div>

              <div className="w-8 h-0.5 bg-slate-700" />

              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 2
                      ? 'bg-indigo-500 text-white shadow-xs ring-2 ring-indigo-400/50'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  2
                </span>
                <span
                  className={`text-xs font-semibold ${
                    step === 2 ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  2. Assess Skill Level
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: SELECT CAREER ROLE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Choose The Career Role You Want to Pursue</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Select 1 option
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAREER_GOALS.map((goal) => {
                  const isSelected = selectedRole === goal.role;
                  return (
                    <button
                      key={goal.role}
                      id={`role-option-${goal.role.replace(/\s+/g, '-').toLowerCase()}`}
                      type="button"
                      onClick={() => setSelectedRole(goal.role)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {roleIcons[goal.role] || <Target className="w-5 h-5" />}
                          </div>
                          <div>
                            <h3 className="font-['Outfit'] text-sm font-bold text-slate-900 leading-snug">
                              {goal.title}
                            </h3>
                            <span className="text-[11px] font-semibold text-emerald-600">
                              {goal.averageSalary}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        {goal.description}
                      </p>

                      {/* Required skills chips */}
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                        {goal.requiredSkills.slice(0, 3).map((sk) => (
                          <span
                            key={sk.skillName}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                              isSelected
                                ? 'bg-indigo-100/80 text-indigo-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {sk.skillName}
                          </span>
                        ))}
                        {goal.requiredSkills.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                            +{goal.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ASSESS YOUR SKILL LEVEL */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Selected Role Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    {roleIcons[selectedRole] || <Brain className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      Selected Target Career Role
                    </span>
                    <h3 className="font-['Outfit'] text-base font-bold text-slate-900">
                      {selectedRole}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer"
                >
                  Change Role
                </button>
              </div>

              {/* Assessment Plan Breakdown */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/40 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                      Curated 50-Question Benchmark
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[11px] font-bold text-emerald-300">
                      Easy • Moderate • Hard
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-300 font-mono text-xs font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>50 Questions</span>
                  </div>
                </div>

                <h4 className="font-['Outfit'] text-lg font-bold text-white">
                  Curated Assessment Questionnaire for {selectedRole}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  The assessment tests 5 core departments required to excel in this role. Each question is internally tagged by department course (e.g. Python, Math & Statistics, ML Algorithms, Deep Learning, SQL) and difficulty level.
                </p>

                {/* 5 Department Preview Tags */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Departments Tested &amp; Graded on a 5-Point Scale:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedGoalConfig?.requiredSkills.map((sk) => (
                      <div
                        key={sk.skillName}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-medium text-slate-200">{sk.skillName}</span>
                        </div>
                        <span className="text-[10px] text-indigo-300 font-mono">
                          Benchmark: {sk.requiredScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post-test outcome preview */}
                <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-200 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Upon submission, you will receive an <strong>Interactive Analysis Chart</strong> ranking each department on a <strong>Scale of 5</strong> (5=Outstanding to 1=Needs Action), alongside your cumulative <strong>Scale of Readiness</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {step === 1 ? (
            <>
              <button
                id="btn-welcome-skip"
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer text-center"
              >
                Explore Dashboard First
              </button>

              <button
                id="btn-welcome-next-step"
                type="button"
                onClick={handleConfirmRoleAndProceed}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Confirm Role &amp; Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                id="btn-welcome-back-to-step1"
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Role Selection</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-assess-skill-level"
                  type="button"
                  onClick={handleAssessSkillLevel}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Assess My Skill Level</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
