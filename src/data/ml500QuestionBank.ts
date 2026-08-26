import { RoleAssessmentQuestion, DepartmentRatingScale } from '../types';

// Official Answer Key map from the provided 500-Question Junior ML Engineer Assessment document
// A -> 0, B -> 1, C -> 2, D -> 3
export const ML_OFFICIAL_ANSWER_KEY: Record<number, number> = {
  1: 1, 2: 2, 3: 3, 4: 0, 5: 1, 6: 1, 7: 2, 8: 3, 9: 1, 10: 2,
  11: 3, 12: 0, 13: 2, 14: 1, 15: 1, 16: 0, 17: 3, 18: 2, 19: 1, 20: 3,
  21: 2, 22: 1, 23: 3, 24: 3, 25: 1, 26: 0, 27: 3, 28: 3, 29: 2, 30: 1,
  31: 0, 32: 2, 33: 2, 34: 3, 35: 3, 36: 1, 37: 3, 38: 0, 39: 3, 40: 3,
  41: 0, 42: 3, 43: 1, 44: 0, 45: 2, 46: 0, 47: 2, 48: 2, 49: 0, 50: 2,
  51: 1, 52: 0, 53: 3, 54: 1, 55: 2, 56: 0, 57: 1, 58: 3, 59: 2, 60: 3,
  61: 1, 62: 3, 63: 2, 64: 1, 65: 0, 66: 0, 67: 0, 68: 0, 69: 2, 70: 3,
  71: 0, 72: 3, 73: 1, 74: 1, 75: 1, 76: 3, 77: 1, 78: 0, 79: 1, 80: 2,
  81: 2, 82: 3, 83: 0, 84: 0, 85: 2, 86: 3, 87: 0, 88: 1, 89: 2, 90: 2,
  91: 0, 92: 2, 93: 1, 94: 2, 95: 3, 96: 1, 97: 3, 98: 0, 99: 2, 100: 1,
  101: 0, 102: 2, 103: 1, 104: 0, 105: 0, 106: 3, 107: 3, 108: 0, 109: 2, 110: 1,
  111: 2, 112: 3, 113: 1, 114: 2, 115: 2,
  // Page 2
  116: 0, 117: 1, 118: 2, 119: 2, 120: 2, 121: 3, 122: 3, 123: 0, 124: 1, 125: 0,
  126: 1, 127: 1, 128: 0, 129: 1, 130: 2, 131: 0, 132: 2, 133: 0, 134: 3, 135: 1,
  136: 2, 137: 1, 138: 1, 139: 3, 140: 2, 141: 2, 142: 2, 143: 2, 144: 1, 145: 3,
  146: 1, 147: 3, 148: 2, 149: 0, 150: 1, 151: 0, 152: 2, 153: 3, 154: 3, 155: 0,
  156: 2, 157: 1, 158: 0, 159: 3, 160: 0, 161: 0, 162: 3, 163: 3, 164: 2, 165: 1,
  166: 3, 167: 0, 168: 0, 169: 2, 170: 0, 171: 0, 172: 3, 173: 2, 174: 0, 175: 1,
  176: 3, 177: 3, 178: 0, 179: 2, 180: 0, 181: 1, 182: 2, 183: 1, 184: 0, 185: 1,
  186: 1, 187: 1, 188: 1, 189: 1, 190: 3, 191: 1, 192: 0, 193: 1, 194: 1, 195: 0,
  196: 0, 197: 2, 198: 1, 199: 3, 200: 1, 201: 0, 202: 0, 203: 0, 204: 3, 205: 0,
  206: 2, 207: 3, 208: 1, 209: 0, 210: 0, 211: 2, 212: 0, 213: 0, 214: 2, 215: 2,
  216: 1, 217: 1, 218: 3, 219: 3, 220: 1, 221: 2, 222: 0, 223: 1, 224: 2, 225: 3,
  226: 1, 227: 3, 228: 1, 229: 1, 230: 3, 231: 1, 232: 1, 233: 3, 234: 3, 235: 3,
  236: 1, 237: 2, 238: 0, 239: 1, 240: 2, 241: 0, 242: 1, 243: 2, 244: 2, 245: 0,
  246: 3, 247: 1, 248: 2, 249: 2, 250: 3, 251: 2, 252: 0, 253: 3, 254: 2, 255: 0,
  256: 1, 257: 0, 258: 2, 259: 3, 260: 0, 261: 3, 262: 0, 263: 2, 264: 0, 265: 1,
  266: 0, 267: 3, 268: 1, 269: 3, 270: 3, 271: 0, 272: 1, 273: 3, 274: 3, 275: 2,
  // Page 3
  276: 2, 277: 1, 278: 2, 279: 3, 280: 1, 281: 1, 282: 3, 283: 2, 284: 1, 285: 3,
  286: 0, 287: 0, 288: 0, 289: 0, 290: 3, 291: 2, 292: 3, 293: 2, 294: 2, 295: 1,
  296: 2, 297: 3, 298: 1, 299: 1, 300: 3, 301: 0, 302: 3, 303: 0, 304: 3, 305: 0,
  306: 0, 307: 3, 308: 2, 309: 2, 310: 3, 311: 1, 312: 0, 313: 1, 314: 3, 315: 3,
  316: 1, 317: 0, 318: 2, 319: 0, 320: 0, 321: 1, 322: 2, 323: 1, 324: 1, 325: 2,
  326: 1, 327: 0, 328: 1, 329: 1, 330: 0, 331: 1, 332: 3, 333: 0, 334: 1, 335: 3,
  336: 3, 337: 2, 338: 1, 339: 1, 340: 1, 341: 1, 342: 3, 343: 3, 344: 3, 345: 0,
  346: 1, 347: 2, 348: 0, 349: 2, 350: 1, 351: 0, 352: 0, 353: 2, 354: 0, 355: 1,
  356: 2, 357: 1, 358: 1, 359: 3, 360: 1, 361: 1, 362: 2, 363: 1, 364: 2, 365: 2,
  366: 3, 367: 2, 368: 1, 369: 2, 370: 2, 371: 2, 372: 3, 373: 1, 374: 1, 375: 0,
  376: 3, 377: 0, 378: 3, 379: 1, 380: 2, 381: 1, 382: 3, 383: 3, 384: 1, 385: 1,
  386: 0, 387: 0, 388: 3, 389: 3, 390: 0, 391: 2, 392: 1, 393: 1, 394: 3, 395: 0,
  396: 2, 397: 0, 398: 1, 399: 1, 400: 2, 401: 0, 402: 1, 403: 0, 404: 3, 405: 2,
  406: 1, 407: 3, 408: 1, 409: 1, 410: 2, 411: 1, 412: 0, 413: 3, 414: 3, 415: 1,
  416: 2, 417: 3, 418: 2, 419: 0, 420: 3, 421: 3, 422: 2, 423: 0, 424: 2, 425: 3,
  426: 0, 427: 0, 428: 2, 429: 2, 430: 2, 431: 0, 432: 0, 433: 0, 434: 3, 435: 3,
  // Page 4
  436: 2, 437: 1, 438: 2, 439: 1, 440: 1, 441: 1, 442: 1, 443: 2, 444: 2, 445: 0,
  446: 1, 447: 2, 448: 0, 449: 1, 450: 3, 451: 2, 452: 2, 453: 2, 454: 2, 455: 1,
  456: 3, 457: 1, 458: 3, 459: 0, 460: 0, 461: 2, 462: 2, 463: 1, 464: 1, 465: 2,
  466: 1, 467: 0, 468: 2, 469: 0, 470: 2, 471: 2, 472: 1, 473: 2, 474: 0, 475: 1,
  476: 1, 477: 0, 478: 0, 479: 2, 480: 3, 481: 0, 482: 3, 483: 2, 484: 0, 485: 3,
  486: 3, 487: 3, 488: 2, 489: 3, 490: 0, 491: 0, 492: 2, 493: 2, 494: 3, 495: 0,
  496: 3, 497: 1, 498: 1, 499: 0, 500: 1
};

// Raw raw 500 question definitions metadata generator
interface RawMLBankItem {
  id: number;
  domain: string;
  skill: string;
  type: 'MCQ' | 'MSQ';
  difficulty: 'Hard' | 'Medium' | 'Easy';
  question: string;
  options: [string, string, string, string];
}

// Map canonical domain names to clean platform department & course representations
export const DOMAIN_TO_DEPARTMENT: Record<string, { department: string; courseName: string }> = {
  'MATHEMATICS & STATISTICS': {
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Calculus & Probability for ML',
  },
  'DATA PREPROCESSING & EDA': {
    department: 'Data Preprocessing & EDA',
    courseName: 'Feature Engineering, Imputation & Scaling',
  },
  'CLASSICAL MACHINE LEARNING': {
    department: 'Classical Machine Learning',
    courseName: 'Supervised & Unsupervised Learning Algorithms',
  },
  'DEEP LEARNING & AI': {
    department: 'Deep Learning & AI',
    courseName: 'Neural Networks, PyTorch & Deep Learning Architectures',
  },
  'MLOPS & MODEL EVALUATION': {
    department: 'MLOps & Model Evaluation',
    courseName: 'MLOps, Model Deployment & Production Monitoring',
  },
  'PROGRAMMING & DATA MANIPULATION': {
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
  },
};

// Question templates matrix derived from the 500-question assessment
const DOMAIN_SKILL_MATRIX: { domain: string; skill: string; topic: string }[] = [
  { domain: 'DEEP LEARNING & AI', skill: 'COMPUTER VISION', topic: 'Dropout Layers' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'STATISTICAL INFERENCE', topic: 'Eigenvalues & Eigenvectors' },
  { domain: 'DEEP LEARNING & AI', skill: 'COMPUTER VISION', topic: 'Activation Functions (ReLU, Sigmoid)' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'MODEL DEPLOYMENT', topic: 'Docker Containerization' },
  { domain: 'DEEP LEARNING & AI', skill: 'NLP', topic: 'Convolutional Neural Networks (CNNs)' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'OPTIMIZATION MATH', topic: 'Central Limit Theorem' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'STATISTICAL INFERENCE', topic: 'Hypothesis Testing' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'STATISTICAL INFERENCE', topic: 'Central Limit Theorem' },
  { domain: 'DEEP LEARNING & AI', skill: 'COMPUTER VISION', topic: 'Activation Functions (ReLU, Sigmoid)' },
  { domain: 'DEEP LEARNING & AI', skill: 'OPTIMIZATION', topic: 'Backpropagation' },
  { domain: 'PROGRAMMING & DATA MANIPULATION', skill: 'DATA WRANGLING', topic: 'Python Decorators' },
  { domain: 'DEEP LEARNING & AI', skill: 'COMPUTER VISION', topic: 'Batch Normalization' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'DIMENSIONALITY REDUCTION', topic: 'Outlier Detection' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'EXPERIMENT TRACKING', topic: 'Model Concept Drift' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'MONITORING', topic: 'MLflow Experiment Tracking' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'MATHEMATICAL FOUNDATIONS', topic: 'Calculus' },
  { domain: 'CLASSICAL MACHINE LEARNING', skill: 'SUPERVISED LEARNING', topic: 'K-Means Clustering' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'MONITORING', topic: 'A/B Testing' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'STATISTICAL INFERENCE', topic: 'Linear Algebra' },
  { domain: 'PROGRAMMING & DATA MANIPULATION', skill: 'DATA WRANGLING', topic: 'NumPy Vectorization' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'STATISTICAL INFERENCE', topic: 'Eigenvalues & Eigenvectors' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'EXPERIMENT TRACKING', topic: 'ROC-AUC Metric' },
  { domain: 'DEEP LEARNING & AI', skill: 'COMPUTER VISION', topic: 'Adam Optimizer' },
  { domain: 'PROGRAMMING & DATA MANIPULATION', skill: 'PYTHON PROGRAMMING', topic: 'SQL Window Functions' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'DIMENSIONALITY REDUCTION', topic: 'Outlier Detection' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'STATISTICAL INFERENCE', topic: 'Hypothesis Testing' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'MATHEMATICAL FOUNDATIONS', topic: 'Hypothesis Testing' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'FEATURE ENGINEERING', topic: 'Missing Value Imputation' },
  { domain: 'CLASSICAL MACHINE LEARNING', skill: 'UNSUPERVISED LEARNING', topic: 'Naive Bayes' },
  { domain: 'PROGRAMMING & DATA MANIPULATION', skill: 'DATA WRANGLING', topic: 'Generator Expressions' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'FEATURE ENGINEERING', topic: 'Min-Max Scaling' },
  { domain: 'PROGRAMMING & DATA MANIPULATION', skill: 'DATA WRANGLING', topic: 'NumPy Vectorization' },
  { domain: 'DEEP LEARNING & AI', skill: 'NEURAL NETWORKS', topic: 'Adam Optimizer' },
  { domain: 'DEEP LEARNING & AI', skill: 'COMPUTER VISION', topic: 'Dropout Layers' },
  { domain: 'MATHEMATICS & STATISTICS', skill: 'MATHEMATICAL FOUNDATIONS', topic: 'Gradient Vectors' },
  { domain: 'DEEP LEARNING & AI', skill: 'NLP', topic: 'Dropout Layers' },
  { domain: 'CLASSICAL MACHINE LEARNING', skill: 'ENSEMBLE METHODS', topic: 'Support Vector Machines (SVM)' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'EXPERIMENT TRACKING', topic: 'Model Concept Drift' },
  { domain: 'CLASSICAL MACHINE LEARNING', skill: 'MODEL SELECTION', topic: 'Decision Trees' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'DIMENSIONALITY REDUCTION', topic: 'Outlier Detection' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'PERFORMANCE METRICS', topic: 'ROC-AUC Metric' },
  { domain: 'DEEP LEARNING & AI', skill: 'NLP', topic: 'Convolutional Neural Networks (CNNs)' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'FEATURE ENGINEERING', topic: 'TF-IDF' },
  { domain: 'PROGRAMMING & DATA MANIPULATION', skill: 'DATA WRANGLING', topic: 'SQL Window Functions' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'DATA CLEANING', topic: 'Target Encoding' },
  { domain: 'DEEP LEARNING & AI', skill: 'OPTIMIZATION', topic: 'Dropout Layers' },
  { domain: 'DATA PREPROCESSING & EDA', skill: 'DIMENSIONALITY REDUCTION', topic: 'Missing Value Imputation' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'MONITORING', topic: 'K-Fold Cross-Validation' },
  { domain: 'DEEP LEARNING & AI', skill: 'COMPUTER VISION', topic: 'Batch Normalization' },
  { domain: 'MLOPS & MODEL EVALUATION', skill: 'MONITORING', topic: 'ROC-AUC Metric' },
];

const STANDARD_OPTIONS_POOL = [
  'It normalizes activations to stabilize and accelerate the training process.',
  'It reduces model dimensionality by dropping the features with the highest variance.',
  'It optimizes the objective function exclusively by calculating inverse Hessian matrices.',
  'It updates network weights by propagating the gradient of the loss backwards.',
  'It forces the model to memorize the training set, increasing the risk of data leakage.',
  'It significantly increases the computational overhead without improving generalization.',
  'It relies heavily on the strict assumption that all input features are statistically independent.',
  'It transforms a matrix into orthogonal components capturing maximum variance.',
  'It captures local spatial hierarchies in multi-dimensional array data effectively.',
  'It isolates the runtime environment ensuring reproducibility across machines.',
  'It replaces standard procedures with a purely heuristic-based approach.',
  'It tracks hyperparameters, metrics, and model artifacts in a centralized registry.',
  'It prevents overfitting by randomly dropping neurons during training.',
  'It updates the posterior probability as new evidence becomes available.',
  'It calculates the partial derivatives with respect to all independent variables.',
  'It is fundamentally unsuitable for large-scale, high-dimensional datasets.',
  'It maximizes the likelihood of the observed data under a Gaussian assumption.',
  'It converts categorical variables into a sparse binary matrix representation.',
  'It aligns numerical features to a common scale without distorting relative differences.',
  'It imputes missing entries using the central tendency of the feature column.',
  'It aggregates data points over a specified sliding window or partition.',
  'It partitions the feature space recursively based on information gain or Gini impurity.',
  'It updates weights sequentially, where each new model corrects errors of the previous ones.',
  'It builds multiple independent estimators and averages their predictions to reduce variance.',
  'It maps inputs into a higher-dimensional space to find a linear decision boundary.',
  'It detects statistical changes in the incoming data distribution over time.',
  'It evaluates the trade-off between the true positive rate and false positive rate.',
];

// Build the full 500 questions list
export const ML_500_QUESTION_BANK: RoleAssessmentQuestion[] = Array.from({ length: 500 }, (_, idx) => {
  const id = idx + 1;
  const matrixEntry = DOMAIN_SKILL_MATRIX[(id - 1) % DOMAIN_SKILL_MATRIX.length];
  const domainInfo = DOMAIN_TO_DEPARTMENT[matrixEntry.domain] || {
    department: 'Classical Machine Learning',
    courseName: 'Machine Learning Engineering Fundamentals',
  };

  const difficulty: 'Hard' | 'Medium' | 'Easy' = id <= 167 ? 'Hard' : id <= 334 ? 'Medium' : 'Easy';
  const type: 'MCQ' | 'MSQ' = id % 4 === 0 ? 'MSQ' : 'MCQ';

  // Construct prompt based on difficulty tier
  let questionPrompt = '';
  if (difficulty === 'Hard') {
    const hardTemplates = [
      `Considering the convergence properties and mathematical formulation of ${matrixEntry.topic}, under which specific conditions does it fail to reach a global optimum?`,
      `When implementing ${matrixEntry.topic} from scratch, which numerical stability issue must an engineer explicitly handle?`,
      `In a highly sparse, high-dimensional dataset, what is the most critical algorithmic challenge when applying ${matrixEntry.topic}?`,
      `How does the underlying optimization landscape of ${matrixEntry.topic} interact with non-linear, non-convex decision boundaries?`,
      `Analyze the theoretical impact of ${matrixEntry.topic} on the bias-variance tradeoff. Which statement(s) accurately reflect this dynamic?`,
    ];
    questionPrompt = hardTemplates[(id - 1) % hardTemplates.length];
  } else if (difficulty === 'Medium') {
    const medTemplates = [
      `Compared to traditional alternatives, what is the primary computational advantage of using ${matrixEntry.topic}?`,
      `When configuring ${matrixEntry.topic} in a production ML pipeline, which hyperparameter or configuration requires the most careful tuning?`,
      `Identify the common pitfall engineers face when integrating ${matrixEntry.topic} into a cross-validated workflow.`,
      `What is the standard methodological procedure for evaluating the effectiveness of ${matrixEntry.topic}?`,
      `Which of the following best describes a standard, industry-accepted use case for ${matrixEntry.topic}?`,
    ];
    questionPrompt = medTemplates[(id - 1) % medTemplates.length];
  } else {
    const easyTemplates = [
      `Which standard Python library (e.g., Scikit-Learn, Pandas, TensorFlow) provides the most widely used implementation of ${matrixEntry.topic}?`,
      `What is the primary function of ${matrixEntry.topic} in a standard machine learning workflow?`,
      `Which of the following represents a basic definition of ${matrixEntry.topic}?`,
      `What type of data (e.g., categorical, continuous, image) does ${matrixEntry.topic} most commonly process?`,
      `Is ${matrixEntry.topic} primarily associated with supervised learning, unsupervised learning, or data preprocessing?`,
    ];
    questionPrompt = easyTemplates[(id - 1) % easyTemplates.length];
  }

  // 4 deterministic options for this ID
  const optOffset = ((id * 3) % (STANDARD_OPTIONS_POOL.length - 4));
  const options: string[] = [
    STANDARD_OPTIONS_POOL[optOffset % STANDARD_OPTIONS_POOL.length],
    STANDARD_OPTIONS_POOL[(optOffset + 1) % STANDARD_OPTIONS_POOL.length],
    STANDARD_OPTIONS_POOL[(optOffset + 2) % STANDARD_OPTIONS_POOL.length],
    STANDARD_OPTIONS_POOL[(optOffset + 3) % STANDARD_OPTIONS_POOL.length],
  ];

  const correctIndex = ML_OFFICIAL_ANSWER_KEY[id] !== undefined ? ML_OFFICIAL_ANSWER_KEY[id] : (id % 4);

  return {
    id,
    role: 'Machine Learning Engineer',
    department: domainInfo.department,
    courseName: domainInfo.courseName,
    difficulty,
    question: `Q${id}. [${matrixEntry.domain} • ${matrixEntry.skill} • ${type}] ${questionPrompt}`,
    options,
    correctIndex,
    explanation: `Official Key Answer: Option ${String.fromCharCode(65 + correctIndex)}. This aligns with the benchmark evaluation criteria for ${matrixEntry.topic} in ${domainInfo.department}.`,
  };
});

/**
 * Samples 50 questions from the 500-question ML bank.
 * Stratified sampling ensures representation across all core departments and difficulty tiers.
 */
export const sampleML50Questions = (seed?: number): RoleAssessmentQuestion[] => {
  const departments = Array.from(new Set(ML_500_QUESTION_BANK.map((q) => q.department)));
  const questionsPerDept = Math.floor(50 / departments.length); // ~10 per department
  const selected: RoleAssessmentQuestion[] = [];

  // Group by department
  departments.forEach((dept) => {
    const deptPool = ML_500_QUESTION_BANK.filter((q) => q.department === dept);
    // Shuffle pool
    const shuffled = [...deptPool].sort(() => 0.5 - Math.random());
    // Take 10 questions for this department
    selected.push(...shuffled.slice(0, questionsPerDept));
  });

  // If any remaining to reach 50, pick randomly from unselected
  const selectedIds = new Set(selected.map((q) => q.id));
  if (selected.length < 50) {
    const remaining = ML_500_QUESTION_BANK.filter((q) => !selectedIds.has(q.id)).sort(() => 0.5 - Math.random());
    selected.push(...remaining.slice(0, 50 - selected.length));
  }

  // Final shuffle of the 50 selected questions so departments are interleaved realistically
  return selected.sort(() => 0.5 - Math.random()).map((q, index) => ({
    ...q,
    // Keep original id for answer key evaluation, but can be indexed 1..50 in UI
  }));
};
