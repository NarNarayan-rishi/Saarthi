import React, { useState } from 'react';
import { FileText, Download, Wand2, X, ChevronDown, ChevronUp, Save, Briefcase, FileCode2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateAtsResumePdf } from '../utils/resumePdfGenerator';

interface AtsResumeBuilderModalProps {
  onClose: () => void;
  jobContext?: {
    title: string;
    company: string;
    description?: string;
  };
}

export const AtsResumeBuilderModal: React.FC<AtsResumeBuilderModalProps> = ({ onClose, jobContext }) => {
  const { profile } = useApp();
  
  const [step, setStep] = useState<'input' | 'generating' | 'edit'>('input');
  
  // Input Step state
  const [jobTitle, setJobTitle] = useState(jobContext?.title || '');
  const [jobDescription, setJobDescription] = useState(jobContext?.description || '');

  // Edit Step state (Generated ATS Data)
  const [resumeData, setResumeData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    linkedinUrl: (profile as any).linkedinUrl || '',
    githubUrl: (profile as any).githubUrl || '',
    summary: '',
    skills: [] as string[],
    experience: [] as { id: string; title: string; company: string; duration: string; bullets: string[] }[],
    projects: [] as { id: string; title: string; date: string; description: string }[],
    education: {
      institution: profile.institution || '',
      degree: profile.degree || '',
      branch: profile.branch || '',
      date: profile.expectedGraduation || '',
      cgpa: profile.cgpa || ''
    }
  });

  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  const handleGenerate = () => {
    setStep('generating');
    
    // Simulate AI Tailoring Process based on Profile + Job Description
    setTimeout(() => {
      setResumeData(prev => ({
        ...prev,
        summary: `Dynamic and results-driven professional with a strong academic background in ${profile.branch}. Proven expertise in developing scalable solutions and contributing to collaborative environments, directly aligning with the requirements for the ${jobTitle} role. Eager to leverage technical skills in modern frameworks to drive impactful results at ${jobContext?.company || 'your company'}.`,
        skills: [...(profile.skills?.map(s => s.name) || []), 'Agile Methodology', 'Problem Solving', 'Team Collaboration'],
        experience: profile.internships?.map(i => ({
          id: i.id,
          title: i.role,
          company: i.company,
          duration: i.duration,
          bullets: [
            i.description,
            `Applied key principles relevant to ${jobTitle} to optimize existing workflows by 15%.`,
            `Collaborated with cross-functional teams to deliver project milestones ahead of schedule.`
          ]
        })) || [],
        projects: profile.projects?.map(p => ({
          id: p.id,
          title: p.title,
          date: p.date || '2023 - Present',
          description: p.description
        })) || []
      }));
      setStep('edit');
    }, 2500);
  };

  const handleDownload = () => {
    const doc = generateAtsResumePdf(resumeData);
    doc.save(`ATS_Resume_${profile.name.replace(/\\s+/g, '_')}_${jobTitle.replace(/\\s+/g, '_')}.pdf`);
    onClose();
  };

  const toggleSection = (sec: string) => {
    setExpandedSection(prev => prev === sec ? null : sec);
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const newExp = [...resumeData.experience];
    newExp[expIndex].bullets[bulletIndex] = val;
    setResumeData({ ...resumeData, experience: newExp });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Smart ATS Resume Builder</h2>
              <p className="text-xs text-slate-500">Open Source Format • ATS Optimized</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {step === 'input' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <Wand2 className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Tailor Your Resume</h3>
                <p className="text-sm text-slate-600 mt-2">Paste the job description below, and our system will curate your profile experiences into a highly-optimized ATS friendly resume.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Target Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm h-48 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!jobTitle || !jobDescription}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Analyze & Tailor Resume
                </button>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center h-64 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                <FileText className="w-8 h-8 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Curating your experience...</h3>
                <p className="text-sm text-slate-500 mt-1">Extracting keywords & matching competencies.</p>
              </div>
            </div>
          )}

          {step === 'edit' && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Resume Successfully Tailored!</h4>
                  <p className="text-xs text-emerald-700 mt-1">Review and manually edit individual sections below before generating your final ATS-compliant PDF.</p>
                </div>
              </div>

              {/* Edit Header */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button onClick={() => toggleSection('header')} className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                  <h4 className="font-bold text-sm text-slate-900">Contact Information</h4>
                  {expandedSection === 'header' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedSection === 'header' && (
                  <div className="p-5 border-t border-slate-200 grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-600">Full Name</label><input type="text" value={resumeData.name} onChange={e => setResumeData({...resumeData, name: e.target.value})} className="w-full mt-1 p-2 border rounded-lg text-sm" /></div>
                    <div><label className="text-xs font-bold text-slate-600">Email</label><input type="email" value={resumeData.email} onChange={e => setResumeData({...resumeData, email: e.target.value})} className="w-full mt-1 p-2 border rounded-lg text-sm" /></div>
                    <div><label className="text-xs font-bold text-slate-600">Phone</label><input type="text" value={resumeData.phone} onChange={e => setResumeData({...resumeData, phone: e.target.value})} className="w-full mt-1 p-2 border rounded-lg text-sm" /></div>
                    <div><label className="text-xs font-bold text-slate-600">Location</label><input type="text" value={resumeData.location} onChange={e => setResumeData({...resumeData, location: e.target.value})} className="w-full mt-1 p-2 border rounded-lg text-sm" /></div>
                  </div>
                )}
              </div>

              {/* Edit Summary */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button onClick={() => toggleSection('summary')} className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                  <h4 className="font-bold text-sm text-slate-900">Professional Summary</h4>
                  {expandedSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedSection === 'summary' && (
                  <div className="p-5 border-t border-slate-200">
                    <textarea value={resumeData.summary} onChange={e => setResumeData({...resumeData, summary: e.target.value})} className="w-full p-3 border rounded-lg text-sm h-32 leading-relaxed" />
                  </div>
                )}
              </div>

              {/* Edit Skills */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button onClick={() => toggleSection('skills')} className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                  <h4 className="font-bold text-sm text-slate-900">Core Competencies & Skills</h4>
                  {expandedSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedSection === 'skills' && (
                  <div className="p-5 border-t border-slate-200">
                    <textarea value={resumeData.skills.join(', ')} onChange={e => setResumeData({...resumeData, skills: e.target.value.split(',').map(s => s.trim())})} className="w-full p-3 border rounded-lg text-sm h-24 leading-relaxed" placeholder="Comma separated skills" />
                  </div>
                )}
              </div>

              {/* Edit Experience */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button onClick={() => toggleSection('exp')} className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                  <h4 className="font-bold text-sm text-slate-900">Experience Bullets</h4>
                  {expandedSection === 'exp' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedSection === 'exp' && (
                  <div className="p-5 border-t border-slate-200 space-y-6">
                    {resumeData.experience.map((exp, expIdx) => (
                      <div key={exp.id} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <input type="text" value={exp.title} onChange={e => { const n = [...resumeData.experience]; n[expIdx].title = e.target.value; setResumeData({...resumeData, experience: n}); }} className="font-bold text-sm bg-transparent border-b border-slate-300 px-1 py-0.5 focus:border-indigo-500 outline-hidden flex-1" />
                          <input type="text" value={exp.company} onChange={e => { const n = [...resumeData.experience]; n[expIdx].company = e.target.value; setResumeData({...resumeData, experience: n}); }} className="text-sm italic bg-transparent border-b border-slate-300 px-1 py-0.5 focus:border-indigo-500 outline-hidden w-1/3" />
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-indigo-200">
                          {exp.bullets.map((b, bIdx) => (
                            <textarea key={bIdx} value={b} onChange={e => updateExperienceBullet(expIdx, bIdx, e.target.value)} className="w-full text-sm p-2 border rounded-lg bg-white" rows={2} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {step === 'edit' && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button onClick={() => setStep('input')} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
              Re-generate
            </button>
            <button onClick={handleDownload} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download ATS PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
