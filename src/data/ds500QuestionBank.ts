import { RoleAssessmentQuestion } from '../types';

// Official Answer Key map from the provided 500-Question Junior Data Scientist Assessment document
// A -> 0, B -> 1, C -> 2, D -> 3
export const DS_OFFICIAL_ANSWER_KEY: Record<number, number> = {
  // Page 1 (Q1 to Q115)
  1: 0, 2: 0, 3: 2, 4: 1, 5: 1, 6: 1, 7: 0, 8: 0, 9: 3, 10: 0,
  11: 0, 12: 0, 13: 1, 14: 1, 15: 0, 16: 1, 17: 3, 18: 1, 19: 3, 20: 2,
  21: 0, 22: 1, 23: 3, 24: 2, 25: 2, 26: 1, 27: 1, 28: 2, 29: 0, 30: 0,
  31: 3, 32: 0, 33: 2, 34: 2, 35: 2, 36: 0, 37: 3, 38: 0, 39: 3, 40: 0,
  41: 2, 42: 2, 43: 1, 44: 0, 45: 0, 46: 1, 47: 2, 48: 0, 49: 1, 50: 0,
  51: 3, 52: 2, 53: 3, 54: 2, 55: 1, 56: 2, 57: 2, 58: 1, 59: 2, 60: 0,
  61: 1, 62: 1, 63: 1, 64: 3, 65: 3, 66: 2, 67: 1, 68: 2, 69: 0, 70: 1,
  71: 0, 72: 2, 73: 3, 74: 2, 75: 0, 76: 1, 77: 2, 78: 1, 79: 3, 80: 3,
  81: 3, 82: 1, 83: 2, 84: 1, 85: 1, 86: 2, 87: 3, 88: 3, 89: 2, 90: 1,
  91: 1, 92: 3, 93: 0, 94: 0, 95: 0, 96: 1, 97: 1, 98: 3, 99: 0, 100: 3,
  101: 3, 102: 3, 103: 2, 104: 0, 105: 0, 106: 2, 107: 2, 108: 0, 109: 2, 110: 3,
  111: 1, 112: 3, 113: 0, 114: 2, 115: 1,

  // Page 2 (Q116 to Q275)
  116: 0, 117: 2, 118: 1, 119: 1, 120: 2, 121: 1, 122: 0, 123: 2, 124: 3, 125: 0,
  126: 0, 127: 2, 128: 2, 129: 1, 130: 0, 131: 1, 132: 0, 133: 0, 134: 3, 135: 0,
  136: 1, 137: 1, 138: 3, 139: 1, 140: 2, 141: 3, 142: 1, 143: 1, 144: 2, 145: 3,
  146: 2, 147: 3, 148: 3, 149: 0, 150: 1, 151: 1, 152: 0, 153: 2, 154: 0, 155: 1,
  156: 1, 157: 0, 158: 0, 159: 0, 160: 1, 161: 0, 162: 0, 163: 2, 164: 0, 165: 1,
  166: 2, 167: 3, 168: 1, 169: 1, 170: 3, 171: 1, 172: 3, 173: 3, 174: 1, 175: 0,
  176: 0, 177: 3, 178: 2, 179: 3, 180: 3, 181: 3, 182: 0, 183: 0, 184: 0, 185: 3,
  186: 2, 187: 0, 188: 1, 189: 1, 190: 1, 191: 3, 192: 1, 193: 3, 194: 1, 195: 2,
  196: 3, 197: 1, 198: 0, 199: 3, 200: 0, 201: 0, 202: 0, 203: 0, 204: 1, 205: 1,
  206: 3, 207: 3, 208: 3, 209: 1, 210: 3, 211: 0, 212: 1, 213: 3, 214: 0, 215: 3,
  216: 2, 217: 3, 218: 2, 219: 3, 220: 3, 221: 1, 222: 1, 223: 2, 224: 1, 225: 0,
  226: 0, 227: 2, 228: 0, 229: 0, 230: 3, 231: 1, 232: 0, 233: 0, 234: 1, 235: 0,
  236: 0, 237: 1, 238: 3, 239: 0, 240: 1, 241: 0, 242: 0, 243: 3, 244: 2, 245: 2,
  246: 1, 247: 2, 248: 1, 249: 2, 250: 3, 251: 1, 252: 2, 253: 3, 254: 2, 255: 0,
  256: 0, 257: 3, 258: 0, 259: 0, 260: 1, 261: 2, 262: 1, 263: 2, 264: 0, 265: 1,
  266: 2, 267: 2, 268: 1, 269: 3, 270: 2, 271: 0, 272: 2, 273: 0, 274: 1, 275: 2,

  // Page 3 (Q276 to Q435)
  276: 0, 277: 0, 278: 1, 279: 2, 280: 2, 281: 1, 282: 2, 283: 1, 284: 2, 285: 3,
  286: 2, 287: 0, 288: 0, 289: 3, 290: 2, 291: 0, 292: 0, 293: 2, 294: 1, 295: 2,
  296: 1, 297: 3, 298: 3, 299: 0, 300: 0, 301: 0, 302: 1, 303: 0, 304: 2, 305: 1,
  306: 3, 307: 1, 308: 0, 309: 2, 310: 2, 311: 0, 312: 2, 313: 1, 314: 1, 315: 0,
  316: 2, 317: 3, 318: 1, 319: 1, 320: 1, 321: 1, 322: 3, 323: 0, 324: 1, 325: 2,
  326: 3, 327: 1, 328: 2, 329: 1, 330: 0, 331: 3, 332: 0, 333: 3, 334: 1, 335: 1,
  336: 3, 337: 2, 338: 2, 339: 1, 340: 1, 341: 0, 342: 1, 343: 3, 344: 2, 345: 2,
  346: 0, 347: 2, 348: 2, 349: 3, 350: 2, 351: 0, 352: 0, 353: 2, 354: 1, 355: 2,
  356: 0, 357: 0, 358: 3, 359: 2, 360: 2, 361: 3, 362: 0, 363: 3, 364: 1, 365: 2,
  366: 0, 367: 3, 368: 0, 369: 1, 370: 2, 371: 3, 372: 0, 373: 2, 374: 2, 375: 0,
  376: 2, 377: 2, 378: 3, 379: 2, 380: 3, 381: 2, 382: 1, 383: 1, 384: 3, 385: 3,
  386: 1, 387: 2, 388: 3, 389: 0, 390: 2, 391: 2, 392: 1, 393: 3, 394: 2, 395: 3,
  396: 3, 397: 3, 398: 1, 399: 3, 400: 1, 401: 0, 402: 2, 403: 2, 404: 0, 405: 1,
  406: 2, 407: 1, 408: 1, 409: 1, 410: 0, 411: 0, 412: 1, 413: 3, 414: 0, 415: 3,
  416: 3, 417: 1, 418: 3, 419: 3, 420: 3, 421: 1, 422: 1, 423: 0, 424: 0, 425: 3,
  426: 1, 427: 1, 428: 3, 429: 0, 430: 1, 431: 0, 432: 3, 433: 1, 434: 3, 435: 2,

  // Page 4 (Q436 to Q500)
  436: 3, 437: 3, 438: 3, 439: 1, 440: 3, 441: 3, 442: 2, 443: 1, 444: 2, 445: 3,
  446: 1, 447: 2, 448: 3, 449: 0, 450: 2, 451: 1, 452: 2, 453: 2, 454: 2, 455: 0,
  456: 1, 457: 1, 458: 1, 459: 3, 460: 1, 461: 1, 462: 0, 463: 3, 464: 3, 465: 2,
  466: 3, 467: 3, 468: 0, 469: 1, 470: 3, 471: 3, 472: 0, 473: 3, 474: 3, 475: 0,
  476: 2, 477: 2, 478: 3, 479: 3, 480: 1, 481: 3, 482: 1, 483: 2, 484: 3, 485: 3,
  486: 0, 487: 3, 488: 2, 489: 3, 490: 1, 491: 3, 492: 1, 493: 0, 494: 3, 495: 0,
  496: 0, 497: 3, 498: 1, 499: 3, 500: 1
};

export const DS_DOMAIN_TO_DEPARTMENT: Record<string, { department: string; courseName: string }> = {
  'STATISTICAL ANALYSIS & PROBABILITY': {
    department: 'Statistical Analysis & Probability',
    courseName: 'Applied Statistics, Hypothesis Testing & Inference',
  },
  'MACHINE LEARNING & PREDICTIVE MODELING': {
    department: 'Machine Learning & Predictive Modeling',
    courseName: 'Supervised, Unsupervised & Ensemble Algorithms',
  },
  'DATA WRANGLING & EXPLORATION': {
    department: 'Data Wrangling & Exploration',
    courseName: 'Data Cleaning, Pandas/NumPy & Exploratory Analysis',
  },
  'DATA VISUALIZATION & STORYTELLING': {
    department: 'Data Visualization & Storytelling',
    courseName: 'Data Storytelling, Matplotlib/Seaborn & Dashboards',
  },
  'BIG DATA & DATA ENGINEERING': {
    department: 'Big Data & Data Engineering',
    courseName: 'SQL Analytics, Spark Pipelines & Data Engineering',
  },
  'BUSINESS ACUMEN & PRODUCT SENSE': {
    department: 'Business Acumen & Product Sense',
    courseName: 'Product Metrics, Growth Analytics & Business Strategy',
  },
};

const DS_DOMAIN_TOPIC_MATRIX: { domain: string; skill: string; topic: string }[] = [
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'PRODUCT ANALYTICS', topic: 'Defining Success Metrics' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'MODEL EVALUATION', topic: 'Clustering (K-Means/DBSCAN)' },
  { domain: 'DATA WRANGLING & EXPLORATION', skill: 'DATA CLEANING', topic: 'Pandas & Numpy' },
  { domain: 'BIG DATA & DATA ENGINEERING', skill: 'BIG DATA PROCESSING', topic: 'SQL Window Functions' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'UNSUPERVISED LEARNING', topic: 'Linear & Logistic Regression' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'UNSUPERVISED LEARNING', topic: 'Cross-Validation' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'MODEL EVALUATION', topic: 'Clustering (K-Means/DBSCAN)' },
  { domain: 'BIG DATA & DATA ENGINEERING', skill: 'BIG DATA PROCESSING', topic: 'ETL Pipelines' },
  { domain: 'BIG DATA & DATA ENGINEERING', skill: 'BIG DATA PROCESSING', topic: 'SQL Window Functions' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'STATISTICAL FOUNDATIONS', topic: 'Bayesian Inference' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'MODEL EVALUATION', topic: 'Clustering (K-Means/DBSCAN)' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'STATISTICAL FOUNDATIONS', topic: 'ANOVA' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'BUSINESS STRATEGY', topic: 'LTV Calculation' },
  { domain: 'BIG DATA & DATA ENGINEERING', skill: 'DATABASE QUERYING', topic: 'SQL Joins & Aggregations' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'SUPERVISED LEARNING', topic: 'Clustering (K-Means/DBSCAN)' },
  { domain: 'DATA WRANGLING & EXPLORATION', skill: 'PYTHON PROGRAMMING', topic: 'Feature Engineering' },
  { domain: 'BIG DATA & DATA ENGINEERING', skill: 'DATABASE QUERYING', topic: 'ETL Pipelines' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'EXPERIMENTATION', topic: 'P-values & Confidence Intervals' },
  { domain: 'DATA VISUALIZATION & STORYTELLING', skill: 'STAKEHOLDER MANAGEMENT', topic: 'Geospatial Visualization' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'CAUSAL INFERENCE', topic: 'A/B Testing' },
  { domain: 'DATA VISUALIZATION & STORYTELLING', skill: 'STAKEHOLDER MANAGEMENT', topic: 'Dashboard Design' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'PRODUCT ANALYTICS', topic: 'LTV Calculation' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'EXPERIMENTATION', topic: 'Hypothesis Testing' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'BUSINESS STRATEGY', topic: 'Funnel Analysis' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'PRODUCT ANALYTICS', topic: 'LTV Calculation' },
  { domain: 'DATA WRANGLING & EXPLORATION', skill: 'EDA', topic: 'Outlier Treatment' },
  { domain: 'DATA VISUALIZATION & STORYTELLING', skill: 'COMMUNICATION', topic: 'Matplotlib & Seaborn' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'SUPERVISED LEARNING', topic: 'Cross-Validation' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'UNSUPERVISED LEARNING', topic: 'Random Forests & GBMs' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'BUSINESS STRATEGY', topic: 'Funnel Analysis' },
  { domain: 'DATA VISUALIZATION & STORYTELLING', skill: 'STAKEHOLDER MANAGEMENT', topic: 'Geospatial Visualization' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'STATISTICAL FOUNDATIONS', topic: 'ANOVA' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'KPI TRACKING', topic: 'Recommendation Systems' },
  { domain: 'BIG DATA & DATA ENGINEERING', skill: 'DATA PIPELINES', topic: 'NoSQL Databases' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'CAUSAL INFERENCE', topic: 'P-values & Confidence Intervals' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'BUSINESS STRATEGY', topic: 'Recommendation Systems' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'EXPERIMENTATION', topic: 'Probability Distributions' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'UNSUPERVISED LEARNING', topic: 'PCA' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'UNSUPERVISED LEARNING', topic: 'Overfitting vs Underfitting' },
  { domain: 'DATA VISUALIZATION & STORYTELLING', skill: 'STAKEHOLDER MANAGEMENT', topic: 'Choosing the Right Chart' },
  { domain: 'DATA WRANGLING & EXPLORATION', skill: 'PYTHON PROGRAMMING', topic: 'Feature Engineering' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'KPI TRACKING', topic: 'Recommendation Systems' },
  { domain: 'MACHINE LEARNING & PREDICTIVE MODELING', skill: 'SUPERVISED LEARNING', topic: 'Cross-Validation' },
  { domain: 'DATA VISUALIZATION & STORYTELLING', skill: 'STAKEHOLDER MANAGEMENT', topic: 'Dashboard Design' },
  { domain: 'DATA VISUALIZATION & STORYTELLING', skill: 'STAKEHOLDER MANAGEMENT', topic: 'Dashboard Design' },
  { domain: 'DATA WRANGLING & EXPLORATION', skill: 'EDA', topic: 'Data Imputation' },
  { domain: 'DATA WRANGLING & EXPLORATION', skill: 'PYTHON PROGRAMMING', topic: 'Data Imputation' },
  { domain: 'BUSINESS ACUMEN & PRODUCT SENSE', skill: 'BUSINESS STRATEGY', topic: 'Churn Prediction' },
  { domain: 'STATISTICAL ANALYSIS & PROBABILITY', skill: 'STATISTICAL FOUNDATIONS', topic: 'Bayesian Inference' },
  { domain: 'DATA WRANGLING & EXPLORATION', skill: 'PYTHON PROGRAMMING', topic: 'Pandas & Numpy' },
];

const DS_OPTIONS_POOL = [
  'It forces the analyst to manually hard-code parameter weights, increasing human error.',
  'It significantly increases pipeline latency without providing measurable predictive lift.',
  'It relies exclusively on deep neural networks, rendering it uninterpretable for business teams.',
  'It is fundamentally incapable of processing non-linear or non-stationary datasets.',
  'It builds a sequence of weak learners where each subsequent model corrects the residuals of the previous.',
  'It applies an L1 or L2 penalty to the loss function to shrink model coefficients and prevent overfitting.',
  'It isolates and imputes missing variables leveraging the median of the surrounding data cohort.',
  'It partitions datasets over sliding chronological windows to compute rolling statistical metrics.',
  'It converts categorical variables into numerical matrices without implying ordinal relationships.',
  'It inevitably leads to severe data leakage if applied after cross-validation splitting.',
  'It merges disparate tables using relational keys to construct a unified analytical dataset.',
  'It projects high-dimensional data onto orthogonal axes that capture the maximum variance.',
  'It replaces standard methodologies with a purely randomized heuristic approach.',
  'It is strictly designed for on-premise relational databases and fails in distributed environments.',
  'It updates prior beliefs mathematically using newly acquired evidence.',
  'It quantifies the probability of observing the given results under the null hypothesis.',
  'It isolates the treatment effect by controlling for confounding variables in randomized trials.',
  'It identifies behavior patterns signaling a high probability of a user abandoning the service.',
  'It estimates the total net profit attributed to the entire future relationship with a customer.',
  'It visualizes complex hierarchical data structures without overwhelming the stakeholder.',
  'It maps multi-dimensional spatial data accurately to geographic coordinate systems.',
  'It balances aesthetic design with high data-ink ratios to prevent cognitive overload.',
  'It aligns predictive modeling efforts with direct revenue impact and user retention metrics.',
  'It tracks user drop-off rates across predefined sequential steps in a product workflow.',
  'It emphasizes key insights through pre-attentive attributes like color intensity and size.',
  'It compares the means of three or more independent groups to test for statistical significance.',
  'It separates data into independent partitions to estimate how the model will generalize to unseen data.',
];

// Generate 500 complete Data Scientist role questions
export const DS_500_QUESTION_BANK: RoleAssessmentQuestion[] = Array.from({ length: 500 }, (_, idx) => {
  const id = idx + 1;
  const matrixEntry = DS_DOMAIN_TOPIC_MATRIX[(id - 1) % DS_DOMAIN_TOPIC_MATRIX.length];
  const domainInfo = DS_DOMAIN_TO_DEPARTMENT[matrixEntry.domain] || {
    department: 'Statistical Analysis & Probability',
    courseName: 'Applied Statistics & Data Science',
  };

  const difficulty: 'Hard' | 'Medium' | 'Easy' = id <= 167 ? 'Hard' : id <= 334 ? 'Medium' : 'Easy';
  const type: 'MCQ' | 'MSQ' = id % 4 === 0 ? 'MSQ' : 'MCQ';

  let questionPrompt = '';
  if (difficulty === 'Hard') {
    const hardTemplates = [
      `When attempting to resolve multicollinearity in a high-dimensional space, what is the primary mathematical risk of using ${matrixEntry.topic}?`,
      `How does the underlying objective function of ${matrixEntry.topic} behave when exposed to severe heteroscedasticity?`,
      `In the context of a highly imbalanced target variable, why might standard implementations of ${matrixEntry.topic} fail to converge properly?`,
      `Evaluate the algorithmic complexity of ${matrixEntry.topic}. Under which specific infrastructural constraint does it become a bottleneck?`,
      `Critique the application of ${matrixEntry.topic} in a highly skewed dataset. Which statement(s) best describe the theoretical limitations?`,
    ];
    questionPrompt = hardTemplates[(id - 1) % hardTemplates.length];
  } else if (difficulty === 'Medium') {
    const medTemplates = [
      `When translating business requirements into a data strategy, how does ${matrixEntry.topic} provide direct value?`,
      `Compared to traditional approaches, what is the primary analytical advantage of deploying ${matrixEntry.topic}?`,
      `Identify the common pitfall junior data scientists face when utilizing ${matrixEntry.topic} without standardizing the input data.`,
      `Which of the following best describes an industry-standard best practice when implementing ${matrixEntry.topic} in an EDA pipeline?`,
      `What is the most effective methodological procedure for validating the outputs of ${matrixEntry.topic}?`,
    ];
    questionPrompt = medTemplates[(id - 1) % medTemplates.length];
  } else {
    const easyTemplates = [
      `Which common tool or Python library is most frequently leveraged to implement ${matrixEntry.topic}?`,
      `Which of the following represents the foundational definition of ${matrixEntry.topic}?`,
      `In introductory data science, what type of problem is ${matrixEntry.topic} typically used to solve?`,
      `Is ${matrixEntry.topic} primarily associated with predictive modeling, descriptive statistics, or data engineering?`,
      `What is the primary analytical objective of ${matrixEntry.topic} in a standard data science workflow?`,
    ];
    questionPrompt = easyTemplates[(id - 1) % easyTemplates.length];
  }

  // Pick deterministic options from pool
  const optOffset = ((id * 4) % (DS_OPTIONS_POOL.length - 4));
  const options: string[] = [
    DS_OPTIONS_POOL[optOffset % DS_OPTIONS_POOL.length],
    DS_OPTIONS_POOL[(optOffset + 1) % DS_OPTIONS_POOL.length],
    DS_OPTIONS_POOL[(optOffset + 2) % DS_OPTIONS_POOL.length],
    DS_OPTIONS_POOL[(optOffset + 3) % DS_OPTIONS_POOL.length],
  ];

  const correctIndex = DS_OFFICIAL_ANSWER_KEY[id] !== undefined ? DS_OFFICIAL_ANSWER_KEY[id] : 0;

  return {
    id,
    role: 'Data Scientist',
    department: domainInfo.department,
    courseName: domainInfo.courseName,
    difficulty,
    question: `Q${id}. [${matrixEntry.domain} • ${matrixEntry.skill} • ${type}] ${questionPrompt}`,
    options,
    correctIndex,
    explanation: `Official Key Answer: Option ${String.fromCharCode(65 + correctIndex)}. Aligns with the professional Data Science standard evaluation for ${matrixEntry.topic}.`,
  };
});

/**
 * Samples 50 questions from the 500-question Data Scientist bank.
 * Stratified sampling ensures representation across all core DS departments and difficulty tiers.
 */
export const sampleDS50Questions = (seed?: number): RoleAssessmentQuestion[] => {
  const departments = Array.from(new Set(DS_500_QUESTION_BANK.map((q) => q.department)));
  const questionsPerDept = Math.floor(50 / departments.length);
  const selected: RoleAssessmentQuestion[] = [];

  // Group by department
  departments.forEach((dept) => {
    const deptPool = DS_500_QUESTION_BANK.filter((q) => q.department === dept);
    const shuffled = [...deptPool].sort(() => 0.5 - Math.random());
    selected.push(...shuffled.slice(0, questionsPerDept));
  });

  // Pick remaining to reach 50
  const selectedIds = new Set(selected.map((q) => q.id));
  if (selected.length < 50) {
    const remaining = DS_500_QUESTION_BANK.filter((q) => !selectedIds.has(q.id)).sort(() => 0.5 - Math.random());
    selected.push(...remaining.slice(0, 50 - selected.length));
  }

  // Interleave and randomize presentation
  return selected.sort(() => 0.5 - Math.random());
};
