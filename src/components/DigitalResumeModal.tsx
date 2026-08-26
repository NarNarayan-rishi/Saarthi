import React, { useState } from 'react';
import {
  FileDown,
  X,
  Sparkles,
  CheckCircle2,
  Award,
  Briefcase,
  Layers,
  GraduationCap,
  Eye,
  Sliders,
  Check,
  Download,
  Share2,
  FileText,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile, JourneyStage, StageAchievement, CareerGoalRole } from '../types';
import { generateDigitalResumePdf, ResumePdfOptions } from '../utils/resumePdfGenerator';

interface DigitalResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  careerGoal: CareerGoalRole;
  journeyStages: JourneyStage[];
  stageAchievements: StageAchievement[];
  userExp: number;
}

export const DigitalResumeModal: React.FC<DigitalResumeModalProps> = ({
  isOpen,
  onClose,
  profile,
  careerGoal,
  journeyStages,
  stageAchievements,
  userExp,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'indigo' | 'slate' | 'navy' | 'emerald'>('indigo');
  const [includeMilestones, setIncludeMilestones] = useState(true);
  const [includeInternships, setIncludeInternships] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeCertifications, setIncludeCertifications] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        const options: ResumePdfOptions = {
          theme: selectedTheme,
          includeMilestones,
          includeInternships,
          includeProjects,
          includeCertifications,
        };

        const doc = generateDigitalResumePdf(
          profile,
          careerGoal,
          journeyStages,
          stageAchievements,
          userExp,
          options
        );

        const sanitizedName = (profile.name || 'Candidate').replace(/\s+/g, '_');
        doc.save(`${sanitizedName}_Digital_Resume_${careerGoal.replace(/\s+/g, '_')}_2026.pdf`);

        setIsGenerating(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } catch (err) {
        console.error('Error generating PDF:', err);
        setIsGenerating(false);
      }
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  const completedMilestonesCount = journeyStages.filter((s) => s.status === 'Completed' || s.progress === 100).length;
  const verifiedSkillsCount = (profile.skills || []).filter((s) => s.verified).length;
  const verifiedInternshipsCount = (profile.internships || []).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs shadow-indigo-200">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                  Digital Resume PDF Compiler
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Saarthi Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Compiles your verified skill matrix, completed career milestones, and internships into a recruiter-ready PDF.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with 2-Column Layout: Controls & Live Resume Preview */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Customization Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Quick Metrics Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Compiled Document Summary
              </span>
              
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Skills:
                  </span>
                  <span className="font-bold text-slate-900">{verifiedSkillsCount} / {profile.skills.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Completed Stages:
                  </span>
                  <span className="font-bold text-slate-900">{completedMilestonesCount} / {journeyStages.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    Verified Internships:
                  </span>
                  <span className="font-bold text-slate-900">{verifiedInternshipsCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Candidate EXP:
                  </span>
                  <span className="font-bold text-amber-600">+{userExp} EXP</span>
                </div>
              </div>
            </div>

            {/* Accent Theme Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Resume Palette Theme</span>
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'indigo', name: 'Royal Indigo', color: 'bg-indigo-600' },
                  { id: 'navy', name: 'Executive Navy', color: 'bg-blue-900' },
                  { id: 'slate', name: 'Modern Slate', color: 'bg-slate-700' },
                  { id: 'emerald', name: 'Emerald Clean', color: 'bg-emerald-600' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTheme(t.id as any)}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedTheme === t.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${t.color}`} />
                    <span className="text-[11px]">{t.name}</span>
                    {selectedTheme === t.id && <Check className="w-3 h-3 text-indigo-600 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Inclusions Toggles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Include in Structured PDF
              </label>

              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Career Stages & Milestones</span>
                  <input
                    type="checkbox"
                    checked={includeMilestones}
                    onChange={(e) => setIncludeMilestones(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Verified Internships & Experience</span>
                  <input
                    type="checkbox"
                    checked={includeInternships}
                    onChange={(e) => setIncludeInternships(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Featured Technical Projects</span>
                  <input
                    type="checkbox"
                    checked={includeProjects}
                    onChange={(e) => setIncludeProjects(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-semibold text-slate-700">Licenses & Certifications</span>
                  <input
                    type="checkbox"
                    checked={includeCertifications}
                    onChange={(e) => setIncludeCertifications(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Target Role Tag */}
            <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">Target Candidate Role</span>
              <div className="font-bold text-indigo-950 text-sm">{careerGoal}</div>
              <p className="text-[11px] text-indigo-700/90">
                Skills and milestones are dynamically structured to match {careerGoal} requirements.
              </p>
            </div>

          </div>

          {/* Right Column: Live Resume Document Sheet Preview (8 cols) */}
          <div className="lg:col-span-8 bg-slate-100/70 p-4 rounded-2xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between pb-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Structured PDF Page Layout Preview
              </span>
              <span className="text-[11px]">Format: Standard A4 • Vector PDF</span>
            </div>

            {/* Paper Container Mockup */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200/90 p-6 space-y-5 text-slate-800 font-sans text-xs overflow-y-auto max-h-[460px]">
              
              {/* Header Box */}
              <div className={`p-4 rounded-xl text-white flex items-center justify-between ${
                selectedTheme === 'indigo' ? 'bg-indigo-600' :
                selectedTheme === 'navy' ? 'bg-blue-900' :
                selectedTheme === 'slate' ? 'bg-slate-800' : 'bg-emerald-700'
              }`}>
                <div>
                  <h4 className="font-['Outfit'] font-extrabold text-lg text-white">
                    {profile.name}
                  </h4>
                  <p className="text-[11px] text-white/90">
                    {profile.headline} • Target: {careerGoal}
                  </p>
                  <p className="text-[10px] text-white/75 mt-1">
                    {profile.email} | {profile.phone} | {profile.location}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-extrabold text-white border border-white/30 text-center shrink-0">
                  SAARTHI<br />VERIFIED
                </div>
              </div>

              {/* Bio Summary */}
              {profile.bio && (
                <div className="space-y-1">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b pb-1">
                    Professional Summary
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Education */}
              <div className="space-y-1">
                <div className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b pb-1">
                  Education
                </div>
                <div className="flex justify-between items-start text-[11px]">
                  <div>
                    <span className="font-bold text-slate-900">{profile.institution}</span>
                    <p className="text-slate-600">{profile.degree} in {profile.branch}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-indigo-600">CGPA: {profile.cgpa}</span>
                    <p className="text-slate-500 text-[10px]">Graduation: {profile.expectedGraduation}</p>
                  </div>
                </div>
              </div>

              {/* Verified Internships */}
              {includeInternships && profile.internships && profile.internships.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b pb-1 flex items-center justify-between">
                    <span>Verified Internships & Experience</span>
                    <span className="text-[9px] text-emerald-600 font-bold uppercase">Industry Verified</span>
                  </div>
                  {profile.internships.map((exp) => (
                    <div key={exp.id} className="text-[11px] space-y-0.5">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-900">{exp.role} — <span className="text-indigo-600">{exp.company}</span></span>
                        <span className="text-slate-500 text-[10px]">{exp.duration}</span>
                      </div>
                      <p className="text-slate-600 text-[10px] leading-relaxed">{exp.description}</p>
                      {exp.technologies && (
                        <p className="text-[10px] text-slate-500 font-medium">Stack: {exp.technologies.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Inventory Grid */}
              <div className="space-y-1.5">
                <div className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b pb-1">
                  Assessed & Verified Skills Inventory
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {profile.skills.map((sk) => (
                    <div key={sk.id} className="p-1.5 bg-slate-50 rounded border border-slate-200/80 flex items-center justify-between">
                      <span className="font-bold text-slate-800">{sk.name} {sk.verified ? '✓' : ''}</span>
                      <span className="font-bold text-indigo-600">{sk.proficiency}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Milestones */}
              {includeMilestones && (
                <div className="space-y-1.5">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b pb-1">
                    Completed Career Journey Milestones
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {journeyStages.slice(0, 6).map((st) => (
                      <div key={st.id} className="p-1 bg-emerald-50/70 border border-emerald-200 rounded text-emerald-800 flex items-center justify-between">
                        <span>Stage {st.stageNumber}: {st.title}</span>
                        <span className="font-bold text-[9px]">✓ {st.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {downloadSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Digital Resume downloaded successfully!
              </span>
            ) : (
              <span>PDF will be saved as <strong>{profile.name.replace(/\s+/g, '_')}_Digital_Resume.pdf</strong></span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Resume</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs shadow-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
              <span>{isGenerating ? 'Compiling PDF...' : 'Download Digital Resume (.pdf)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
