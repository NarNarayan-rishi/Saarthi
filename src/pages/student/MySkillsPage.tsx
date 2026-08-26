import React, { useState, useRef } from 'react';
import {
  Award,
  Plus,
  CheckCircle2,
  Sparkles,
  Filter,
  Search,
  BookOpen,
  TrendingUp,
  BarChart3,
  Check,
  Brain,
  Database,
  Code2,
  Cloud,
  Shield,
  Palette,
  ExternalLink,
  GraduationCap,
  Calendar,
  Zap,
  FileText,
  Download,
  Trash2,
  Upload,
  Paperclip,
  Eye,
  X,
  LayoutGrid,
  List,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Skill, SkillCategory, CareerGoalRole } from '../../types';
import { CAREER_GOALS } from '../../data/mockData';
import { CertificateModal } from '../../components/CertificateModal';

export const MySkillsPage: React.FC = () => {
  const {
    profile,
    addSkill,
    updateSkill,
    updateSkillFull,
    removeSkill,
    setActiveTab,
    comprehensiveResultsByRole,
    startComprehensiveRoleTest,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'Verified' | 'Self-Rated' | 'With-Cert'>('All');
  const [sortBy, setSortBy] = useState<'proficiency-desc' | 'proficiency-asc' | 'name' | 'recent'>('proficiency-desc');
  const [viewLayout, setViewLayout] = useState<'tiles' | 'compact'>('tiles');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkillForCertificate, setSelectedSkillForCertificate] = useState<Skill | null>(null);
  
  // Add Skill Form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Technical');
  const [newSkillProficiency, setNewSkillProficiency] = useState(75);
  const [newCourseId, setNewCourseId] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    type: string;
    dataUrl: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: string[] = ['All', 'Technical', 'Data & AI', 'Web & Cloud', 'Soft Skills', 'Aptitude'];

  // Global skill statistics
  const totalSkills = profile.skills.length;
  const verifiedSkills = profile.skills.filter((s) => s.verified).length;
  const certifiedSkillsCount = profile.skills.filter((s) => s.certificateDataUrl || s.certificateName).length;
  const avgProficiency =
    totalSkills > 0
      ? Math.round(profile.skills.reduce((acc, s) => acc + s.proficiency, 0) / totalSkills)
      : 0;

  // Filter & Search
  let filteredSkills = profile.skills.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.courseId && s.courseId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesVerification =
      verificationFilter === 'All'
        ? true
        : verificationFilter === 'Verified'
        ? s.verified
        : verificationFilter === 'With-Cert'
        ? Boolean(s.certificateDataUrl || s.certificateName)
        : !s.verified;
    return matchesSearch && matchesCategory && matchesVerification;
  });

  // Sort
  filteredSkills.sort((a, b) => {
    if (sortBy === 'proficiency-desc') return b.proficiency - a.proficiency;
    if (sortBy === 'proficiency-asc') return a.proficiency - b.proficiency;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'recent') {
      return (b.lastAssessed || '').localeCompare(a.lastAssessed || '');
    }
    return 0;
  });

  // Completed role assessments
  const completedRoleAssessments = Object.entries(comprehensiveResultsByRole || {})
    .filter(([_, res]) => Boolean(res))
    .map(([roleKey, res]) => ({
      role: roleKey as CareerGoalRole,
      result: res!,
    }));

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: Number(newSkillProficiency),
      verified: Boolean(uploadedFile || newCourseId.trim()),
      courseId: newCourseId.trim() || undefined,
      certificateName: uploadedFile ? uploadedFile.name : undefined,
      certificateDataUrl: uploadedFile ? uploadedFile.dataUrl : undefined,
      certificateType: uploadedFile?.type.includes('pdf') ? 'pdf' : uploadedFile ? 'image' : undefined,
      certificateUploadDate: uploadedFile ? new Date().toISOString().split('T')[0] : undefined,
      certificateIssuer: newIssuer.trim() || (uploadedFile ? profile.institution || 'Saarthi Career Academy' : undefined),
      lastAssessed: new Date().toISOString().split('T')[0],
    });

    // Reset Form
    setNewSkillName('');
    setNewCourseId('');
    setNewIssuer('');
    setNewSkillProficiency(75);
    setUploadedFile(null);
    setShowAddModal(false);
  };

  const getProficiencyTier = (val: number) => {
    if (val >= 85) return { label: 'Expert', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 70) return { label: 'Proficient', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (val >= 50) return { label: 'Intermediate', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    return { label: 'Foundational', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto font-['Plus_Jakarta_Sans']">
      
      {/* 1. Global Skills Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-indigo-200">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>Digital Credentials &amp; Verified Skill Inventory</span>
            </div>
            
            <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              My Skills &amp; Credentials Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Manage your technical competencies, track standardized assessment ratings, and archive course completion certificates in PDF format for recruiter verification.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              id="btn-add-skill-open-modal"
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill &amp; Upload Certificate</span>
            </button>
          </div>
        </div>

        {/* Global Summary Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 mt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Tracked Skills
            </span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-white mt-0.5 block">
              {totalSkills}
            </span>
            <span className="text-[11px] text-indigo-200 mt-1 block">
              Across {categories.length - 1} domains
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Verified Skills
            </span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5 block">
              {verifiedSkills}
            </span>
            <span className="text-[11px] text-emerald-200 mt-1 block">
              {Math.round((verifiedSkills / (totalSkills || 1)) * 100)}% verification rate
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Archived Certificates
            </span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-amber-300 mt-0.5 block">
              {certifiedSkillsCount}
            </span>
            <span className="text-[11px] text-amber-200 mt-1 block">
              PDF Documents Saved
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Average Mastery
            </span>
            <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold text-indigo-300 mt-0.5 block">
              {avgProficiency}%
            </span>
            <span className="text-[11px] text-indigo-200 mt-1 block">
              Cumulative score
            </span>
          </div>
        </div>
      </section>

      {/* 2. Global Skills Filter, Search & Layout Switcher */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-skills"
              type="text"
              placeholder="Search skills by name, domain, or Course ID (e.g., CS-PY-101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Verification Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium shrink-0">Filter:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'All', label: 'All' },
                { id: 'Verified', label: 'Verified' },
                { id: 'With-Cert', label: 'With Certificate' },
                { id: 'Self-Rated', label: 'Self-Rated' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVerificationFilter(v.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    verificationFilter === v.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="proficiency-desc">Highest Proficiency</option>
              <option value="proficiency-asc">Lowest Proficiency</option>
              <option value="name">Alphabetical (A-Z)</option>
              <option value="recent">Recently Assessed</option>
            </select>
          </div>

          {/* Layout Switcher (Tiles vs Compact) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewLayout('tiles')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'tiles' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tile Style Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('compact')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'compact' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Categories Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Add Skill & Certificate Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-slate-900">
                    Add Skill &amp; Upload Certificate
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter skill details, course ID, and store your certificate as PDF.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="space-y-4 text-xs">
              
              {/* Skill Name */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Name of the Skill <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-add-skill-name"
                  type="text"
                  required
                  placeholder="e.g. Machine Learning, React.js, Kubernetes, PostgreSQL"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Category & Course ID (2 Cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Domain Category
                  </label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Data & AI">Data &amp; AI</option>
                    <option value="Web & Cloud">Web &amp; Cloud</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Aptitude">Aptitude</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Course ID <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                  </label>
                  <input
                    id="input-add-course-id"
                    type="text"
                    placeholder="e.g. CS-PY-101, AWS-SAA-C03"
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Certificate Issuer */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Issuing Institution / Academy <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford Online, Google Cloud, Meta Academy, Coursera"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Self-Assessed Proficiency Slider */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-slate-700">
                    Self-Assessed Proficiency Level
                  </label>
                  <span className="font-['Outfit'] font-black text-indigo-600 text-sm">
                    {newSkillProficiency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Certificate Upload Dropzone */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Upload Certificate Document (PDF / Image)
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
                      : uploadedFile
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                  }`}
                >
                  {uploadedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                            {uploadedFile.name}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            Ready to archive as PDF credential
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">
                          Drag and drop your Certificate here, or <span className="text-indigo-600 underline">Browse</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Supports PDF, PNG, JPG files. Stored permanently for instant PDF viewing.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-add-skill"
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
                >
                  Save Skill &amp; Certificate
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. Certificate Viewer Modal */}
      {selectedSkillForCertificate && (
        <CertificateModal
          skill={selectedSkillForCertificate}
          profile={profile}
          onClose={() => setSelectedSkillForCertificate(null)}
        />
      )}

    </div>
  );
};
