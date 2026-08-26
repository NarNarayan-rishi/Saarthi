import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Upload,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Target,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CAREER_GOALS } from '../../data/mockData';
import { CareerGoalRole, WorkMode } from '../../types';

export const StudentProfile: React.FC = () => {
  const { profile, updateProfile, careerGoal, setCareerGoal } = useApp();
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'career' | 'professional' | 'resume'>('personal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showClearDataModal && deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showClearDataModal, deleteCountdown]);

  const openClearDataModal = () => {
    setDeleteCountdown(5);
    setShowClearDataModal(true);
  };

  // Form states
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    headline: profile.headline,
    bio: profile.bio,
    institution: profile.institution,
    degree: profile.degree,
    branch: profile.branch,
    currentYear: profile.currentYear,
    cgpa: profile.cgpa,
    expectedGraduation: profile.expectedGraduation,
    preferredJobRole: profile.preferredJobRole,
    preferredLocation: profile.preferredLocation,
    preferredWorkMode: profile.preferredWorkMode,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSimulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateProfile({ resumeFileName: file.name });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      
      {/* Profile Header Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-50 border-2 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-['Outfit'] text-2xl font-extrabold text-slate-900">
                {profile.name}
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-indigo-600 mt-0.5">
              {profile.headline}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {profile.institution} • {profile.degree} in {profile.branch} (CGPA: {profile.cgpa})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Saved successfully!
            </span>
          )}
          <button
            id="btn-save-profile"
            onClick={handleSave}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-indigo-200 flex items-center justify-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'academic', label: 'Academic & Education', icon: GraduationCap },
          { id: 'career', label: 'Career Preferences', icon: Target },
          { id: 'professional', label: 'Projects & Credentials', icon: Award },
          { id: 'resume', label: 'Resume & Documents', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
              Personal Information
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Contact and personal bio details visible on applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Location
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. Mumbai, MH"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            try {
                              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
                              const data = await res.json();
                              const city = data.address.city || data.address.town || data.address.state || 'Unknown Location';
                              handleInputChange('location', city);
                              updateProfile({ location: city });
                              alert(`Location detected as ${city} and updated automatically!`);
                            } catch (e) {
                              console.error(e);
                              alert('Could not determine location name.');
                            }
                          },
                          (err) => {
                            alert('Location permission denied or unavailable.');
                          }
                        );
                      } else {
                        alert('Geolocation is not supported by this browser.');
                      }
                    }}
                    className="p-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl border border-indigo-200 font-bold transition-colors cursor-pointer flex-shrink-0 flex items-center justify-center group relative"
                    title="Detect Current Location"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Detect Location</span>
                  </button>
                </div>
              </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Professional Headline
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              About Bio
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Academic & Education */}
      {activeTab === 'academic' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
              Academic Information
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              University background and verified academic standing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Institution / University
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Degree Program
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Branch / Major
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => handleInputChange('branch', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Year of Study
              </label>
              <input
                type="text"
                value={formData.currentYear}
                onChange={(e) => handleInputChange('currentYear', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Cumulative GPA / Percentage
              </label>
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) => handleInputChange('cgpa', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Expected Graduation
              </label>
              <input
                type="text"
                value={formData.expectedGraduation}
                onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Career Preferences */}
      {activeTab === 'career' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
              Career Information & Preferences
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Determines your skill gaps, recommendations, and employer matches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Target Career Goal
              </label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value as CareerGoalRole)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {CAREER_GOALS.map((g) => (
                  <option key={g.role} value={g.role}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Preferred Work Mode
              </label>
              <select
                value={formData.preferredWorkMode}
                onChange={(e) => handleInputChange('preferredWorkMode', e.target.value as WorkMode)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Preferred Role Title
              </label>
              <input
                type="text"
                value={formData.preferredJobRole}
                onChange={(e) => handleInputChange('preferredJobRole', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Preferred Location
              </label>
              <input
                type="text"
                value={formData.preferredLocation}
                onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Projects & Professional Credentials */}
      {activeTab === 'professional' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Projects */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                  Featured Projects ({profile.projects.length})
                </h3>
                <p className="text-xs text-slate-600">
                  Showcase code repositories and live demonstrations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{proj.title}</h4>
                    <span className="text-[11px] text-slate-600">{proj.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((t) => (
                      <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline pt-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{proj.githubUrl}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Internships */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                Certifications ({profile.certifications.length})
              </h3>
              <div className="space-y-3">
                {profile.certifications.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.title}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{c.issuer} • Issued {c.issueDate}</p>
                    {c.credentialId && <p className="text-slate-600 font-mono text-[11px]">ID: {c.credentialId}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                Prior Internships ({profile.internships.length})
              </h3>
              <div className="space-y-3">
                {profile.internships.map((exp) => (
                  <div key={exp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <p className="text-indigo-600 font-semibold">{exp.company} • {exp.duration}</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Resume & Documents */}
      {activeTab === 'resume' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
              Resume & Documents
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Manage your default resume attached to all campus and corporate applications
            </p>
          </div>

          {/* Current Attached Resume */}
          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{profile.resumeFileName}</p>
                <p className="text-xs text-slate-600">Updated August 2026 • 248 KB • PDF</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Default
              </span>
            </div>
          </div>

          {/* Upload New Resume Box */}
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
            <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-slate-900">Upload Updated Resume</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              Drag and drop your updated PDF or DOCX resume here, or click to browse files.
            </p>
            <label className="mt-4 inline-block px-5 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors">
              <span>Select File</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleSimulateResumeUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Clear Data Section */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col items-center justify-center pb-12">
        <button
          onClick={openClearDataModal}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold transition-colors shadow-sm cursor-pointer"
        >
          <Trash2 className="w-5 h-5" />
          Clear All Data
        </button>
        <p className="text-xs text-slate-500 mt-2 max-w-sm text-center">
          Warning: This action will permanently erase all your application progress and reset your portal to its default state.
        </p>
      </div>

      {/* Clear Data Confirmation Modal */}
      {showClearDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-rose-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Clear All Data?</h2>
            <p className="text-slate-600 text-center mb-6 text-sm">
              Warning: This action is irreversible. All your profile data, job applications, assessment scores, and career progress will be permanently deleted.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearDataModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleteCountdown > 0}
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all ${
                  deleteCountdown > 0 
                    ? 'bg-rose-300 cursor-not-allowed' 
                    : 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 cursor-pointer'
                }`}
              >
                {deleteCountdown > 0 ? `Yes, Delete (${deleteCountdown}s)` : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
