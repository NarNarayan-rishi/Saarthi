import React, { useState, useRef } from 'react';
import { GraduationCap, Plus, Search, LayoutGrid, List, FileCheck, Upload, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Skill, SkillCategory } from '../../types';
import { CertificateModal } from '../../components/CertificateModal';

export const MySkillsPage: React.FC = () => {
  const { profile, addSkill, removeSkill } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'Verified' | 'Self-Rated' | 'With-Cert'>('All');
  const [sortBy, setSortBy] = useState<'proficiency-desc' | 'proficiency-asc' | 'name' | 'recent'>('proficiency-desc');
  const [viewLayout, setViewLayout] = useState<'tiles' | 'compact'>('tiles');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkillForCertificate, setSelectedSkillForCertificate] = useState<Skill | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Technical');
  const [newCourseId, setNewCourseId] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; dataUrl: string; } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: string[] = ['All', 'Technical', 'Data & AI', 'Web & Cloud', 'Soft Skills', 'Aptitude'];
  const totalSkills = profile.skills.length;
  const verifiedSkills = profile.skills.filter((s) => s.verified).length;
  const certifiedSkillsCount = profile.skills.filter((s) => s.certificateDataUrl || s.certificateName).length;
  
  // Exclude untested skills (proficiency 0) from average
  const testedSkills = profile.skills.filter(s => s.proficiency > 0);
  const avgProficiency = testedSkills.length > 0
      ? Math.round(testedSkills.reduce((acc, s) => acc + s.proficiency, 0) / testedSkills.length)
      : 0;

  let filteredSkills = profile.skills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesVerification = verificationFilter === 'All' ? true : verificationFilter === 'Verified' ? s.verified : verificationFilter === 'With-Cert' ? Boolean(s.certificateDataUrl) : !s.verified;
    return matchesSearch && matchesCategory && matchesVerification;
  });

  filteredSkills.sort((a, b) => {
    if (sortBy === 'proficiency-desc') return b.proficiency - a.proficiency;
    if (sortBy === 'proficiency-asc') return a.proficiency - b.proficiency;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedFile({ name: file.name, type: file.type || 'image/png', dataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: 0, // Default to 0 (Take Test) until they take an assessment
      verified: Boolean(uploadedFile || newCourseId.trim()),
      courseId: newCourseId.trim() || undefined,
      certificateName: uploadedFile ? uploadedFile.name : undefined,
      certificateDataUrl: uploadedFile ? uploadedFile.dataUrl : undefined,
      certificateType: uploadedFile?.type.includes('pdf') ? 'pdf' : uploadedFile ? 'image' : undefined,
      certificateUploadDate: uploadedFile ? new Date().toISOString().split('T')[0] : undefined,
      certificateIssuer: newIssuer.trim() || undefined,
      lastAssessed: new Date().toISOString().split('T')[0],
    });

    setNewSkillName(''); setNewCourseId(''); setNewIssuer(''); setUploadedFile(null); setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
      
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              My Skills &amp; Credentials
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Manage your technical competencies, take assessments, and archive certificates.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button onClick={() => setShowAddModal(true)} className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> <span>Add Skill</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 mt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Tracked Skills</span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-white mt-0.5 block">{totalSkills}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verified</span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5 block">{verifiedSkills}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Certificates</span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-amber-300 mt-0.5 block">{certifiedSkillsCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Average Mastery</span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-indigo-300 mt-0.5 block">{avgProficiency}%</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-slate-500 font-medium shrink-0">Sort:</span>
             <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
               <option value="proficiency-desc">Highest Proficiency</option>
               <option value="proficiency-asc">Lowest Proficiency</option>
               <option value="name">Alphabetical (A-Z)</option>
             </select>
          </div>
        </div>
      </section>

      {/* Main Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm bg-white rounded-3xl border border-slate-200">No skills found. Add a skill to get started!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <div key={skill.name} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{skill.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{skill.category}</span>
                </div>
                {/* Take Test or Display Score */}
                {skill.proficiency > 0 ? (
                  <div className="bg-indigo-50 text-indigo-700 font-black text-sm px-3 py-1.5 rounded-lg border border-indigo-100">
                    {skill.proficiency}%
                  </div>
                ) : (
                  <button onClick={() => alert('Starting Assessment for ' + skill.name)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition-colors">
                    Take Test
                  </button>
                )}
              </div>

              {skill.certificateDataUrl && (
                <button onClick={() => setSelectedSkillForCertificate(skill)} className="text-xs text-indigo-600 font-bold hover:underline mb-2 block">
                  View Certificate
                </button>
              )}

              <button onClick={() => removeSkill(skill.name)} className="text-[10px] text-red-500 font-bold hover:underline absolute bottom-4 right-5">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal (Slider Removed Completely) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-slate-900">Add Skill</h3>
                <p className="text-xs text-slate-500">Enter skill details and optional certificate.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Name of the Skill *</label>
                <input required value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Domain Category</label>
                <select value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Upload Certificate (Optional)</label>
                <input type="file" ref={fileInputRef} accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="hidden" />
                <div onClick={() => fileInputRef.current?.click()} className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center cursor-pointer hover:bg-slate-50">
                  {uploadedFile ? <p className="font-bold text-emerald-600">Attached: {uploadedFile.name}</p> : <p className="font-bold text-slate-600">Click to attach file</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSkillForCertificate && <CertificateModal skill={selectedSkillForCertificate} profile={profile} onClose={() => setSelectedSkillForCertificate(null)} />}
    </div>
  );
};
