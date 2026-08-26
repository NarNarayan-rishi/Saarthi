import React, { useState } from 'react';
import {
  Users2,
  Briefcase,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  PlusCircle,
  Award,
  Video,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  FileText,
  UserCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RecruiterCandidate, RecruiterJobPosting, InterviewSchedule } from '../../types';
import { JobWorkspace } from '../../components/JobWorkspace';
import { RecruiterMessageModal } from '../../components/RecruiterMessageModal';
import { MessageSquare } from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const {
    recruiterProfile,
    recruiterCandidates,
    recruiterJobs,
    interviewSchedules,
    toggleShortlistCandidate,
    createJobPosting,
    updateJobStatus,
    scheduleCandidateInterview,
    activeTab,
    setActiveTab,
    updateRecruiterProfile,
  } = useApp();

  // Tab Filtering & Local States
  const [candidateSearch, setCandidateSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [minReadiness, setMinReadiness] = useState<number>(0);
  const [shortlistedOnly, setShortlistedOnly] = useState(false);

  // Modals
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<RecruiterCandidate | null>(null);
  const [candidateToScheduleInterview, setCandidateToScheduleInterview] = useState<RecruiterCandidate | null>(null);
  const [messagingCandidate, setMessagingCandidate] = useState<RecruiterCandidate | null>(null);
  const [viewingApplicantsForJob, setViewingApplicantsForJob] = useState<any>(null);

  // Job Posting Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobOpenings, setJobOpenings] = useState('');
  const [jobType, setJobType] = useState<RecruiterJobPosting['type']>('Full-time');
  const [jobWorkMode, setJobWorkMode] = useState<RecruiterJobPosting['workMode']>('Remote');
  const [jobLocation, setJobLocation] = useState('');
  const [jobNationality, setJobNationality] = useState('');
  const [jobCompType, setJobCompType] = useState<'Salary' | 'Stipend'>('Salary');
  const [jobCurrency, setJobCurrency] = useState('USD');
  const [jobSalary, setJobSalary] = useState('');
  const [jobSkills, setJobSkills] = useState('React, TypeScript, Node.js, Cloud');
  const [jobDesc, setJobDesc] = useState('');

  // Interview Schedule Form State
  const [intDate, setIntDate] = useState('2026-03-05');
  const [intTime, setIntTime] = useState('11:00 AM PST');
  const [intFormat, setIntFormat] = useState<InterviewSchedule['format']>('Technical Round');
  const [intMeetLink, setIntMeetLink] = useState('https://meet.google.com/xyz-next-prep');
  const [intNotes, setIntNotes] = useState('Focus on system architecture, API state caching, and live code pair.');

  // Calculation Metrics
  const totalJobReady = recruiterCandidates.filter((c) => c.jobReadinessScore >= 75).length;
  const activeJobsCount = recruiterJobs.filter((j) => j.status === 'Active').length;
  const totalApplicantsCount = recruiterJobs.reduce((acc, j) => acc + j.applicantsCount, 0);
  const shortlistedCount = recruiterCandidates.filter((c) => c.shortlisted).length;
  const upcomingInterviewsCount = interviewSchedules.length;

  // Filtered Candidates
  const filteredCandidates = recruiterCandidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.careerGoal.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.skills.some((s) => s.name.toLowerCase().includes(candidateSearch.toLowerCase()));
    const matchesRole = roleFilter === 'All' || c.careerGoal.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesScore = c.jobReadinessScore >= minReadiness;
    const matchesShortlist = !shortlistedOnly || c.shortlisted;
    return matchesSearch && matchesRole && matchesScore && matchesShortlist;
  });

  // Handlers
  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;

    createJobPosting({
      title: jobTitle,
      company: recruiterProfile.companyName || 'Apex Technologies',
      companyLogo: recruiterProfile.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      type: jobType,
      openings: parseInt(jobOpenings) || undefined,
      workMode: jobWorkMode,
      location: jobWorkMode === 'Remote' ? `Remote (${jobNationality || 'Global'})` : jobLocation,
      salary: `${jobCurrency} ${jobSalary} (${jobCompType})`,
      requiredSkills: jobSkills.split(',').map((s) => s.trim()).filter(Boolean),
      requirements: ['Proven project experience in core stack', 'Strong analytical & problem solving skills', 'Team collaboration attitude'],
      description: jobDesc || 'Exciting opportunity for high-performing graduates.',
      deadline: '2026-04-30',
      status: 'Active',
    });

    setJobTitle('');
    setJobOpenings('');
    setJobDesc('');
    setShowPostJobModal(false);
  };

  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateToScheduleInterview) return;

    scheduleCandidateInterview({
      candidateId: candidateToScheduleInterview.id,
      candidateName: candidateToScheduleInterview.name,
      candidateAvatar: candidateToScheduleInterview.avatar,
      candidateRole: candidateToScheduleInterview.careerGoal,
      jobTitle: candidateToScheduleInterview.careerGoal,
      date: intDate,
      time: intTime,
      format: intFormat,
      interviewerName: recruiterProfile.name,
      meetLink: intMeetLink,
      notes: intNotes,
      status: 'Upcoming',
    });

    setCandidateToScheduleInterview(null);
  };

  if (viewingApplicantsForJob) {
    return <JobWorkspace job={viewingApplicantsForJob} onBack={() => setViewingApplicantsForJob(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Recruiter Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-amber-600/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Talent Sourcing & Recruitment Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
              Welcome back, {recruiterProfile.name}
            </h1>
            <p className="text-sm text-slate-300">
              {recruiterProfile.role} at <strong className="text-amber-300">{recruiterProfile.companyName}</strong>
            </p>
            <p className="text-xs text-slate-400">
              Industry: <span className="text-slate-200 font-medium">{recruiterProfile.industry}</span> • Location: <span className="text-slate-200 font-medium">{recruiterProfile.location}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-recruiter-post-job"
              onClick={() => setShowPostJobModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
            <button
              onClick={() => setActiveTab('find_students')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Verified Candidates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Recruiter Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Recruiter Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Job-Ready Talent
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-['Outfit']">{totalJobReady}</p>
                <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
                  Score ≥ 75% verified
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Openings
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-['Outfit']">{activeJobsCount}</p>
                <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">
                  {totalApplicantsCount} Total Applicants
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Shortlisted
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-['Outfit']">{shortlistedCount}</p>
                <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">
                  Flagged for pipeline
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Interviews Scheduled
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-['Outfit']">{upcomingInterviewsCount}</p>
                <span className="text-[11px] text-purple-600 font-medium mt-0.5 block">
                  Upcoming rounds
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bento Grid: Candidate Sourcing & Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8 cols): Top Candidate Matches */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-base">Top Recommended Candidate Matches</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('talent_pool')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <span>View Talent Pool</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {recruiterCandidates.slice(0, 4).map((cand) => (
                    <div
                      key={cand.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img src={cand.avatar} alt={cand.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{cand.name}</h4>
                            <p className="text-xs text-slate-500">{cand.careerGoal}</p>
                            <p className="text-[10px] text-slate-400">{cand.college} • {cand.graduationYear}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleShortlistCandidate(cand.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            cand.shortlisted
                              ? 'bg-amber-50 border-amber-300 text-amber-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${cand.shortlisted ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {cand.skills.slice(0, 3).map((sk) => (
                          <span key={sk.name} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {sk.name} ({sk.level}%)
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600">{cand.jobReadinessScore}% Match</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCandidateForDetail(cand)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setCandidateToScheduleInterview(cand)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-xs"
                          >
                            Interview
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Job Postings */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-base">Active Company Job Postings</h3>
                  </div>
                  <button
                    onClick={() => setShowPostJobModal(true)}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    + Post New Role
                  </button>
                </div>

                <div className="space-y-3">
                  {recruiterJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                            {job.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {job.location} • {job.salary} • {job.workMode}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1">
                          <span>Deadline: <strong>{job.deadline}</strong></span>
                          <span>•</span>
                          <button 
                            onClick={() => {
                              setViewingApplicantsForJob(job);
                              setActiveTab('find_students');
                            }}
                            className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            Applicants: {job.applicantsCount} <span className="text-[9px] uppercase tracking-wider ml-1 bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-500">View</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateJobStatus(job.id, job.status === 'Active' ? 'Closed' : 'Active')
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            job.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                        >
                          {job.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Scheduled Interviews */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-slate-900 text-base">Upcoming Interviews</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {interviewSchedules.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {interviewSchedules.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No interviews scheduled yet.</p>
                  ) : (
                    interviewSchedules.map((intv) => (
                      <div
                        key={intv.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{intv.candidateName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800">
                            {intv.format}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{intv.jobTitle}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>{intv.date} at {intv.time}</span>
                          <a
                            href={intv.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join</span>
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "Find Students" & "Talent Pool" Tab */}
      {(activeTab === 'find_students' || activeTab === 'talent_pool' || activeTab === 'shortlisted') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeTab === 'shortlisted' ? 'Shortlisted Candidates' : 'Campus Talent Search & Filter'}
              </h2>
              <p className="text-xs text-slate-500">
                Discover verified students across engineering domains with validated test assessments and projects.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                placeholder="Search candidate name, skills..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              >
                <option value="All">All Domains</option>
                <option value="Full Stack">Full Stack Developer</option>
                <option value="Frontend">Frontend Specialist</option>
                <option value="Backend">Backend / Cloud</option>
                <option value="Data Science">Data Science / ML</option>
              </select>
            </div>

            <div>
              <select
                value={minReadiness}
                onChange={(e) => setMinReadiness(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              >
                <option value="0">All Readiness Scores</option>
                <option value="70">≥ 70% Readiness</option>
                <option value="80">≥ 80% Readiness (High Match)</option>
                <option value="90">≥ 90% Readiness (Top 5%)</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => setShortlistedOnly(!shortlistedOnly)}
                className={`w-full py-2 px-3.5 rounded-xl border text-xs font-bold transition-all ${
                  shortlistedOnly
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ★ Shortlisted Only
              </button>
            </div>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={cand.avatar} alt={cand.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100" />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{cand.name}</h3>
                        <p className="text-xs text-slate-500">{cand.careerGoal}</p>
                        <p className="text-[10px] text-slate-400">{cand.college} • {cand.graduationYear}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleShortlistCandidate(cand.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        cand.shortlisted
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${cand.shortlisted ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Readiness Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Industry Readiness:</span>
                      <strong className="text-emerald-600 font-bold">{cand.jobReadinessScore}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${cand.jobReadinessScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Verified Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.skills.map((sk) => (
                        <span key={sk.name} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {sk.name} ({sk.level}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCandidateForDetail(cand)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex-1"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setCandidateToScheduleInterview(cand)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex-1 shadow-xs"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Job Postings" Tab */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Company Job Postings & Openings</h2>
              <p className="text-xs text-slate-500">Manage active campus recruitment drives, stipends, and applicant queues.</p>
            </div>
            <button
              onClick={() => setShowPostJobModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
          </div>

          <div className="space-y-3">
            {recruiterJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 space-y-3 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.location} • {job.workMode}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{job.salary}</span>
                </div>

                <p className="text-xs text-slate-600">{job.description}</p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Required Skills:</span>
                    {job.requiredSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setViewingApplicantsForJob(job);
                        setActiveTab('find_students');
                      }}
                      className="font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {job.applicantsCount} Applicants <span className="text-[10px] uppercase tracking-wider ml-1 bg-indigo-50 px-2 py-0.5 rounded text-indigo-500">View All</span>
                    </button>
                    <button
                      onClick={() =>
                        updateJobStatus(job.id, job.status === 'Active' ? 'Closed' : 'Active')
                      }
                      className={`px-3 py-1 rounded-lg font-bold ${
                        job.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {job.status}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Interviews" Tab */}
      {activeTab === 'interviews' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Campus Interview Schedules & Calendar</h2>
            <p className="text-xs text-slate-500">Track scheduled technical, coding pair, and HR interview meetings.</p>
          </div>

          <div className="space-y-3">
            {interviewSchedules.map((intv) => (
              <div
                key={intv.id}
                className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={intv.candidateAvatar} alt={intv.candidateName} className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/20" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{intv.candidateName}</h4>
                    <p className="text-xs text-slate-500">{intv.jobTitle} • {intv.format}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Interviewer: {intv.interviewerName}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 sm:text-right">
                  <div className="flex items-center gap-1.5 sm:justify-end text-xs font-bold text-slate-900">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{intv.date} at {intv.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{intv.notes}</p>
                </div>

                <div>
                  <a
                    href={intv.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Company Profile & Settings" Tab */}
      {(activeTab === 'profile' || activeTab === 'settings') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recruiter & Enterprise Profile</h2>
            <p className="text-xs text-slate-500">Manage company recruitment branding and hiring team details.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center gap-4">
            <img src={recruiterProfile.companyLogo} alt={recruiterProfile.companyName} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{recruiterProfile.companyName}</h3>
              <p className="text-xs text-slate-600">{recruiterProfile.name} • {recruiterProfile.role}</p>
              <p className="text-xs text-amber-800 font-semibold">{recruiterProfile.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Description</label>
              <textarea
                rows={3}
                value={recruiterProfile.aboutCompany}
                onChange={(e) => updateRecruiterProfile({ aboutCompany: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Careers Website</label>
                <input
                  type="text"
                  value={recruiterProfile.companyWebsite}
                  onChange={(e) => updateRecruiterProfile({ companyWebsite: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headquarters</label>
                <input
                  type="text"
                  value={recruiterProfile.location}
                  onChange={(e) => updateRecruiterProfile({ location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Create Campus Job Opening</h3>
              <button onClick={() => setShowPostJobModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJobSubmit} className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Role Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Associate Full Stack Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. of Openings</label>
                  <input
                    type="number"
                    min="1"
                    value={jobOpenings}
                    onChange={(e) => setJobOpenings(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as RecruiterJobPosting['type'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={jobWorkMode}
                    onChange={(e) => {
                      setJobWorkMode(e.target.value as any);
                      setJobLocation('');
                      setJobNationality('');
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                {jobWorkMode === 'Remote' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Allowed Nationalities (e.g. US Only, Global, India)</label>
                    <input
                      type="text"
                      value={jobNationality}
                      onChange={(e) => setJobNationality(e.target.value)}
                      placeholder="Specify which nationality people can apply..."
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Work Location</label>
                    <input
                      type="text"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      placeholder={jobWorkMode === 'Hybrid' ? "e.g. New York (3 days office, 2 days remote)" : "e.g. San Francisco Office"}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Compensation Type</label>
                    <select
                      value={jobCompType}
                      onChange={(e) => setJobCompType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                    >
                      <option value="Salary">Salary</option>
                      <option value="Stipend">Stipend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                    <select
                      value={jobCurrency}
                      onChange={(e) => setJobCurrency(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="ZAR">ZAR - South African Rand</option>
                      <option value="BRL">BRL - Brazilian Real</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary/Stipend Amount</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g. 100,000 / yr or 5,000 / mo"
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Describe day-to-day responsibilities, stack requirements, and culture..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {candidateToScheduleInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Schedule Candidate Interview</h3>
              <button onClick={() => setCandidateToScheduleInterview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center gap-3">
              <img src={candidateToScheduleInterview.avatar} alt={candidateToScheduleInterview.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{candidateToScheduleInterview.name}</h4>
                <p className="text-[11px] text-slate-500">{candidateToScheduleInterview.careerGoal} • {candidateToScheduleInterview.jobReadinessScore}% Ready</p>
              </div>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={intTime}
                    onChange={(e) => setIntTime(e.target.value)}
                    placeholder="11:00 AM PST"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interview Format</label>
                <select
                  value={intFormat}
                  onChange={(e) => setIntFormat(e.target.value as InterviewSchedule['format'])}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                >
                  <option value="Technical Round">Technical Round & Coding</option>
                  <option value="System Design">System Design Architecture</option>
                  <option value="HR Round">HR & Behavioral Fit</option>
                  <option value="Cultural Fit">Cultural Fit & Team Pair</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link</label>
                <input
                  type="url"
                  required
                  value={intMeetLink}
                  onChange={(e) => setIntMeetLink(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Focus Notes</label>
                <input
                  type="text"
                  value={intNotes}
                  onChange={(e) => setIntNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCandidateToScheduleInterview(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Confirm & Dispatch Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Profile Drawer */}
      {selectedCandidateForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidateForDetail.avatar}
                  alt={selectedCandidateForDetail.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/20"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedCandidateForDetail.name}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedCandidateForDetail.college} • {selectedCandidateForDetail.degree} ({selectedCandidateForDetail.graduationYear})
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidateForDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 rounded-xl text-center">
                <span className="text-[10px] text-emerald-800 block uppercase font-bold">Readiness Score</span>
                <span className="text-lg font-extrabold text-emerald-700">{selectedCandidateForDetail.jobReadinessScore}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Career Target</span>
                <span className="text-xs font-bold text-slate-800">{selectedCandidateForDetail.careerGoal}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Shortlisted</span>
                <span className="text-xs font-bold text-slate-800">{selectedCandidateForDetail.shortlisted ? 'Yes ★' : 'No'}</span>
              </div>
            </div>

            {/* Verified Projects */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Verified Projects</h4>
              <div className="space-y-2">
                {selectedCandidateForDetail.projects.map((proj) => (
                  <div key={proj.title} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{proj.title}</span>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1">
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCandidateForDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setCandidateToScheduleInterview(selectedCandidateForDetail);
                  setSelectedCandidateForDetail(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Schedule Interview Now
              </button>
            </div>
          </div>
        </div>
      )}
      {messagingCandidate && (
        <RecruiterMessageModal candidate={messagingCandidate} onClose={() => setMessagingCandidate(null)} />
      )}
    </div>
  );
};
