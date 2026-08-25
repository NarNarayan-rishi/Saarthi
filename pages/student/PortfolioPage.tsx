import React, { useState } from 'react';
import {
  FolderGit2,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Trophy,
  FileDown,
  Layers,
  ShieldCheck,
  CheckCircle,
  Clock,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DigitalResumeModal } from '../../components/DigitalResumeModal';
import { generateDigitalResumePdf } from '../../utils/resumePdfGenerator';

export const PortfolioPage: React.FC = () => {
  const {
    profile,
    careerGoal,
    journeyStages,
    stageAchievements,
    userExp
  } = useApp();
  
  const [copied, setCopied] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isQuickDownloading, setIsQuickDownloading] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleQuickDownloadPdf = () => {
    setIsQuickDownloading(true);
    setTimeout(() => {
      try {
        const doc = generateDigitalResumePdf(
          profile,
          careerGoal,
          journeyStages,
          stageAchievements,
          userExp,
          {
            theme: 'indigo',
            includeMilestones: true,
            includeInternships: true,
            includeProjects: true,
            includeCertifications: true,
          }
        );
        const sanitizedName = (profile.name || 'Candidate').replace(/\s+/g, '_');
        doc.save(`${sanitizedName}_Digital_Resume_${careerGoal.replace(/\s+/g, '_')}_2026.pdf`);
      } catch (err) {
        console.error('Error generating PDF:', err);
      } finally {
        setIsQuickDownloading(false);
      }
    }, 300);
  };

  const completedStagesCount = journeyStages.filter((s) => s.status === 'Completed' || s.progress === 100).length;
  const verifiedSkillsCount = (profile.skills || []).filter((s) => s.verified).length;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Portfolio Actions Top Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public Candidate Portfolio</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            • Verified Recruiter View
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Preview and customize resume layout options"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Customize Resume</span>
          </button>

          {/* Primary Action: Download Digital Resume Button */}
          <button
            id="btn-download-digital-resume"
            onClick={handleQuickDownloadPdf}
            disabled={isQuickDownloading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
            title="Download structured PDF compiling skills, milestones & internships"
          >
            <FileDown className={`w-4 h-4 ${isQuickDownloading ? 'animate-bounce' : ''}`} />
            <span>{isQuickDownloading ? 'Compiling PDF...' : 'Download Digital Resume'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-extrabold uppercase tracking-wide">
              PDF
            </span>
          </button>
        </div>
      </div>

      {/* Digital Resume Compilation Highlights Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800/40 shadow-xs relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Automated Resume Compiler
              </span>
              <span className="text-xs text-indigo-300">Target Role: {careerGoal}</span>
            </div>

            <h2 className="font-['Outfit'] text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Structured Digital Resume Ready for Export
            </h2>

            <p className="text-xs text-indigo-200/90 leading-relaxed">
              Your resume dynamically compiles your <strong className="text-white">skill inventory ({verifiedSkillsCount} verified)</strong>, <strong className="text-white">completed milestones ({completedStagesCount} stages)</strong>, and <strong className="text-white">verified internship history</strong> into a clean, recruiter-ready PDF.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-300" />
              <span>Preview Layout</span>
            </button>

            <button
              onClick={handleQuickDownloadPdf}
              disabled={isQuickDownloading}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-4 h-4 text-indigo-600 ${isQuickDownloading ? 'animate-bounce' : ''}`} />
              <span>{isQuickDownloading ? 'Generating PDF...' : 'Download PDF Resume'}</span>
            </button>
          </div>
        </div>

        {/* Mini 3-point Highlights Pill Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Skill Inventory:</strong> {profile.skills.length} Technical & Soft Skills</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-200">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <span><strong>Milestones:</strong> {completedStagesCount} Stages Completed (+{userExp} EXP)</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-200">
            <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Internships:</strong> {profile.internships.length} Verified Experiences</span>
          </div>
        </div>
      </div>

      {/* Main Portfolio Document Canvas */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10">
        
        {/* 1. Header & Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-2">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-sm font-bold text-indigo-600">
              {profile.headline} • Target Role: {careerGoal}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                {profile.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                {profile.location}
              </span>
            </div>
          </div>

          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-50 border-2 border-white shadow-md self-start sm:self-center"
          />
        </div>

        {/* 2. Executive Bio */}
        <div className="space-y-3">
          <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            About & Professional Summary
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* 3. Education */}
        <div className="space-y-3">
          <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Education
          </h2>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">{profile.institution}</h3>
              <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                {profile.degree} in {profile.branch}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Current Standing: {profile.currentYear} • Expected Graduation: {profile.expectedGraduation}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                CGPA: {profile.cgpa}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Verified Skills Grid */}
        <div className="space-y-3">
          <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Assessed & Verified Skills ({profile.skills.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.skills.map((skill) => (
              <div key={skill.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{skill.name}</span>
                  <span className="font-bold text-slate-800">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Featured Projects */}
        <div className="space-y-3">
          <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            Projects ({profile.projects.length})
          </h2>
          <div className="space-y-4">
            {profile.projects.map((proj) => (
              <div key={proj.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{proj.title}</h3>
                    <p className="text-xs text-slate-600">{proj.date}</p>
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Code Repository</span>
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((tech) => (
                    <span key={tech} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Certifications & Internships */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          <div className="space-y-3">
            <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Certifications
            </h2>
            <div className="space-y-3">
              {profile.certifications.map((c) => (
                <div key={c.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.title}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-slate-600 mt-0.5">{c.issuer} • {c.issueDate}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Internship History
            </h2>
            <div className="space-y-3">
              {profile.internships.map((exp) => (
                <div key={exp.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900">{exp.role}</span>
                  <p className="text-indigo-600 font-semibold">{exp.company} • {exp.duration}</p>
                  <p className="text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 7. Career Readiness Milestones */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Career Readiness Milestones ({completedStagesCount}/{journeyStages.length} Stages)
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
              +{userExp} EXP Earned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {journeyStages.map((stage) => {
              const isCompleted = stage.status === 'Completed' || stage.progress === 100;
              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                    isCompleted
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">
                      Stage {stage.stageNumber}: {stage.title}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
                      {(stage.subtitle || stage.summary || stage.description || '')}
                    </span>
                  </div>
                  <div className="shrink-0 ml-2">
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        100%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 font-bold text-[10px]">
                        {stage.progress}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Honors & Achievements */}
        <div className="space-y-3 pt-2">
          <h2 className="font-['Outfit'] font-bold text-lg text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Honors & Achievements ({profile.achievements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.achievements.map((ach) => (
              <div key={ach.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">{ach.title}</span>
                <p className="text-slate-600 text-[11px] mt-0.5">{ach.organization} • {ach.date}</p>
                <p className="text-slate-600 mt-1 leading-relaxed">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Digital Resume Modal Dialog */}
      <DigitalResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        profile={profile}
        careerGoal={careerGoal}
        journeyStages={journeyStages}
        stageAchievements={stageAchievements}
        userExp={userExp}
      />

    </div>
  );
};
