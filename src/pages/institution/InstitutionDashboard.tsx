import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users2,
  BarChart3,
  TrendingDown,
  Target,
  Building2,
  Flame,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Download,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  BookOpen,
  DollarSign,
  Layers,
  Zap,
  Landmark,
  FileText,
  Percent,
  Check,
  Send,
  X,
  RefreshCw,
  Eye,
  Sliders,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlacementDrive, InstitutionalStudent, InstitutionalSkillMetric, InstitutionalReport } from '../../types';
import { triggerInstitutionalReportDownload } from '../../utils/reportDownloader';

export const InstitutionDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    institutionProfile,
    updateInstitutionProfile,
    institutionSkills,
    placementReadiness,
    internshipPlacementStats,
    industryDemandSkills,
    institutionalStudents,
    placementDrives,
    addPlacementDrive,
    updatePlacementDrive,
    toggleShortlistDriveCandidate,
    removeCandidateFromDrive,
    triggerSkillBootcamp,
    institutionalReports,
  } = useApp();

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');

  // Modals & Drawers
  const [showNewDriveModal, setShowNewDriveModal] = useState(false);
  const [selectedDriveForView, setSelectedDriveForView] = useState<PlacementDrive | null>(null);
  const [selectedDriveForManage, setSelectedDriveForManage] = useState<PlacementDrive | null>(null);
  const [manageTab, setManageTab] = useState<'candidates' | 'edit'>('candidates');
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'shortlisted'>('all');
  const [candidateSearch, setCandidateSearch] = useState('');

  // Drive Edit Form State in Manage Modal
  const [editRole, setEditRole] = useState('');
  const [editPackage, setEditPackage] = useState('');
  const [editMinCgpa, setEditMinCgpa] = useState(7.0);
  const [editMinSkillScore, setEditMinSkillScore] = useState(70);
  const [editDriveDate, setEditDriveDate] = useState('');
  const [editEligibleBranches, setEditEligibleBranches] = useState('');
  const [editStatus, setEditStatus] = useState<PlacementDrive['status']>('Upcoming');

  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<InstitutionalStudent | null>(null);
  const [selectedSkillForDetail, setSelectedSkillForDetail] = useState<InstitutionalSkillMetric | null>(null);
  const [showReportPreviewModal, setShowReportPreviewModal] = useState<any | null>(null);
  const [bootcampSuccessToast, setBootcampSuccessToast] = useState<string | null>(null);

  // New Placement Drive Form State
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPackage, setNewPackage] = useState('');
  const [newMinCgpa, setNewMinCgpa] = useState(7.5);
  const [newMinSkillScore, setNewMinSkillScore] = useState(75);
  const [newDriveDate, setNewDriveDate] = useState('2026-03-25');
  const [newEligibleBranches, setNewEligibleBranches] = useState('CSE, AI & DS, IT');

  // Institution Profile Settings Form
  const [instName, setInstName] = useState(institutionProfile.name);
  const [instDeanName, setInstDeanName] = useState(institutionProfile.deanName);
  const [instEmail, setInstEmail] = useState(institutionProfile.email);
  const [instNaacGrade, setInstNaacGrade] = useState(institutionProfile.naacGrade);
  const [instNirfRank, setInstNirfRank] = useState(institutionProfile.nirfRank);
  const [isSavedProfile, setIsSavedProfile] = useState(false);

  // Candidate mapping helper for drives
  const getDriveCandidateIds = (drive: PlacementDrive) => {
    if (drive.registeredStudentIds && drive.registeredStudentIds.length > 0) {
      return {
        registeredIds: drive.registeredStudentIds,
        shortlistedIds: drive.shortlistedStudentIds || [],
      };
    }
    // Deterministic fallback for default dataset drives
    if (drive.id === 'drv_01') {
      return {
        registeredIds: ['st_inst_01', 'st_inst_02', 'st_inst_03', 'st_inst_04', 'st_inst_07', 'st_inst_08'],
        shortlistedIds: ['st_inst_01', 'st_inst_02', 'st_inst_07'],
      };
    }
    if (drive.id === 'drv_02') {
      return {
        registeredIds: ['st_inst_01', 'st_inst_03', 'st_inst_04', 'st_inst_05', 'st_inst_08'],
        shortlistedIds: ['st_inst_03', 'st_inst_08'],
      };
    }
    if (drive.id === 'drv_03') {
      return {
        registeredIds: ['st_inst_01', 'st_inst_02', 'st_inst_03', 'st_inst_07'],
        shortlistedIds: ['st_inst_02', 'st_inst_07'],
      };
    }
    if (drive.id === 'drv_04') {
      return {
        registeredIds: ['st_inst_01', 'st_inst_02', 'st_inst_07'],
        shortlistedIds: ['st_inst_02', 'st_inst_07'],
      };
    }
    // Generic fallback for any newly scheduled drive
    const eligible = institutionalStudents.filter((s) => (drive.minCgpa ? s.cgpa >= drive.minCgpa : true));
    return {
      registeredIds: eligible.length > 0 ? eligible.map((s) => s.id) : institutionalStudents.slice(0, 5).map((s) => s.id),
      shortlistedIds: [],
    };
  };

  const openManageDriveModal = (drive: PlacementDrive) => {
    const currentDrive = placementDrives.find((d) => d.id === drive.id) || drive;
    setSelectedDriveForManage(currentDrive);
    setEditRole(currentDrive.role);
    setEditPackage(currentDrive.ctcPackage);
    setEditMinCgpa(currentDrive.minCgpa);
    setEditMinSkillScore(currentDrive.minSkillScore);
    setEditDriveDate(currentDrive.driveDate);
    setEditEligibleBranches(currentDrive.eligibleBranches.join(', '));
    setEditStatus(currentDrive.status);
    setManageTab('candidates');
    setCandidateFilter('all');
    setCandidateSearch('');
  };

  const handleToggleShortlist = (driveId: string, studentId: string) => {
    const drive = placementDrives.find((d) => d.id === driveId);
    if (!drive) return;
    const { registeredIds, shortlistedIds } = getDriveCandidateIds(drive);
    const isShortlisted = shortlistedIds.includes(studentId);
    const nextShortlisted = isShortlisted
      ? shortlistedIds.filter((id) => id !== studentId)
      : [...shortlistedIds, studentId];

    updatePlacementDrive(driveId, {
      registeredStudentIds: registeredIds,
      shortlistedStudentIds: nextShortlisted,
      shortlistedCount: nextShortlisted.length,
    });

    const student = institutionalStudents.find((s) => s.id === studentId);
    const studentName = student ? student.name : 'Candidate';
    if (!isShortlisted) {
      setBootcampSuccessToast(`${studentName} has been SHORTLISTED for ${drive.company} (${drive.role}).`);
    } else {
      setBootcampSuccessToast(`${studentName} removed from shortlist for ${drive.company}.`);
    }
    setTimeout(() => setBootcampSuccessToast(null), 3500);
  };

  const handleRemoveCandidate = (driveId: string, studentId: string) => {
    const drive = placementDrives.find((d) => d.id === driveId);
    if (!drive) return;
    const { registeredIds, shortlistedIds } = getDriveCandidateIds(drive);
    const nextRegistered = registeredIds.filter((id) => id !== studentId);
    const nextShortlisted = shortlistedIds.filter((id) => id !== studentId);

    updatePlacementDrive(driveId, {
      registeredStudentIds: nextRegistered,
      shortlistedStudentIds: nextShortlisted,
      registeredStudentsCount: nextRegistered.length,
      shortlistedCount: nextShortlisted.length,
    });

    const student = institutionalStudents.find((s) => s.id === studentId);
    const studentName = student ? student.name : 'Candidate';
    setBootcampSuccessToast(`${studentName} removed from registered candidate list for ${drive.company}.`);
    setTimeout(() => setBootcampSuccessToast(null), 3500);
  };

  const handleSaveDriveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriveForManage) return;

    updatePlacementDrive(selectedDriveForManage.id, {
      role: editRole,
      ctcPackage: editPackage,
      minCgpa: Number(editMinCgpa),
      minSkillScore: Number(editMinSkillScore),
      driveDate: editDriveDate,
      eligibleBranches: editEligibleBranches.split(',').map((s) => s.trim()),
      status: editStatus,
    });

    setBootcampSuccessToast(`Drive details updated successfully for ${selectedDriveForManage.company}.`);
    setTimeout(() => setBootcampSuccessToast(null), 3500);
  };

  const handleRescheduleDrive = (newDate: string) => {
    if (!selectedDriveForManage || !newDate) return;
    setEditDriveDate(newDate);
    updatePlacementDrive(selectedDriveForManage.id, {
      driveDate: newDate,
    });
    setBootcampSuccessToast(`Drive with ${selectedDriveForManage.company} rescheduled to ${newDate}.`);
    setTimeout(() => setBootcampSuccessToast(null), 3500);
  };

  const handleUpdateDriveStatus = (newStatus: PlacementDrive['status']) => {
    if (!selectedDriveForManage) return;
    setEditStatus(newStatus);
    updatePlacementDrive(selectedDriveForManage.id, {
      status: newStatus,
    });
    setBootcampSuccessToast(`Drive status updated to "${newStatus}" for ${selectedDriveForManage.company}.`);
    setTimeout(() => setBootcampSuccessToast(null), 3500);
  };

  // Handle Create Drive
  const handleCreateDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole || !newPackage) return;

    addPlacementDrive({
      company: newCompany,
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      role: newRole,
      type: 'Full-time',
      ctcPackage: newPackage,
      minCgpa: Number(newMinCgpa),
      minSkillScore: Number(newMinSkillScore),
      driveDate: newDriveDate,
      eligibleBranches: newEligibleBranches.split(',').map((s) => s.trim()),
      status: 'Upcoming',
    });

    setShowNewDriveModal(false);
    setNewCompany('');
    setNewRole('');
    setNewPackage('');
    setBootcampSuccessToast(`New Placement Drive with ${newCompany} has been scheduled & published.`);
    setTimeout(() => setBootcampSuccessToast(null), 4000);
  };

  // Handle Trigger Bootcamp
  const handleTriggerBootcamp = (skillName: string, dept: string = 'Engineering') => {
    triggerSkillBootcamp(skillName, dept);
    setBootcampSuccessToast(`4-Week Remedial Bootcamp scheduled for "${skillName}". Enrolled eligible students notified.`);
    setTimeout(() => {
      setBootcampSuccessToast(null), 4500;
    });
  };

  // Handle Report Download
  const handleDownloadReport = (report: InstitutionalReport) => {
    const { filename } = triggerInstitutionalReportDownload(
      report,
      institutionProfile,
      internshipPlacementStats,
      institutionSkills
    );
    setBootcampSuccessToast(`Downloaded "${filename}" (${report.fileFormat}) successfully.`);
    setTimeout(() => setBootcampSuccessToast(null), 4000);
  };

  // Save Settings
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitutionProfile({
      name: instName,
      deanName: instDeanName,
      email: instEmail,
      naacGrade: instNaacGrade,
      nirfRank: instNirfRank,
    });
    setIsSavedProfile(true);
    setTimeout(() => setIsSavedProfile(false), 3000);
  };

  // Filtered Students List
  const filteredStudents = institutionalStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.topSkills.some((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (student.placedCompany && student.placedCompany.toLowerCase().includes(studentSearch.toLowerCase()));

    const matchesDept = deptFilter === 'All' || student.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || student.placementStatus === statusFilter;
    const matchesTier = tierFilter === 'All' || student.readinessTier === tierFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesTier;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {bootcampSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-500 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-300">Action Confirmed</p>
            <p className="text-xs text-slate-300">{bootcampSuccessToast}</p>
          </div>
          <button
            onClick={() => setBootcampSuccessToast(null)}
            className="text-slate-400 hover:text-white ml-2 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Institutional Top Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Abstract background decorative shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-inner">
              <Landmark className="w-8 h-8 text-purple-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-['Outfit'] tracking-tight">
                  {institutionProfile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  NAAC {institutionProfile.naacGrade}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  NIRF Rank #{institutionProfile.nirfRank}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
                {institutionProfile.type} • {institutionProfile.campusLocation}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-purple-200/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <strong>{institutionProfile.totalStudents.toLocaleString()}</strong> Enrolled Students
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                  <strong>{institutionProfile.activeInternships}</strong> Active Internships
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <strong>{internshipPlacementStats.partnerCompaniesCount}</strong> Partner Recruiters
                </span>
              </div>
            </div>
          </div>

          {/* Quick Institutional Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowNewDriveModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Drive</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs backdrop-blur flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-300" />
              <span>Accreditation Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'dashboard', label: 'Hub Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Cohort', icon: Users2, count: institutionalStudents.length },
          { id: 'skills', label: 'Skill Analytics', icon: BarChart3 },
          { id: 'gaps', label: 'Skill Gap Alerts', icon: TrendingDown, alert: true },
          { id: 'readiness', label: 'Placement Readiness', icon: Target },
          { id: 'internships', label: 'Internships & Drives', icon: Building2, count: placementDrives.length },
          { id: 'demand', label: 'Industry Demand', icon: Flame },
          { id: 'reports', label: 'Reports & NAAC', icon: FileSpreadsheet },
          { id: 'settings', label: 'Campus Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: HUB OVERVIEW & MACRO KPIs */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Key Metric Hero Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Placement Rate</span>
                <Percent className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {institutionProfile.placementRate}%
              </p>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Target: {institutionProfile.targetPlacementRate}%
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Average CTC</span>
                <DollarSign className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {internshipPlacementStats.avgPackageLPA} LPA
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Highest: {internshipPlacementStats.highestPackageLPA} LPA</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Skill Quotient</span>
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {institutionProfile.averageSkillScore}%
              </p>
              <p className="text-[11px] text-purple-600 font-medium mt-1">Across 8 Domains</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Internships Active</span>
                <Briefcase className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {internshipPlacementStats.internshipsCompleted}
              </p>
              <p className="text-[11px] text-amber-600 font-medium mt-1">Of {internshipPlacementStats.internshipsApplied} Applied</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Partner Recruiters</span>
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {internshipPlacementStats.partnerCompaniesCount}
              </p>
              <p className="text-[11px] text-blue-600 font-medium mt-1">{placementDrives.length} Drives Scheduled</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Critical Gaps</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-extrabold text-rose-600 font-['Outfit']">
                {institutionSkills.filter((s) => s.gapSeverity === 'High Gap').length}
              </p>
              <p className="text-[11px] text-rose-600 font-medium mt-1">Needs Remedial Sync</p>
            </div>
          </div>

          {/* Department Breakdown & Placement Readiness Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Academic Departments */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>Academic Departments & Curriculum Tracks</span>
                  </h3>
                  <p className="text-xs text-slate-500">Live monitoring of department cohort health</p>
                </div>
                <button
                  onClick={() => setActiveTab('students')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Students</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {institutionProfile.departments.map((dept, idx) => {
                  const deptStudents = institutionalStudents.filter((s) => s.department === dept || s.department.includes(dept.split(' ')[0]));
                  const placedCount = deptStudents.filter((s) => s.placementStatus === 'Placed').length;
                  return (
                    <div key={dept} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{dept}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          {deptStudents.length > 0 ? `${deptStudents.length} Students` : 'Active Track'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Cohort Placement:</span>
                        <strong className="text-emerald-700">
                          {deptStudents.length > 0 ? `${Math.round((placedCount / deptStudents.length) * 100)}% Placed` : '78% Avg'}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Placement Readiness Breakdown */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Placement Readiness Distribution</span>
                </h3>
                <p className="text-xs text-slate-500">Student readiness tiers across diagnostic test scores</p>
              </div>

              <div className="space-y-3 pt-1">
                {placementReadiness.map((tier) => (
                  <div key={tier.tier} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{tier.tier}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{tier.studentCount} Students</span>
                        <span className="text-slate-500 font-semibold">({tier.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">{tier.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Gap Hotlist with 1-Click Bootcamp Trigger */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span>Curriculum vs Industry Benchmark Skill Gap Hotlist</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted competencies where student average lags behind industry hiring thresholds
                </p>
              </div>
              <button
                onClick={() => setActiveTab('gaps')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Deep Gap Diagnostics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {institutionSkills.slice(0, 4).map((skill) => (
                <div
                  key={skill.skillName}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{skill.skillName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          skill.gapSeverity === 'High Gap'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : skill.gapSeverity === 'Medium Gap'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {skill.gapSeverity}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Student Avg: <strong>{skill.studentAvg}%</strong></span>
                        <span>Benchmark: <strong>{skill.industryBenchmark}%</strong></span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden flex">
                        <div
                          className="bg-indigo-600 h-full"
                          style={{ width: `${skill.studentAvg}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                      {skill.recommendedIntervention}
                    </p>
                  </div>

                  <button
                    onClick={() => handleTriggerBootcamp(skill.skillName, skill.category)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Launch Bootcamp</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Drives Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Upcoming On-Campus Placement Drives</span>
                </h3>
                <p className="text-xs text-slate-500">Recruiter visits, eligibility criteria and registered candidates</p>
              </div>
              <button
                onClick={() => setShowNewDriveModal(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Drive</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {placementDrives.map((drive) => (
                <div
                  key={drive.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={drive.companyLogo}
                        alt={drive.company}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{drive.company}</h4>
                        <p className="text-xs text-slate-500">{drive.role}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        drive.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : drive.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {drive.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Offered CTC</span>
                      <strong className="text-slate-900 font-bold">{drive.ctcPackage}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Drive Date</span>
                      <strong className="text-slate-900 font-semibold">{drive.driveDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Min CGPA</span>
                      <strong className="text-slate-900 font-semibold">{drive.minCgpa}+</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Registered</span>
                      <strong className="text-indigo-600 font-bold">{drive.registeredStudentsCount} Candidates</strong>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-600">Eligible: </span>
                    {drive.eligibleBranches.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STUDENT COHORT & PERFORMANCE DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-purple-600" />
                  <span>Institutional Student Directory & Placement Tracking</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect candidate readiness scores, skills, placement status and mentor tracking.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200 self-start sm:self-auto">
                Showing {filteredStudents.length} of {institutionalStudents.length} Students
              </span>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search name, roll no, skill, company..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                >
                  <option value="All">All Placement Statuses</option>
                  <option value="Placed">Placed</option>
                  <option value="In Process">In Process</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Opted Out">Opted Out</option>
                </select>
              </div>

              <div>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                >
                  <option value="All">All Readiness Tiers</option>
                  <option value="Ready">Ready (Tier 1)</option>
                  <option value="Needs Development">Needs Development</option>
                  <option value="Not Ready">Not Ready</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Department & Roll</th>
                    <th className="py-3 px-3">CGPA</th>
                    <th className="py-3 px-3">Readiness Score</th>
                    <th className="py-3 px-3">Top Skills</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-[10px] text-slate-400">{student.year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-slate-800 font-semibold">{student.department}</p>
                        <p className="text-[10px] text-slate-400">{student.rollNo}</p>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{student.cgpa}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{student.readinessScore}%</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                student.readinessScore >= 80
                                  ? 'bg-emerald-500'
                                  : student.readinessScore >= 65
                                  ? 'bg-indigo-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${student.readinessScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {student.topSkills.map((s) => (
                            <span
                              key={s.name}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {s.name} ({s.score}%)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            student.placementStatus === 'Placed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : student.placementStatus === 'In Process'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : student.placementStatus === 'Eligible'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {student.placementStatus}
                          {student.placedCompany && ` (${student.placedCompany})`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedStudentForDrawer(student)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SKILL ANALYTICS & CURRICULUM HEALTH */}
      {/* ========================================================= */}
      {activeTab === 'skills' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Institutional Skill Quotient Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive performance audit across key technical, software engineering, and analytical domains.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 px-3 py-1 bg-slate-100 rounded-xl">
                Campus Benchmark: <strong>{institutionProfile.averageSkillScore}% Avg Score</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {institutionSkills.map((metric) => (
                <div
                  key={metric.skillName}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{metric.skillName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Category: {metric.category}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        metric.gapSeverity === 'High Gap'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : metric.gapSeverity === 'Medium Gap'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {metric.gapSeverity} ({metric.gap >= 0 ? `+${metric.gap}%` : `${metric.gap}%`})
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-600">Student Average: <strong>{metric.studentAvg}%</strong></span>
                      <span className="text-slate-600">Industry Required: <strong>{metric.industryBenchmark}%</strong></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex relative">
                      <div
                        className={`h-full ${
                          metric.studentAvg >= metric.industryBenchmark
                            ? 'bg-emerald-500'
                            : metric.studentAvg >= 70
                            ? 'bg-indigo-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${metric.studentAvg}%` }}
                      />
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
                        style={{ left: `${metric.industryBenchmark}%` }}
                        title={`Industry Target: ${metric.industryBenchmark}%`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-slate-500 border-t border-slate-100">
                    <span>Coverage: <strong>{metric.studentsAssessed} students tested</strong></span>
                    <button
                      onClick={() => setSelectedSkillForDetail(metric)}
                      className="text-purple-600 font-bold hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Diagnostics</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SKILL GAP ALERTS & REMEDIAL BOOTCAMPS */}
      {/* ========================================================= */}
      {activeTab === 'gaps' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">
                Institutional Placement Gap Early-Warning System
              </h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                Below are prioritized curriculum deficit zones where upcoming recruiters report high rejection rates during technical rounds. Launching a remedial bootcamp triggers specialized mentoring modules and mock assessments for students in that cohort.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {institutionSkills
              .filter((s) => s.gapSeverity !== 'Benchmark Met')
              .map((skill) => (
                <div
                  key={skill.skillName}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">{skill.skillName}</h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          skill.gapSeverity === 'High Gap'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {skill.gapSeverity} (Deficit: {skill.gap}%)
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Recommended Remedial Action: </strong>
                      {skill.recommendedIntervention}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Tested Cohort: <strong>{skill.studentsAssessed} Students</strong></span>
                      <span>•</span>
                      <span>Average Score: <strong className="text-rose-600">{skill.studentAvg}%</strong> (Target {skill.industryBenchmark}%)</span>
                      <span>•</span>
                      <span>Domain: <strong>{skill.category}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => handleTriggerBootcamp(skill.skillName, skill.category)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Trigger 4-Week Remedial Bootcamp</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: PLACEMENT READINESS */}
      {/* ========================================================= */}
      {activeTab === 'readiness' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Campus-Wide Placement Readiness Calibration</span>
              </h3>
              <p className="text-xs text-slate-500">
                Evaluation based on diagnostic test performance, mentor evaluations, mock interviews, and verified projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {placementReadiness.map((tier) => (
                <div
                  key={tier.tier}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{tier.tier}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {tier.percentage}% of cohort
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
                        {tier.studentCount}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">Students</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
                      />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{tier.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      setTierFilter(tier.tier);
                      setActiveTab('students');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-purple-700 hover:text-purple-900 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Candidates</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: INTERNSHIPS, PLACEMENTS & DRIVES */}
      {/* ========================================================= */}
      {activeTab === 'internships' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Internship Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Internships Applied</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{internshipPlacementStats.internshipsApplied}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{internshipPlacementStats.internshipsCompleted} Successfully Completed</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Students Placed</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{internshipPlacementStats.studentsPlaced}</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">{internshipPlacementStats.placementRate}% Overall Placement Rate</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Average CTC</span>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{internshipPlacementStats.avgPackageLPA} LPA</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Highest: {internshipPlacementStats.highestPackageLPA} LPA</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-medium text-slate-500">Corporate Partners</span>
              <p className="text-2xl font-bold text-purple-600 mt-1">{internshipPlacementStats.partnerCompaniesCount}</p>
              <p className="text-[11px] text-purple-600 mt-0.5">Active Campus Recruiters</p>
            </div>
          </div>

          {/* Drives Manager */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>On-Campus Recruitment Drives & Shortlists</span>
                </h3>
                <p className="text-xs text-slate-500">Manage recruiter schedules, cutoff criteria and candidate registration.</p>
              </div>
              <button
                onClick={() => setShowNewDriveModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Schedule New Drive</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Company & Role</th>
                    <th className="py-3 px-3">Package (CTC)</th>
                    <th className="py-3 px-3">Min CGPA</th>
                    <th className="py-3 px-3">Drive Date</th>
                    <th className="py-3 px-3">Registered / Shortlisted</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {placementDrives.map((drive) => (
                    <tr key={drive.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={drive.companyLogo}
                            alt={drive.company}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{drive.company}</p>
                            <p className="text-[10px] text-slate-500">{drive.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{drive.ctcPackage}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{drive.minCgpa}+</td>
                      <td className="py-3 px-3 text-slate-700">{drive.driveDate}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-indigo-700">{drive.registeredStudentsCount} Registered</span>
                        <span className="text-[10px] text-slate-400 block">{drive.shortlistedCount} Shortlisted</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            drive.status === 'Completed'
                              ? 'bg-slate-100 text-slate-700'
                              : drive.status === 'Registration Closed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : drive.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {drive.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDriveForView(drive)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
                            title="View Drive Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => openManageDriveModal(drive)}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                            title="Manage Candidates & Drive"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Manage</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: INDUSTRY DEMAND & MARKET CALIBRATION */}
      {/* ========================================================= */}
      {activeTab === 'demand' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <span>Live Tech Industry Demand & Curriculum Benchmarks</span>
              </h3>
              <p className="text-xs text-slate-500">
                Calibrate academic curriculum against real-time industry hiring and salary benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industryDemandSkills.map((demand) => (
                <div
                  key={demand.skill}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{demand.skill}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Openings: {demand.hiringOpeningsCount} active</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        demand.gapStatus === 'Critical Gap'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : demand.gapStatus === 'Moderate Gap'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {demand.gapStatus}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>Demand Score:</span>
                      <strong className="text-slate-900">{demand.demandScore}/100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Student Proficiency:</span>
                      <strong className="text-indigo-600">{demand.studentProficiency}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Salary Bracket:</span>
                      <strong className="text-slate-900">{demand.averageSalaryRange}</strong>
                    </div>
                  </div>

                  <div className="text-xs pt-1 text-slate-600">
                    <span className="font-semibold text-slate-800">Top Recruiters: </span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{demand.topHiringCompanies.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: ACCREDITATION & NAAC AUDIT REPORTS */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                <span>Accreditation, NAAC & AICTE Compliance Exports</span>
              </h3>
              <p className="text-xs text-slate-500">
                Instantly generate and download certified institutional audit documents and NIRF placement tables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {institutionalReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                        {report.category}
                      </span>
                      <span className="text-xs text-slate-400">{report.generatedDate}</span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-slate-900">{report.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{report.summary}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Format: <strong>{report.fileFormat}</strong></span>
                      <span>•</span>
                      <span>File Size: <strong>{report.fileSize}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setShowReportPreviewModal(report)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Preview Audit</span>
                    </button>
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 9: CAMPUS PROFILE SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span>Campus Profile & Accreditation Settings</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure institution name, dean contact, and official ranking classifications.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dean / Head of Placements</label>
              <input
                type="text"
                value={instDeanName}
                onChange={(e) => setInstDeanName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Placement Email</label>
              <input
                type="email"
                value={instEmail}
                onChange={(e) => setInstEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NAAC Grade</label>
                <input
                  type="text"
                  value={instNaacGrade}
                  onChange={(e) => setInstNaacGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIRF National Rank</label>
                <input
                  type="number"
                  value={instNirfRank}
                  onChange={(e) => setInstNirfRank(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Save Settings
              </button>
              {isSavedProfile && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: SCHEDULE PLACEMENT DRIVE */}
      {/* ========================================================= */}
      {showNewDriveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-600" />
                <span>Schedule Campus Placement Drive</span>
              </h3>
              <button
                onClick={() => setShowNewDriveModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDriveSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oracle, Microsoft, Cisco"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role Offered</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CTC Package</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18.5 LPA"
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min Cutoff CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="10"
                    required
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Drive Date</label>
                  <input
                    type="date"
                    required
                    value={newDriveDate}
                    onChange={(e) => setNewDriveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eligible Branches</label>
                <input
                  type="text"
                  value={newEligibleBranches}
                  onChange={(e) => setNewEligibleBranches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewDriveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Schedule Drive & Notify Eligible Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: STUDENT INSPECTION DRAWER */}
      {/* ========================================================= */}
      {selectedStudentForDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForDrawer.avatar}
                  alt={selectedStudentForDrawer.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudentForDrawer.name}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedStudentForDrawer.department} • {selectedStudentForDrawer.rollNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForDrawer(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 text-[10px]">CGPA</span>
                <p className="font-bold text-slate-900">{selectedStudentForDrawer.cgpa} / 10</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Year / Batch</span>
                <p className="font-bold text-slate-900">{selectedStudentForDrawer.year}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Readiness Score</span>
                <p className="font-bold text-purple-700">{selectedStudentForDrawer.readinessScore}% ({selectedStudentForDrawer.readinessTier})</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Placement Status</span>
                <p className="font-bold text-emerald-700">
                  {selectedStudentForDrawer.placementStatus}
                  {selectedStudentForDrawer.placedCompany && ` (${selectedStudentForDrawer.placedCompany})`}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1.5">Assessed Top Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentForDrawer.topSkills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-100"
                  >
                    {skill.name} ({skill.score}%)
                  </span>
                ))}
              </div>
            </div>

            {selectedStudentForDrawer.skillGaps.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-1.5">Identified Skill Deficits</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudentForDrawer.skillGaps.map((gap) => (
                    <span
                      key={gap}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-100"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudentForDrawer(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ACCREDITATION REPORT PREVIEW */}
      {/* ========================================================= */}
      {showReportPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                  {showReportPreviewModal.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{showReportPreviewModal.title}</h3>
              </div>
              <button
                onClick={() => setShowReportPreviewModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{showReportPreviewModal.summary}</p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Institution:</span>
                <strong>{institutionProfile.name}</strong>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Audited Cohort:</span>
                <strong>{institutionProfile.totalStudents.toLocaleString()} Enrolled Students</strong>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Overall Placement Rate:</span>
                <strong className="text-emerald-700 font-bold">{institutionProfile.placementRate}%</strong>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Average CTC Package:</span>
                <strong>{internshipPlacementStats.avgPackageLPA} LPA</strong>
              </div>
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Accreditation Classification:</span>
                <strong className="text-purple-700">NAAC {institutionProfile.naacGrade}</strong>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowReportPreviewModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetReport = showReportPreviewModal;
                  setShowReportPreviewModal(null);
                  handleDownloadReport(targetReport);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Official Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: VIEW PLACEMENT DRIVE DETAILS */}
      {/* ========================================================= */}
      {selectedDriveForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDriveForView.companyLogo}
                  alt={selectedDriveForView.company}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">{selectedDriveForView.company}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        selectedDriveForView.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : selectedDriveForView.status === 'Registration Closed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : selectedDriveForView.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {selectedDriveForView.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedDriveForView.role} • {selectedDriveForView.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriveForView(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drive Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">CTC Package</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedDriveForView.ctcPackage}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Drive Date</span>
                <p className="font-bold text-indigo-700 text-sm mt-0.5">{selectedDriveForView.driveDate}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Minimum Cutoff CGPA</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedDriveForView.minCgpa} / 10.0</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Min Assessment Score</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedDriveForView.minSkillScore}%</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Registered Candidates</span>
                <p className="font-bold text-purple-700 text-sm mt-0.5">{selectedDriveForView.registeredStudentsCount} Students</p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Shortlisted Candidates</span>
                <p className="font-bold text-emerald-700 text-sm mt-0.5">{selectedDriveForView.shortlistedCount} Students</p>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Eligible Engineering Branches
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDriveForView.eligibleBranches.map((branch) => (
                  <span
                    key={branch}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-100"
                  >
                    {branch}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => {
                  const driveToManage = selectedDriveForView;
                  setSelectedDriveForView(null);
                  openManageDriveModal(driveToManage);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manage Candidates & Drive</span>
              </button>
              <button
                onClick={() => setSelectedDriveForView(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: MANAGE PLACEMENT DRIVE & CANDIDATES */}
      {/* ========================================================= */}
      {selectedDriveForManage && (() => {
        const currentDrive = placementDrives.find((d) => d.id === selectedDriveForManage.id) || selectedDriveForManage;
        const { registeredIds, shortlistedIds } = getDriveCandidateIds(currentDrive);
        const registeredStudents = institutionalStudents.filter((s) => registeredIds.includes(s.id));
        const shortlistedStudents = institutionalStudents.filter((s) => shortlistedIds.includes(s.id));

        const displayList = candidateFilter === 'shortlisted' ? shortlistedStudents : registeredStudents;
        const filteredCandidates = displayList.filter((s) => {
          const q = candidateSearch.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.rollNo.toLowerCase().includes(q) ||
            s.department.toLowerCase().includes(q)
          );
        });

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <img
                    src={currentDrive.companyLogo}
                    alt={currentDrive.company}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-['Outfit']">{currentDrive.company}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          currentDrive.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : currentDrive.status === 'Registration Closed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : currentDrive.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {currentDrive.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {currentDrive.role} • {currentDrive.ctcPackage} • Scheduled: {currentDrive.driveDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDriveForManage(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Controls & Reschedule Bar */}
              <div className="px-5 py-3 bg-purple-50/50 border-b border-purple-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Reschedule:</span>
                  </span>
                  <input
                    type="date"
                    value={editDriveDate}
                    onChange={(e) => setEditDriveDate(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-purple-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => handleRescheduleDrive(editDriveDate)}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                  >
                    Update Date
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {currentDrive.status !== 'Registration Closed' ? (
                    <button
                      onClick={() => handleUpdateDriveStatus('Registration Closed')}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs cursor-pointer border border-amber-200"
                    >
                      Close Registrations
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateDriveStatus('In Progress')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs cursor-pointer border border-emerald-200"
                    >
                      Reopen Registrations
                    </button>
                  )}

                  {currentDrive.status !== 'Completed' ? (
                    <button
                      onClick={() => handleUpdateDriveStatus('Completed')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateDriveStatus('Upcoming')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs cursor-pointer border border-indigo-200"
                    >
                      Mark Active
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Switcher: Candidates vs Edit Drive */}
              <div className="flex border-b border-slate-200 px-5 pt-3 gap-4 text-xs font-bold">
                <button
                  onClick={() => setManageTab('candidates')}
                  className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    manageTab === 'candidates'
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users2 className="w-4 h-4" />
                  <span>Candidate Management ({registeredStudents.length})</span>
                </button>
                <button
                  onClick={() => setManageTab('edit')}
                  className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    manageTab === 'edit'
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Drive Details</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {manageTab === 'candidates' ? (
                  <div className="space-y-4">
                    {/* Candidate Filter & Search bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setCandidateFilter('all')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            candidateFilter === 'all'
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          All Registered ({registeredStudents.length})
                        </button>
                        <button
                          onClick={() => setCandidateFilter('shortlisted')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            candidateFilter === 'shortlisted'
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Shortlisted ({shortlistedStudents.length})
                        </button>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search candidate or roll no..."
                          value={candidateSearch}
                          onChange={(e) => setCandidateSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Candidates List */}
                    {filteredCandidates.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                        {candidateFilter === 'shortlisted'
                          ? 'No candidates have been shortlisted yet. Shortlist candidates from the "All Registered" list.'
                          : 'No candidates found matching search criteria.'}
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {filteredCandidates.map((st) => {
                          const isShortlisted = shortlistedIds.includes(st.id);
                          return (
                            <div
                              key={st.id}
                              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                                isShortlisted
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : 'bg-white border-slate-200 hover:border-purple-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={st.avatar}
                                  alt={st.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-900 text-xs">{st.name}</p>
                                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                      {st.rollNo}
                                    </span>
                                    {isShortlisted && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px] border border-emerald-200 flex items-center gap-1">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        <span>Shortlisted</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    {st.department} • CGPA: <strong className="text-slate-800">{st.cgpa}</strong> • Readiness:{' '}
                                    <strong className="text-purple-700">{st.readinessScore}%</strong> ({st.readinessTier})
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                  onClick={() => handleToggleShortlist(currentDrive.id, st.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                                    isShortlisted
                                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200'
                                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                                  }`}
                                >
                                  {isShortlisted ? (
                                    <>
                                      <X className="w-3.5 h-3.5" />
                                      <span>Unshortlist</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Shortlist Candidate</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleRemoveCandidate(currentDrive.id, st.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Remove from Drive"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Edit Drive Form */
                  <form onSubmit={handleSaveDriveEdits} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Role Offered</label>
                        <input
                          type="text"
                          required
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">CTC Package</label>
                        <input
                          type="text"
                          required
                          value={editPackage}
                          onChange={(e) => setEditPackage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Min Cutoff CGPA</label>
                        <input
                          type="number"
                          step="0.1"
                          min="5"
                          max="10"
                          required
                          value={editMinCgpa}
                          onChange={(e) => setEditMinCgpa(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Min Assessment Score (%)</label>
                        <input
                          type="number"
                          min="40"
                          max="100"
                          required
                          value={editMinSkillScore}
                          onChange={(e) => setEditMinSkillScore(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Drive Date</label>
                        <input
                          type="date"
                          required
                          value={editDriveDate}
                          onChange={(e) => setEditDriveDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Eligible Branches (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editEligibleBranches}
                          onChange={(e) => setEditEligibleBranches(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Drive Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as PlacementDrive['status'])}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Registration Closed">Registration Closed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer"
                      >
                        Save Drive Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/70">
                <button
                  onClick={() => setSelectedDriveForManage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
