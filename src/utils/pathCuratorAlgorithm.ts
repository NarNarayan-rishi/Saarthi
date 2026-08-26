import {
  AdaptiveCareerPath,
  AdaptiveJourneyNode,
  CareerGoalRole,
  ComprehensiveAssessmentResult,
  DepartmentAnalysis,
  Skill,
} from '../types';
import { DOMAIN_RESOURCES } from '../data/coursesCatalogData';

/**
 * Intelligent Career Journey Curation Algorithm
 *
 * Translates diagnostic skill assessment data (domain scores, proficiency %, gaps)
 * into a personalized, progressive level-by-level upskilling tree (inspired by Coddy.tech).
 *
 * Principles:
 * 1. Flexible & Non-Dogmatic: If a learner scored 90% in frontend basics, it skips HTML/CSS and fast-tracks to state machines or architectures.
 * 2. Systematic Scaffolding for Deficits: If a learner scored low (<45%), it scaffolds from building blocks -> core syntax -> mini project -> backend -> db -> major project -> re-assessment.
 * 3. Scaled EXP: Level 1 has lowest EXP, scaling exponentially up to the major capstone & placement checkpoint.
 */
export function curateAdaptiveCareerJourney(
  role: CareerGoalRole,
  assessmentResult: ComprehensiveAssessmentResult | null,
  studentSkills: Skill[],
  completedNodeIds: string[] = []
): AdaptiveCareerPath {
  const generatedAt = new Date().toISOString();
  const overallScore = assessmentResult ? assessmentResult.totalScorePercent : calculateEstimatedRoleScore(role, studentSkills);
  const departments = assessmentResult?.departmentBreakdowns || [];

  // Helper to find a specific domain's score
  const getDomainScore = (keywords: string[]): number => {
    if (departments.length > 0) {
      const match = departments.find((d) =>
        keywords.some((k) => d.department.toLowerCase().includes(k.toLowerCase()) || d.courseName.toLowerCase().includes(k.toLowerCase()))
      );
      if (match) return match.scorePercent;
    }
    // Fallback: check studentSkills
    const matchingSkills = studentSkills.filter((s) =>
      keywords.some((k) => s.name.toLowerCase().includes(k.toLowerCase()))
    );
    if (matchingSkills.length > 0) {
      const avg = matchingSkills.reduce((acc, s) => acc + s.proficiency, 0) / matchingSkills.length;
      return Math.round(avg);
    }
    return overallScore;
  };

  // Generate dynamic raw node blueprints based on target role & diagnosed performance
  const rawNodes = buildRoleNodeBlueprints(role, overallScore, getDomainScore);

  // Calculate scaled EXP: level 1 gets base EXP (~75), scaling up to last level (~1000)
  const totalLevels = rawNodes.length;
  const nodes: AdaptiveJourneyNode[] = rawNodes.map((blueprint, index) => {
    const levelNumber = index + 1;
    // Scaled progressive EXP formula: starts small (75-100), increases progressively, ends high (850-1000)
    const expReward = Math.round(75 + Math.pow(index / (totalLevels - 1 || 1), 1.6) * 925);
    const isCompleted = completedNodeIds.includes(blueprint.id);

    return {
      ...blueprint,
      level: levelNumber,
      expReward,
      status: isCompleted ? 'completed' : 'locked', // Status will be resolved below for active unlock
    };
  });

  // Resolve unlock flow: first incomplete node becomes 'current', all completed stay 'completed', rest stay 'locked'
  let foundCurrent = false;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].status === 'completed') {
      continue;
    }
    if (!foundCurrent) {
      nodes[i].status = 'current';
      foundCurrent = true;
    } else {
      nodes[i].status = 'locked';
    }
  }

  // Calculate total EXP earned & progress
  const completedNodesCount = nodes.filter((n) => n.status === 'completed').length;
  const totalExpEarned = nodes
    .filter((n) => n.status === 'completed')
    .reduce((acc, n) => acc + n.expReward, 0);
  const maxPossibleExp = nodes.reduce((acc, n) => acc + n.expReward, 0);
  const overallProgress = Math.round((completedNodesCount / (nodes.length || 1)) * 100);

  // Diagnostic summary narrative
  const readinessTier = getReadinessTierLabel(overallScore);
  const diagnosticSummary = generateDiagnosticSummary(role, overallScore, departments);

  return {
    role,
    generatedAt,
    candidateAssessmentScore: overallScore,
    readinessTier,
    diagnosticSummary,
    totalNodes: nodes.length,
    completedNodes: completedNodesCount,
    totalExpEarned,
    maxPossibleExp,
    currentLevel: Math.min(completedNodesCount + 1, nodes.length),
    overallProgress,
    nodes,
  };
}

/**
 * Generates tailored node sequence for specific career roles
 */
function buildRoleNodeBlueprints(
  role: CareerGoalRole,
  overallScore: number,
  getDomainScore: (keywords: string[]) => number
): Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] {
  switch (role) {
    case 'Full Stack Developer':
      return buildFullStackPath(overallScore, getDomainScore);
    case 'Machine Learning Engineer':
      return buildMachineLearningPath(overallScore, getDomainScore);
    case 'Data Scientist':
      return buildDataScientistPath(overallScore, getDomainScore);
    case 'Cloud Engineer':
      return buildCloudDevOpsPath(overallScore, getDomainScore);
    case 'Cybersecurity Analyst':
      return buildCybersecurityPath(overallScore, getDomainScore);
    case 'UI/UX Designer':
      return buildUIUXPath(overallScore, getDomainScore);
    default:
      return buildFullStackPath(overallScore, getDomainScore);
  }
}

/**
 * 1. Full Stack Web Development Path
 */
function buildFullStackPath(
  overallScore: number,
  getDomainScore: (keywords: string[]) => number
): Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] {
  const htmlCssScore = getDomainScore(['html', 'css', 'markup', 'frontend basic']);
  const jsScore = getDomainScore(['javascript', 'typescript', 'js', 'es6', 'programming']);
  const reactScore = getDomainScore(['react', 'frontend', 'ui component', 'framework']);
  const nodeScore = getDomainScore(['node', 'backend', 'api', 'express', 'server']);
  const dbScore = getDomainScore(['sql', 'database', 'mongodb', 'dbms', 'nosql']);

  const nodes: Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] = [];

  // Level 1: HTML & CSS Semantic Foundations
  // Skip if candidate demonstrated >75% in HTML/CSS
  if (htmlCssScore < 75) {
    nodes.push({
      id: 'fs_html_css',
      title: 'HTML5 & Modern CSS3 Layouts',
      subtitle: 'Semantic Structure, Flexbox, CSS Grid & Responsive Systems',
      category: 'Frontend Foundations',
      domainName: 'Web Fundamentals',
      nodeType: 'foundation',
      description:
        'Master core semantic tags, CSS Box Model, media queries, CSS variables, and modern fluid layouts.',
      estimatedHours: '12 Hours',
      tags: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design'],
      reasonForInclusion:
        htmlCssScore < 50
          ? `Curated based on foundational deficit (${htmlCssScore}% score in Web Fundamentals). Building core layout mechanics.`
          : `Reinforcing responsive layout and CSS Grid principles (${htmlCssScore}% score).`,
      skillScoreAtGeneration: htmlCssScore,
      resources: DOMAIN_RESOURCES['html_css_basics'],
    });
  }

  // Level 2: JavaScript ES6+ Fluency
  // If candidate is low in JS, include syntax + DOM basics; if moderate, focus on Async & Closures
  if (jsScore < 80) {
    nodes.push({
      id: 'fs_js_core',
      title: jsScore < 50 ? 'JavaScript ES6+ Language Essentials' : 'Modern JavaScript & Asynchronous Programming',
      subtitle: jsScore < 50 ? 'Variables, Functions, DOM Manipulation & Event Loop' : 'Promises, Async/Await, Closures & Functional JS',
      category: 'Core Programming',
      domainName: 'JavaScript / TypeScript',
      nodeType: 'language',
      description:
        'Master ECMAScript standards, array methods (map, filter, reduce), lexical scope, fetch API, and asynchronous workflows.',
      estimatedHours: '20 Hours',
      tags: ['JavaScript ES6+', 'Async/Await', 'Event Loop', 'Fetch API', 'DOM'],
      reasonForInclusion:
        jsScore < 50
          ? `Curated to bridge critical programming gap (${jsScore}% in JavaScript). Essential before framework layer.`
          : `Advancing to asynchronous architectures and ES6+ modules (${jsScore}% score).`,
      skillScoreAtGeneration: jsScore,
      resources: DOMAIN_RESOURCES['javascript_core'],
    });
  }

  // Level 3: Frontend Component Framework (React 18+)
  nodes.push({
    id: 'fs_react_frontend',
    title: reactScore < 60 ? 'React 18 & Component-Driven UI' : 'Advanced React Architecture & Custom Hooks',
    subtitle: reactScore < 60 ? 'JSX, State Hooks, Props, Effect Lifecycles & Context' : 'Performance Optimization, Context State & Custom Hook Composition',
    category: 'Frontend Architecture',
    domainName: 'Frontend Frameworks',
    nodeType: 'core_concept',
    description:
      'Build scalable single-page web applications with React 18, Tailwind CSS, TypeScript, and clean component composition.',
    estimatedHours: '24 Hours',
    tags: ['React', 'Custom Hooks', 'Tailwind CSS', 'TypeScript', 'State Management'],
    reasonForInclusion:
      reactScore < 60
        ? `Targeted focus based on ${reactScore}% in Frontend Frameworks. Master UI reactivity and state flow.`
        : `Elevating to enterprise React design patterns and component optimization (${reactScore}% score).`,
    skillScoreAtGeneration: reactScore,
    resources: DOMAIN_RESOURCES['frontend_react'],
  });

  // Level 4: Milestone Mini-Project (Portfolio / Interactive Web App)
  nodes.push({
    id: 'fs_mini_project',
    title: 'Milestone Project: Interactive Web Dashboard',
    subtitle: 'Build & Deploy a Client-Side Responsive App with API Integration',
    category: 'Applied Portfolio Milestone',
    domainName: 'Applied Frontend',
    nodeType: 'mini_project',
    description:
      'Synthesize HTML5, Tailwind CSS, and React to build an interactive client-side application with live REST API data, loading skeletons, and dark mode.',
    estimatedHours: '16 Hours',
    tags: ['React App', 'API Integration', 'Responsive UI', 'Vite', 'Tailwind'],
    reasonForInclusion:
      'Practical synthesis milestone: Validate frontend craftsmanship and component engineering before backend transition.',
    skillScoreAtGeneration: reactScore,
    resources: DOMAIN_RESOURCES['frontend_react'],
    projectSpec: {
      objective: 'Create a fully interactive Analytics or Movie Discovery Dashboard with search, filter, and theme switching.',
      deliverables: [
        'Responsive layout supporting mobile and desktop',
        'State-managed search with debounced REST API queries',
        'Error boundary and elegant empty/loading skeleton states',
      ],
      starterStack: ['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
    },
  });

  // Level 5: Server-Side Backend (Node.js & Express REST APIs)
  nodes.push({
    id: 'fs_backend_nodejs',
    title: 'Node.js & Express RESTful API Architecture',
    subtitle: 'Routing, Middleware, JWT Authentication & Error Pipelines',
    category: 'Backend Engineering',
    domainName: 'Backend & Servers',
    nodeType: 'backend_service',
    description:
      'Develop scalable HTTP microservices, secure JSON Web Token authentication, rate limiting, and structured REST endpoints.',
    estimatedHours: '22 Hours',
    tags: ['Node.js', 'Express', 'JWT Auth', 'RESTful API', 'Middleware'],
    reasonForInclusion:
      nodeScore < 50
        ? `Critical gap resolution (${nodeScore}% in Backend Systems). Learn server architecture and request lifecycle.`
        : `Engineering high-throughput REST APIs and auth middleware (${nodeScore}% score).`,
    skillScoreAtGeneration: nodeScore,
    resources: DOMAIN_RESOURCES['backend_nodejs'],
  });

  // Level 6: Databases (SQL Relational & MongoDB Atlas)
  nodes.push({
    id: 'fs_database_layer',
    title: 'DBMS: Relational SQL & NoSQL Architecture',
    subtitle: 'PostgreSQL / MySQL Schema Design, Indexing & MongoDB Document Stores',
    category: 'Data Persistence',
    domainName: 'Databases & SQL',
    nodeType: 'database_layer',
    description:
      'Design normalized 3NF relational schemas, write multi-table JOIN queries, implement database indexing, and configure MongoDB Atlas.',
    estimatedHours: '18 Hours',
    tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'ACID Transactions', 'Indexing'],
    reasonForInclusion:
      dbScore < 60
        ? `Bridging persistence deficit (${dbScore}% in Database Concepts). Master relational and document data modeling.`
        : `Database query optimization, transaction locking, and ORM modeling (${dbScore}% score).`,
    skillScoreAtGeneration: dbScore,
    resources: DOMAIN_RESOURCES['database_sql_nosql'],
  });

  // Level 7: Full Stack Integration, Microservices & Docker
  nodes.push({
    id: 'fs_integration',
    title: 'Full Stack Integration, Caching & Containerization',
    subtitle: 'Connecting React UI with Node API, Redis Caching & Docker Deployment',
    category: 'Full Stack Integration',
    domainName: 'Systems Architecture',
    nodeType: 'integration',
    description:
      'Connect frontend state with backend endpoints, implement CORS security, Redis query caching, and package the app into multi-stage Docker containers.',
    estimatedHours: '20 Hours',
    tags: ['Full Stack', 'Docker', 'Redis', 'CORS Security', 'Environment Config'],
    reasonForInclusion:
      'Bridging client and server into a unified production-ready software lifecycle.',
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  // Level 8: Major Capstone Project (Full Stack SaaS)
  nodes.push({
    id: 'fs_major_project',
    title: 'Major Capstone: Production-Grade Full-Stack SaaS',
    subtitle: 'End-to-End Application with Authentication, Database, Payments & Cloud Deploy',
    category: 'Production Capstone',
    domainName: 'Capstone Project',
    nodeType: 'major_project',
    description:
      'Architect, test, and deploy a comprehensive enterprise SaaS application featuring role-based access control (RBAC), database persistence, and live cloud deployment.',
    estimatedHours: '35 Hours',
    tags: ['Full Stack SaaS', 'RBAC Auth', 'Cloud CI/CD', 'Production Database', 'Portfolio Ready'],
    reasonForInclusion:
      'Flagship recruiter evidence: Demonstrates ability to ship production software from zero to cloud deployment.',
    resources: DOMAIN_RESOURCES['fullstack_capstone'],
    projectSpec: {
      objective: 'Build an AI Prompt Studio, Team Collaboration Workspace, or E-Commerce Marketplace.',
      deliverables: [
        'Secure user authentication with JWT and refresh token rotation',
        'Database with normalized relational models and ACID migrations',
        'Live deployment with CI/CD pipeline and verified domain',
      ],
      starterStack: ['React', 'Node.js', 'PostgreSQL / MongoDB', 'Docker', 'Tailwind'],
    },
  });

  // Level 9: Diagnostic Skill Re-Assessment & Placement Checkpoint
  nodes.push({
    id: 'fs_reassessment',
    title: 'Diagnostic Skill Re-Assessment & Placement Audit',
    subtitle: 'Verify 85%+ Competency Across All Full-Stack Domains',
    category: 'Verification Checkpoint',
    domainName: 'Skill Certification',
    nodeType: 'assessment_checkpoint',
    description:
      'Retake the 50-Question Full-Stack Diagnostic Assessment to objectively verify your updated proficiency, earn industry-ready certification, and unlock direct recruiter matching.',
    estimatedHours: '2 Hours',
    tags: ['Skill Assessment', 'Recruiter Verification', 'Benchmark Pass', 'Industry Ready'],
    reasonForInclusion:
      'Continuous progression validation: Confirms that newly acquired coursework translates into verified domain mastery.',
    resources: DOMAIN_RESOURCES['fullstack_capstone'],
  });

  return nodes;
}

/**
 * 2. Machine Learning & MLOps Path
 */
function buildMachineLearningPath(
  overallScore: number,
  getDomainScore: (keywords: string[]) => number
): Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] {
  const pythonScore = getDomainScore(['python', 'programming', 'syntax']);
  const mathScore = getDomainScore(['math', 'linear algebra', 'statistics', 'calculus']);
  const mlScore = getDomainScore(['machine learning', 'supervised', 'scikit']);
  const dlScore = getDomainScore(['deep learning', 'neural', 'nlp', 'vision']);

  const nodes: Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] = [];

  if (pythonScore < 70) {
    nodes.push({
      id: 'ml_python_numpy',
      title: 'Python for Data & Vectorized Computing',
      subtitle: 'NumPy Arrays, Vectorization, Pandas DataFrames & Visualization',
      category: 'Data Science Core',
      domainName: 'Python Computing',
      nodeType: 'language',
      description: 'Master array broadcasting, matrix multiplication with NumPy, and high-performance data manipulation in Pandas.',
      estimatedHours: '16 Hours',
      tags: ['Python', 'NumPy', 'Pandas', 'Vectorization'],
      reasonForInclusion: `Curated to bridge numerical computing foundation (${pythonScore}% in Python).`,
      skillScoreAtGeneration: pythonScore,
      resources: DOMAIN_RESOURCES['data_science_analytics'],
    });
  }

  nodes.push({
    id: 'ml_algorithms',
    title: 'Supervised & Unsupervised Machine Learning',
    subtitle: 'Regression, Decision Trees, Random Forests, SVM & Clustering',
    category: 'Applied Machine Learning',
    domainName: 'ML Algorithms',
    nodeType: 'core_concept',
    description: 'Learn cost functions, gradient descent optimization, feature engineering, and cross-validation metrics.',
    estimatedHours: '24 Hours',
    tags: ['Scikit-Learn', 'Gradient Descent', 'Classification', 'Regression'],
    reasonForInclusion: `Core requirement for ML Engineer (${mlScore}% score in ML Algorithms).`,
    skillScoreAtGeneration: mlScore,
    resources: DOMAIN_RESOURCES['ml_foundations'],
  });

  nodes.push({
    id: 'ml_mini_project',
    title: 'Milestone Project: Predictive Churn or Pricing Model',
    subtitle: 'End-to-End Data Pipeline, Feature Extraction & Model Evaluation',
    category: 'Applied Portfolio Milestone',
    domainName: 'Applied ML',
    nodeType: 'mini_project',
    description: 'Build, tune, and evaluate a production Scikit-learn predictive model using real-world tabular data.',
    estimatedHours: '18 Hours',
    tags: ['EDA', 'Feature Engineering', 'ROC-AUC', 'Hyperparameter Tuning'],
    reasonForInclusion: 'Hands-on practical validation: Demonstrate algorithmic intuition before neural network architectures.',
    resources: DOMAIN_RESOURCES['ml_foundations'],
  });

  nodes.push({
    id: 'ml_deep_learning',
    title: 'Deep Learning & Neural Architectures',
    subtitle: 'PyTorch / TensorFlow, Backpropagation, CNNs & Transformer Attention',
    category: 'Deep Learning & AI',
    domainName: 'Deep Learning',
    nodeType: 'core_concept',
    description: 'Build multi-layer perceptrons, convolutional image filters, and modern Transformer sequence models from scratch.',
    estimatedHours: '28 Hours',
    tags: ['PyTorch', 'TensorFlow', 'Transformers', 'CNNs', 'Backprop'],
    reasonForInclusion: `Mastering deep neural architectures for modern AI applications (${dlScore}% score).`,
    skillScoreAtGeneration: dlScore,
    resources: DOMAIN_RESOURCES['deep_learning_nlp'],
  });

  nodes.push({
    id: 'ml_mlops_production',
    title: 'MLOps: Model Deployment, Docker & Vertex AI',
    subtitle: 'FastAPI Model Inference, Drift Monitoring & Containerization',
    category: 'Production MLOps',
    domainName: 'MLOps & Systems',
    nodeType: 'backend_service',
    description: 'Package trained models into high-concurrency FastAPI microservices, containerize with Docker, and monitor feature drift.',
    estimatedHours: '24 Hours',
    tags: ['FastAPI', 'Docker', 'Vertex AI', 'Data Drift', 'CI/CD for ML'],
    reasonForInclusion: 'Crucial bridge from experimental notebooks to scalable production infrastructure.',
    resources: DOMAIN_RESOURCES['ml_foundations'],
  });

  nodes.push({
    id: 'ml_major_capstone',
    title: 'Major Capstone: Autonomous AI Agent / Vision Intelligence Platform',
    subtitle: 'Production LLM Rag Pipeline / Multi-Modal Classification Service',
    category: 'Production Capstone',
    domainName: 'Capstone Project',
    nodeType: 'major_project',
    description: 'Architect a full-stack AI-driven application featuring vector embeddings, LangChain / LlamaIndex retrieval, and cloud serving.',
    estimatedHours: '35 Hours',
    tags: ['RAG Pipeline', 'Vector Database', 'FastAPI', 'Production Serving'],
    reasonForInclusion: 'Signature portfolio artifact for hiring managers and recruiters.',
    resources: DOMAIN_RESOURCES['deep_learning_nlp'],
  });

  nodes.push({
    id: 'ml_reassessment',
    title: 'ML Diagnostic Skill Re-Assessment & Benchmark Verification',
    subtitle: 'Validate 85%+ Accuracy in Linear Algebra, Algorithms & MLOps',
    category: 'Verification Checkpoint',
    domainName: 'Skill Certification',
    nodeType: 'assessment_checkpoint',
    description: 'Verify your end-to-end Machine Learning Engineer competencies to unlock verified recruiter endorsements.',
    estimatedHours: '2 Hours',
    tags: ['Skill Assessment', 'Recruiter Verified', 'Benchmark Pass'],
    reasonForInclusion: 'Validate comprehensive mastery across statistical models, deep networks, and deployment pipelines.',
    resources: DOMAIN_RESOURCES['ml_foundations'],
  });

  return nodes;
}

/**
 * 3. Data Scientist Path
 */
function buildDataScientistPath(
  overallScore: number,
  getDomainScore: (keywords: string[]) => number
): Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] {
  const statsScore = getDomainScore(['stat', 'probability', 'hypothesis']);
  const pythonScore = getDomainScore(['python', 'pandas']);
  const sqlScore = getDomainScore(['sql', 'query', 'database']);

  const nodes: Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] = [];

  nodes.push({
    id: 'ds_python_pandas',
    title: 'Statistical Python & Advanced Pandas Analytics',
    subtitle: 'Data Wrangling, Aggregations, Exploratory Data Analysis (EDA)',
    category: 'Data Science Core',
    domainName: 'Data Wrangling',
    nodeType: 'language',
    description: 'Perform advanced data transformations, handle missing values, reshape datasets, and engineer statistical features.',
    estimatedHours: '18 Hours',
    tags: ['Python', 'Pandas', 'NumPy', 'EDA'],
    reasonForInclusion: `Targeted data manipulation foundation (${pythonScore}% in Python).`,
    skillScoreAtGeneration: pythonScore,
    resources: DOMAIN_RESOURCES['data_science_analytics'],
  });

  nodes.push({
    id: 'ds_advanced_sql',
    title: 'Advanced SQL & Data Warehousing',
    subtitle: 'Window Functions, CTEs, Joins & BigQuery Optimization',
    category: 'Data Persistence',
    domainName: 'SQL Analytics',
    nodeType: 'database_layer',
    description: 'Write complex window analytic functions (RANK, ROW_NUMBER, LAG/LEAD), recursive CTEs, and optimize warehouse queries.',
    estimatedHours: '16 Hours',
    tags: ['SQL', 'Window Functions', 'BigQuery', 'CTEs'],
    reasonForInclusion: `Core data extraction competency (${sqlScore}% in SQL).`,
    skillScoreAtGeneration: sqlScore,
    resources: DOMAIN_RESOURCES['database_sql_nosql'],
  });

  nodes.push({
    id: 'ds_statistics_inference',
    title: 'Applied Inferential Statistics & A/B Testing',
    subtitle: 'Hypothesis Testing, P-values, Bayesian Inference & Causal Analysis',
    category: 'Statistical Foundations',
    domainName: 'Statistics',
    nodeType: 'core_concept',
    description: 'Master parametric/non-parametric tests, sample size power calculations, variance estimation, and experimentation frameworks.',
    estimatedHours: '22 Hours',
    tags: ['A/B Testing', 'Hypothesis Tests', 'Probability', 'P-values'],
    reasonForInclusion: `Bridging statistical inference gap (${statsScore}% in Statistics).`,
    skillScoreAtGeneration: statsScore,
    resources: DOMAIN_RESOURCES['data_science_analytics'],
  });

  nodes.push({
    id: 'ds_mini_project',
    title: 'Milestone Project: Interactive Business Intelligence Dashboard',
    subtitle: 'Statistical EDA & Executive Dashboard with Streamlit / Tableau',
    category: 'Applied Portfolio Milestone',
    domainName: 'Data Visualization',
    nodeType: 'mini_project',
    description: 'Build an interactive web-based data dashboard uncovering actionable executive insights from raw multi-million row datasets.',
    estimatedHours: '16 Hours',
    tags: ['Streamlit', 'Plotly', 'Data Storytelling', 'BI Dashboard'],
    reasonForInclusion: 'Demonstrate actionable business translation and data storytelling capability.',
    resources: DOMAIN_RESOURCES['data_science_analytics'],
  });

  nodes.push({
    id: 'ds_machine_learning',
    title: 'Predictive Modeling & Statistical Machine Learning',
    subtitle: 'GLMs, Logistic Regression, Ensemble Methods & SHAP Interpretability',
    category: 'Applied Machine Learning',
    domainName: 'Predictive Analytics',
    nodeType: 'core_concept',
    description: 'Build robust predictive models, tune hyperparameters with Optuna, and explain feature impacts using SHAP and LIME.',
    estimatedHours: '24 Hours',
    tags: ['Scikit-Learn', 'SHAP Values', 'XGBoost', 'Optuna'],
    reasonForInclusion: 'Essential predictive analytics skill required across enterprise data teams.',
    resources: DOMAIN_RESOURCES['ml_foundations'],
  });

  nodes.push({
    id: 'ds_major_capstone',
    title: 'Major Capstone: End-to-End Analytics & Customer Churn Engine',
    subtitle: 'Automated ETL Pipeline, Predictive Model & Interactive Web App',
    category: 'Production Capstone',
    domainName: 'Capstone Project',
    nodeType: 'major_project',
    description: 'Develop an end-to-end data pipeline feeding a real-time risk score prediction model with cloud deployment.',
    estimatedHours: '32 Hours',
    tags: ['ETL Pipeline', 'Prediction Engine', 'Cloud Deployment', 'Portfolio Ready'],
    reasonForInclusion: 'Comprehensive showcase demonstrating full data science lifecycle to corporate recruiters.',
    resources: DOMAIN_RESOURCES['data_science_analytics'],
  });

  nodes.push({
    id: 'ds_reassessment',
    title: 'Data Science Diagnostic Re-Assessment Checkpoint',
    subtitle: 'Verify 85%+ Readiness Across SQL, Statistics & Predictive Modeling',
    category: 'Verification Checkpoint',
    domainName: 'Skill Certification',
    nodeType: 'assessment_checkpoint',
    description: 'Retake the Data Scientist assessment to certify your verified score on your public student profile.',
    estimatedHours: '2 Hours',
    tags: ['Skill Assessment', 'Recruiter Verification', 'Benchmark Pass'],
    reasonForInclusion: 'Validation checkpoint to unlock direct recruiter interview recommendations.',
    resources: DOMAIN_RESOURCES['data_science_analytics'],
  });

  return nodes;
}

/**
 * 4. Cloud DevOps Engineering Path
 */
function buildCloudDevOpsPath(
  overallScore: number,
  getDomainScore: (keywords: string[]) => number
): Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] {
  const linuxScore = getDomainScore(['linux', 'bash', 'terminal']);
  const cloudScore = getDomainScore(['cloud', 'aws', 'gcp', 'azure']);
  const dockerScore = getDomainScore(['docker', 'container', 'kubernetes']);

  const nodes: Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] = [];

  nodes.push({
    id: 'cdo_linux_shell',
    title: 'Linux Systems & Advanced Shell Scripting',
    subtitle: 'Filesystem Hierarchy, Permissions, Networking, Bash Automation',
    category: 'Systems Foundations',
    domainName: 'Linux & Scripting',
    nodeType: 'language',
    description: 'Master bash scripting, SSH keys, cron automations, process management, and networking diagnostics (netstat, curl, iptables).',
    estimatedHours: '16 Hours',
    tags: ['Linux', 'Bash', 'Networking', 'SSH'],
    reasonForInclusion: `Foundational systems competency (${linuxScore}% in Linux).`,
    skillScoreAtGeneration: linuxScore,
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  nodes.push({
    id: 'cdo_docker_containers',
    title: 'Docker Containerization & Multi-Stage Builds',
    subtitle: 'Dockerfile Optimization, Storage Volumes, Networks & Docker Compose',
    category: 'Container Technologies',
    domainName: 'Containerization',
    nodeType: 'core_concept',
    description: 'Containerize complex polyglot microservices, minimize image layers, configure healthchecks, and manage multi-container stacks.',
    estimatedHours: '18 Hours',
    tags: ['Docker', 'Containers', 'Docker Compose', 'Multi-stage Builds'],
    reasonForInclusion: `Core DevOps pillar (${dockerScore}% in Containerization).`,
    skillScoreAtGeneration: dockerScore,
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  nodes.push({
    id: 'cdo_kubernetes_orchestration',
    title: 'Kubernetes Container Orchestration (K8s)',
    subtitle: 'Pods, Deployments, Services, Ingress Controllers, ConfigMaps & Helm',
    category: 'Cloud Infrastructure',
    domainName: 'Kubernetes',
    nodeType: 'core_concept',
    description: 'Deploy auto-healing, auto-scaling application clusters, configure zero-downtime rolling updates, and package Helm charts.',
    estimatedHours: '24 Hours',
    tags: ['Kubernetes', 'K8s', 'Helm', 'Ingress', 'Auto-scaling'],
    reasonForInclusion: 'Enterprise standard for orchestrating containerized production microservices.',
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  nodes.push({
    id: 'cdo_cicd_pipelines',
    title: 'Automated CI/CD Pipelines with GitHub Actions',
    subtitle: 'Automated Testing, Security Scanning (SAST), Artifact Registries & Deployments',
    category: 'Automation & CI/CD',
    domainName: 'CI/CD Pipelines',
    nodeType: 'backend_service',
    description: 'Author robust GitHub Actions workflows triggered on Git commits, running linters, automated test suites, and Docker push actions.',
    estimatedHours: '20 Hours',
    tags: ['GitHub Actions', 'CI/CD', 'Automated Testing', 'GitOps'],
    reasonForInclusion: 'Core requirement to automate software delivery safely to production.',
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  nodes.push({
    id: 'cdo_terraform_iac',
    title: 'Infrastructure as Code (IaC) with Terraform & AWS',
    subtitle: 'Terraform Modules, State Management, VPCs, IAM, ECS & S3',
    category: 'Cloud Engineering',
    domainName: 'Cloud Infrastructure',
    nodeType: 'core_concept',
    description: 'Provision immutable cloud infrastructure programmatically using HashiCorp Terraform modules on AWS or GCP.',
    estimatedHours: '22 Hours',
    tags: ['Terraform', 'IaC', 'AWS', 'VPC', 'IAM'],
    reasonForInclusion: `Enterprise cloud provisioning standard (${cloudScore}% in Cloud Infrastructure).`,
    skillScoreAtGeneration: cloudScore,
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  nodes.push({
    id: 'cdo_major_capstone',
    title: 'Major Capstone: Automated Multi-Environment Cloud Platform',
    subtitle: 'Full CI/CD Pipeline, K8s Cluster, Prometheus/Grafana Monitoring & SSL Ingress',
    category: 'Production Capstone',
    domainName: 'Capstone Project',
    nodeType: 'major_project',
    description: 'Provision a complete cloud-native infrastructure with Terraform, automated GitHub Actions deployment, and real-time observability.',
    estimatedHours: '35 Hours',
    tags: ['Terraform', 'Kubernetes', 'Prometheus', 'Grafana', 'CI/CD'],
    reasonForInclusion: 'Comprehensive evidence demonstrating senior cloud infrastructure craftsmanship.',
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  nodes.push({
    id: 'cdo_reassessment',
    title: 'Cloud DevOps Diagnostic Re-Assessment Checkpoint',
    subtitle: 'Certify 85%+ Benchmark in Containers, Orchestration & Cloud Infrastructure',
    category: 'Verification Checkpoint',
    domainName: 'Skill Certification',
    nodeType: 'assessment_checkpoint',
    description: 'Pass the diagnostic assessment to verify your cloud infrastructure capabilities and earn verified recruiter status.',
    estimatedHours: '2 Hours',
    tags: ['Skill Assessment', 'Recruiter Verified', 'Benchmark Pass'],
    reasonForInclusion: 'Validation milestone to unlock high-tier cloud engineer placements.',
    resources: DOMAIN_RESOURCES['devops_docker_kubernetes'],
  });

  return nodes;
}

/**
 * 5. Cybersecurity & SOC Analysis Path
 */
function buildCybersecurityPath(
  overallScore: number,
  getDomainScore: (keywords: string[]) => number
): Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] {
  const nodes: Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] = [];

  nodes.push({
    id: 'sec_networking',
    title: 'Network Security & Packet Diagnostics',
    subtitle: 'TCP/IP Protocols, Firewalls, Wireshark Packet Capture & Port Scanning',
    category: 'Security Foundations',
    domainName: 'Network Security',
    nodeType: 'foundation',
    description: 'Analyze live network packet captures with Wireshark, detect malicious port scans, and configure stateful firewall rules.',
    estimatedHours: '18 Hours',
    tags: ['Wireshark', 'TCP/IP', 'Firewalls', 'Network Protocols'],
    reasonForInclusion: 'Foundational baseline for any cybersecurity defensive analyst.',
    resources: DOMAIN_RESOURCES['cybersecurity_soc'],
  });

  nodes.push({
    id: 'sec_siem_soc',
    title: 'SOC Operations & SIEM Threat Detection (Splunk / Chronicle)',
    subtitle: 'Log Aggregation, Threat Hunting, Correlation Rules & Alert Triage',
    category: 'SOC Analysis',
    domainName: 'Security Operations',
    nodeType: 'core_concept',
    description: 'Write search queries in Splunk, correlate anomalous authentication spikes, and document incident response tickets.',
    estimatedHours: '22 Hours',
    tags: ['SIEM', 'Splunk', 'Threat Hunting', 'Log Analysis'],
    reasonForInclusion: 'Direct practical training for entry-level Security Operations Center (SOC) roles.',
    resources: DOMAIN_RESOURCES['cybersecurity_soc'],
  });

  nodes.push({
    id: 'sec_vuln_assessment',
    title: 'Vulnerability Assessment & Penetration Testing Basics',
    subtitle: 'Nmap Scanning, OWASP Top 10 Web Vulnerabilities & CVE Mitigation',
    category: 'Offensive & Defensive Security',
    domainName: 'Threat Assessment',
    nodeType: 'core_concept',
    description: 'Discover vulnerabilities with Nmap and Burp Suite, reproduce SQL injection and XSS exploits, and write mitigation patches.',
    estimatedHours: '24 Hours',
    tags: ['OWASP Top 10', 'Nmap', 'Burp Suite', 'Vulnerability Scanning'],
    reasonForInclusion: 'Understanding offensive attacker vectors to harden defensive perimeters.',
    resources: DOMAIN_RESOURCES['cybersecurity_soc'],
  });

  nodes.push({
    id: 'sec_major_capstone',
    title: 'Major Capstone: Simulated Enterprise SOC Incident Response Lab',
    subtitle: 'Investigate Live Multi-Stage Ransomware Attack & Author Forensic Report',
    category: 'Production Capstone',
    domainName: 'Capstone Project',
    nodeType: 'major_project',
    description: 'Analyze telemetry across endpoints, reconstruct attacker timeline, remediate vulnerabilities, and author an executive report.',
    estimatedHours: '30 Hours',
    tags: ['Incident Response', 'Digital Forensics', 'Malware Analysis', 'Executive Report'],
    reasonForInclusion: 'High-impact portfolio piece demonstrating rigorous investigative ability.',
    resources: DOMAIN_RESOURCES['cybersecurity_soc'],
  });

  nodes.push({
    id: 'sec_reassessment',
    title: 'Cybersecurity Diagnostic Re-Assessment Checkpoint',
    subtitle: 'Validate 85%+ Competency Across SOC, Cryptography & Network Defense',
    category: 'Verification Checkpoint',
    domainName: 'Skill Certification',
    nodeType: 'assessment_checkpoint',
    description: 'Pass the diagnostic assessment to verify cybersecurity analyst readiness.',
    estimatedHours: '2 Hours',
    tags: ['Skill Assessment', 'Recruiter Verified', 'Benchmark Pass'],
    reasonForInclusion: 'Certification checkpoint to unlock verified security opportunities.',
    resources: DOMAIN_RESOURCES['cybersecurity_soc'],
  });

  return nodes;
}

/**
 * 6. UI/UX & Product Design Path
 */
function buildUIUXPath(
  overallScore: number,
  getDomainScore: (keywords: string[]) => number
): Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] {
  const nodes: Omit<AdaptiveJourneyNode, 'level' | 'expReward' | 'status'>[] = [];

  nodes.push({
    id: 'ux_research_heuristics',
    title: 'User Experience Research & Usability Heuristics',
    subtitle: 'Nielsen Norman Heuristics, User Personas, Empathy Maps & Journey Flows',
    category: 'UX Research',
    domainName: 'UX Principles',
    nodeType: 'foundation',
    description: 'Conduct qualitative user interviews, synthesize user affinity diagrams, and evaluate interfaces against 10 usability heuristics.',
    estimatedHours: '16 Hours',
    tags: ['UX Research', 'User Personas', 'Heuristic Evaluation', 'Journey Mapping'],
    reasonForInclusion: 'Core foundation for human-centered digital product design.',
    resources: DOMAIN_RESOURCES['ui_ux_design'],
  });

  nodes.push({
    id: 'ui_figma_systems',
    title: 'Figma Mastery, Design Systems & Auto-Layout Math',
    subtitle: 'Typography Scaling, 8pt Grid Math, Component Variants & Design Tokens',
    category: 'Visual & UI Design',
    domainName: 'UI Systems',
    nodeType: 'core_concept',
    description: 'Build robust Figma design systems with auto-layout, nested component properties, color token variables, and responsive constraints.',
    estimatedHours: '22 Hours',
    tags: ['Figma', 'Design Systems', 'Auto-Layout', 'Design Tokens'],
    reasonForInclusion: 'Industry standard design software and component crafting workflows.',
    resources: DOMAIN_RESOURCES['ui_ux_design'],
  });

  nodes.push({
    id: 'ui_interactive_prototyping',
    title: 'Interactive Micro-Interactions & Usability Testing',
    subtitle: 'Figma Smart Animate, Accessible Contrast (WCAG AA), Rapid Prototyping',
    category: 'Prototyping & Testing',
    domainName: 'Interactive Prototyping',
    nodeType: 'core_concept',
    description: 'Create high-fidelity clickable prototypes with micro-interactions, conduct unmoderated usability testing, and iterate designs.',
    estimatedHours: '20 Hours',
    tags: ['Smart Animate', 'WCAG AA Accessibility', 'Usability Testing', 'Prototypes'],
    reasonForInclusion: 'Validating design decisions through interactive tactile user testing.',
    resources: DOMAIN_RESOURCES['ui_ux_design'],
  });

  nodes.push({
    id: 'ui_major_capstone',
    title: 'Major Capstone: End-to-End Mobile & Web Product Case Study',
    subtitle: 'Complete Problem-to-Solution Case Study Documenting Research to High-Fi Figma Prototype',
    category: 'Production Capstone',
    domainName: 'Capstone Project',
    nodeType: 'major_project',
    description: 'Research, architect, wireframe, and prototype a complete commercial application with documented case study for hiring teams.',
    estimatedHours: '32 Hours',
    tags: ['Case Study', 'Figma Prototype', 'UX Portfolio', 'Recruiter Ready'],
    reasonForInclusion: 'Primary portfolio asset required for product design job applications.',
    resources: DOMAIN_RESOURCES['ui_ux_design'],
  });

  nodes.push({
    id: 'ui_reassessment',
    title: 'UI/UX Diagnostic Re-Assessment Checkpoint',
    subtitle: 'Verify 85%+ Competency in Design Systems, Typography & Usability Testing',
    category: 'Verification Checkpoint',
    domainName: 'Skill Certification',
    nodeType: 'assessment_checkpoint',
    description: 'Pass the diagnostic assessment to verify your product design competencies.',
    estimatedHours: '2 Hours',
    tags: ['Skill Assessment', 'Recruiter Verified', 'Benchmark Pass'],
    reasonForInclusion: 'Certification checkpoint to unlock verified design opportunities.',
    resources: DOMAIN_RESOURCES['ui_ux_design'],
  });

  return nodes;
}

/**
 * Helpers
 */
function calculateEstimatedRoleScore(role: CareerGoalRole, skills: Skill[]): number {
  const verified = skills.filter((s) => s.verified);
  if (verified.length > 0) {
    const avg = verified.reduce((acc, s) => acc + s.proficiency, 0) / verified.length;
    return Math.round(avg);
  }
  return 42; // Default baseline if unassessed
}

function getReadinessTierLabel(score: number): string {
  if (score >= 85) return 'Role Ready (Outstanding)';
  if (score >= 70) return 'High Competency (Very Good)';
  if (score >= 50) return 'Concept Solidification (Good)';
  if (score >= 35) return 'Requires Coursework (Emerging)';
  return 'Immediate Action Required (Foundational)';
}

function generateDiagnosticSummary(
  role: CareerGoalRole,
  score: number,
  departments: DepartmentAnalysis[]
): string {
  if (departments.length === 0) {
    return `Curated standard progressive roadmap for ${role}. Complete the 50-Question Diagnostic Assessment to dynamically tailor this path to your exact domain competencies.`;
  }

  const weakDomains = departments.filter((d) => d.scorePercent < 50).map((d) => d.department);
  const strongDomains = departments.filter((d) => d.scorePercent >= 75).map((d) => d.department);

  let summary = `Adaptive curriculum tailored for ${role} based on your ${score}% diagnostic assessment score.`;

  if (weakDomains.length > 0) {
    summary += ` Prioritizing foundational building blocks in ${weakDomains.join(', ')}.`;
  }
  if (strongDomains.length > 0) {
    summary += ` Fast-tracked advanced modules in ${strongDomains.join(', ')} due to verified competency.`;
  }

  return summary;
}
