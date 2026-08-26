import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trophy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { AssessmentTest } from '../types';
import { useApp } from '../context/AppContext';

interface AssessmentModalProps {
  test: AssessmentTest;
  onClose: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({ test, onClose }) => {
  const { submitAssessmentResult } = useApp();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = test.questions[currentQIndex];
  const totalQuestions = test.questions.length;
  const isLastQuestion = currentQIndex === totalQuestions - 1;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    test.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });
    return Math.round((correctCount / totalQuestions) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    submitAssessmentResult(test.id, score);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const scorePercentage = calculateScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                {test.category}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {test.difficulty}
              </span>
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 mt-1">
              {test.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isSubmitted ? (
            <>
              {/* Question Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span>
                    Question {currentQIndex + 1} of {totalQuestions}
                  </span>
                  <span>{Math.round(((currentQIndex + 1) / totalQuestions) * 100)}% Complete</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Prompt */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="font-semibold text-slate-900 text-sm md:text-base leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      id={`opt-btn-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-xl text-left text-xs md:text-sm font-medium transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-indigo-50/90 text-indigo-900 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-['Outfit'] text-2xl font-extrabold text-slate-900">
                  Assessment Completed!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your skill profile for <span className="font-bold text-slate-800">{test.skillName}</span> has been updated.
                </p>
              </div>

              {/* Score Display */}
              <div className="p-6 bg-indigo-50/60 rounded-2xl border border-indigo-100 max-w-sm mx-auto">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Score Achieved
                </p>
                <div className="font-['Outfit'] text-4xl font-extrabold text-indigo-950 mt-1">
                  {scorePercentage}%
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold mt-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Skill Badge Awarded</span>
                </div>
              </div>

              {/* Review question explanations */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-100">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                  Answer Key & Concept Explanations
                </h5>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {test.questions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-xl border text-xs ${
                          isCorrect
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">Q{idx + 1}. {q.question}</span>
                          <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isCorrect ? 'Correct (+20%)' : 'Incorrect'}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          <strong className="text-slate-700">Correct Answer:</strong> {q.options[q.correctIndex]}
                        </p>
                        <p className="text-slate-600 mt-0.5 italic">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  id="btn-submit-assessment"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </button>
              ) : (
                <button
                  id="btn-next-question"
                  onClick={() => setCurrentQIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-indigo-200 flex items-center gap-1.5 transition-colors"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <button
              id="btn-close-assessment"
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Return to Dashboard
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
