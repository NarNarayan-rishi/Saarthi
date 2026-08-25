import { RoleAssessmentQuestion, CareerGoalRole } from '../types';

export interface DiagnosticQuestion extends RoleAssessmentQuestion {
  skill: string;
}

export const DATA_SCIENTIST_DIAGNOSTIC_QUESTIONS: RoleAssessmentQuestion[] = [
  // 1. Python (Questions 1 - 2)
  {
    id: 1,
    role: 'Data Scientist',
    department: 'Python',
    courseName: 'Python for Data Science & Pandas',
    difficulty: 'Easy',
    question: "In Python's pandas library, which method is specifically designed to filter DataFrame rows by their integer position index rather than label index?",
    options: ['df.loc[]', 'df.iloc[]', 'df.filter()', 'df.at[]'],
    correctIndex: 1,
    explanation: 'df.iloc[] provides purely integer-location based indexing for selection by position (from 0 to length-1), while df.loc[] is label-based indexing.',
  },
  {
    id: 2,
    role: 'Data Scientist',
    department: 'Python',
    courseName: 'Python for Data Science & Pandas',
    difficulty: 'Moderate',
    question: 'What is the primary operational difference between a Python generator expression (x**2 for x in range(10000)) and a list comprehension [x**2 for x in range(10000)]?',
    options: [
      'A generator loads all 10,000 computed elements into memory immediately, whereas a list evaluates lazily.',
      'A generator yields values lazily on demand via the iterator protocol with O(1) auxiliary memory, whereas a list allocates memory for all elements upfront.',
      'A generator creates an immutable tuple, whereas a list comprehension produces a mutable dictionary.',
      'Generators can only execute inside asynchronous async/await event loops across multi-threaded workers.',
    ],
    correctIndex: 1,
    explanation: 'Generator expressions produce elements lazily on demand without allocating the entire list in RAM, resulting in minimal constant O(1) memory overhead.',
  },

  // 2. SQL (Questions 3 - 4)
  {
    id: 3,
    role: 'Data Scientist',
    department: 'SQL',
    courseName: 'Relational SQL & Database Querying',
    difficulty: 'Easy',
    question: 'Which SQL clause is used to filter groups of rows after an aggregate function (such as COUNT, AVG, or SUM) and GROUP BY have been applied?',
    options: ['WHERE', 'HAVING', 'QUALIFY', 'ORDER BY'],
    correctIndex: 1,
    explanation: 'The HAVING clause filters aggregated summary groups produced by GROUP BY, whereas WHERE filters individual rows prior to aggregation.',
  },
  {
    id: 4,
    role: 'Data Scientist',
    department: 'SQL',
    courseName: 'Relational SQL & Database Querying',
    difficulty: 'Moderate',
    question: 'In SQL window functions, what is the key difference between RANK() and DENSE_RANK() when dealing with tied values?',
    options: [
      'RANK() leaves gaps in ranking numbers after a tie (e.g., 1, 1, 3), whereas DENSE_RANK() does not skip ranking numbers (e.g., 1, 1, 2).',
      'DENSE_RANK() assigns rankings randomly for tied records, whereas RANK() throws a syntax collision error.',
      'RANK() can only be computed over PARTITION BY clauses without ORDER BY.',
      'DENSE_RANK() is only available in NoSQL document databases.',
    ],
    correctIndex: 0,
    explanation: 'RANK() skips subsequent ranks when duplicates occur (e.g., ties at rank 1 produce 1, 1, 3), while DENSE_RANK() assigns consecutive integers without gaps (1, 1, 2).',
  },

  // 3. Statistics (Questions 5 - 6)
  {
    id: 5,
    role: 'Data Scientist',
    department: 'Statistics',
    courseName: 'Applied Probability & Inferential Statistics',
    difficulty: 'Easy',
    question: 'In hypothesis testing, what does a p-value strictly lower than the pre-specified significance level alpha (e.g., p < 0.05) indicate?',
    options: [
      'The null hypothesis is proven to be 100% true with zero probability of error.',
      'The observed data is sufficiently unlikely under the assumption that the null hypothesis is true, leading to rejection of the null hypothesis.',
      'The alternative hypothesis is false and the experiment must be discarded.',
      'The statistical power of the test was zero.',
    ],
    correctIndex: 1,
    explanation: 'A p-value below alpha indicates that the observed sample difference is statistically significant under the null hypothesis, providing sufficient evidence to reject the null hypothesis.',
  },
  {
    id: 6,
    role: 'Data Scientist',
    department: 'Statistics',
    courseName: 'Applied Probability & Inferential Statistics',
    difficulty: 'Moderate',
    question: 'According to the Central Limit Theorem (CLT), what happens to the sampling distribution of the sample mean as sample size n becomes sufficiently large?',
    options: [
      'It converges to a uniform distribution between 0 and 1.',
      'It approximates a normal distribution with mean equal to the population mean and standard error sigma/sqrt(n), regardless of the shape of the underlying population (given finite variance).',
      'The standard error increases proportionally with n squared.',
      'The sample variance becomes zero.',
    ],
    correctIndex: 1,
    explanation: 'The Central Limit Theorem states that the distribution of sample means approaches a Gaussian (normal) distribution as n increases, provided the population has a finite variance.',
  },

  // 4. Machine Learning (Questions 7 - 8)
  {
    id: 7,
    role: 'Data Scientist',
    department: 'Machine Learning',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Easy',
    question: 'What condition occurs when a machine learning model achieves near-zero error on training data but exhibits poor accuracy and high variance on unseen validation data?',
    options: [
      'Underfitting (High Bias)',
      'Overfitting (High Variance)',
      'Covariate Shift',
      'Data Imbalance',
    ],
    correctIndex: 1,
    explanation: 'Overfitting occurs when a complex model memorizes noise and sample-specific quirks in the training dataset, resulting in high variance and failure to generalize to new data.',
  },
  {
    id: 8,
    role: 'Data Scientist',
    department: 'Machine Learning',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Moderate',
    question: 'When evaluating a binary classification model on a heavily imbalanced dataset (e.g., 99% negative class, 1% positive fraud class), which evaluation metric is most informative?',
    options: [
      'Standard Classification Accuracy',
      'Precision-Recall AUC (PR-AUC) or F1-Score on the minority class',
      'Mean Squared Error (MSE)',
      'R-Squared (Coefficient of Determination)',
    ],
    correctIndex: 1,
    explanation: 'Standard accuracy is deceptive on imbalanced data because predicting only the majority class achieves 99% accuracy while missing all positive cases. PR-AUC and F1-score measure precision and recall directly on the minority class.',
  },

  // 5. Data Visualization (Questions 9 - 10)
  {
    id: 9,
    role: 'Data Scientist',
    department: 'Data Visualization',
    courseName: 'Data Visualization & Storytelling',
    difficulty: 'Easy',
    question: 'Which visualization type is most effective for displaying the five-number summary (minimum, Q1, median, Q3, maximum) and identifying outliers in continuous numerical distributions?',
    options: [
      'Pie Chart',
      'Box Plot (Box-and-Whisker Plot)',
      'Stacked Area Chart',
      'Donut Chart',
    ],
    correctIndex: 1,
    explanation: 'Box plots succinctly convey median, interquartile range (IQR), skewness, and individual outlier points beyond 1.5 * IQR for continuous variables.',
  },
  {
    id: 10,
    role: 'Data Scientist',
    department: 'Data Visualization',
    courseName: 'Data Visualization & Storytelling',
    difficulty: 'Moderate',
    question: 'In exploratory data analysis (EDA), what is the primary diagnostic utility of a Heatmap generated from a Pearson Correlation Matrix?',
    options: [
      'To evaluate the non-linear clustering of categorical labels.',
      'To visually identify linear collinearity, positive/negative associations, and redundant features among numerical variables.',
      'To measure the distribution of model prediction residual errors.',
      'To trace chronological time-series trends.',
    ],
    correctIndex: 1,
    explanation: 'A correlation heatmap maps pairwise linear correlation coefficients between features (-1 to +1), highlighting multicollinearity and strong feature associations quickly.',
  },
];

export const DS_BENCHMARKS: Record<string, number> = {
  Python: 80,
  'Machine Learning': 75,
  SQL: 70,
  Statistics: 70,
  'Data Visualization': 65,
};
