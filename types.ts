export type CareerGoalRole =
  | 'Data Scientist'
  | 'Machine Learning Engineer'
  | 'Full Stack Developer'
  | 'Cloud Engineer'
  | 'Cybersecurity Analyst'
  | 'UI/UX Designer';

export type SkillStatus = 'Ready' | 'Improve' | 'Major Gap';

export type JourneyStageId =
  | 'profile'
  | 'assessment'
  | 'skill_profile'
  | 'skill_gap'
  | 'learning'
  | 'portfolio'
  | 'internship'
  | 'placement';

export type JourneyStageStatus = 'Completed' | 'Current' | 'Needs Attention' | 'Ready' | 'Upcoming';

export interface JourneyStageRequirement {
  label: string;
  isComplete: boolean;
  note?: string;
}

export interface JourneyStage {
  id: JourneyStageId;
  stageNumber: number;
  title: string;
  subtitle: string;
  description?: string;
  status: JourneyStageStatus;
  progress: number; // 0 - 100
  progressLabel?: string;
  summary: string;
  requirements: JourneyStageRequirement[];
  primaryAction: {
    label: string;
    targetTab: string;
    actionType?: string;
  };
  badgeText?: string;
}

export interface NextBestAction {
  type:
    | 'gap_learning'
    | 'assessment_needed'
    | 'portfolio_project'
    | 'apply_internship'
    | 'complete_profile'
    | 'placement_prep';
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  detail: string;
  actionLabel: string;
  targetTab: string;
  secondaryActionLabel?: string;
  secondaryTargetTab?: string;
  skillName?: string;
  courseId?: string;
}

export interface CareerReadinessOverview {
  score: number; // 0 - 100
  targetRole: CareerGoalRole;
  currentStageName: string;
  currentStageId: JourneyStageId;
  explanation: string;
  journeyProgress: number; // 0 - 100
  formulaBreakdown: {
    component: string;
    weight: number;
    score: number;
    contribution: number;
  }[];
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export type OpportunityType = 'Internship' | 'Job';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type SkillCategory = 'Technical' | 'Data & AI' | 'Web & Cloud' | 'Aptitude' | 'Soft Skills';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0 - 100
  verified: boolean;
  lastAssessed?: string;
  credibilityStatus?: 'Self-Reported' | 'Assessed' | 'Verified' | 'Industry-Ready';
  courseId?: string;
  certificateName?: string;
  certificateDataUrl?: string;
  certificateUploadDate?: string;
  certificateIssuer?: string;
  certificateType?: 'uploaded_pdf' | 'uploaded_image' | 'system_generated' | 'pdf' | 'image';
}

export interface StageAchievement {
  id: string;
  stageId: JourneyStageId;
  stageNumber: number;
  title: string;
  badgeEmoji: string;
  badgeName: string;
  description: string;
  rewardExp: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  icon?: string;
  expReward?: number;
}

export interface SkillGapItem {
  skillId: string;
  name: string;
  category: SkillCategory;
  studentScore: number;
  requiredScore: number;
  gap: number; // required - student
  status: SkillStatus;
  recommendedAction: string;
  recommendedCourseId?: string;
}

export interface CareerGoalConfig {
  role: CareerGoalRole;
  title: string;
  description: string;
  averageSalary: string;
  growthRate: string;
  requiredSkills: {
    skillName: string;
    requiredScore: number;
    weight: number; // 1 to 5
    category: SkillCategory;
  }[];
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workMode: WorkMode;
  stipendOrSalary: string;
  deadline: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requiredSkills: {
    skillName: string;
    requiredLevel: number;
    weight: number;
  }[];
  applicantsCount: number;
  matchScore?: number; // dynamically computed based on student skills
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  companyLogo?: string;
  type: OpportunityType;
  appliedDate: string;
  status: ApplicationStatus;
  workMode: WorkMode;
  location: string;
  stipendOrSalary: string;
  matchScoreAtApplication: number;
  timeline: {
    status: ApplicationStatus;
    date: string;
    note?: string;
  }[];
  notes?: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string;
  skillName: string;
  category: SkillCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  studentsEnrolled: number;
  hasCertification: boolean;
  url: string;
  description: string;
  status?: 'Not Started' | 'In Progress' | 'Completed';
  progress?: number;
}

export interface Question {
  id: string;
  skillName: string;
  category: SkillCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AssessmentTest {
  id: string;
  skillName: string;
  category: SkillCategory;
  title: string;
  durationMinutes: number;
  questionsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  questions: Question[];
}

// Assessment Question & Evaluation Types
export interface RoleAssessmentQuestion {
  id: number;
  role: CareerGoalRole;
  department: string;
  courseName: string;
  difficulty: 'Easy' | 'Moderate' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type DepartmentRatingScale = 1 | 2 | 3 | 4 | 5;

export interface DepartmentAnalysis {
  department: string;
  courseName: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number; // 0 - 100
  rating: DepartmentRatingScale; // 1 to 5
  ratingLabel: string; // "Outstanding" | "Very Good" | "Good" | "Needs a Course" | "Needs to start acting"
  feedback: string;
  skillGapPercent: number; // gap percentage required to excel (0 - 100)
  statusColor: string;
  recommendedAction: string;
  recommendedCourse?: string;
}

export interface GrandReadinessScale {
  cumulativeScore: number; // 0 - 100
  cumulativeRating: number; // 1.0 - 5.0
  readinessTier: 'Outstanding (Role Ready)' | 'Very Good (High Competence)' | 'Good (Concept Solidification)' | 'Emerging (Requires Coursework)' | 'Foundational (Needs Immediate Action)';
  summary: string;
  nextBestStep: string;
}

export interface ComprehensiveAssessmentResult {
  id: string;
  role: CareerGoalRole;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
  totalScorePercent: number;
  timeSpentSeconds: number;
  grandReadiness: GrandReadinessScale;
  departmentBreakdowns: DepartmentAnalysis[];
  userAnswers: Record<number, number>; // questionId -> selected optionIndex
  questions?: RoleAssessmentQuestion[];
  strongestSkill?: string;
  weakestSkill?: string;
  assessmentStatus?: string;
}

// Gamified Adaptive Career Journey Types (Coddy.tech Inspired)
export type ResourceTier = 'paid' | 'youtube' | 'university';

export interface CuratedCourseResource {
  tier: ResourceTier;
  title: string; // e.g. "Full-Stack Developer Professional Certificate"
  provider: string; // e.g. "Meta" / "freeCodeCamp" / "Harvard University"
  platform: string; // e.g. "Coursera" / "YouTube" / "edX"
  url: string; // Direct destination course URL
  duration?: string;
  certificationOffered: boolean;
  badge?: string;
  description: string;
}

export type JourneyNodeType =
  | 'foundation'
  | 'language'
  | 'core_concept'
  | 'mini_project'
  | 'backend_service'
  | 'database_layer'
  | 'integration'
  | 'major_project'
  | 'assessment_checkpoint'
  | 'placement_prep';

export interface AdaptiveJourneyNode {
  id: string;
  level: number; // 1, 2, 3, 4...
  title: string;
  subtitle: string;
  category: string;
  domainName: string;
  nodeType: JourneyNodeType;
  description: string;
  status: 'completed' | 'current' | 'locked';
  expReward: number; // Scaled EXP: lowest for level 1, highest for final level
  estimatedHours: string;
  tags: string[];
  reasonForInclusion: string; // Dynamic reason on why this node was curated or fast-tracked
  skillScoreAtGeneration?: number;
  resources: {
    paid: CuratedCourseResource;
    youtube: CuratedCourseResource;
    university: CuratedCourseResource;
  };
  projectSpec?: {
    objective: string;
    deliverables: string[];
    starterStack: string[];
  };
  completedDate?: string;
}

export interface AdaptiveCareerPath {
  role: CareerGoalRole;
  generatedAt: string;
  candidateAssessmentScore: number;
  readinessTier: string;
  diagnosticSummary: string;
  totalNodes: number;
  completedNodes: number;
  totalExpEarned: number;
  maxPossibleExp: number;
  currentLevel: number;
  overallProgress: number; // 0-100%
  nodes: AdaptiveJourneyNode[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  date: string;
  featured?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verified: boolean;
}

export interface InternshipExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  iconType?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  headline: string;
  bio: string;
  resumeFileName: string;
  resumeUrl?: string;
  
  // Academic
  institution: string;
  degree: string;
  branch: string;
  currentYear: string;
  cgpa: string;
  expectedGraduation: string;

  // Career Preferences
  careerGoal: CareerGoalRole;
  preferredIndustry: string[];
  preferredJobRole: string;
  preferredLocation: string;
  preferredWorkMode: WorkMode;

  // Professional
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  internships: InternshipExperience[];
  achievements: Achievement[];
}

export type UserRole = 'student' | 'mentor' | 'recruiter' | 'institution';

export interface InstitutionProfile {
  id: string;
  name: string;
  code: string;
  type: string;
  deanName: string;
  deanTitle: string;
  email: string;
  phone: string;
  logo: string;
  banner?: string;
  naacGrade: string;
  nirfRank: number;
  totalStudents: number;
  activeInternships: number;
  placementRate: number;
  averageSkillScore: number;
  targetPlacementRate: number;
  campusLocation: string;
  establishedYear: number;
  departments: string[];
}

export interface InstitutionalSkillMetric {
  skillName: string;
  studentAvg: number;
  industryBenchmark: number;
  gap: number;
  gapSeverity: 'High Gap' | 'Medium Gap' | 'Low Gap' | 'Benchmark Met' | 'Surplus';
  category: string;
  studentsAssessed: number;
  trendYoY: number; // e.g. +8%
  recommendedIntervention: string;
}

export interface PlacementReadinessBreakdown {
  tier: 'Ready' | 'Needs Development' | 'Not Ready';
  percentage: number;
  studentCount: number;
  description: string;
  color: string;
}

export interface InternshipPlacementStats {
  internshipsApplied: number;
  internshipsCompleted: number;
  studentsPlaced: number;
  placementRate: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  partnerCompaniesCount: number;
  monthlyTrends: {
    month: string;
    applications: number;
    completed: number;
    placements: number;
  }[];
}

export interface IndustryDemandSkill {
  skill: string;
  demandScore: number; // 0 - 100
  studentProficiency: number; // 0 - 100
  gapStatus: 'Critical Gap' | 'Moderate Gap' | 'Optimal Match' | 'Surplus';
  hiringOpeningsCount: number;
  topHiringCompanies: string[];
  averageSalaryRange: string;
}

export interface InstitutionalStudent {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
  department: string;
  year: string;
  cgpa: number;
  readinessScore: number;
  readinessTier: 'Ready' | 'Needs Development' | 'Not Ready';
  topSkills: { name: string; score: number }[];
  skillGaps: string[];
  internshipStatus: 'Completed' | 'Ongoing' | 'Applied' | 'Not Started';
  placementStatus: 'Placed' | 'In Process' | 'Eligible' | 'Opted Out';
  placedCompany?: string;
  packageLPA?: number;
}

export interface PlacementDrive {
  id: string;
  company: string;
  companyLogo: string;
  role: string;
  type: 'Full-time' | 'Internship + PPO' | 'Internship';
  ctcPackage: string;
  eligibleBranches: string[];
  minCgpa: number;
  minSkillScore: number;
  driveDate: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Registration Closed';
  registeredStudentsCount: number;
  shortlistedCount: number;
  selectedCount: number;
  registeredStudentIds?: string[];
  shortlistedStudentIds?: string[];
  eligibilityCriteria?: string;
}

export interface InstitutionalReport {
  id: string;
  title: string;
  category: 'NAAC Compliance' | 'NIRF Ranking' | 'Placement Audit' | 'Skill Gap Diagnostic' | 'Curriculum Gap Analysis';
  generatedDate: string;
  fileFormat: 'PDF' | 'XLSX';
  summary: string;
  fileSize: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title?: string;
  organization?: string;
}

// Student Task Types
export interface StudentTaskItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  category: 'Course' | 'Project' | 'DSA' | 'Resume' | 'Assessment' | 'General';
  assignedBy?: string;
  mentorName?: string;
  completedDate?: string;
  associatedLink?: string;
}

// Student Career Roadmap Step
export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  skillsToLearn: string[];
  recommendedCourses: string[];
  tasks: { id: string; title: string; completed: boolean }[];
  milestoneProject: string;
}

// Mentor Types
export type MentorStudentStatus = 'On Track' | 'Good Progress' | 'Needs Attention' | 'Excellent';

export interface MentorStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  careerGoal: string;
  college: string;
  currentYear: string;
  cgpa: string;
  progress: number; // 0 - 100
  status: MentorStudentStatus;
  performanceScore: number; // 0 - 100
  rank: number;
  badge?: string;
  skills: { name: string; level: number; verified: boolean }[];
  completedCoursesCount: number;
  completedCoursesList: string[];
  pendingTasksCount: number;
  pendingTasksList: string[];
  roadmapCurrentStage: string;
  roadmapProgress: number; // 0 - 100
  testHistory: {
    testName: string;
    score: number;
    date: string;
    status: 'Passed' | 'Failed' | 'Top Performer';
  }[];
  projectsCompleted: {
    title: string;
    tech: string[];
    githubUrl?: string;
    liveUrl?: string;
  }[];
  jobReadinessScore: number;
  mentorNotes?: string;
  attendanceRate: number;
  lastActive: string;
}

export interface MentorTask {
  id: string;
  title: string;
  description: string;
  assignedToStudentIds: string[];
  assignedStudentNames: string[];
  deadline: string;
  type: 'Course' | 'Project' | 'DSA' | 'General';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Overdue';
  courseOrProjectName?: string;
  completedCount: number;
  totalAssigned: number;
  createdAt: string;
}

export interface MentorTest {
  id: string;
  topic: string;
  questionsCount: number;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  assignedStudentsCount: number;
  scheduledDate: string;
  status: 'Scheduled' | 'Live' | 'Completed';
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  completedStudentsCount?: number;
  studentScores?: {
    studentId: string;
    studentName: string;
    avatar: string;
    score: number;
    status: 'Passed' | 'Failed' | 'Top Performer';
    submittedAt: string;
  }[];
  questions?: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface MentorDoubt {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  careerGoal: string;
  question: string;
  category: string;
  timestamp: string;
  status: 'Pending' | 'Resolved';
  reply?: string;
  repliedAt?: string;
  mentorName?: string;
  attachedResources?: {
    title: string;
    url: string;
    type: 'course' | 'doc' | 'video' | 'repo';
  }[];
}

export interface MentorProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  institution: string;
  avatar: string;
  bio: string;
  studentsMentored: number;
  rating: number;
  specializations: string[];
  email: string;
  officeHours: string;
  linkedinUrl?: string;
  totalTestsConducted: number;
  doubtsResolved: number;
}

// Recruiter Types
export interface RecruiterCandidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  careerGoal: string;
  college: string;
  degree: string;
  graduationYear: string;
  location: string;
  workModePreference: WorkMode;
  jobReadinessScore: number;
  skills: { name: string; level: number }[];
  projectsCount: number;
  projects: {
    title: string;
    description: string;
    tech: string[];
    githubUrl?: string;
    liveUrl?: string;
  }[];
  experience: string;
  resumeUrl: string;
  resumeFileName: string;
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  shortlisted: boolean;
  interviewStatus?: 'Not Scheduled' | 'Scheduled' | 'Completed' | 'Offer Extended';
  interviewScheduled?: {
    date: string;
    time: string;
    format: 'Technical Round' | 'HR Round' | 'System Design' | 'Cultural Fit';
    meetLink: string;
    notes: string;
  };
}

export interface RecruiterJobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  type: 'Internship' | 'Full-time' | 'Part-time';
  location: string;
  workMode: WorkMode;
  salary: string;
  applicantsCount: number;
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  requiredSkills: string[];
}

export interface InterviewSchedule {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateRole: string;
  jobTitle: string;
  date: string;
  time: string;
  format: 'Technical Round' | 'HR Round' | 'System Design' | 'Cultural Fit';
  meetLink: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes: string;
  feedback?: string;
  interviewerName: string;
}

export interface RecruiterProfile {
  id: string;
  name: string;
  role: string;
  companyName: string;
  companyLogo: string;
  companyWebsite: string;
  industry: string;
  size: string;
  location: string;
  aboutCompany: string;
  email: string;
  phone: string;
  verifiedEmployer: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'application' | 'opportunity' | 'assessment' | 'course' | 'mentor' | 'task' | 'test' | 'interview' | 'achievement';
  linkTarget?: string;
}

export interface MessageThread {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  company?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: {
    id: string;
    sender: 'user' | 'other';
    text: string;
    timestamp: string;
  }[];
}

export interface MarketNewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'Tech & Tools' | 'Hiring & Salaries' | 'Industry Shifts' | 'Company News' | string;
  impact: string;
  tags: string[];
  date: string;
  sourceName: string;
  sourceUrl: string;
}

export interface TrendingMarketSkill {
  name: string;
  growthRate: string;
  category: string;
  reason: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MarketInsightsData {
  role: string;
  marketSummary: string;
  hiringSentiment: 'Surging Demand' | 'High Growth' | 'Stable Demand' | 'Competitive' | string;
  demandScore: number;
  averageStartingSalary?: string;
  topHiringSectors?: string[];
  articles: MarketNewsArticle[];
  trendingSkills: TrendingMarketSkill[];
  marketTakeaways: string[];
  groundingSources: GroundingSource[];
  lastUpdated: string;
}

