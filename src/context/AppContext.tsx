import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Application,
  CareerGoalRole,
  CareerReadinessOverview,
  Course,
  JourneyStage,
  JourneyStageId,
  NextBestAction,
  NotificationItem,
  Opportunity,
  OpportunityType,
  PipelineStage,
  JobApplicant,
  AssessmentTest,
  Skill,
  SkillGapItem,
  StudentProfile,
  MessageThread,
  UserRole,
  MentorStudent,
  MentorTask,
  MentorTest,
  MentorDoubt,
  MentorProfile,
  RecruiterCandidate,
  RecruiterJobPosting,
  InterviewSchedule,
  RecruiterProfile,
  StudentTaskItem,
  RoadmapStep,
  ComprehensiveAssessmentResult,
  RoleAssessmentQuestion,
  AdaptiveCareerPath,
  AdaptiveJourneyNode,
  InstitutionProfile,
  InstitutionalSkillMetric,
  PlacementReadinessBreakdown,
  InternshipPlacementStats,
  IndustryDemandSkill,
  InstitutionalStudent,
  PlacementDrive,
  InstitutionalReport,
  StageAchievement,
} from '../types';
import { curateAdaptiveCareerJourney } from '../utils/pathCuratorAlgorithm';
import { evaluateRoleAssessment } from '../data/roleAssessmentsData';
import {
  CAREER_GOALS,
  COURSES_CATALOG,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OPPORTUNITIES,
  ASSESSMENT_TESTS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_MESSAGES,
  INITIAL_MENTOR_PROFILE,
  INITIAL_MENTOR_STUDENTS,
  INITIAL_MENTOR_TASKS,
  INITIAL_MENTOR_TESTS,
  INITIAL_MENTOR_DOUBTS,
  INITIAL_RECRUITER_PROFILE,
  INITIAL_RECRUITER_CANDIDATES,
  INITIAL_RECRUITER_JOBS,
  INITIAL_INTERVIEW_SCHEDULES,
  INITIAL_STUDENT_TASKS,
  ROADMAP_STEPS_FLOW,
} from '../data/mockData';
import {
  INITIAL_INSTITUTION_PROFILE,
  INSTITUTIONAL_SKILLS,
  PLACEMENT_READINESS,
  INTERNSHIP_PLACEMENT_STATS,
  INDUSTRY_DEMAND_SKILLS,
  INSTITUTIONAL_STUDENTS,
  PLACEMENT_DRIVES,
  INSTITUTIONAL_REPORTS,
} from '../data/institutionData';
import {
  calculateCareerJourneyOverview,
  calculateCareerReadiness,
  calculateJourneyStages,
  calculateNextBestAction,
  calculateOpportunityMatch,
  calculateProfileCompletion,
  calculateSkillGaps,
} from '../utils/calculations';
import confetti from 'canvas-confetti';

export interface VaultSettings {
  isSetup: boolean;
  passwordHash: string; // Storing plain text mock for simplicity
  q1: string;
  a1: string;
  q2: string;
  a2: string;
}

interface AppContextType {
  // Vault
  vaultSettings: VaultSettings | null;
  isVaultUnlocked: boolean;
  setupVault: (password: string, q1: string, a1: string, q2: string, a2: string) => void;
  unlockVault: (password: string) => boolean;
  resetVault: (a1: string, a2: string, newPassword: string) => boolean;
  lockVault: () => void;

  // Accessibility
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Authentication & Role
  currentUserRole: UserRole | null;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole, email?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Student Profile & Career Goal
  profile: StudentProfile;
  careerGoal: CareerGoalRole;
  setCareerGoal: (goal: CareerGoalRole) => void;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, proficiency: number) => void;
  updateSkillFull: (id: string, updates: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Stage Achievements & Gamification
  stageAchievements: StageAchievement[];
  unlockedAchievementIds: string[];
  unlockStageAchievement: (achievementId: string) => void;
  activeAchievementUnlocked: StageAchievement | null;
  dismissAchievementModal: () => void;

  // Student Tasks & Roadmap
  studentTasks: StudentTaskItem[];
  toggleStudentTask: (taskId: string) => void;
  addStudentTask: (task: Omit<StudentTaskItem, 'id'>) => void;
  roadmapSteps: RoadmapStep[];
  toggleRoadmapTask: (stepId: string, taskId: string) => void;
  askStudentDoubt: (question: string, category: string) => void;

  // Calculated Metrics
  skillReadinessScore: number;
  profileCompletion: {
    percentage: number;
    completedItems: { name: string; isComplete: boolean; weight: number }[];
  };
  skillGaps: SkillGapItem[];
  topSkillGap: SkillGapItem | null;
  recommendedOpportunitiesCount: number;
  activeApplicationsCount: number;

  // Career Journey Feature
  journeyStages: JourneyStage[];
  currentJourneyStage: JourneyStage;
  nextBestAction: NextBestAction;
  careerJourneyOverview: CareerReadinessOverview;
  userExp: number;
  completedJourneyNodeIds: string[];
  curatedCareerPath: AdaptiveCareerPath;
  completeJourneyNode: (nodeId: string, expReward: number) => void;
  resetJourneyNodes: () => void;

  // Opportunities & Applications
  opportunities: Opportunity[];
  applications: Application[];
  applyToOpportunity: (opportunityId: string, notes?: string) => boolean;
  withdrawApplication: (applicationId: string) => void;
  hasApplied: (opportunityId: string) => boolean;

  // Learning & Courses
  courses: Course[];
  updateCourseProgress: (courseId: string, progress: number, status?: Course['status']) => void;

  // Assessments
  assessmentTests: AssessmentTest[];
  activeTestModal: AssessmentTest | null;
  setActiveTestModal: (test: AssessmentTest | null) => void;
  submitAssessmentResult: (testId: string, scorePercentage: number) => void;

  // Opportunity Details Modal & Quick Apply Modal
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (opp: Opportunity | null) => void;
  applyingOpportunity: Opportunity | null;
  setApplyingOpportunity: (opp: Opportunity | null) => void;

  // Mentor Features
  mentorProfile: MentorProfile;
  updateMentorProfile: (updates: Partial<MentorProfile>) => void;
  mentorStudents: MentorStudent[];
  mentorTasks: MentorTask[];
  mentorTests: MentorTest[];
  mentorDoubts: MentorDoubt[];
  selectedStudentForDetail: MentorStudent | null;
  setSelectedStudentForDetail: (student: MentorStudent | null) => void;
  assignMentorTask: (taskData: Omit<MentorTask, 'id' | 'createdAt' | 'completedCount' | 'totalAssigned'>) => void;
  updateMentorTaskStatus: (taskId: string, status: MentorTask['status']) => void;
  createMentorTest: (testData: Omit<MentorTest, 'id' | 'status'>) => void;
  startMentorTest: (testId: string) => void;
  replyToMentorDoubt: (doubtId: string, replyText: string, attachedResources?: MentorDoubt['attachedResources']) => void;
  resolveMentorDoubt: (doubtId: string) => void;
  updateStudentMentorNotes: (studentId: string, notes: string) => void;

  // Recruiter Features
  recruiterProfile: RecruiterProfile;
  updateRecruiterProfile: (updates: Partial<RecruiterProfile>) => void;
  recruiterCandidates: RecruiterCandidate[];
  recruiterJobs: RecruiterJobPosting[];
  interviewSchedules: InterviewSchedule[];
  selectedCandidateForDetail: RecruiterCandidate | null;
  setSelectedCandidateForDetail: (candidate: RecruiterCandidate | null) => void;
  candidateToScheduleInterview: RecruiterCandidate | null;
  setCandidateToScheduleInterview: (candidate: RecruiterCandidate | null) => void;
  toggleShortlistCandidate: (candidateId: string) => void;
  scheduleCandidateInterview: (scheduleData: Omit<InterviewSchedule, 'id'>) => void;
  createJobPosting: (jobData: Omit<RecruiterJobPosting, 'id' | 'postedDate' | 'applicantsCount'>) => void;
  updateJobStatus: (jobId: string, status: RecruiterJobPosting['status']) => void;
  updateJobPipeline: (jobId: string, pipeline: PipelineStage[]) => void;
  publishJobPipeline: (jobId: string) => void;
  jobApplicants: JobApplicant[];
  closeJobAndFinalize: (jobId: string, hiredIds: string[], underProcessIds: string[]) => void;

  // Institution Features
  institutionProfile: InstitutionProfile;
  updateInstitutionProfile: (updates: Partial<InstitutionProfile>) => void;
  institutionSkills: InstitutionalSkillMetric[];
  placementReadiness: PlacementReadinessBreakdown[];
  internshipPlacementStats: InternshipPlacementStats;
  industryDemandSkills: IndustryDemandSkill[];
  institutionalStudents: InstitutionalStudent[];
  placementDrives: PlacementDrive[];
  institutionalReports: InstitutionalReport[];
  addPlacementDrive: (driveData: Omit<PlacementDrive, 'id' | 'registeredStudentsCount' | 'shortlistedCount' | 'selectedCount'> & Partial<Pick<PlacementDrive, 'registeredStudentsCount' | 'shortlistedCount' | 'selectedCount' | 'registeredStudentIds' | 'shortlistedStudentIds'>>) => void;
  updatePlacementDrive: (driveId: string, updates: Partial<PlacementDrive>) => void;
  toggleShortlistDriveCandidate: (driveId: string, studentId: string) => void;
  removeCandidateFromDrive: (driveId: string, studentId: string) => void;
  triggerSkillBootcamp: (skillName: string, department: string) => void;

  // Notifications & Messages
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  messages: MessageThread[];
  sendReplyMessage: (threadId: string, text: string, senderOverride?: 'user' | 'other') => void;
  createNewMessageThread: (thread: MessageThread, candidateId?: string) => void;
  activeMessageThreadId: string | null;
  setActiveMessageThreadId: (id: string | null) => void;

  // Search & Global Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Welcome Assessment Onboarding Modal
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  startAssessmentFromWelcome: (testId?: string) => void;

  // Comprehensive 50-Question Role Assessment Engine
  comprehensiveResult: ComprehensiveAssessmentResult | null;
  comprehensiveResultsByRole: Partial<Record<CareerGoalRole, ComprehensiveAssessmentResult>>;
  getRoleAssessmentResult: (role: CareerGoalRole) => ComprehensiveAssessmentResult | null;
  hasCompletedAssessmentForRole: (role: CareerGoalRole) => boolean;
  activeRoleTestMode: boolean;
  activeRoleTestRole: CareerGoalRole | null;
  startComprehensiveRoleTest: (role?: CareerGoalRole) => void;
  exitComprehensiveRoleTest: () => void;
  submitComprehensiveRoleTest: (
    role: CareerGoalRole,
    userAnswers: Record<number, number>,
    timeSpentSeconds: number,
    activeQuestions?: RoleAssessmentQuestion[]
  ) => ComprehensiveAssessmentResult;
  clearComprehensiveResult: (role?: CareerGoalRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_ROLE = 'academiaport_role_v2';
const STORAGE_KEY_AUTH = 'academiaport_auth_v2';
const STORAGE_KEY_PROFILE = 'academiaport_profile_v2';
const STORAGE_KEY_APPS = 'academiaport_apps_v2';
const STORAGE_KEY_COURSES = 'academiaport_courses_v2';
const STORAGE_KEY_NOTIFS = 'academiaport_notifs_v2';
const STORAGE_KEY_MENTOR_TASKS = 'academiaport_mtasks_v2';
const STORAGE_KEY_MENTOR_TESTS = 'academiaport_mtests_v2';
const STORAGE_KEY_MENTOR_DOUBTS = 'academiaport_mdoubts_v2';
const STORAGE_KEY_STUDENT_TASKS = 'academiaport_stasks_v2';
const STORAGE_KEY_RECRUITER_CANDS = 'academiaport_rcands_v2';
const STORAGE_KEY_RECRUITER_JOBS = 'academiaport_rjobs_v2';
const STORAGE_KEY_INTERVIEWS = 'academiaport_interviews_v2';
const STORAGE_KEY_INST_PROFILE = 'academiaport_inst_profile_v2';
const STORAGE_KEY_INST_DRIVES = 'academiaport_inst_drives_v2';
const STORAGE_KEY_INST_SKILLS = 'academiaport_inst_skills_v2';
const STORAGE_KEY_WELCOME_DISMISSED = 'academiaport_welcome_dismissed_v2';
const STORAGE_KEY_COMPREHENSIVE_RESULT = 'academiaport_comp_result_v2';
const STORAGE_KEY_COMPREHENSIVE_RESULTS_BY_ROLE = 'academiaport_comp_results_by_role_v3';
const STORAGE_KEY_USER_EXP = 'academiaport_user_exp_v2';
const STORAGE_KEY_COMPLETED_NODES = 'academiaport_completed_nodes_v2';
const STORAGE_KEY_UNLOCKED_ACHIEVEMENTS = 'saarthi_unlocked_achievements_v1';

export const DEFAULT_STAGE_ACHIEVEMENTS: StageAchievement[] = [
  {
    id: 'ach_stage_profile',
    stageId: 'profile',
    stageNumber: 1,
    title: 'Identity Established',
    badgeEmoji: '🎓',
    badgeName: 'Profile Pioneer',
    description: 'Completed baseline academic and technical profile with verified credentials.',
    rewardExp: 150,
    isUnlocked: true,
    unlockedAt: '2026-08-10',
  },
  {
    id: 'ach_stage_assessment',
    stageId: 'assessment',
    stageNumber: 2,
    title: 'Diagnostic Master',
    badgeEmoji: '🎯',
    badgeName: 'Diagnostic Ace',
    description: 'Completed the 50-Question standardized role diagnostic benchmark.',
    rewardExp: 250,
    isUnlocked: true,
    unlockedAt: '2026-08-14',
  },
  {
    id: 'ach_stage_skills',
    stageId: 'skill_profile',
    stageNumber: 3,
    title: 'Skill Portfolio Pioneer',
    badgeEmoji: '🛡️',
    badgeName: 'Verified Maestro',
    description: 'Documented core technical competencies with verified benchmarks & certificates.',
    rewardExp: 200,
    isUnlocked: true,
    unlockedAt: '2026-08-15',
  },
  {
    id: 'ach_stage_skill_gap',
    stageId: 'skill_gap',
    stageNumber: 4,
    title: 'Gap Strategist',
    badgeEmoji: '⚡',
    badgeName: 'Gap Crusher',
    description: 'Audited all skill gaps against industry benchmarks with actionable remediations.',
    rewardExp: 200,
    isUnlocked: false,
  },
  {
    id: 'ach_stage_learning',
    stageId: 'learning',
    stageNumber: 5,
    title: 'Master Scholar',
    badgeEmoji: '📚',
    badgeName: 'Knowledge Seeker',
    description: 'Actively progressed through curated modules and unattempted coursework.',
    rewardExp: 300,
    isUnlocked: false,
  },
  {
    id: 'ach_stage_portfolio',
    stageId: 'portfolio',
    stageNumber: 6,
    title: 'Capstone Architect',
    badgeEmoji: '🛠️',
    badgeName: 'Builder Elite',
    description: 'Constructed verified production projects with live demos & repository links.',
    rewardExp: 400,
    isUnlocked: false,
  },
  {
    id: 'ach_stage_readiness',
    stageId: 'internship',
    stageNumber: 7,
    title: 'Industry Ready',
    badgeEmoji: '🚀',
    badgeName: 'Career Ready',
    description: 'Achieved high benchmark readiness score for prime recruiter matching.',
    rewardExp: 500,
    isUnlocked: false,
  },
  {
    id: 'ach_stage_applications',
    stageId: 'placement',
    stageNumber: 8,
    title: 'Placement Conqueror',
    badgeEmoji: '🏆',
    badgeName: 'Job Champion',
    description: 'Applied to verified top-tier roles and scheduled technical interview rounds.',
    rewardExp: 600,
    isUnlocked: false,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Vault State
  const [vaultSettings, setVaultSettings] = useState<VaultSettings | null>(() => {
    try {
      const saved = localStorage.getItem('agy_vault_settings');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  useEffect(() => {
    if (vaultSettings) {
      localStorage.setItem('agy_vault_settings', JSON.stringify(vaultSettings));
    }
  }, [vaultSettings]);

  const setupVault = (password: string, q1: string, a1: string, q2: string, a2: string) => {
    setVaultSettings({ isSetup: true, passwordHash: password, q1, a1: a1.trim().toLowerCase(), q2, a2: a2.trim().toLowerCase() });
    setIsVaultUnlocked(true);
  };

  const unlockVault = (password: string) => {
    if (vaultSettings?.passwordHash === password) {
      setIsVaultUnlocked(true);
      return true;
    }
    return false;
  };

  const resetVault = (a1: string, a2: string, newPassword: string) => {
    if (vaultSettings && vaultSettings.a1 === a1.trim().toLowerCase() && vaultSettings.a2 === a2.trim().toLowerCase()) {
      setVaultSettings({ ...vaultSettings, passwordHash: newPassword });
      setIsVaultUnlocked(true);
      return true;
    }
    return false;
  };

  const lockVault = () => setIsVaultUnlocked(false);

  // Accessibility State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('agy_dark_mode') === 'true'; } catch { return false; }
  });
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    try { return parseFloat(localStorage.getItem('agy_zoom') || '1'); } catch { return 1; }
  });

  useEffect(() => {
    localStorage.setItem('agy_dark_mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('agy-dark-theme');
    } else {
      document.documentElement.classList.remove('agy-dark-theme');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('agy_zoom', zoomLevel.toString());
    (document.body.style as any).zoom = zoomLevel;
  }, [zoomLevel]);

  const toggleDarkMode = () => setIsDarkMode(p => !p);

  // Authentication & Role
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE);
      if (
        savedAuth === 'true' &&
        savedRole &&
        (savedRole === 'student' || savedRole === 'mentor' || savedRole === 'recruiter' || savedRole === 'institution')
      ) {
        return savedRole as UserRole;
      }
    } catch {
      // fallback
    }
    // Default to null so user sees the login page first as requested
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE);
      if (
        savedAuth === 'true' &&
        savedRole &&
        (savedRole === 'student' || savedRole === 'mentor' || savedRole === 'recruiter' || savedRole === 'institution')
      ) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const rawHash = window.location.hash.replace(/^#\/?/, '');
        const parts = rawHash.split('/');
        if (parts.length >= 2 && parts[1] && parts[1].trim()) {
          return parts[1].trim();
        }
      }
    } catch {
      // fallback
    }
    return 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENT_PROFILE;
  });

  const [careerGoal, setCareerGoal] = useState<CareerGoalRole>(profile.careerGoal || 'Full Stack Developer');

  // Gamified Adaptive Journey State
  const [userExp, setUserExp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_EXP);
      if (saved) return parseInt(saved, 10) || 0;
    } catch {
      // fallback
    }
    return 320;
  });

  const [completedJourneyNodeIds, setCompletedJourneyNodeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_NODES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Stage Achievements State
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED_ACHIEVEMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['ach_stage_profile', 'ach_stage_assessment', 'ach_stage_skills'];
  });

  const [activeAchievementUnlocked, setActiveAchievementUnlocked] = useState<StageAchievement | null>(null);

  const stageAchievements = useMemo<StageAchievement[]>(() => {
    return DEFAULT_STAGE_ACHIEVEMENTS.map((ach) => {
      const isUnlocked = unlockedAchievementIds.includes(ach.id);
      return {
        ...ach,
        isUnlocked,
      };
    });
  }, [unlockedAchievementIds]);

  const unlockStageAchievement = (achievementId: string) => {
    const targetAch = DEFAULT_STAGE_ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!targetAch) return;

    if (!unlockedAchievementIds.includes(achievementId)) {
      setUnlockedAchievementIds((prev) => {
        const next = [...prev, achievementId];
        try {
          localStorage.setItem(STORAGE_KEY_UNLOCKED_ACHIEVEMENTS, JSON.stringify(next));
        } catch (e) {
          console.warn('Storage save failed', e);
        }
        return next;
      });

      // Award EXP
      setUserExp((prev) => {
        const nextExp = prev + targetAch.rewardExp;
        try {
          localStorage.setItem(STORAGE_KEY_USER_EXP, nextExp.toString());
        } catch {
          // ignore
        }
        return nextExp;
      });

      // Trigger Celebration Notification & Modal
      setActiveAchievementUnlocked({
        ...targetAch,
        isUnlocked: true,
        unlockedAt: new Date().toISOString().split('T')[0],
      });

      const newNotif: NotificationItem = {
        id: `notif_ach_${Date.now()}`,
        title: `🏆 Achievement Unlocked: ${targetAch.title}`,
        message: `Congratulations! You unlocked the '${targetAch.badgeName}' badge and earned +${targetAch.rewardExp} EXP.`,
        timestamp: 'Just now',
        read: false,
        type: 'achievement',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
        });
      } catch {
        // ignore
      }
    } else {
      // Even if already unlocked, allow previewing the modal celebration
      setActiveAchievementUnlocked(targetAch);
    }
  };

  const dismissAchievementModal = () => {
    setActiveAchievementUnlocked(null);
  };

  // Student Tasks & Roadmap
  const [studentTasks, setStudentTasks] = useState<StudentTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT_TASKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENT_TASKS;
  });

  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>(ROADMAP_STEPS_FLOW);

  // Mentor Datasets
  const [mentorProfile, setMentorProfile] = useState<MentorProfile>(INITIAL_MENTOR_PROFILE);
  const [mentorStudents, setMentorStudents] = useState<MentorStudent[]>(INITIAL_MENTOR_STUDENTS);

  const [mentorTasks, setMentorTasks] = useState<MentorTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENTOR_TASKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MENTOR_TASKS;
  });

  const [mentorTests, setMentorTests] = useState<MentorTest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENTOR_TESTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MENTOR_TESTS;
  });

  const [mentorDoubts, setMentorDoubts] = useState<MentorDoubt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENTOR_DOUBTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MENTOR_DOUBTS;
  });

  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<MentorStudent | null>(null);

  // Recruiter Datasets
  const [recruiterProfile, setRecruiterProfile] = useState<RecruiterProfile>(INITIAL_RECRUITER_PROFILE);

  const [recruiterCandidates, setRecruiterCandidates] = useState<RecruiterCandidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECRUITER_CANDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_RECRUITER_CANDIDATES;
  });

  const [jobApplicants, setJobApplicants] = useState<JobApplicant[]>(() => {
    try {
      const saved = localStorage.getItem('agy_job_applicants');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('agy_job_applicants', JSON.stringify(jobApplicants));
    } catch {}
  }, [jobApplicants]);

  const [sharedListings, setSharedListings] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem('agy_shared_listings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_OPPORTUNITIES;
  });

  const recruiterJobs = useMemo(() => {
    return sharedListings
      .filter(o => o.postedBy === 'Recruiter' || o.id.startsWith('rjob_'))
      .map(o => ({
        ...o,
        id: o.id,
        title: o.title,
        company: o.company,
        companyLogo: o.companyLogo || '',
        type: o.type as any,
        location: o.location,
        workMode: o.workMode,
        salary: o.stipendOrSalary,
        applicantsCount: o.applicantsCount,
        status: (o.status === 'Published' ? 'Active' : o.status === 'Closed' ? 'Closed' : 'Draft') as RecruiterJobPosting['status'],
        postedDate: o.postedDate,
        deadline: o.deadline,
        description: o.description,
        requirements: o.responsibilities,
        requiredSkills: o.requiredSkills.map(sk => sk.skillName)
      }));
  }, [sharedListings]);

  const [interviewSchedules, setInterviewSchedules] = useState<InterviewSchedule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTERVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_INTERVIEW_SCHEDULES;
  });

  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<RecruiterCandidate | null>(null);
  const [candidateToScheduleInterview, setCandidateToScheduleInterview] = useState<RecruiterCandidate | null>(null);

  // Institution Datasets
  const [institutionProfile, setInstitutionProfile] = useState<InstitutionProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INST_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_INSTITUTION_PROFILE;
  });

  const [institutionSkills, setInstitutionSkills] = useState<InstitutionalSkillMetric[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INST_SKILLS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INSTITUTIONAL_SKILLS;
  });

  const [placementReadiness] = useState<PlacementReadinessBreakdown[]>(PLACEMENT_READINESS);
  const [internshipPlacementStats] = useState<InternshipPlacementStats>(INTERNSHIP_PLACEMENT_STATS);
  const [industryDemandSkills] = useState<IndustryDemandSkill[]>(INDUSTRY_DEMAND_SKILLS);
  const [institutionalStudents] = useState<InstitutionalStudent[]>(INSTITUTIONAL_STUDENTS);

  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INST_DRIVES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return PLACEMENT_DRIVES;
  });

  const [institutionalReports] = useState<InstitutionalReport[]>(INSTITUTIONAL_REPORTS);

  const updateInstitutionProfile = (updates: Partial<InstitutionProfile>) => {
    setInstitutionProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const addPlacementDrive = (
    driveData: Omit<PlacementDrive, 'id' | 'registeredStudentsCount' | 'shortlistedCount' | 'selectedCount'> &
      Partial<Pick<PlacementDrive, 'registeredStudentsCount' | 'shortlistedCount' | 'selectedCount' | 'registeredStudentIds' | 'shortlistedStudentIds'>>
  ) => {
    const newDrive: Opportunity = {
      id: `drive_${Date.now()}`,
      type: driveData.type.includes('Internship') ? 'Internship' : 'Job',
      title: driveData.role,
      company: driveData.company,
      companyLogo: driveData.companyLogo,
      location: institutionProfile.address || 'Campus',
      workMode: 'On-site',
      stipendOrSalary: driveData.ctcPackage,
      deadline: driveData.driveDate,
      postedDate: new Date().toISOString().split('T')[0],
      description: `Placement drive by ${driveData.company} for ${driveData.role}.`,
      responsibilities: ['Participate in pre-placement talk', 'Technical assessment', 'Interviews'],
      requiredSkills: [{ skillName: 'Core Engineering', requiredLevel: 70, weight: 1 }],
      applicantsCount: driveData.registeredStudentIds?.length || 0,
      minCgpa: driveData.minCgpa,
      eligibleBranches: driveData.eligibleBranches,
      postedBy: 'Institution',
      status: 'Published',
      source: 'Internal'
    };
    setSharedListings((prev) => [newDrive, ...prev]);
  };

  const updatePlacementDrive = (driveId: string, updates: Partial<PlacementDrive>) => {
    setPlacementDrives((prev) =>
      prev.map((drv) => {
        if (drv.id === driveId) {
          const updated = { ...drv, ...updates };
          if (updates.registeredStudentIds) {
            updated.registeredStudentsCount = updates.registeredStudentIds.length;
          }
          if (updates.shortlistedStudentIds) {
            updated.shortlistedCount = updates.shortlistedStudentIds.length;
          }
          return updated;
        }
        return drv;
      })
    );
  };

  const toggleShortlistDriveCandidate = (driveId: string, studentId: string) => {
    setPlacementDrives((prev) =>
      prev.map((drv) => {
        if (drv.id === driveId) {
          const shortlisted = drv.shortlistedStudentIds || [];
          const isShortlisted = shortlisted.includes(studentId);
          const nextShortlisted = isShortlisted
            ? shortlisted.filter((id) => id !== studentId)
            : [...shortlisted, studentId];
          return {
            ...drv,
            shortlistedStudentIds: nextShortlisted,
            shortlistedCount: nextShortlisted.length,
          };
        }
        return drv;
      })
    );
  };

  const removeCandidateFromDrive = (driveId: string, studentId: string) => {
    setPlacementDrives((prev) =>
      prev.map((drv) => {
        if (drv.id === driveId) {
          const reg = (drv.registeredStudentIds || []).filter((id) => id !== studentId);
          const short = (drv.shortlistedStudentIds || []).filter((id) => id !== studentId);
          return {
            ...drv,
            registeredStudentIds: reg,
            shortlistedStudentIds: short,
            registeredStudentsCount: reg.length,
            shortlistedCount: short.length,
          };
        }
        return drv;
      })
    );
  };

  const triggerSkillBootcamp = (skillName: string, department: string) => {
    // Dynamically improve assessed score in state
    setInstitutionSkills((prev) =>
      prev.map((s) => {
        if (s.skillName.toLowerCase() === skillName.toLowerCase()) {
          const improvedScore = Math.min(100, s.studentAvg + 8);
          const newGap = improvedScore - s.industryBenchmark;
          return {
            ...s,
            studentAvg: improvedScore,
            gap: newGap,
            gapSeverity: newGap >= 0 ? 'Benchmark Met' : newGap > -10 ? 'Low Gap' : 'Medium Gap',
            trendYoY: s.trendYoY + 8,
          };
        }
        return s;
      })
    );

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Bootcamp Initiated: ${skillName}`,
      message: `4-week remedial bootcamp scheduled for ${department}. Target benchmark gap reduction: +8%.`,
      timestamp: 'Just now',
      read: false,
      type: 'mentor',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_APPLICATIONS;
  });

  // Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return COURSES_CATALOG;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Messages
  const [messages, setMessages] = useState<MessageThread[]>(() => {
    try {
      const saved = localStorage.getItem('saarthi_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MESSAGES;
  });

  // Effect to save messages
  useEffect(() => {
    localStorage.setItem('saarthi_messages', JSON.stringify(messages));
  }, [messages]);

  const createNewMessageThread = (thread: MessageThread, candidateId?: string) => {
    setMessages((prev) => [thread, ...prev]);
  };

  // Modals state
  const [activeTestModal, setActiveTestModal] = useState<AssessmentTest | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [applyingOpportunity, setApplyingOpportunity] = useState<Opportunity | null>(null);
  const [activeMessageThreadId, setActiveMessageThreadId] = useState<string | null>(null);

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY_WELCOME_DISMISSED);
      return dismissed !== 'true';
    } catch {
      return true;
    }
  });

  const openWelcomeModal = () => {
    setShowWelcomeModal(true);
  };

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem(STORAGE_KEY_WELCOME_DISMISSED, 'true');
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  };

  // Comprehensive 50-Question Role Assessment States (Mapped by Career Goal Role)
  const [comprehensiveResultsByRole, setComprehensiveResultsByRole] = useState<
    Partial<Record<CareerGoalRole, ComprehensiveAssessmentResult>>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPREHENSIVE_RESULTS_BY_ROLE);
      if (saved) return JSON.parse(saved);
      // Migration fallback for legacy single result
      const legacy = localStorage.getItem(STORAGE_KEY_COMPREHENSIVE_RESULT);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed && parsed.role) {
          return { [parsed.role]: parsed };
        }
      }
    } catch {
      // fallback
    }
    return {};
  });

  const comprehensiveResult = useMemo(() => {
    return comprehensiveResultsByRole[careerGoal] || null;
  }, [comprehensiveResultsByRole, careerGoal]);

  const getRoleAssessmentResult = (role: CareerGoalRole): ComprehensiveAssessmentResult | null => {
    return comprehensiveResultsByRole[role] || null;
  };

  const hasCompletedAssessmentForRole = (role: CareerGoalRole): boolean => {
    return !!comprehensiveResultsByRole[role];
  };

  const [activeRoleTestMode, setActiveRoleTestMode] = useState<boolean>(false);
  const [activeRoleTestRole, setActiveRoleTestRole] = useState<CareerGoalRole | null>(null);

  const startComprehensiveRoleTest = (role?: CareerGoalRole) => {
    const targetRole = role || careerGoal;
    setActiveRoleTestRole(targetRole);
    setActiveRoleTestMode(true);
    closeWelcomeModal();
  };

  const exitComprehensiveRoleTest = () => {
    setActiveRoleTestMode(false);
    setActiveRoleTestRole(null);
  };

  const clearComprehensiveResult = (role?: CareerGoalRole) => {
    const targetRole = role || careerGoal;
    setComprehensiveResultsByRole((prev) => {
      const next = { ...prev };
      delete next[targetRole];
      try {
        localStorage.setItem(STORAGE_KEY_COMPREHENSIVE_RESULTS_BY_ROLE, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to remove result from storage', e);
      }
      return next;
    });
  };

  const submitComprehensiveRoleTest = (
    role: CareerGoalRole,
    userAnswers: Record<number, number>,
    timeSpentSeconds: number,
    activeQuestions?: RoleAssessmentQuestion[]
  ): ComprehensiveAssessmentResult => {
    const evaluation = evaluateRoleAssessment(role, userAnswers, timeSpentSeconds, activeQuestions);
    
    setComprehensiveResultsByRole((prev) => {
      const updated = {
        ...prev,
        [role]: evaluation,
      };
      try {
        localStorage.setItem(STORAGE_KEY_COMPREHENSIVE_RESULTS_BY_ROLE, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save assessment results by role', e);
      }
      return updated;
    });

    setActiveRoleTestMode(false);
    setActiveRoleTestRole(null);
    setCareerGoal(role);
    setProfile((prev) => ({
      ...prev,
      careerGoal: role,
    }));
    setActiveTab('assessment');

    // Automatically update student profile skills with department benchmarks
    setProfile((prev) => {
      const updatedSkills = [...prev.skills];

      evaluation.departmentBreakdowns.forEach((dept) => {
        const matchingSkillIndex = updatedSkills.findIndex(
          (s) =>
            s.name.toLowerCase().includes(dept.department.split('&')[0].trim().toLowerCase()) ||
            dept.department.toLowerCase().includes(s.name.toLowerCase())
        );

        if (matchingSkillIndex >= 0) {
          updatedSkills[matchingSkillIndex] = {
            ...updatedSkills[matchingSkillIndex],
            proficiency: dept.scorePercent,
            credibilityStatus: 'Assessed',
            lastAssessed: new Date().toISOString().split('T')[0],
          };
        } else {
          updatedSkills.push({
            id: `sk_assessed_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            name: dept.department.split('&')[0].trim(),
            category: 'Technical',
            proficiency: dept.scorePercent,
            verified: false,
            credibilityStatus: 'Assessed',
            lastAssessed: new Date().toISOString().split('T')[0],
          });
        }
      });

      return {
        ...prev,
        skills: updatedSkills,
      };
    });

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_comp_eval_${Date.now()}`,
      title: `Diagnostic Assessment Evaluated: ${evaluation.totalScorePercent}% for ${role}`,
      message: `Your Grand Scale of Readiness for ${role} is ${evaluation.grandReadiness.cumulativeRating}/5.0 (${evaluation.grandReadiness.readinessTier}). ${evaluation.correctCount}/${evaluation.totalQuestions} questions correct. Full skill gap analysis available.`,
      timestamp: 'Just now',
      read: false,
      type: 'assessment',
      linkTarget: 'assessment',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return evaluation;
  };

  const startAssessmentFromWelcome = (testId?: string) => {
    closeWelcomeModal();
    setActiveTab('assessment');
  };

  // Save to localStorage when changed
  useEffect(() => {
    try {
      if (currentUserRole) {
        localStorage.setItem(STORAGE_KEY_ROLE, currentUserRole);
      } else {
        localStorage.removeItem(STORAGE_KEY_ROLE);
      }
      localStorage.setItem(STORAGE_KEY_AUTH, String(isAuthenticated));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [currentUserRole, isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MENTOR_TASKS, JSON.stringify(mentorTasks));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [mentorTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MENTOR_TESTS, JSON.stringify(mentorTests));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [mentorTests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MENTOR_DOUBTS, JSON.stringify(mentorDoubts));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [mentorDoubts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT_TASKS, JSON.stringify(studentTasks));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [studentTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECRUITER_CANDS, JSON.stringify(recruiterCandidates));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [recruiterCandidates]);

  useEffect(() => {
    try {
      localStorage.setItem('agy_shared_listings', JSON.stringify(sharedListings));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [sharedListings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTERVIEWS, JSON.stringify(interviewSchedules));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [interviewSchedules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INST_PROFILE, JSON.stringify(institutionProfile));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [institutionProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INST_DRIVES, JSON.stringify(placementDrives));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [placementDrives]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INST_SKILLS, JSON.stringify(institutionSkills));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [institutionSkills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER_EXP, userExp.toString());
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [userExp]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED_NODES, JSON.stringify(completedJourneyNodeIds));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [completedJourneyNodeIds]);

  // Auth actions
  /*const loginAsRole = async (role: UserRole, email?: string) => {
    // Try to authenticate via the real backend first
    try {
      const { apiLogin } = await import('../services/api');
      const data = await apiLogin(role, email);
      if (data.user) {
        // Real backend success
        setCurrentUserRole(data.user.role as UserRole);
        setIsAuthenticated(true);
        setActiveTab('dashboard');
        try {
          localStorage.setItem(STORAGE_KEY_ROLE, data.user.role);
          localStorage.setItem(STORAGE_KEY_AUTH, 'true');
          localStorage.setItem('saarthi_user_id', data.user.id);
          localStorage.setItem('saarthi_user_name', data.user.name);
        } catch {}
        if (typeof window !== 'undefined') window.location.hash = `#/${role}/dashboard`;
        return;
      }
    } catch (err) {
      // Backend is offline or unavailable — silently fall through to offline mode
      console.warn('Backend unavailable, using offline/demo mode:', err);
    }

    // Offline / Demo fallback (keeps prototype working without a backend)
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    } catch (e) {
      console.warn('Storage save failed', e);
    }
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${role}/dashboard`;
    }

    // Add welcome notification
    const roleLabels: Record<UserRole, string> = {
      student: 'Student Portal',
      mentor: 'Mentor Dashboard',
      recruiter: 'Recruiter Talent Hub',
      institution: 'Institution Hub & Analytics',
    };

    if (role === 'student') {
      setShowWelcomeModal(true);
    }
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Welcome to ${roleLabels[role]}`,
      message: `You are signed in as ${role.toUpperCase()}. Explore roadmaps, institutional analytics, progress metrics, and tools.`,
      timestamp: 'Just now',
      read: false,
      type: 'mentor',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors:
          role === 'student'
            ? ['#4F46E5', '#3B82F6']
            : role === 'mentor'
            ? ['#059669', '#10B981']
            : role === 'recruiter'
            ? ['#D97706', '#F59E0B']
            : ['#7C3AED', '#4F46E5', '#10B981'],
      });
    } catch {
      // ignore
    }
  };
*/

 // Making sure your website saves data permanently to the database (like when you add a skill) and loads a completely fresh, blank profile for new users (while keeping the demo accounts safe).
  // --- LIVE DATABASE SYNC HOOK ---
  useEffect(() => {
    const saveToDB = async () => {
      const token = localStorage.getItem('saarthi_jwt_token');
      if (isAuthenticated && token) {
        try {
          const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
          await fetch(`${BACKEND}/api/auth/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ profileData: profile })
          });
        } catch (e) {
          console.warn('Silent save failed', e);
        }
      }
    };
    
    // Only save if it's a real user (we leave the demo accounts alone)
    if (localStorage.getItem('saarthi_user_id') && localStorage.getItem('saarthi_jwt_token')) {
      const timer = setTimeout(saveToDB, 1500); // Debounce saves by 1.5s
      return () => clearTimeout(timer);
    }
  }, [profile, isAuthenticated]);

  const loginAsRole = async (role: UserRole, email?: string) => {
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    try {
      localStorage.setItem('saarthi_role', role);
      localStorage.setItem('saarthi_auth', 'true');
    } catch {}

    // Hydrate from Database for Real Users
    if (email && !email.startsWith('demo')) {
      try {
        const token = localStorage.getItem('saarthi_jwt_token');
        const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        const res = await fetch(`${BACKEND}/api/auth/me`, {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await res.json();
        
        if (userData && userData.profileData && Object.keys(userData.profileData).length > 0) {
           // If they have saved data in MongoDB, load it!
           if (userData.profileData.skills) {
             setProfile(prev => ({ ...prev, skills: userData.profileData.skills }));
           }
        } else {
           // Completely Blank Slate for brand new users!
           setProfile(prev => ({ 
             ...prev, 
             name: userData.name || '', 
             email: userData.email || '', 
             skills: [], 
             experience: [], 
             education: [] 
           }));
        }
      } catch (e) {
        console.warn('Failed to load DB profile', e);
      }
    }

    if (typeof window !== 'undefined') window.location.hash = `#/${role}/dashboard`;
    if (role === 'student') setShowWelcomeModal(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserRole(null);
    setActiveTab('dashboard');

    try {
      localStorage.removeItem(STORAGE_KEY_ROLE);
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.warn('Storage clear failed', e);
    }

    if (typeof window !== 'undefined') {
      window.location.hash = '#/login';
    }
  };

  const switchRole = (_newRole: UserRole) => {
    // Role switching is restricted to enforce strict authentication boundaries.
    // Users must sign out and log in with the desired role.
    logout();
  };

  // Student Profile updates
  const handleSetCareerGoal = (newGoal: CareerGoalRole) => {
    setCareerGoal(newGoal);
    setProfile((prev) => ({
      ...prev,
      careerGoal: newGoal,
    }));
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const addSkill = (newSkillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...newSkillData,
      id: `sk_${Date.now()}`,
    };
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (id: string, proficiency: number) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.id === id ? { ...s, proficiency, lastAssessed: new Date().toISOString().split('T')[0] } : s
      ),
    }));
  };

  const updateSkillFull = (id: string, updates: Partial<Skill>) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.id === id ? { ...s, ...updates, lastAssessed: new Date().toISOString().split('T')[0] } : s
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  // Student Tasks & Roadmap
  const toggleStudentTask = (taskId: string) => {
    setStudentTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'Completed';
          return {
            ...t,
            status: isDone ? 'Pending' : 'Completed',
            completedDate: isDone ? undefined : new Date().toISOString().split('T')[0],
          };
        }
        return t;
      })
    );
  };

  const addStudentTask = (task: Omit<StudentTaskItem, 'id'>) => {
    const newTask: StudentTaskItem = {
      ...task,
      id: `stask_${Date.now()}`,
    };
    setStudentTasks((prev) => [newTask, ...prev]);
  };

  const toggleRoadmapTask = (stepId: string, taskId: string) => {
    setRoadmapSteps((prev) =>
      prev.map((st) => {
        if (st.id === stepId) {
          const updatedTasks = st.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
          const allCompleted = updatedTasks.every((t) => t.completed);
          return {
            ...st,
            tasks: updatedTasks,
            status: allCompleted ? 'Completed' : 'In Progress',
          };
        }
        return st;
      })
    );
  };

  const askStudentDoubt = (question: string, category: string) => {
    if (!question.trim()) return;
    const newDoubt: MentorDoubt = {
      id: `dbt_${Date.now()}`,
      studentId: profile.id,
      studentName: profile.name,
      studentAvatar: profile.avatarUrl,
      careerGoal: profile.careerGoal,
      question: question.trim(),
      category: category || 'General Guidance',
      timestamp: 'Just now',
      status: 'Pending',
    };

    setMentorDoubts((prev) => [newDoubt, ...prev]);

    // Student notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Doubt Submitted to Mentor',
      message: `Your question "${question.slice(0, 40)}..." has been sent to Dr. Vikram Rao.`,
      timestamp: 'Just now',
      read: false,
      type: 'mentor',
      linkTarget: 'mentorship',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Mentor actions
  const updateMentorProfile = (updates: Partial<MentorProfile>) => {
    setMentorProfile((prev) => ({ ...prev, ...updates }));
  };

  const assignMentorTask = (
    taskData: Omit<MentorTask, 'id' | 'createdAt' | 'completedCount' | 'totalAssigned'>
  ) => {
    const newTask: MentorTask = {
      ...taskData,
      id: `mtask_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completedCount: 0,
      totalAssigned: taskData.assignedToStudentIds.length,
    };
    setMentorTasks((prev) => [newTask, ...prev]);

    // Also sync to student's task list if student is in assigned list
    const isAssignedToAlex =
      taskData.assignedToStudentIds.includes('std_alex') ||
      taskData.assignedToStudentIds.includes('all');
    if (isAssignedToAlex) {
      const studentTask: StudentTaskItem = {
        id: `stask_sync_${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        status: 'Pending',
        priority: taskData.priority,
        category: taskData.type,
        mentorName: mentorProfile.name,
        assignedBy: 'Mentor',
      };
      setStudentTasks((prev) => [studentTask, ...prev]);
    }

    // Add mentor notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Task Assigned: ${taskData.title}`,
      message: `Assigned to ${taskData.assignedStudentNames.join(', ')} with deadline ${taskData.deadline}.`,
      timestamp: 'Just now',
      read: false,
      type: 'task',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateMentorTaskStatus = (taskId: string, status: MentorTask['status']) => {
    setMentorTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const createMentorTest = (testData: Omit<MentorTest, 'id' | 'status'>) => {
    const newTest: MentorTest = {
      ...testData,
      id: `mtest_${Date.now()}`,
      status: 'Scheduled',
    };
    setMentorTests((prev) => [newTest, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Test Scheduled: ${testData.topic}`,
      message: `Scheduled for ${testData.scheduledDate} for ${testData.assignedStudentsCount} students.`,
      timestamp: 'Just now',
      read: false,
      type: 'test',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const startMentorTest = (testId: string) => {
    setMentorTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'Live' } : t))
    );

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Assessment Test Started Live',
      message: 'Students have been notified to join the live assessment test session.',
      timestamp: 'Just now',
      read: false,
      type: 'test',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const replyToMentorDoubt = (
    doubtId: string,
    replyText: string,
    attachedResources?: MentorDoubt['attachedResources']
  ) => {
    setMentorDoubts((prev) =>
      prev.map((d) =>
        d.id === doubtId
          ? {
              ...d,
              status: 'Resolved',
              reply: replyText,
              repliedAt: 'Just now',
              mentorName: mentorProfile.name,
              attachedResources: attachedResources || d.attachedResources,
            }
          : d
      )
    );

    // Sync notification
    const targetDoubt = mentorDoubts.find((d) => d.id === doubtId);
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Replied to ${targetDoubt?.studentName || 'Student'}`,
      message: `Doubt marked as resolved with guidance resources.`,
      timestamp: 'Just now',
      read: false,
      type: 'mentor',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const resolveMentorDoubt = (doubtId: string) => {
    setMentorDoubts((prev) =>
      prev.map((d) => (d.id === doubtId ? { ...d, status: 'Resolved', repliedAt: 'Just now' } : d))
    );
  };

  const updateStudentMentorNotes = (studentId: string, notes: string) => {
    setMentorStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, mentorNotes: notes } : s))
    );
  };

  // Recruiter actions
  const updateRecruiterProfile = (updates: Partial<RecruiterProfile>) => {
    setRecruiterProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleShortlistCandidate = (candidateId: string) => {
    setRecruiterCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, shortlisted: !c.shortlisted } : c))
    );
  };

  const scheduleCandidateInterview = (scheduleData: Omit<InterviewSchedule, 'id'>) => {
    const newInterview: InterviewSchedule = {
      ...scheduleData,
      id: `int_${Date.now()}`,
    };
    setInterviewSchedules((prev) => [newInterview, ...prev]);

    // Update candidate interview status
    setRecruiterCandidates((prev) =>
      prev.map((c) =>
        c.id === scheduleData.candidateId
          ? {
              ...c,
              interviewStatus: 'Scheduled',
              interviewScheduled: {
                date: scheduleData.date,
                time: scheduleData.time,
                format: scheduleData.format,
                meetLink: scheduleData.meetLink,
                notes: scheduleData.notes,
              },
            }
          : c
      )
    );

    // Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Interview Scheduled: ${scheduleData.candidateName}`,
      message: `${scheduleData.format} scheduled on ${scheduleData.date} at ${scheduleData.time}.`,
      timestamp: 'Just now',
      read: false,
      type: 'interview',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const createJobPosting = (
    jobData: Omit<RecruiterJobPosting, 'id' | 'postedDate' | 'applicantsCount'>
  ) => {
    const newJob: Opportunity = {
      id: `rjob_${Date.now()}`,
      type: (jobData.type === 'Internship' ? 'Internship' : 'Job') as OpportunityType,
      title: jobData.title,
      company: jobData.company,
      companyLogo: jobData.companyLogo,
      location: jobData.location,
      workMode: jobData.workMode,
      stipendOrSalary: jobData.salary,
      deadline: jobData.deadline,
      postedDate: new Date().toISOString().split('T')[0],
      description: jobData.description,
      responsibilities: jobData.requirements,
      requiredSkills: jobData.requiredSkills.map(sk => ({ skillName: sk, requiredLevel: 50, weight: 1 })),
      applicantsCount: 0,
      status: jobData.status === 'Active' ? 'Published' : 'Draft',
      postedBy: 'Recruiter',
      source: 'Internal'
    };
    setSharedListings((prev) => [newJob, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Job Posted: ${jobData.title}`,
      message: `Active and accepting candidate applications from talent pool.`,
      timestamp: 'Just now',
      read: false,
      type: 'opportunity',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateJobPipeline = (jobId: string, pipeline: PipelineStage[]) => {
    setSharedListings((prev) => prev.map((j) => (j.id === jobId ? { ...j, pipeline } : j)));
  };

  const publishJobPipeline = (jobId: string) => {
    setSharedListings((prev) => prev.map((j) => (j.id === jobId ? { ...j, pipelinePublished: true } : j)));
  };

  const closeJobAndFinalize = (jobId: string, hiredIds: string[], underProcessIds: string[]) => {
    setSharedListings((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'Closed' } : j)));
    setJobApplicants((prev) => prev.map((a) => {
      if (a.jobId === jobId) {
        if (hiredIds.includes(a.candidateId)) return { ...a, status: 'Hired' };
        if (underProcessIds.includes(a.candidateId)) return { ...a, status: 'Under Process' };
        return { ...a, status: 'Rejected' };
      }
      return a;
    }));
  };

  const updateJobStatus = (jobId: string, status: RecruiterJobPosting['status']) => {
    setSharedListings((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: status === 'Active' ? 'Published' : status === 'Closed' ? 'Closed' : 'Draft' } : j)));
  };

  // Dynamic calculations
  const skillReadinessScore = useMemo(() => {
    return calculateCareerReadiness(profile.skills, careerGoal);
  }, [profile.skills, careerGoal]);

  const profileCompletion = useMemo(() => {
    return calculateProfileCompletion(profile);
  }, [profile]);

  const skillGaps = useMemo(() => {
    return calculateSkillGaps(profile.skills, careerGoal);
  }, [profile.skills, careerGoal]);

  const topSkillGap = useMemo(() => {
    const majorGaps = skillGaps.filter((g) => g.status === 'Major Gap');
    if (majorGaps.length > 0) {
      return [...majorGaps].sort((a, b) => b.gap - a.gap)[0];
    }
    const improveGaps = skillGaps.filter((g) => g.status === 'Improve');
    if (improveGaps.length > 0) {
      return [...improveGaps].sort((a, b) => b.gap - a.gap)[0];
    }
    return null;
  }, [skillGaps]);

  // Dynamic Journey Stages & Progression Engine
  const journeyStages = useMemo(() => {
    return calculateJourneyStages(profile, careerGoal, applications, courses);
  }, [profile, careerGoal, applications, courses]);

  // Coddy.tech-style Algorithmic Journey Curation
  const curatedCareerPath = useMemo(() => {
    const activeResult = comprehensiveResultsByRole[careerGoal] || comprehensiveResult || null;
    return curateAdaptiveCareerJourney(
      careerGoal,
      activeResult,
      profile.skills,
      completedJourneyNodeIds
    );
  }, [careerGoal, comprehensiveResultsByRole, comprehensiveResult, profile.skills, completedJourneyNodeIds]);

  const completeJourneyNode = (nodeId: string, expReward: number) => {
    if (!completedJourneyNodeIds.includes(nodeId)) {
      setCompletedJourneyNodeIds((prev) => [...prev, nodeId]);
      setUserExp((prev) => prev + expReward);

      const targetNode = curatedCareerPath.nodes.find((n) => n.id === nodeId);
      const notif: NotificationItem = {
        id: `notif_node_${Date.now()}`,
        title: `Level Completed: +${expReward} EXP! 🎉`,
        message: `You completed "${targetNode?.title || 'Learning Level'}" and claimed ${expReward} EXP in your ${careerGoal} roadmap!`,
        timestamp: 'Just now',
        read: false,
        type: 'course',
        linkTarget: 'career-journey',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const resetJourneyNodes = () => {
    setCompletedJourneyNodeIds([]);
  };

  const currentJourneyStage = useMemo(() => {
    return (
      journeyStages.find((s) => s.status === 'Current' || s.status === 'Needs Attention') ||
      journeyStages[0]
    );
  }, [journeyStages]);

  const nextBestAction = useMemo(() => {
    return calculateNextBestAction(
      profile,
      careerGoal,
      skillGaps,
      topSkillGap,
      applications,
      courses,
      profileCompletion
    );
  }, [profile, careerGoal, skillGaps, topSkillGap, applications, courses, profileCompletion]);

  const careerJourneyOverview = useMemo(() => {
    return calculateCareerJourneyOverview(
      profile,
      careerGoal,
      skillGaps,
      applications,
      courses,
      profileCompletion
    );
  }, [profile, careerGoal, skillGaps, applications, courses, profileCompletion]);

  // Dynamic opportunities with real-time match computation
  const opportunities = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Dynamically generate external portal jobs tailored to user's career goal
    const generateExternalJob = (id: string, source: 'LinkedIn' | 'Naukri' | 'Internshala', role: string, company: string, location: string, stipend: string, workMode: 'Remote' | 'Hybrid' | 'On-site'): Opportunity => ({
      id,
      type: 'Job',
      title: `${role} - Early Career`,
      company,
      location,
      workMode,
      stipendOrSalary: stipend,
      deadline: 'Rolling Basis',
      postedDate: today,
      description: `Sourced from ${source}: We are looking for an ambitious ${role} to join our growing team. This is a perfect opportunity for someone looking to build a career in ${careerGoal}.`,
      responsibilities: ['Collaborate with cross-functional teams', 'Build scalable solutions', 'Participate in agile ceremonies'],
      requiredSkills: profile.skills.slice(0, 3).map(s => ({ skillName: s.name, requiredLevel: 60, weight: 1 })),
      applicantsCount: Math.floor(Math.random() * 200) + 10,
      source,
      externalUrl: `https://${source.toLowerCase()}.com/jobs/${id}`,
    });

    const dynamicJobs: Opportunity[] = [
      generateExternalJob('ext-li-1', 'LinkedIn', careerGoal, 'TechFlow Systems', profile.location || 'Bangalore, India', '₹8,50,000 - ₹14,00,000', 'Hybrid'),
      generateExternalJob('ext-nk-1', 'Naukri', careerGoal, 'InnovateTech Solutions', profile.location || 'Bangalore, India', '₹12,00,000 - ₹18,00,000', 'On-site'),
      generateExternalJob('ext-in-1', 'Internshala', careerGoal, 'StartupX', 'Remote', '₹6,00,000 - ₹7,50,000', 'Remote'),
      generateExternalJob('ext-li-2', 'LinkedIn', careerGoal, 'Global Data Corp', profile.preferredLocation || 'Mumbai, India', '₹10,50,000 - ₹18,00,000', 'Hybrid')
    ];

    const allOpportunities = [...sharedListings.filter(l => l.status === 'Published' || !l.status), ...dynamicJobs].map(opp => {
      // Adapt static mock data to user's location so the UI updates clearly
      if (profile.location && opp.location.includes('Bangalore')) {
        return { ...opp, location: profile.location };
      }
      if (profile.preferredLocation && opp.location.includes('Mumbai')) {
        return { ...opp, location: profile.preferredLocation };
      }
      return opp;
    });

    return allOpportunities.map((opp) => {
      let matchScore = calculateOpportunityMatch(profile.skills, opp);
      
      // Boost score based on geographic location match
      if (profile.location && opp.location.toLowerCase().includes(profile.location.toLowerCase())) {
        matchScore = Math.min(100, matchScore + 15);
      } else if (profile.preferredLocation && opp.location.toLowerCase().includes(profile.preferredLocation.toLowerCase())) {
        matchScore = Math.min(100, matchScore + 10);
      }

      return {
        ...opp,
        matchScore,
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [profile.skills, careerGoal, profile.location, profile.preferredLocation]);

  const recommendedOpportunitiesCount = useMemo(() => {
    return opportunities.filter((o) => (o.matchScore || 0) >= 65).length;
  }, [opportunities]);

  const activeApplicationsCount = useMemo(() => {
    return applications.filter((app) => app.status !== 'Rejected' && app.status !== 'Selected').length;
  }, [applications]);

  const hasApplied = (opportunityId: string) => {
    return applications.some((a) => a.opportunityId === opportunityId);
  };

  const applyToOpportunity = (opportunityId: string, notes?: string): boolean => {
    const opp = opportunities.find((o) => o.id === opportunityId);
    if (!opp || hasApplied(opportunityId)) return false;

    const newApp: Application = {
      id: `app_${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      company: opp.company,
      type: opp.type,
      appliedDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Applied',
      workMode: opp.workMode,
      location: opp.location,
      stipendOrSalary: opp.stipendOrSalary,
      matchScoreAtApplication: opp.matchScore || 75,
      source: opp.source,
      externalUrl: opp.externalUrl,
      timeline: [{ status: 'Applied', date: new Date().toISOString().split('T')[0], note: notes || 'Application submitted successfully.' }],
      notes
    };
    setApplications((prev) => [newApp, ...prev]);
    // INCREMENT APPLICANTS COUNT
    setSharedListings(prev => prev.map(job => job.id === opportunityId ? { ...job, applicantsCount: job.applicantsCount + 1 } : job));

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Applied: ${opp.title}`,
      message: `Your application to ${opp.company} has been received and logged in your Application Tracker.`,
      timestamp: 'Just now',
      read: false,
      type: 'application',
      linkTarget: 'applications',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#3B82F6', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    return true;
  };

  const withdrawApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
  };

  const updateCourseProgress = (courseId: string, progress: number, status?: Course['status']) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const newProgress = Math.min(100, Math.max(0, progress));
          let computedStatus = status;
          if (!computedStatus) {
            if (newProgress === 100) computedStatus = 'Completed';
            else if (newProgress > 0) computedStatus = 'In Progress';
            else computedStatus = 'Not Started';
          }
          return {
            ...c,
            progress: newProgress,
            status: computedStatus,
          };
        }
        return c;
      })
    );
  };

  const submitAssessmentResult = (testId: string, scorePercentage: number) => {
    const test = ASSESSMENT_TESTS.find((t) => t.id === testId);
    if (!test) return;

    // Update or add skill in profile
    setProfile((prev) => {
      const existing = prev.skills.find((s) => s.name.toLowerCase() === test.skillName.toLowerCase());
      if (existing) {
        return {
          ...prev,
          skills: prev.skills.map((s) =>
            s.id === existing.id
              ? {
                  ...s,
                  proficiency: scorePercentage,
                  verified: true,
                  lastAssessed: new Date().toISOString().split('T')[0],
                }
              : s
          ),
        };
      } else {
        const newSk: Skill = {
          id: `sk_${Date.now()}`,
          name: test.skillName,
          category: test.category,
          proficiency: scorePercentage,
          verified: true,
          lastAssessed: new Date().toISOString().split('T')[0],
        };
        return {
          ...prev,
          skills: [...prev.skills, newSk],
        };
      }
    });

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Assessment Completed: ${test.skillName}`,
      message: `You scored ${scorePercentage}% in ${test.title}. Your skill profile and job matches have been updated!`,
      timestamp: 'Just now',
      read: false,
      type: 'assessment',
      linkTarget: 'skills',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sendReplyMessage = (threadId: string, text: string, senderOverride: 'user' | 'other' = 'user') => {
    if (!text.trim()) return;
    setMessages((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          return {
            ...th,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [
              ...th.messages,
              {
                id: `m_${Date.now()}`,
                sender: 'user',
                text,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return th;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        vaultSettings,
        isVaultUnlocked,
        setupVault,
        unlockVault,
        resetVault,
        lockVault,
        isDarkMode,
        toggleDarkMode,
        zoomLevel,
        setZoomLevel,
        currentUserRole,
        isAuthenticated,
        loginAsRole,
        logout,
        switchRole,
        activeTab,
        setActiveTab,
        profile,
        careerGoal,
        setCareerGoal: handleSetCareerGoal,
        updateProfile,
        addSkill,
        updateSkill,
        updateSkillFull,
        removeSkill,
        stageAchievements,
        unlockedAchievementIds,
        unlockStageAchievement,
        activeAchievementUnlocked,
        dismissAchievementModal,
        studentTasks,
        toggleStudentTask,
        addStudentTask,
        roadmapSteps,
        toggleRoadmapTask,
        askStudentDoubt,
        skillReadinessScore,
        profileCompletion,
        skillGaps,
        topSkillGap,
        recommendedOpportunitiesCount,
        activeApplicationsCount,
        journeyStages,
        currentJourneyStage,
        nextBestAction,
        careerJourneyOverview,
        userExp,
        completedJourneyNodeIds,
        curatedCareerPath,
        completeJourneyNode,
        resetJourneyNodes,
        opportunities,
        applications,
        applyToOpportunity,
        withdrawApplication,
        hasApplied,
        courses,
        updateCourseProgress,
        assessmentTests: ASSESSMENT_TESTS,
        activeTestModal,
        setActiveTestModal,
        submitAssessmentResult,
        selectedOpportunity,
        setSelectedOpportunity,
        applyingOpportunity,
        setApplyingOpportunity,
        mentorProfile,
        updateMentorProfile,
        mentorStudents,
        mentorTasks,
        mentorTests,
        mentorDoubts,
        selectedStudentForDetail,
        setSelectedStudentForDetail,
        assignMentorTask,
        updateMentorTaskStatus,
        createMentorTest,
        startMentorTest,
        replyToMentorDoubt,
        resolveMentorDoubt,
        updateStudentMentorNotes,
        recruiterProfile,
        updateRecruiterProfile,
        recruiterCandidates,
        recruiterJobs,
        interviewSchedules,
        selectedCandidateForDetail,
        setSelectedCandidateForDetail,
        candidateToScheduleInterview,
        setCandidateToScheduleInterview,
        toggleShortlistCandidate,
        scheduleCandidateInterview,
        createJobPosting,
        updateJobStatus,
        updateJobPipeline,
        publishJobPipeline,
        jobApplicants,
        setJobApplicants,
        closeJobAndFinalize,
        institutionProfile,
        updateInstitutionProfile,
        institutionSkills,
        placementReadiness,
        internshipPlacementStats,
        industryDemandSkills,
        institutionalStudents,
        placementDrives,
        institutionalReports,
        addPlacementDrive,
        updatePlacementDrive,
        toggleShortlistDriveCandidate,
        removeCandidateFromDrive,
        triggerSkillBootcamp,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        messages,
        sendReplyMessage,
        createNewMessageThread,
        activeMessageThreadId,
        setActiveMessageThreadId,
        searchQuery,
        setSearchQuery,
        showWelcomeModal,
        setShowWelcomeModal,
        openWelcomeModal,
        closeWelcomeModal,
        startAssessmentFromWelcome,
        comprehensiveResult,
        comprehensiveResultsByRole,
        getRoleAssessmentResult,
        hasCompletedAssessmentForRole,
        activeRoleTestMode,
        activeRoleTestRole,
        startComprehensiveRoleTest,
        exitComprehensiveRoleTest,
        submitComprehensiveRoleTest,
        clearComprehensiveResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
