import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Sparkles,
  Layers,
  Award,
  HelpCircle,
  Check,
  Flame,
  LayoutGrid,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CareerGoalRole, RoleAssessmentQuestion } from '../types';
import { getQuestionsForRole } from '../data/roleAssessmentsData';

interface ComprehensiveTestModalProps {
  role: CareerGoalRole;
  onClose: () => void;
}

interface SavedTestProgress {
  role: CareerGoalRole;
  questionIds?: number[];
  currentIndex: number;
  answers: Record<number, number>;
  flagged: Record<number, boolean>;
  timeLeft: number;
  lastUpdated: number;
}

export const ComprehensiveTestModal: React.FC<ComprehensiveTestModalProps> = ({
  role,
  onClose,
}) => {
  const { submitComprehensiveRoleTest } = useApp();

  const storageKey = `academia_test_progress_${role.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  // Helper to load saved progress from localStorage
  const loadSavedProgress = (): SavedTestProgress | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedTestProgress;
        if (parsed && parsed.role === role && parsed.answers) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read test progress from localStorage', e);
    }
    return null;
  };

  const initialProgress = loadSavedProgress();

  const [questions, setQuestions] = useState<RoleAssessmentQuestion[]>(() => {
    if (initialProgress && initialProgress.questionIds && initialProgress.questionIds.length > 0) {
      return getQuestionsForRole(role, initialProgress.questionIds);
    }
    return getQuestionsForRole(role);
  });

  const totalQuestions = questions.length;
  const defaultDurationSeconds = Math.max(10 * 60, totalQuestions * 2 * 60);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (initialProgress && typeof initialProgress.currentIndex === 'number') {
      return Math.min(Math.max(0, initialProgress.currentIndex), totalQuestions - 1);
    }
    return 0;
  });

  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    return initialProgress?.answers || {};
  });

  const [flagged, setFlagged] = useState<Record<number, boolean>>(() => {
    return initialProgress?.flagged || {};
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (initialProgress && typeof initialProgress.timeLeft === 'number' && initialProgress.timeLeft > 0) {
      return initialProgress.timeLeft;
    }
    return defaultDurationSeconds;
  });

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(() => {
    return Boolean(initialProgress && (Object.keys(initialProgress.answers).length > 0 || initialProgress.currentIndex > 0));
  });

  const currentQ = questions[currentIndex] || questions[0];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Auto-save test progress to localStorage whenever state changes
  useEffect(() => {
    try {
      const stateToSave: SavedTestProgress = {
        role,
        questionIds: questions.map((q) => q.id),
        currentIndex,
        answers,
        flagged,
        timeLeft,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Could not save test progress to localStorage', e);
    }
  }, [role, questions, currentIndex, answers, flagged, timeLeft, storageKey]);

  // Clean up localStorage on reset / restart
  const handleResetProgress = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    const freshQuestions = getQuestionsForRole(role);
    setQuestions(freshQuestions);
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeLeft(Math.max(10 * 60, freshQuestions.length * 2 * 60));
    setShowResumeBanner(false);
    setShowResetConfirm(false);
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleFinalSubmit = () => {
    const timeSpent = Math.max(10, defaultDurationSeconds - timeLeft);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    // Remove local saved draft upon final submission
    try {
      localStorage.removeItem(storageKey);
    } catch {}

    submitComprehensiveRoleTest(role, answers, timeSpent, questions);
    onClose();
  };

  const departments = ['All', ...Array.from(new Set(questions.map((q) => q.department)))];

  const filteredQuestionIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => filterDepartment === 'All' || q.department === filterDepartment);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    Medium: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    Moderate: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    Hard: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  };

  return (
    <div
      id="comprehensive-test-view"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans']"
    >
      {/* Top Application Bar */}
      <header className="px-4 sm:px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
            {totalQuestions}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Official Benchmark
              </span>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                {role}
              </span>
            </div>
            <h1 className="font-['Outfit'] font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-md">
              {role} Diagnostic Assessment
            </h1>
          </div>
        </div>

        {/* Center Progress & Timer */}
        <div className="flex items-center gap-4">
          {/* Timer */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-mono font-bold ${
              timeLeft < 300
                ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse'
                : 'bg-slate-800 text-amber-300 border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Quick Question Palette Trigger (Mobile) */}
          <button
            type="button"
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
            aria-label="Toggle Question Navigator"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* Submit Action */}
          <button
            id="btn-submit-comprehensive-test"
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Submit Test</span>
            <span className="hidden sm:inline text-xs text-indigo-200">
              ({answeredCount}/{totalQuestions})
            </span>
          </button>

          {/* Exit Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit assessment"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Real-time Global Progress Bar */}
      <div className="w-full h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Auto-Resume Progress Notification Banner */}
      {showResumeBanner && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-indigo-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Resumed Test in Progress:</strong> Restored {answeredCount} answered questions &amp; {formatTime(timeLeft)} remaining time from your local session.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetProgress}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset &amp; Start Over</span>
            </button>
            <button
              type="button"
              onClick={() => setShowResumeBanner(false)}
              className="text-slate-400 hover:text-white"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question & Options Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full space-y-6">
          <div className="space-y-6">
            {/* Question Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold font-mono">
                  Q{currentIndex + 1} of {totalQuestions}
                </span>

                {/* Internal Department Tag */}
                <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dept: {currentQ.department}</span>
                </span>

                {/* Internal Course Tag */}
                <span className="hidden md:inline-block px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                  Course: {currentQ.courseName}
                </span>

                {/* Difficulty Tag */}
                <span
                  className={`px-2.5 py-1 rounded-xl border text-xs font-bold ${
                    difficultyColors[currentQ.difficulty]
                  }`}
                >
                  {currentQ.difficulty} Level
                </span>
              </div>

              {/* Bookmark / Flag for Review */}
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  flagged[currentQ.id]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{flagged[currentQ.id] ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            {/* Question Text Box */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                Question Statement
              </span>
              <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* 4 Interactive Options */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                Select The Correct Answer:
              </span>

              {currentQ.options.map((option, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={optIdx}
                    id={`opt-btn-${optIdx}`}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/30 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {optionLetters[optIdx]}
                    </span>

                    <span className="text-sm sm:text-base font-medium leading-snug pt-0.5 flex-1">
                      {option}
                    </span>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Question Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <button
              id="btn-prev-question"
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Answered {answeredCount} of {totalQuestions} ({progressPercent}%)
            </span>

            {currentIndex === totalQuestions - 1 ? (
              <button
                id="btn-final-submit-bottom"
                type="button"
                onClick={() => setShowSubmitConfirm(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Complete &amp; Submit</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-next-question"
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>

        {/* Desktop Side Question Matrix Palette (1 to 50) */}
        <aside
          className={`fixed lg:static inset-y-0 right-0 z-40 w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            isPaletteOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-indigo-400" />
                <h3 className="font-['Outfit'] text-sm font-bold text-white">
                  Question Palette
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPaletteOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Department Filter Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Filter by Department:
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-indigo-600" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500/40 border border-amber-400/60" />
                <span>Flagged ({Object.values(flagged).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
                <span>Unanswered ({totalQuestions - answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md ring-2 ring-indigo-400 bg-slate-800" />
                <span>Current (Q{currentIndex + 1})</span>
              </div>
            </div>

            {/* 50 Questions Number Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[48vh] overflow-y-auto pr-1">
              {filteredQuestionIndices.map(({ q, idx }) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = !!flagged[q.id];

                return (
                  <button
                    key={q.id}
                    id={`nav-q-${q.id}`}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPaletteOpen(false);
                    }}
                    className={`h-9 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-indigo-400 bg-indigo-950 text-white font-extrabold shadow-sm'
                        : isAnswered
                        ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-500'
                        : isFlagged
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-750'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Submit Block */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit &amp; View Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset &amp; Clear Progress</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-['Outfit'] font-bold text-xl text-white">
                Submit {role} Diagnostic Assessment?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have answered <strong className="text-white">{answeredCount}</strong> out of{' '}
                <strong className="text-white">{totalQuestions}</strong> questions.
                {answeredCount < totalQuestions && (
                  <span className="block text-amber-400 font-medium mt-1">
                    ⚠️ You have {totalQuestions - answeredCount} unanswered questions remaining.
                  </span>
                )}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Target Role:</span>
                <span className="font-bold text-white">{role}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <span className="font-mono font-semibold text-amber-300">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Continue Test
              </button>
              <button
                id="btn-confirm-submit-modal"
                type="button"
                onClick={handleFinalSubmit}
                className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Yes, Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset & Start Over Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-rose-500/30 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-['Outfit'] font-bold text-xl text-white">
                Reset &amp; Start Over?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will clear all your current answers, reset the timer to 100 minutes, and randomly sample a <strong className="text-indigo-300">brand-new set of 50 questions</strong> from the 500-question pool.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-[11px] text-rose-200">
              ⚠️ Any progress you have saved for this test session will be deleted immediately.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-reset-modal"
                type="button"
                onClick={handleConfirmReset}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Reset Test</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
