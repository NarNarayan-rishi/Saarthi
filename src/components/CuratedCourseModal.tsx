import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Award,
  Youtube,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
} from 'lucide-react';
import { AdaptiveJourneyNode, CuratedCourseResource } from '../types';
import confetti from 'canvas-confetti';

interface CuratedCourseModalProps {
  node: AdaptiveJourneyNode | null;
  onClose: () => void;
  onCompleteLevel: (nodeId: string, expReward: number) => void;
  onTakeAssessment?: () => void;
}

export const CuratedCourseModal: React.FC<CuratedCourseModalProps> = ({
  node,
  onClose,
  onCompleteLevel,
  onTakeAssessment,
}) => {
  const [selectedTier, setSelectedTier] = useState<'paid' | 'youtube' | 'university'>('paid');

  if (!node) return null;

  const isCompleted = node.status === 'completed';
  const isAssessment = node.nodeType === 'assessment_checkpoint';

  const handleClaimExp = () => {
    // Confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
      });
    } catch {
      // ignore
    }
    onCompleteLevel(node.id, node.expReward);
  };

  const renderResourceCard = (
    resource: CuratedCourseResource,
    tierType: 'paid' | 'youtube' | 'university',
    icon: React.ReactNode,
    categoryBadge: string,
    badgeBg: string,
    borderColor: string
  ) => {
    const isSelected = selectedTier === tierType;

    return (
      <div
        onClick={() => setSelectedTier(tierType)}
        className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
          isSelected
            ? `${borderColor} bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/40`
            : 'border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300'
        }`}
      >
        <div className="space-y-3">
          {/* Header Tag */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${badgeBg}`}>
              {icon}
              <span>{categoryBadge}</span>
            </span>

            {resource.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {resource.badge}
              </span>
            )}
          </div>

          {/* Hyperlinked Formatted Text: e.g. "Frontend Course | IBM | Coursera" */}
          <div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group inline-flex items-center gap-1.5 font-['Outfit'] font-extrabold text-base text-slate-900 hover:text-indigo-600 transition-colors leading-snug"
              title="Open direct course link in a new tab"
            >
              <span>
                {resource.title} | {resource.provider} | {resource.platform}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
            </a>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Meta Details */}
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap">
            {resource.duration && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{resource.duration}</span>
              </span>
            )}
            <span className="font-semibold text-slate-700">
              Provider: <strong className="text-slate-900 font-bold">{resource.provider}</strong>
            </span>
            <span className="font-semibold text-slate-700">
              Platform: <strong className="text-indigo-600 font-bold">{resource.platform}</strong>
            </span>
            {resource.certificationOffered && (
              <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Award className="w-3 h-3 text-emerald-600" />
                Certificate Included
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Click text to explore direct course link
          </span>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Launch Course</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-black uppercase tracking-wider">
                  Level {node.level} • {node.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-black flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                  +{node.expReward} EXP
                </span>
                {isCompleted && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Level Completed
                  </span>
                )}
              </div>

              <h2 className="font-['Outfit'] font-black text-xl sm:text-2xl text-white">
                {node.title}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">
                {node.subtitle}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic AI Diagnostic Insight Pill */}
          <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-start gap-2.5 text-xs text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold">Curation Rationale: </strong>
              <span>{node.reasonForInclusion}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content: 3 Curated Choices */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Project Spec Banner if it's a project node */}
          {node.projectSpec && (
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                <h4 className="font-['Outfit'] font-bold text-sm text-indigo-950">
                  Practical Milestone Specification
                </h4>
              </div>
              <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                <strong>Objective: </strong>
                {node.projectSpec.objective}
              </p>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">
                  Required Deliverables:
                </span>
                <ul className="list-disc list-inside text-xs text-indigo-950 space-y-1">
                  {node.projectSpec.deliverables.map((del, i) => (
                    <li key={i}>{del}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Section Header */}
          <div>
            <h3 className="font-['Outfit'] font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Explore 3 Curated Learning Paths (Pick What Fits Your Style)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any resource to open its dedicated course syllabus. You can choose industry credentials, free masterclasses, or university programs.
            </p>
          </div>

          {/* 3 DISTINCT CARDS */}
          <div className="space-y-4">
            
            {/* 1. Paid Certification Course */}
            {renderResourceCard(
              node.resources.paid,
              'paid',
              <Award className="w-3.5 h-3.5 text-purple-600" />,
              '1. Paid Industry Certification (Issues Verified Certificate)',
              'bg-purple-50 text-purple-800 border-purple-200',
              'border-purple-500'
            )}

            {/* 2. YouTube Most-Viewed Video Course */}
            {renderResourceCard(
              node.resources.youtube,
              'youtube',
              <Youtube className="w-3.5 h-3.5 text-rose-600" />,
              '2. YouTube High-Visibility Video Course (Most Viewed & Free)',
              'bg-rose-50 text-rose-800 border-rose-200',
              'border-rose-500'
            )}

            {/* 3. Renowned University Program (Harvard, Stanford, MIT, Swayam, NPTEL) */}
            {renderResourceCard(
              node.resources.university,
              'university',
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />,
              '3. Renowned University Program (Harvard, Stanford, MIT, Swayam / NPTEL)',
              'bg-emerald-50 text-emerald-800 border-emerald-200',
              'border-emerald-500'
            )}

          </div>

          {/* Assessment checkpoint trigger if applicable */}
          {isAssessment && onTakeAssessment && (
            <div className="p-4 rounded-2xl bg-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-indigo-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Re-Assessment</span>
                </div>
                <h4 className="font-['Outfit'] font-bold text-sm text-white">
                  Ready to test your new skills & unlock verified benchmark?
                </h4>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTakeAssessment();
                }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs shrink-0 flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Launch Diagnostic Test</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Estimated time investment: <strong className="text-slate-900 font-bold">{node.estimatedHours}</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>

            {isCompleted ? (
              <div className="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Level Completed (+{node.expReward} EXP)</span>
              </div>
            ) : (
              <button
                id="btn-claim-level-exp"
                type="button"
                onClick={handleClaimExp}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mark Level Done & Claim +{node.expReward} EXP!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
