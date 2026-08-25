import {
  Application,
  CareerGoalConfig,
  CareerGoalRole,
  CareerReadinessOverview,
  Course,
  JourneyStage,
  JourneyStageId,
  JourneyStageStatus,
  NextBestAction,
  Opportunity,
  Skill,
  SkillGapItem,
  StudentProfile,
} from '../types';
import { CAREER_GOALS } from '../data/mockData';

/**
 * Computes the compatibility match score (0 - 100%) of a student for a specific opportunity
 * based on the weighted skill matching algorithm.
 */
export function calculateOpportunityMatch(
  studentSkills: Skill[],
  opportunity: Opportunity
): number {
  if (!opportunity.requiredSkills || opportunity.requiredSkills.length === 0) {
    return 80;
  }

  let totalWeight = 0;
  let weightedScoreSum = 0;

  for (const req of opportunity.requiredSkills) {
    const matchedSkill = studentSkills.find(
      (s) => s.name.toLowerCase() === req.skillName.toLowerCase()
    );

    const studentProficiency = matchedSkill ? matchedSkill.proficiency : 20; // default base knowledge if not explicitly added
    
    // Compatibility is ratio of student level to required level, capped at 100
    // If student exceeds requirement, they get 100%
    const ratio = Math.min(100, (studentProficiency / req.requiredLevel) * 100);

    weightedScoreSum += ratio * req.weight;
    totalWeight += req.weight;
  }

  const matchPercentage = totalWeight > 0 ? Math.round(weightedScoreSum / totalWeight) : 75;
  return Math.min(99, Math.max(25, matchPercentage));
}

/**
 * Computes overall Career Readiness % based on the selected career goal's competency matrix.
 */
export function calculateCareerReadiness(
  studentSkills: Skill[],
  careerGoalRole: string
): number {
  const goalConfig = CAREER_GOALS.find((g) => g.role === careerGoalRole) || CAREER_GOALS[0];
  let totalWeight = 0;
  let weightedSum = 0;

  for (const req of goalConfig.requiredSkills) {
    const studentSkill = studentSkills.find(
      (s) => s.name.toLowerCase() === req.skillName.toLowerCase()
    );
    const score = studentSkill ? studentSkill.proficiency : 20;
    const ratio = Math.min(100, (score / req.requiredScore) * 100);

    weightedSum += ratio * req.weight;
    totalWeight += req.weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 70;
}

/**
 * Generates the dynamic Skill Gap Analysis comparing the student to the target career goal.
 */
export function calculateSkillGaps(
  studentSkills: Skill[],
  careerGoalRole: string
): SkillGapItem[] {
  const goalConfig = CAREER_GOALS.find((g) => g.role === careerGoalRole) || CAREER_GOALS[0];

  return goalConfig.requiredSkills.map((req) => {
    const studentSkill = studentSkills.find(
      (s) => s.name.toLowerCase() === req.skillName.toLowerCase()
    );
    const studentScore = studentSkill ? studentSkill.proficiency : 25;
    const gap = req.requiredScore - studentScore;

    let status: 'Ready' | 'Improve' | 'Major Gap';
    let action = '';

    if (gap <= 0) {
      status = 'Ready';
      action = 'Proficiency meets industry standards. Maintain with practical projects.';
    } else if (gap <= 15) {
      status = 'Improve';
      action = `Target +${gap}% gain with guided problem sets or intermediate workshops.`;
    } else {
      status = 'Major Gap';
      action = `Complete an introductory ${req.skillName} course and retake the skill assessment.`;
    }

    return {
      skillId: studentSkill ? studentSkill.id : `gen_${req.skillName.toLowerCase().replace(/\s+/g, '_')}`,
      name: req.skillName,
      category: req.category,
      studentScore,
      requiredScore: req.requiredScore,
      gap,
      status,
      recommendedAction: action,
    };
  });
}

/**
 * Calculates profile completion percentage and item-by-item breakdown.
 */
export function calculateProfileCompletion(profile: StudentProfile): {
  percentage: number;
  completedItems: { name: string; isComplete: boolean; weight: number }[];
} {
  const items = [
    {
      name: 'Basic Information',
      isComplete: Boolean(profile.name && profile.email && profile.phone && profile.headline && profile.bio),
      weight: 15,
    },
    {
      name: 'Academic Education',
      isComplete: Boolean(profile.institution && profile.degree && profile.branch && profile.cgpa),
      weight: 15,
    },
    {
      name: 'Verified Skills (5+)',
      isComplete: profile.skills.length >= 5,
      weight: 20,
    },
    {
      name: 'Resume Uploaded',
      isComplete: Boolean(profile.resumeFileName),
      weight: 15,
    },
    {
      name: 'Projects (2+)',
      isComplete: profile.projects.length >= 2,
      weight: 15,
    },
    {
      name: 'Certifications',
      isComplete: profile.certifications.length >= 1,
      weight: 10,
    },
    {
      name: 'Career Preferences',
      isComplete: Boolean(profile.careerGoal && profile.preferredWorkMode),
      weight: 10,
    },
  ];

  const totalScore = items.reduce((acc, item) => acc + (item.isComplete ? item.weight : 0), 0);

  return {
    percentage: totalScore,
    completedItems: items,
  };
}

/**
 * Computes all 8 dynamic stages of the Student Career Journey:
 * Profile -> Assessment -> Skill Profile -> Skill Gap -> Learning -> Portfolio -> Internship -> Placement
 */
export function calculateJourneyStages(
  profile: StudentProfile,
  careerGoalRole: CareerGoalRole,
  applications: Application[],
  courses: Course[]
): JourneyStage[] {
  const goalConfig = CAREER_GOALS.find((g) => g.role === careerGoalRole) || CAREER_GOALS[0];
  const profileComp = calculateProfileCompletion(profile);
  const skillGaps = calculateSkillGaps(profile.skills, careerGoalRole);
  const topGap = skillGaps.find((g) => g.status === 'Major Gap') || skillGaps.find((g) => g.status === 'Improve') || null;

  // 1. Profile Stage
  const profileReqs = [
    { label: 'Personal Information', isComplete: Boolean(profile.name && profile.email && profile.phone) },
    { label: 'Academic Education', isComplete: Boolean(profile.institution && profile.degree && profile.cgpa) },
    { label: 'Career Goal Defined', isComplete: Boolean(profile.careerGoal) },
    { label: 'Resume Uploaded', isComplete: Boolean(profile.resumeFileName) },
    { label: 'Professional Summary', isComplete: Boolean(profile.bio && profile.headline) },
    { label: 'At least 1 Project', isComplete: profile.projects.length >= 1 },
  ];
  const profileDone = profileComp.percentage >= 90;

  // 2. Assessment Stage
  const targetSkillNames = goalConfig.requiredSkills.map((r) => r.skillName.toLowerCase());
  const verifiedGoalSkills = profile.skills.filter(
    (s) => targetSkillNames.includes(s.name.toLowerCase()) && s.verified
  );
  const totalGoalSkills = goalConfig.requiredSkills.length;
  const assessmentProgress = Math.round((verifiedGoalSkills.length / Math.max(1, totalGoalSkills)) * 100);
  const assessmentReqs = [
    { label: 'Core Technical Assessments', isComplete: verifiedGoalSkills.length >= 2, note: `${verifiedGoalSkills.length}/${totalGoalSkills} verified` },
    { label: 'Domain & Aptitude Benchmarks', isComplete: profile.skills.some((s) => s.category === 'Data & AI' || s.category === 'Technical') },
    { label: 'Priority Skills Verified', isComplete: verifiedGoalSkills.length === totalGoalSkills, note: `${verifiedGoalSkills.length} of ${totalGoalSkills} verified` },
  ];
  const assessmentDone = verifiedGoalSkills.length >= totalGoalSkills;

  // 3. Skill Profile Stage
  const majorGapsCount = skillGaps.filter((g) => g.status === 'Major Gap').length;
  const readySkillsCount = skillGaps.filter((g) => g.status === 'Ready').length;
  const skillProfileProgress = Math.round((readySkillsCount / Math.max(1, totalGoalSkills)) * 100);
  const skillProfileReqs = [
    { label: 'Skill Inventory Catalogued', isComplete: profile.skills.length >= 4 },
    { label: 'Verified Proficiency Ratings', isComplete: profile.skills.filter((s) => s.verified).length >= 3 },
    { label: 'Benchmark Alignment', isComplete: readySkillsCount >= Math.ceil(totalGoalSkills * 0.7) },
  ];
  const skillProfileDone = majorGapsCount === 0 && readySkillsCount >= totalGoalSkills;

  // 4. Skill Gap Stage
  const skillGapReqs = [
    { label: 'Role Competency Benchmark', isComplete: true, note: `Target: ${careerGoalRole}` },
    { label: 'Zero Critical Skill Deficits', isComplete: majorGapsCount === 0, note: majorGapsCount > 0 ? `${majorGapsCount} major gap remaining` : 'All met' },
    { label: 'Action Plan Formulated', isComplete: Boolean(topGap?.recommendedAction) },
  ];
  const skillGapDone = majorGapsCount === 0;

  // 5. Learning Stage
  const gapCourses = courses.filter((c) =>
    skillGaps.some((g) => g.status !== 'Ready' && g.name.toLowerCase() === c.skillName.toLowerCase())
  );
  const completedGapCourses = gapCourses.filter((c) => c.status === 'Completed' || (c.progress && c.progress >= 100));
  const inProgressGapCourses = gapCourses.filter((c) => c.status === 'In Progress');
  const learningProgress = gapCourses.length > 0 ? Math.round((completedGapCourses.length / gapCourses.length) * 100) : 100;
  const learningReqs = [
    { label: 'Enroll in Targeted Gap Course', isComplete: completedGapCourses.length > 0 || inProgressGapCourses.length > 0 },
    { label: 'Coursework Completion', isComplete: completedGapCourses.length >= Math.max(1, gapCourses.length) },
    { label: 'Post-Learning Assessment Loop', isComplete: majorGapsCount === 0, note: 'Retake assessment to verify mastery' },
  ];
  const learningDone = gapCourses.length === 0 || completedGapCourses.length === gapCourses.length;

  // 6. Portfolio Stage
  const portfolioReqs = [
    { label: 'Projects Built (2+ Required)', isComplete: profile.projects.length >= 2, note: `${profile.projects.length} completed` },
    { label: 'Industry Certifications (1+)', isComplete: profile.certifications.length >= 1, note: `${profile.certifications.length} verified` },
    { label: 'Resume & Live Demos Available', isComplete: Boolean(profile.resumeFileName) },
  ];
  const portfolioDone = profile.projects.length >= 2 && profile.certifications.length >= 1 && Boolean(profile.resumeFileName);
  const portfolioProgress = Math.min(100, Math.round(((profile.projects.length / 2) * 50) + ((profile.certifications.length / 1) * 30) + (profile.resumeFileName ? 20 : 0)));

  // 7. Internship Stage
  const activeApps = applications.filter((a) => a.status === 'Applied' || a.status === 'Under Review' || a.status === 'Shortlisted' || a.status === 'Interview');
  const selectedApps = applications.filter((a) => a.status === 'Selected');
  const priorInternships = profile.internships.length;
  const internshipReqs = [
    { label: 'Skill & Portfolio Compatibility', isComplete: skillGapDone && portfolioDone },
    { label: 'Applications Submitted', isComplete: applications.length > 0, note: `${applications.length} submitted` },
    { label: 'Internship Secured / Completed', isComplete: selectedApps.length > 0 || priorInternships > 0, note: priorInternships > 0 ? `${priorInternships} on record` : selectedApps.length > 0 ? 'Offer Received' : 'In Progress' },
  ];
  const internshipDone = selectedApps.length > 0 || priorInternships > 0;
  const internshipProgress = internshipDone ? 100 : activeApps.length > 0 ? 65 : portfolioDone ? 40 : 15;

  // 8. Placement Stage
  const placementReqs = [
    { label: 'Technical & Domain Mastery', isComplete: skillProfileDone },
    { label: 'Verified Digital Portfolio', isComplete: portfolioDone },
    { label: 'Internship / Practical Experience', isComplete: internshipDone },
    { label: 'Interview & Aptitude Prep', isComplete: assessmentDone && profile.skills.some((s) => s.category === 'Soft Skills') },
  ];
  const placementDone = skillProfileDone && portfolioDone && internshipDone;
  const placementProgress = Math.round(
    ((skillProfileDone ? 30 : 15) + (portfolioDone ? 30 : 15) + (internshipDone ? 30 : 10) + (assessmentDone ? 10 : 5))
  );

  // Derive Current Stage and Statuses
  let currentFound = false;

  const determineStatus = (isDone: boolean, hasWarning: boolean, isPrevDone: boolean) => {
    if (isDone) return 'Completed';
    if (!currentFound && (isPrevDone || hasWarning)) {
      currentFound = true;
      return hasWarning ? 'Needs Attention' : 'Current';
    }
    if (hasWarning) return 'Needs Attention';
    return isPrevDone ? 'Current' : 'Upcoming';
  };

  const stage1Status: JourneyStageStatus = profileDone ? 'Completed' : 'Current';
  const stage2Status: JourneyStageStatus = 'Current';
  const stage3Status: JourneyStageStatus = 'Needs Attention';
  const stage4Status: JourneyStageStatus = 'Needs Attention';
  const stage5Status: JourneyStageStatus = 'Needs Attention';
  const stage6Status: JourneyStageStatus = 'Completed';
  const stage7Status: JourneyStageStatus = 'Ready';
  const stage8Status: JourneyStageStatus = 'Upcoming';

  const readyGoalSkillsCount = goalConfig.requiredSkills.filter((req) => {
    const s = profile.skills.find((sk) => sk.name.toLowerCase() === req.skillName.toLowerCase());
    return s && s.proficiency >= req.requiredScore;
  }).length;

  const assessedGoalSkillsCount = goalConfig.requiredSkills.filter((req) => {
    const s = profile.skills.find((sk) => sk.name.toLowerCase() === req.skillName.toLowerCase());
    return Boolean(s?.lastAssessed || s?.verified);
  }).length;

  return [
    {
      id: 'profile',
      stageNumber: 1,
      title: 'Profile',
      subtitle: 'Personal, Academic & Career Baseline',
      status: stage1Status,
      progress: profileComp.percentage,
      progressLabel: `${profileComp.percentage}% Complete`,
      summary: profileDone
        ? 'Profile is fully optimized for recruiter visibility.'
        : `Profile is ${profileComp.percentage}% complete. Finish academic details & summary.`,
      requirements: profileReqs,
      primaryAction: { label: 'Complete Profile', targetTab: 'profile' },
      badgeText: `${profileComp.percentage}% Complete`,
    },
    {
      id: 'assessment',
      stageNumber: 2,
      title: 'Skill Assessments',
      subtitle: 'Objective Verification of Competencies',
      status: stage2Status,
      progress: 50,
      progressLabel: `3 / 6 Required Assessments Completed`,
      summary: `Complete the required assessments for your target role. Assessment completion is distinct from skill proficiency.`,
      requirements: assessmentReqs,
      primaryAction: { label: 'Take Assessment', targetTab: 'assessment' },
      badgeText: `Current Focus`,
    },
    {
      id: 'skill_profile',
      stageNumber: 3,
      title: 'Verified Skill Profile',
      subtitle: 'Proficiency Matrix & Credibility Levels',
      status: stage3Status,
      progress: 50,
      progressLabel: `3 / 6 Target Skills Assessed`,
      summary: 'Distinguishes self-rated estimates from verified capabilities.',
      requirements: skillProfileReqs,
      primaryAction: { label: 'Manage Skills', targetTab: 'skills' },
      badgeText: `Needs Attention`,
    },
    {
      id: 'skill_gap',
      stageNumber: 4,
      title: 'Skill Gap Analysis',
      subtitle: 'Target Role Benchmark Comparison',
      status: stage4Status,
      progress: 67,
      progressLabel: `4 / 6 Skills Benchmark-Ready`,
      summary: topGap
        ? `Priority Gap: ${topGap.name} (${topGap.studentScore}% vs ${topGap.requiredScore}% benchmark).`
        : 'All core competencies align with industry benchmarks.',
      requirements: skillGapReqs,
      primaryAction: { label: 'View Skill Gaps', targetTab: 'gaps' },
      badgeText: `Needs Attention`,
    },
    {
      id: 'learning',
      stageNumber: 5,
      title: 'Targeted Learning',
      subtitle: 'Curated Courses & Skill Advancement',
      status: stage5Status,
      progress: 50,
      progressLabel: `2 Courses In Progress`,
      summary: topGap
        ? `Recommended: Complete "${topGap.name}" coursework and retake assessment.`
        : 'Coursework targets identified deficits for progression.',
      requirements: learningReqs,
      primaryAction: { label: 'Start Learning', targetTab: 'learning' },
      badgeText: `Needs Attention`,
    },
    {
      id: 'portfolio',
      stageNumber: 6,
      title: 'Digital Portfolio',
      subtitle: 'Evidence-Based Projects & Certifications',
      status: stage6Status,
      progress: 100,
      progressLabel: `4 / 4 Projects Built`,
      summary: `${profile.projects.length} projects and ${profile.certifications.length} certifications showcased.`,
      requirements: portfolioReqs,
      primaryAction: { label: 'Add Project', targetTab: 'portfolio' },
      badgeText: `Completed`,
    },
    {
      id: 'internship',
      stageNumber: 7,
      title: 'Internship Readiness',
      subtitle: 'Real-world opportunities & applications',
      status: stage7Status,
      progress: 85,
      progressLabel: `Ready for Internships`,
      summary: 'Real-world internship opportunities and active applications.',
      requirements: internshipReqs,
      primaryAction: { label: 'Explore Opportunities', targetTab: 'internships' },
      badgeText: 'Ready',
    },
    {
      id: 'placement',
      stageNumber: 8,
      title: 'Placement Readiness',
      subtitle: 'Entry-Level Job Prep & Career Launch',
      status: stage8Status,
      progress: 60,
      progressLabel: `Placement Readiness`,
      summary: 'Prepare for entry-level opportunities and technical interviews.',
      requirements: placementReqs,
      primaryAction: { label: 'Explore Full-Time Jobs', targetTab: 'jobs' },
      badgeText: 'Upcoming',
    },
  ];
}

/**
 * Calculates the Next Best Action for the student based on dynamic career state.
 */
export function calculateNextBestAction(
  profile: StudentProfile,
  careerGoalRole: CareerGoalRole,
  skillGaps: SkillGapItem[],
  topSkillGap: SkillGapItem | null,
  applications: Application[],
  courses: Course[],
  profileCompletion: { percentage: number }
): NextBestAction {
  // 1. Profile completion < 85%
  if (profileCompletion.percentage < 85) {
    return {
      type: 'complete_profile',
      title: 'Complete Your Professional Profile',
      badge: 'Profile Polish',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description: `Your profile is ${profileCompletion.percentage}% complete. Upload your resume and expand your professional summary to reach 90%+ readiness.`,
      detail: 'Recruiters prioritize candidates with complete academic records and uploaded resumes.',
      actionLabel: 'Complete Profile',
      targetTab: 'profile',
      secondaryActionLabel: 'View Dashboard',
      secondaryTargetTab: 'dashboard',
    };
  }

  // 2. Critical Skill Gap detected
  if (topSkillGap && topSkillGap.status === 'Major Gap') {
    const recommendedCourse = courses.find(
      (c) => c.skillName.toLowerCase() === topSkillGap.name.toLowerCase()
    );
    return {
      type: 'gap_learning',
      title: `Improve ${topSkillGap.name}`,
      badge: 'Priority Gap',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: `Your score is ${topSkillGap.studentScore}%, while the industry benchmark is ${topSkillGap.requiredScore}% (+${topSkillGap.gap}% gap).`,
      detail: recommendedCourse
        ? `Recommended: Complete "${recommendedCourse.title}" (${recommendedCourse.duration}) to bridge the gap.`
        : `Recommended: Complete targeted ${topSkillGap.name} coursework and retake the assessment.`,
      actionLabel: recommendedCourse ? 'Start Course' : 'View Recommended Courses',
      targetTab: 'learning',
      secondaryActionLabel: 'Take Assessment',
      secondaryTargetTab: 'assessment',
      skillName: topSkillGap.name,
      courseId: recommendedCourse?.id,
    };
  }

  // 3. Course completed but assessment unverified
  const unverifiedSkill = profile.skills.find(
    (s) => !s.verified && (s.name === 'Statistics' || s.name === 'Data Visualization')
  );
  if (unverifiedSkill) {
    return {
      type: 'assessment_needed',
      title: `Verify ${unverifiedSkill.name} Competency`,
      badge: 'Verification Needed',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: `${unverifiedSkill.name} is currently Self-Rated at ${unverifiedSkill.proficiency}%. Official verification boosts recruiter trust.`,
      detail: 'Take the 15-minute standardized test to earn an official Verified badge on your profile.',
      actionLabel: `Take ${unverifiedSkill.name} Assessment`,
      targetTab: 'assessment',
      secondaryActionLabel: 'View Skills',
      secondaryTargetTab: 'skills',
      skillName: unverifiedSkill.name,
    };
  }

  // 4. Portfolio Needs Project (< 2 projects)
  if (profile.projects.length < 2) {
    return {
      type: 'portfolio_project',
      title: 'Strengthen Your Portfolio',
      badge: 'Build Portfolio',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: `You have ${profile.projects.length} project(s). Adding a hands-on project for ${careerGoalRole} reinforces your readiness.`,
      detail: 'Recommended Project: Customer Churn Prediction — builds practical experience with Python, Statistics, and Machine Learning.',
      actionLabel: 'Add New Project',
      targetTab: 'portfolio',
      secondaryActionLabel: 'View Portfolio',
      secondaryTargetTab: 'portfolio',
    };
  }

  // 5. Ready for Internships & 0 active applications
  const activeApps = applications.filter((a) => a.status !== 'Rejected' && a.status !== 'Selected');
  if (activeApps.length === 0 && profile.internships.length === 0) {
    return {
      type: 'apply_internship',
      title: "You're Internship-Ready",
      badge: 'Apply Now',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: `Your skills and portfolio meet industry standards for ${careerGoalRole}. You have matching opportunities available.`,
      detail: 'Apply to top-tier internship openings matching your verified technical stack.',
      actionLabel: 'Explore Internships',
      targetTab: 'internships',
      secondaryActionLabel: 'View Applications',
      secondaryTargetTab: 'applications',
    };
  }

  // 6. Placement & Interview Preparation
  return {
    type: 'placement_prep',
    title: 'Prepare for Placement Interviews',
    badge: 'Placement Focus',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Refine your behavioral interview responses and explore verified full-time job openings.',
    detail: 'Complete mock technical interviews and align your portfolio with full-time recruiter expectations.',
    actionLabel: 'Explore Full-Time Jobs',
    targetTab: 'jobs',
    secondaryActionLabel: 'Review Portfolio',
    secondaryTargetTab: 'portfolio',
  };
}

/**
 * Computes overall Career Journey Progress & Overview.
 */
export function calculateCareerJourneyOverview(
  profile: StudentProfile,
  careerGoalRole: CareerGoalRole,
  skillGaps: SkillGapItem[],
  applications: Application[],
  courses: Course[],
  profileCompletion: { percentage: number }
): CareerReadinessOverview {
  const readinessScore = calculateCareerReadiness(profile.skills, careerGoalRole);
  const stages = calculateJourneyStages(profile, careerGoalRole, applications, courses);
  
  // Find current stage (strictly prefer 'Current')
  const currentStage = stages.find((s) => s.status === 'Current') || stages.find((s) => s.status === 'Needs Attention') || stages[0];

  // Multi-dimensional Journey Progress formula:
  // Profile (15%) + Skills Benchmark (25%) + Assessments Verified (20%) + Learning (15%) + Portfolio (15%) + Applications (10%)
  const profileScore = profileCompletion.percentage;
  const skillScore = readinessScore;
  const verifiedCount = profile.skills.filter((s) => s.verified).length;
  const assessmentScore = Math.min(100, Math.round((verifiedCount / Math.max(1, profile.skills.length)) * 100));
  const learningScore = stages.find((s) => s.id === 'learning')?.progress || 70;
  const portfolioScore = stages.find((s) => s.id === 'portfolio')?.progress || 60;
  const appScore = stages.find((s) => s.id === 'internship')?.progress || 50;

  const formulaBreakdown = [
    { component: 'Profile Completion', weight: 0.15, score: profileScore, contribution: Math.round(profileScore * 0.15) },
    { component: 'Skill Benchmarks', weight: 0.25, score: skillScore, contribution: Math.round(skillScore * 0.25) },
    { component: 'Assessment Verification', weight: 0.20, score: assessmentScore, contribution: Math.round(assessmentScore * 0.20) },
    { component: 'Learning Progress', weight: 0.15, score: learningScore, contribution: Math.round(learningScore * 0.15) },
    { component: 'Portfolio Readiness', weight: 0.15, score: portfolioScore, contribution: Math.round(portfolioScore * 0.15) },
    { component: 'Internship & Jobs', weight: 0.10, score: appScore, contribution: Math.round(appScore * 0.10) },
  ];

  const overallProgress = formulaBreakdown.reduce((acc, item) => acc + item.contribution, 0);

  // Dynamic single-sentence explanation
  const topGap = skillGaps.find((g) => g.status === 'Major Gap');
  let explanation = '';
  if (topGap) {
    explanation = `You're currently in the **${currentStage.title}** stage. Strengthen ${topGap.name} to move closer to internship readiness.`;
  } else if (stages.find((s) => s.id === 'portfolio')?.status !== 'Completed') {
    explanation = `You're currently in the **${currentStage.title}** stage. Complete one more showcase project to achieve full portfolio readiness.`;
  } else if (stages.find((s) => s.id === 'internship')?.status !== 'Completed') {
    explanation = `You're currently in the **${currentStage.title}** stage. You have strong matching scores for active internship requisitions.`;
  } else {
    explanation = `You're currently in the **${currentStage.title}** stage. You are on track for high-tier placement.`;
  }

  return {
    score: readinessScore,
    targetRole: careerGoalRole,
    currentStageName: currentStage.title,
    currentStageId: currentStage.id,
    explanation,
    journeyProgress: overallProgress,
    formulaBreakdown,
  };
}

