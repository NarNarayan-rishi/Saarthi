import {
  CareerGoalRole,
  RoleAssessmentQuestion,
  DepartmentAnalysis,
  GrandReadinessScale,
  ComprehensiveAssessmentResult,
  DepartmentRatingScale,
} from '../types';
import { ML_500_QUESTION_BANK, sampleML50Questions } from './ml500QuestionBank';
import { DS_500_QUESTION_BANK, sampleDS50Questions } from './ds500QuestionBank';
import { DATA_SCIENTIST_DIAGNOSTIC_QUESTIONS, DS_BENCHMARKS } from './dsDiagnosticData';

// ==========================================
// 50 QUESTIONS PER CAREER ROLE
// ==========================================

// 1. DATA SCIENTIST & MACHINE LEARNING ENGINEER (50 Questions)
const ML_QUESTIONS: RoleAssessmentQuestion[] = [
  // --- Department: Python & Core Programming (Questions 1-10) ---
  {
    id: 1,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Easy',
    question: 'In Python, which built-in data structure is mutable, ordered, and allows duplicate elements?',
    options: ['Tuple', 'List', 'Set', 'Dictionary keys view'],
    correctIndex: 1,
    explanation: 'Lists in Python are mutable sequences that preserve insertion order and can contain duplicate values.',
  },
  {
    id: 2,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Easy',
    question: 'What is the time complexity of looking up a key in a standard Python dictionary on average?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'Python dictionaries are implemented using hash tables, offering O(1) average-time complexity for key lookups.',
  },
  {
    id: 3,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Easy',
    question: 'Which statement correctly creates a generator in Python?',
    options: [
      'Using list comprehensions with square brackets []',
      'Using a function containing the yield keyword',
      'Using the return keyword inside a lambda',
      'Using the dict.fromkeys() method',
    ],
    correctIndex: 1,
    explanation: 'A function that contains the yield statement becomes a generator function, producing values lazily on demand.',
  },
  {
    id: 4,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Moderate',
    question: 'In NumPy, what is broadcasting?',
    options: [
      'Transmitting array data across distributed worker nodes in PySpark',
      'A mechanism that allows arithmetic operations between arrays of different shapes under compatible dimension rules',
      'Converting 2D dataframes to flat 1D contiguous memory buffers',
      'Serializing numerical matrices into binary JSON objects',
    ],
    correctIndex: 1,
    explanation: 'Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations without making unnecessary copies of data.',
  },
  {
    id: 5,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Moderate',
    question: 'What is the key difference between copy.copy() (shallow copy) and copy.deepcopy() in Python?',
    options: [
      'Shallow copy creates a new object and recursively inserts copies of nested objects, while deepcopy does not',
      'Shallow copy copies references of nested objects, whereas deepcopy recursively constructs copies of nested objects',
      'Deepcopy only works on primitive datatypes like integers and strings',
      'There is no performance difference between shallow copy and deep copy',
    ],
    correctIndex: 1,
    explanation: 'A shallow copy constructs a new compound object and inserts references to the original nested objects. A deep copy recursively duplicates child objects.',
  },
  {
    id: 6,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Moderate',
    question: 'In pandas, which method is most computationally efficient for applying a custom transformation row-wise across millions of rows?',
    options: [
      'Python standard for-loop with df.iterrows()',
      'df.apply() with a Python lambda function',
      'NumPy vectorized operations or np.vectorize / Cython backend',
      'df.itertuples() combined with list appends',
    ],
    correctIndex: 2,
    explanation: 'Vectorized operations execute in compiled C code at memory level and are orders of magnitude faster than iterating via iterrows() or row-wise apply().',
  },
  {
    id: 7,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Moderate',
    question: 'What is the purpose of the *args and **kwargs parameters in Python function definitions?',
    options: [
      'Enforcing strict static type checking at compile time',
      'Passing a variable number of positional and keyword arguments respectively',
      'Allocating C-style pointer addresses on the memory stack',
      'Restricting function execution to asynchronous event loops',
    ],
    correctIndex: 1,
    explanation: '*args allows passing an arbitrary number of positional arguments as a tuple, while **kwargs captures arbitrary keyword arguments as a dictionary.',
  },
  {
    id: 8,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Hard',
    question: 'What is Python’s Global Interpreter Lock (GIL) and its direct implication on CPU-bound machine learning tasks?',
    options: [
      'A hardware lock that restricts GPU tensor acceleration to single threads',
      'A mutex that allows only one native thread to execute Python bytecode at a time, making multiprocessing preferable over multi-threading for CPU-bound tasks',
      'A garbage collection lock that prevents memory leaks during matrix multiplication',
      'A security boundary preventing unauthorized OS socket access',
    ],
    correctIndex: 1,
    explanation: 'The GIL prevents multi-threaded CPython programs from executing pure Python bytecodes simultaneously on multiple CPU cores, necessitating multiprocessing for CPU parallelism.',
  },
  {
    id: 9,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Hard',
    question: 'What is the function of the __slots__ declaration in a Python class?',
    options: [
      'It restricts subclassing and method overriding',
      'It prevents creation of the instance __dict__, drastically reducing memory overhead for millions of object instances',
      'It automatically registers the class with the garbage collector cycle detector',
      'It creates multithreaded queues for instance variables',
    ],
    correctIndex: 1,
    explanation: '__slots__ explicitly reserves space for declared attributes, skipping the per-instance __dict__ and saving substantial RAM in high-volume object creation.',
  },
  {
    id: 10,
    role: 'Machine Learning Engineer',
    department: 'Python & Core Programming',
    courseName: 'Advanced Python for Data Science & ML',
    difficulty: 'Hard',
    question: 'When writing high-performance data processing pipelines, what does the memoryview object in Python provide?',
    options: [
      'A real-time GUI chart of heap memory utilization',
      'A way to slice and access buffer protocol memory without copying bytes',
      'A tool for converting float64 arrays into 8-bit quantized integers',
      'A caching wrapper for disk-based swaps',
    ],
    correctIndex: 1,
    explanation: 'memoryview allows Python code to access the internal data of an object that supports the buffer protocol without copying the memory bytes.',
  },

  // --- Department: Mathematics & Statistics (Questions 11-20) ---
  {
    id: 11,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Easy',
    question: 'Which measure of central tendency is least sensitive to extreme outliers in a skewed dataset?',
    options: ['Arithmetic Mean', 'Median', 'Standard Deviation', 'Variance'],
    correctIndex: 1,
    explanation: 'The median represents the 50th percentile and is robust against extreme values unlike the mean which is pulled toward heavy tails.',
  },
  {
    id: 12,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Easy',
    question: 'What is the determinant of a square matrix if its columns are linearly dependent?',
    options: ['1', '0', 'Infinity', 'Equal to the trace'],
    correctIndex: 1,
    explanation: 'If the columns or rows of a matrix are linearly dependent, the matrix is singular and its determinant is 0.',
  },
  {
    id: 13,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Easy',
    question: 'In probability theory, what does Bayes’ Theorem calculate?',
    options: [
      'The joint probability of independent random variables',
      'The posterior probability of an event given prior knowledge of conditions that might be related to the event',
      'The cumulative distribution function of a Gaussian curve',
      'The Pearson correlation coefficient between two continuous features',
    ],
    correctIndex: 1,
    explanation: 'Bayes’ Theorem calculates posterior probability: P(A|B) = [P(B|A) * P(A)] / P(B).',
  },
  {
    id: 14,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Moderate',
    question: 'What is the geometric interpretation of the dot product of two normalized (unit) vectors?',
    options: [
      'The area of the parallelogram formed by both vectors',
      'The cosine of the angle between them',
      'The Euclidean distance between the vector endpoints',
      'The ratio of their eigenvalues',
    ],
    correctIndex: 1,
    explanation: 'For unit vectors u and v, u · v = ||u|| ||v|| cos(θ) = 1 * 1 * cos(θ) = cos(θ), measuring cosine similarity.',
  },
  {
    id: 15,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Moderate',
    question: 'In hypothesis testing, what is a Type I error?',
    options: [
      'Failing to reject a false null hypothesis (False Negative)',
      'Rejecting a true null hypothesis (False Positive)',
      'Selecting a sample size that is too small for statistical power',
      'Having collinear features in a regression model',
    ],
    correctIndex: 1,
    explanation: 'A Type I error occurs when the null hypothesis is true, but is incorrectly rejected (false positive), bounded by alpha (significance level).',
  },
  {
    id: 16,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Moderate',
    question: 'What does Singular Value Decomposition (SVD) decompose a matrix A (m × n) into?',
    options: [
      'A = L * U (Lower and Upper triangular matrices)',
      'A = U * Σ * V^T (Orthogonal, diagonal singular values, and orthogonal matrices)',
      'A = Q * R (Orthogonal and upper triangular)',
      'A = P * D * P^(-1) (Eigenbasis decomposition for symmetric matrices only)',
    ],
    correctIndex: 1,
    explanation: 'SVD factorizes any m x n matrix into U (m x m orthogonal), Σ (m x n diagonal with singular values), and V^T (n x n orthogonal).',
  },
  {
    id: 17,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Moderate',
    question: 'According to the Central Limit Theorem (CLT), what happens to the sampling distribution of the sample mean as sample size n increases?',
    options: [
      'It approaches a uniform distribution',
      'It approaches a normal distribution regardless of the underlying population distribution, provided variance is finite',
      'Its variance increases proportionally to the square root of n',
      'It collapses into a single discrete delta point',
    ],
    correctIndex: 1,
    explanation: 'CLT establishes that the distribution of sample means approximates a normal distribution as n becomes large, with standard error = σ / sqrt(n).',
  },
  {
    id: 18,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Hard',
    question: 'In mathematical optimization for machine learning, what is the Hessian matrix?',
    options: [
      'A vector of first-order partial derivatives (gradient)',
      'A square matrix of second-order partial derivatives describing the local curvature of a multivariable function',
      'A projection matrix that maps high-dimensional tensors to lower Euclidean subspaces',
      'A matrix containing pairwise Euclidean distances between training points',
    ],
    correctIndex: 1,
    explanation: 'The Hessian matrix organizes all second-order partial derivatives and characterizes whether a stationary point is a local minimum, maximum, or saddle point.',
  },
  {
    id: 19,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Hard',
    question: 'What is the Kullback-Leibler (KL) Divergence D_KL(P || Q)?',
    options: [
      'A symmetric distance metric between two probability distributions',
      'A non-symmetric measure of the relative entropy or information lost when approximating distribution P with Q',
      'The covariance between two stochastic processes in discrete time',
      'The probability that distribution P was generated by a Markov chain',
    ],
    correctIndex: 1,
    explanation: 'KL divergence measures the expected excess surprise or information loss when using Q to model P. Note D_KL(P||Q) != D_KL(Q||P).',
  },
  {
    id: 20,
    role: 'Machine Learning Engineer',
    department: 'Mathematics & Statistics',
    courseName: 'Linear Algebra, Probability & Inferential Statistics',
    difficulty: 'Hard',
    question: 'Why is positive semi-definiteness a requirement for a valid covariance matrix or kernel Gram matrix?',
    options: [
      'To guarantee that all calculated variances are non-negative (x^T C x >= 0)',
      'To ensure the matrix has zero trace and unit determinant',
      'To allow inversion using basic Gaussian elimination without pivoting',
      'To force all off-diagonal correlation values to equal 0',
    ],
    correctIndex: 0,
    explanation: 'A covariance matrix must be positive semi-definite so that any linear combination of random variables has variance greater than or equal to zero.',
  },

  // --- Department: Machine Learning Algorithms (Questions 21-30) ---
  {
    id: 21,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Easy',
    question: 'Which of the following is a supervised machine learning algorithm used for classification?',
    options: ['K-Means Clustering', 'Logistic Regression', 'PCA (Principal Component Analysis)', 'DBSCAN'],
    correctIndex: 1,
    explanation: 'Logistic Regression is a supervised learning algorithm that maps inputs to probability estimates for discrete classification targets.',
  },
  {
    id: 22,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Easy',
    question: 'In classification, what metric is calculated as True Positives / (True Positives + False Positives)?',
    options: ['Recall (Sensitivity)', 'Precision', 'Accuracy', 'Specificity'],
    correctIndex: 1,
    explanation: 'Precision measures of all instances predicted as positive, what fraction was actually positive.',
  },
  {
    id: 23,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Easy',
    question: 'What is overfitting in machine learning?',
    options: [
      'When a model performs poorly on both training and test data due to insufficient complexity',
      'When a model learns noise and specifics of training data, performing excellently on training data but poorly on unseen test data',
      'When a model trains faster than expected',
      'When a model has zero bias and zero variance',
    ],
    correctIndex: 1,
    explanation: 'Overfitting happens when a model has high variance and models random noise in the training set rather than generalizing the underlying distribution.',
  },
  {
    id: 24,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Moderate',
    question: 'What is the primary difference between L1 Regularization (Lasso) and L2 Regularization (Ridge)?',
    options: [
      'L1 adds squared weights and penalizes large weights smoothly, while L2 adds absolute weights and produces sparse zero weights',
      'L1 adds absolute weights (|w|) promoting sparse weights (feature selection), while L2 adds squared weights (w^2) shrinking coefficients smoothly',
      'L1 regularization can only be applied to neural networks',
      'L2 regularization completely eliminates collinear features by setting them to zero',
    ],
    correctIndex: 1,
    explanation: 'Lasso (L1) uses the diamond geometry of the constraint region to drive non-informative feature weights to exact zero, serving as feature selection.',
  },
  {
    id: 25,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Moderate',
    question: 'How do Bagging (e.g., Random Forest) and Boosting (e.g., XGBoost, LightGBM) differ in ensemble construction?',
    options: [
      'Bagging trains decision trees sequentially to correct errors, whereas Boosting trains deep trees independently in parallel',
      'Bagging trains base estimators in parallel on bootstrap samples to reduce variance, while Boosting trains trees sequentially where each tree corrects predecessor residual errors to reduce bias',
      'Bagging is only for regression and Boosting is only for unsupervised clustering',
      'There is no algorithmic difference; they are synonymous terms',
    ],
    correctIndex: 1,
    explanation: 'Bagging reduces variance by averaging diverse parallel models trained on bootstrap subsets. Boosting reduces bias sequentially by fitting residuals.',
  },
  {
    id: 26,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Moderate',
    question: 'When dealing with severe class imbalance (e.g., 99.5% negative, 0.5% fraud), why is Accuracy a misleading metric?',
    options: [
      'Accuracy cannot be mathematically computed for binary classes',
      'A trivial classifier predicting the majority class for every sample achieves 99.5% accuracy while identifying 0% of fraud cases',
      'Accuracy is non-differentiable during gradient descent',
      'Accuracy is only applicable to regression problems',
    ],
    correctIndex: 1,
    explanation: 'On imbalanced data, accuracy gives a false sense of success. PR-AUC, F1-Score, and Precision-Recall tradeoffs are appropriate.',
  },
  {
    id: 27,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Moderate',
    question: 'In Support Vector Machines (SVM), what is the "Kernel Trick"?',
    options: [
      'A CPU instruction optimization for multiplying 4x4 matrices',
      'Implicitly computing the inner product in a high-dimensional feature space without explicitly transforming data into that space',
      'Randomly dropping support vectors during training to prevent overfitting',
      'Pruning decision trees based on Gini impurity',
    ],
    correctIndex: 1,
    explanation: 'The kernel trick evaluates dot products in high (or infinite) dimensional reproducing kernel Hilbert spaces directly using kernel functions k(x, x’).',
  },
  {
    id: 28,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Hard',
    question: 'What is the Bias-Variance Decomposition of Mean Squared Error (MSE)?',
    options: [
      'MSE = Accuracy + Precision + Recall',
      'MSE = (Bias)^2 + Variance + Irreducible Error (σ^2)',
      'MSE = L1 Loss + L2 Loss + Entropy',
      'MSE = Learning Rate * Gradient Norm + Epochs',
    ],
    correctIndex: 1,
    explanation: 'Total expected test MSE decomposes into the squared bias of the estimator, the variance of the estimator, and the irreducible noise inherent in the data.',
  },
  {
    id: 29,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Hard',
    question: 'In XGBoost, how is the exact or approximate split finding computed mathematically at each node?',
    options: [
      'By computing first (gradient g) and second-order (hessian h) Taylor expansion of the loss function to maximize gain',
      'By running K-Means clustering on the residuals of the previous three trees',
      'By calculating the Gini impurity on the raw target labels without considering the loss function',
      'By calculating the Pearson correlation between feature vectors and target labels',
    ],
    correctIndex: 0,
    explanation: 'XGBoost uses a second-order Taylor expansion of the objective function, computing split gain as Gain = 0.5 * [(G_L^2 / (H_L + λ)) + (G_R^2 / (H_R + λ)) - (G^2 / (H + λ))] - γ.',
  },
  {
    id: 30,
    role: 'Machine Learning Engineer',
    department: 'Machine Learning Algorithms',
    courseName: 'Applied Machine Learning & Predictive Modeling',
    difficulty: 'Hard',
    question: 'What makes SHAP (SHapley Additive exPlanations) theoretically superior to basic feature importance (like tree impurity reduction) for model explainability?',
    options: [
      'SHAP is faster to compute and does not require evaluating predictions',
      'SHAP values are grounded in cooperative game theory and satisfy Efficiency, Symmetry, Dummy, and Additivity axioms',
      'SHAP only works on linear regression models',
      'SHAP forces non-linear models to produce identical outputs to logistic regression',
    ],
    correctIndex: 1,
    explanation: 'Shapley values uniquely satisfy the four fundamental fairness properties from game theory, avoiding the systematic bias of Gini feature importance toward high-cardinality features.',
  },

  // --- Department: Deep Learning & Neural Networks (Questions 31-40) ---
  {
    id: 31,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Easy',
    question: 'Which activation function outputs values strictly in the range (0, 1) and is traditionally used for binary classification outputs?',
    options: ['ReLU', 'Sigmoid', 'LeakyReLU', 'Linear'],
    correctIndex: 1,
    explanation: 'The sigmoid function σ(z) = 1 / (1 + e^-z) maps any real input to the interval (0, 1), representing a probability distribution.',
  },
  {
    id: 32,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Easy',
    question: 'Why did ReLU (Rectified Linear Unit) replace Sigmoid and Tanh as the standard activation function in deep hidden layers?',
    options: [
      'ReLU outputs negative numbers for fast normalization',
      'ReLU prevents the vanishing gradient problem for positive inputs (gradient = 1) and is computationally trivial to compute (max(0, x))',
      'ReLU is smooth and infinitely differentiable everywhere',
      'ReLU eliminates the need for backpropagation',
    ],
    correctIndex: 1,
    explanation: 'Sigmoid saturates with near-zero gradients at extreme values. ReLU avoids vanishing gradients for x > 0 and computes very quickly without exponentiation.',
  },
  {
    id: 33,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Easy',
    question: 'What is Backpropagation in deep learning?',
    options: [
      'Passing images backward through a convolutional filter to perform super-resolution',
      'The application of the chain rule of calculus to compute the gradient of the loss function with respect to every weight in the network',
      'A method to prune dead neurons after training completes',
      'Saving neural network weights to disk in ONNX format',
    ],
    correctIndex: 1,
    explanation: 'Backpropagation recursively applies the multivariate chain rule from the loss output backward to compute partial derivatives for parameter updates.',
  },
  {
    id: 34,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Moderate',
    question: 'What problem does Batch Normalization solve during the training of deep networks?',
    options: [
      'Reduces internal covariate shift and smooths the loss landscape, allowing higher learning rates and faster convergence',
      'Compresses weights by quantizing float32 into int8',
      'Eliminates the requirement for labeled training data',
      'Prevents GPU memory overflow by deleting old activations',
    ],
    correctIndex: 0,
    explanation: 'Batch Normalization standardizes layer inputs per mini-batch, stabilizing activation distributions and making optimization significantly smoother.',
  },
  {
    id: 35,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Moderate',
    question: 'In Convolutional Neural Networks (CNNs), what is the key benefit of parameter sharing (weight sharing)?',
    options: [
      'It enforces that all channels in an image share identical RGB values',
      'The same convolutional kernel slides across the entire image, drastically reducing the number of learnable parameters and providing translation equivariance',
      'It converts 2D convolutions into 1D linear algebra operations',
      'It allows training without using loss functions',
    ],
    correctIndex: 1,
    explanation: 'Weight sharing applies identical filter weights across all spatial locations, enabling translation equivariance and keeping parameter count manageable.',
  },
  {
    id: 36,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Moderate',
    question: 'In the Transformer architecture, what is the formula for Scaled Dot-Product Attention?',
    options: [
      'Attention(Q, K, V) = Q * K^T + V',
      'Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V',
      'Attention(Q, K, V) = sigmoid( Q + K ) * V',
      'Attention(Q, K, V) = relu( Q K V )',
    ],
    correctIndex: 1,
    explanation: 'Scaled Dot-Product Attention computes attention weights via softmax((Q K^T) / sqrt(d_k)) multiplied by Values V, where scaling by sqrt(d_k) prevents vanishing gradients in softmax.',
  },
  {
    id: 37,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Moderate',
    question: 'What is the core distinction between Dropout during training versus Dropout during inference/evaluation?',
    options: [
      'During training, neurons are randomly zeroed out with probability p; during evaluation, all neurons are active and outputs are scaled by (1 - p) or inverted during training',
      'Dropout is only activated during inference to simulate probabilistic ensemble outputs',
      'Dropout permanently removes weights from the model file',
      'Dropout doubles the learning rate during testing',
    ],
    correctIndex: 0,
    explanation: 'During training, dropout randomly zeroes out activations to prevent co-adaptation. During inference, all weights are utilized with proper scaling (or inverted dropout at train time).',
  },
  {
    id: 38,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Hard',
    question: 'What is the purpose of Residual Connections (Skip Connections) introduced in ResNet architectures?',
    options: [
      'To allow gradients to flow directly through the identity shortcut during backpropagation, solving the degradation/vanishing gradient problem in very deep networks',
      'To skip the forward pass computation for odd-numbered batches',
      'To convert convolutional networks into recurrent sequence models',
      'To reduce memory footprint by 90%',
    ],
    correctIndex: 0,
    explanation: 'By learning residual mapping F(x) = H(x) - x, gradients can propagate directly through the identity mapping (d(x + F(x))/dx = 1 + dF(x)/dx), enabling networks with 100+ layers to train.',
  },
  {
    id: 39,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Hard',
    question: 'In modern LLM parameter-efficient fine-tuning (PEFT), how does LoRA (Low-Rank Adaptation) work?',
    options: [
      'It quantizes the entire model to 1-bit binary weights',
      'It freezes the pre-trained weight matrix W_0 (d × k) and injects trainable rank decomposition matrices A (d × r) and B (r × k), where r << min(d, k)',
      'It drops 50% of the transformer layers during inference',
      'It adds convolutional layers on top of the output tokens',
    ],
    correctIndex: 1,
    explanation: 'LoRA decomposes weight updates into ΔW = B * A with low intrinsic rank r, drastically reducing trainable parameters and GPU VRAM requirements by over 90%.',
  },
  {
    id: 40,
    role: 'Machine Learning Engineer',
    department: 'Deep Learning & Neural Networks',
    courseName: 'Deep Learning, PyTorch & Transformer Architectures',
    difficulty: 'Hard',
    question: 'What is the Adam optimizer doing beyond standard Stochastic Gradient Descent (SGD)?',
    options: [
      'It computes both the exponentially decaying average of past gradients (1st moment - momentum) and past squared gradients (2nd moment - uncentered variance), with bias correction',
      'It calculates the exact inverse Hessian matrix at every epoch',
      'It swaps between L1 and L2 regularization randomly',
      'It enforces all weight updates to remain strictly positive',
    ],
    correctIndex: 0,
    explanation: 'Adam combines the advantages of AdaGrad and RMSProp by tracking moving averages of the gradients (m_t) and squared gradients (v_t) with bias correction for step initialization.',
  },

  // --- Department: Data Engineering & SQL (Questions 41-50) ---
  {
    id: 41,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Easy',
    question: 'In SQL, what is the difference between WHERE and HAVING clauses?',
    options: [
      'WHERE filters aggregated groups, while HAVING filters individual rows before grouping',
      'WHERE filters individual rows before aggregation, while HAVING filters aggregated group results after GROUP BY',
      'HAVING can only be used with SELECT * queries',
      'There is no difference; they are interchangeable',
    ],
    correctIndex: 1,
    explanation: 'WHERE filters records prior to grouping. HAVING filters groups formed by the GROUP BY clause based on aggregate conditions (e.g., HAVING COUNT(*) > 5).',
  },
  {
    id: 42,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Easy',
    question: 'Which SQL JOIN returns all records when there is a match in either left or right table?',
    options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
    correctIndex: 2,
    explanation: 'A FULL OUTER JOIN combines the results of both LEFT and RIGHT joins, returning all rows from both tables with NULLs in non-matching columns.',
  },
  {
    id: 43,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Easy',
    question: 'What is the primary purpose of creating an index on a database table column?',
    options: [
      'To encrypt confidential user information',
      'To accelerate data retrieval (SELECT queries) at the cost of slight overhead on INSERT, UPDATE, and DELETE operations',
      'To ensure all values in the column are distinct and non-null',
      'To automatically normalize the table to Third Normal Form (3NF)',
    ],
    correctIndex: 1,
    explanation: 'Indexes (such as B-Trees) enable rapid lookup without scanning the entire table, trading write performance and storage space for search speed.',
  },
  {
    id: 44,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Moderate',
    question: 'In SQL Window Functions, what does the ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) expression produce?',
    options: [
      'A cumulative sum of user transactions over time',
      'A unique sequential integer starting at 1 for each row within each user_id partition, ordered from newest to oldest',
      'The total count of users registered in the database',
      'A randomized shuffle index across all records',
    ],
    correctIndex: 1,
    explanation: 'ROW_NUMBER() assigns a unique rank from 1..N within each partition defined by user_id according to the specified sorting order.',
  },
  {
    id: 45,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Moderate',
    question: 'What is the difference between an OLTP database and an OLAP data warehouse?',
    options: [
      'OLTP systems are optimized for heavy analytical aggregate queries, while OLAP is designed for high-frequency transactional inserts/updates',
      'OLTP (e.g., PostgreSQL) is optimized for row-oriented high-concurrency transactional processing, while OLAP (e.g., Snowflake, BigQuery) is optimized for column-oriented complex analytical aggregations',
      'OLTP does not support relational schemas, whereas OLAP is purely NoSQL document storage',
      'OLAP systems never store historical data',
    ],
    correctIndex: 1,
    explanation: 'OLTP systems handle day-to-day transactional writes with ACID compliance. OLAP systems store columnar data optimized for petabyte-scale aggregations.',
  },
  {
    id: 46,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Moderate',
    question: 'Why is Parquet format preferred over CSV or JSON for training machine learning models on large data lakes?',
    options: [
      'Parquet is human-readable plain text that opens directly in spreadsheet applications',
      'Parquet is a columnar binary format supporting efficient compression, predicate pushdown, and reading only requested feature columns into memory',
      'Parquet completely eliminates the need for data cleaning and imputation',
      'Parquet files cannot be corrupted by network errors',
    ],
    correctIndex: 1,
    explanation: 'Apache Parquet organizes data by column with snappy/gzip compression and dictionary encoding, enabling fast column pruning and I/O reduction.',
  },
  {
    id: 47,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Moderate',
    question: 'In distributed data processing with Apache Spark, what is a "Shuffle" and why is it expensive?',
    options: [
      'A random number generator for initializing weights',
      'The redistribution of data across cluster partitions over the physical network during operations like groupByKey or wide joins',
      'The process of reading data from cold S3 archives',
      'The periodic garbage collection of dead Java virtual machines',
    ],
    correctIndex: 1,
    explanation: 'Shuffling involves disk I/O, network serialization, and data redistribution across cluster nodes, making wide transformations computationally costly.',
  },
  {
    id: 48,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Hard',
    question: 'What is the role of Feature Stores (e.g., Feast, Tecton) in production machine learning architectures?',
    options: [
      'To sell pre-trained machine learning weights on an enterprise marketplace',
      'To provide consistent, low-latency online feature serving for real-time inference and point-in-time correct offline feature joins to prevent data leakage during training',
      'To compress Docker container images for Kubernetes deployment',
      'To automatically write unit tests for Python functions',
    ],
    correctIndex: 1,
    explanation: 'Feature stores bridge the gap between offline training (time-travel consistency without lookahead bias) and online low-latency inference feature lookups.',
  },
  {
    id: 49,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Hard',
    question: 'In SQL, what is the consequence of selecting columns non-deterministically without grouping in a query with GROUP BY under SQL-92 standards?',
    options: [
      'The database query optimizer returns NULL for all numeric columns',
      'It triggers a syntax error unless all unaggregated SELECT columns appear explicitly in the GROUP BY clause or are wrapped in aggregate functions',
      'It converts the table into a distributed materialized view',
      'It automatically groups by the primary key',
    ],
    correctIndex: 1,
    explanation: 'Standard SQL enforces that every column in the SELECT list that is not an aggregate function must be included in the GROUP BY clause.',
  },
  {
    id: 50,
    role: 'Machine Learning Engineer',
    department: 'Data Engineering & SQL',
    courseName: 'Relational SQL, Data Warehousing & ETL Pipelines',
    difficulty: 'Hard',
    question: 'What is Data Drift vs Concept Drift in production ML monitoring?',
    options: [
      'Data drift means hardware clocks unsynchronize; concept drift means software versions change',
      'Data drift is a shift in input feature distribution P(X) while P(Y|X) remains constant; Concept drift is a shift in the conditional relationship P(Y|X) between features and target labels',
      'Data drift happens only in testing; concept drift happens only in deployment',
      'Data drift affects only SQL databases, while concept drift affects only deep neural networks',
    ],
    correctIndex: 1,
    explanation: 'Data drift (covariate shift) occurs when input feature distributions change. Concept drift occurs when the underlying ground truth relationship between X and Y changes over time.',
  },
];

// Helper to get questions for any career role (generates role-specific 50 questions)
export const getQuestionsForRole = (
  role: CareerGoalRole,
  specificQuestionIds?: number[]
): RoleAssessmentQuestion[] => {
  if (role === 'Machine Learning Engineer') {
    if (specificQuestionIds && specificQuestionIds.length > 0) {
      const idSet = new Set(specificQuestionIds);
      const matched = ML_500_QUESTION_BANK.filter((q) => idSet.has(q.id));
      if (matched.length > 0) {
        const idMap = new Map(matched.map((q) => [q.id, q]));
        const ordered = specificQuestionIds.map((id) => idMap.get(id)).filter(Boolean) as RoleAssessmentQuestion[];
        if (ordered.length === specificQuestionIds.length) {
          return ordered;
        }
      }
    }
    return sampleML50Questions();
  }

  if (role === 'Data Scientist') {
    if (specificQuestionIds && specificQuestionIds.length > 0) {
      const idSet = new Set(specificQuestionIds);
      const matched = DATA_SCIENTIST_DIAGNOSTIC_QUESTIONS.filter((q) => idSet.has(q.id));
      if (matched.length > 0) {
        const idMap = new Map(matched.map((q) => [q.id, q]));
        const ordered = specificQuestionIds.map((id) => idMap.get(id)).filter(Boolean) as RoleAssessmentQuestion[];
        if (ordered.length === specificQuestionIds.length) {
          return ordered;
        }
      }
    }
    return DATA_SCIENTIST_DIAGNOSTIC_QUESTIONS;
  }

  // Generate customized 50 questions for other roles based on their 5 specific departments
  const departmentSpecs: Record<
    CareerGoalRole,
    { department: string; course: string }[]
  > = {
    'Full Stack Developer': [
      { department: 'Frontend & Modern React', course: 'React 19, Modern Hooks & State Architecture' },
      { department: 'Backend & API Architecture', course: 'Node.js, Express & Scalable REST/GraphQL APIs' },
      { department: 'Databases & Data Modeling', course: 'PostgreSQL, Prisma & Redis Caching' },
      { department: 'System Design & Scalability', course: 'High-Concurrency Web Systems & Microservices' },
      { department: 'DevOps, Testing & Security', course: 'CI/CD Pipelines, Docker, Jest & OAuth Security' },
    ],
    'Cloud Engineer': [
      { department: 'Cloud Architecture & Services', course: 'AWS & Google Cloud Core Solutions' },
      { department: 'Containers & Orchestration', course: 'Docker, Kubernetes & Service Meshes' },
      { department: 'Infrastructure as Code (IaC)', course: 'Terraform & Declarative Cloud Orchestration' },
      { department: 'CI/CD & Release Pipelines', course: 'GitHub Actions, Automated Testing & GitOps' },
      { department: 'Networking, IAM & Security', course: 'VPCs, Subnets, IAM Policies & Cloud Compliance' },
    ],
    'Cybersecurity Analyst': [
      { department: 'Network Security & Traffic Analysis', course: 'TCP/IP Protocols, Firewalls & Packet Inspection' },
      { department: 'SOC Operations & Threat Hunting', course: 'SIEM Log Correlation & Incident Response' },
      { department: 'Cryptography & Identity Systems', course: 'PKI, TLS, Symmetric Ciphers & Identity Access' },
      { department: 'Vulnerability Assessment & Pen Testing', course: 'OWASP Top 10 & Offensive Security Practice' },
      { department: 'Security Governance & Compliance', course: 'NIST Framework, ISO 27001 & Security Auditing' },
    ],
    'UI/UX Designer': [
      { department: 'User Research & Discovery', course: 'User Interviews, Personas & Usability Heuristics' },
      { department: 'Information Architecture & Wireframes', course: 'User Journeys, Card Sorting & Low-Fi Wireframing' },
      { department: 'Visual Hierarchy & Typography', course: 'Modern UI Layouts, Color Contrast & Type Scales' },
      { department: 'Design Systems & Component Libraries', course: 'Figma Auto-Layout, Tokens & Component Variants' },
      { department: 'Interaction Design & Accessibility (a11y)', course: 'WCAG 2.2 Standards, Motion & Micro-interactions' },
    ],
    'Data Scientist': [
      { department: 'Python & Core Programming', course: 'Advanced Python for Data Science & ML' },
      { department: 'Mathematics & Statistics', course: 'Linear Algebra, Probability & Inferential Statistics' },
      { department: 'Machine Learning Algorithms', course: 'Applied Machine Learning & Predictive Modeling' },
      { department: 'Deep Learning & Neural Networks', course: 'Deep Learning, PyTorch & Transformer Architectures' },
      { department: 'Data Engineering & SQL', course: 'Relational SQL, Data Warehousing & ETL Pipelines' },
    ],
    'Machine Learning Engineer': [
      { department: 'Python & Core Programming', course: 'Advanced Python for Data Science & ML' },
      { department: 'Mathematics & Statistics', course: 'Linear Algebra, Probability & Inferential Statistics' },
      { department: 'Machine Learning Algorithms', course: 'Applied Machine Learning & Predictive Modeling' },
      { department: 'Deep Learning & Neural Networks', course: 'Deep Learning, PyTorch & Transformer Architectures' },
      { department: 'Data Engineering & SQL', course: 'Relational SQL, Data Warehousing & ETL Pipelines' },
    ],
  };

  const specs = departmentSpecs[role] || departmentSpecs['Full Stack Developer'];

  // Generate 50 questions across the 5 departments (10 questions per department)
  const fullList: RoleAssessmentQuestion[] = [];
  let currentId = 1;

  specs.forEach((deptSpec, deptIndex) => {
    // 10 questions per department (3 Easy, 4 Moderate, 3 Hard)
    for (let q = 1; q <= 10; q++) {
      const difficulty: 'Easy' | 'Moderate' | 'Hard' =
        q <= 3 ? 'Easy' : q <= 7 ? 'Moderate' : 'Hard';

      let questionText = '';
      let options: string[] = [];
      let correctIndex = 0;
      let explanation = '';

      if (role === 'Full Stack Developer') {
        if (deptIndex === 0) {
          // Frontend & React
          if (q === 1) {
            questionText = 'What is the purpose of useEffect dependency array in React 19?';
            options = [
              'To specify which state variables or props trigger the effect to re-run when their values change',
              'To define global CSS styles for the component',
              'To declare database connections',
              'To force asynchronous server compilation',
            ];
            correctIndex = 0;
            explanation = 'The dependency array instructs React to only re-invoke the effect callback when values within the array change between renders.';
          } else if (q === 2) {
            questionText = 'How does the Virtual DOM enhance client-side UI performance in React?';
            options = [
              'By caching HTTP GET requests in browser IndexedDB',
              'By calculating diffs in memory and applying only minimal batched patch updates to the real browser DOM tree',
              'By compiling JSX directly into WebAssembly binary modules',
              'By bypassing browser security sandboxes',
            ];
            correctIndex = 1;
            explanation = 'Reconciliation computes the minimal set of real DOM mutations necessary to match the virtual representation, reducing costly layout reflows.';
          } else {
            questionText = `In ${deptSpec.department}, question #${q} (${difficulty}): How should application state be managed for optimal re-render efficiency?`;
            options = [
              'Colocate state close to where it is needed and use memoization (useMemo/useCallback) to avoid unnecessary sub-tree re-renders',
              'Store every single variable in global window object',
              'Trigger forceUpdate() on every mouse movement event',
              'Duplicate state across all sibling components without lifting state up',
            ];
            correctIndex = 0;
            explanation = 'Localizing state and memoizing heavy computational derivations prevents unnecessary re-rendering across untouched component branches.';
          }
        } else if (deptIndex === 1) {
          // Backend
          questionText = `In ${deptSpec.department}, question #${q} (${difficulty}): What is the primary advantage of non-blocking asynchronous I/O in Node.js event loop?`;
          options = [
            'It allows a single-threaded server to handle thousands of concurrent I/O operations without stalling the execution thread',
            'It converts all JavaScript syntax into synchronous C code at runtime',
            'It eliminates the need for error handling and try/catch blocks',
            'It forces CPU computations to run in zero clock cycles',
          ];
          correctIndex = 0;
          explanation = 'Node.js delegates I/O calls to libuv worker threads and the kernel, resuming execution via event loop callbacks when results are ready.';
        } else if (deptIndex === 2) {
          // Database
          questionText = `In ${deptSpec.department}, question #${q} (${difficulty}): What is the ACID property in relational databases?`;
          options = [
            'Atomicity, Consistency, Isolation, and Durability guarantees for database transactions',
            'Advanced Columnar Indexing and Distribution',
            'Asynchronous Caching Interface Driver',
            'Automated Container Image Deployment',
          ];
          correctIndex = 0;
          explanation = 'ACID ensures database transactions are processed reliably even in the event of system failures or concurrent access.';
        } else if (deptIndex === 3) {
          // System Design
          questionText = `In ${deptSpec.department}, question #${q} (${difficulty}): How does a reverse proxy (e.g., Nginx) improve web application scalability?`;
          options = [
            'Provides load balancing, SSL termination, static caching, and shields application servers from direct client traffic',
            'Rewrites frontend HTML into binary executable code',
            'Eliminates database storage limits',
            'Generates artificial user traffic for stress testing',
          ];
          correctIndex = 0;
          explanation = 'A reverse proxy distributes incoming traffic across backend nodes, offloads SSL handshakes, and caches repeated static responses.';
        } else {
          // DevOps
          questionText = `In ${deptSpec.department}, question #${q} (${difficulty}): What is the difference between Continuous Integration (CI) and Continuous Delivery (CD)?`;
          options = [
            'CI automates code building and test execution on push; CD automates deploying tested releases to staging/production environments',
            'CI is only for frontend; CD is only for backend databases',
            'CI requires manual approval for every commit; CD has no automated tests',
            'They are identical terms with no operational difference',
          ];
          correctIndex = 0;
          explanation = 'CI ensures new code integrates cleanly and passes all automated tests. CD automatically packages and stages the release for deployment.';
        }
      } else {
        // Generic high-quality role question generator
        questionText = `[${role}] ${deptSpec.department} — Practical Question #${q} (${difficulty}): In professional enterprise practice for ${deptSpec.course}, what is the recognized gold standard approach?`;
        options = [
          `Apply proven architectural patterns in ${deptSpec.department} with automated validation, rigorous testing, and benchmarked metrics.`,
          `Avoid standardized best practices and rely entirely on unversioned ad-hoc configurations.`,
          `Disable monitoring and error logs to increase baseline network throughput.`,
          `Store sensitive credentials directly in public client-side repository commits.`,
        ];
        correctIndex = 0;
        explanation = `Excellence in ${deptSpec.department} requires systematic methodologies, automated validation, and continuous metric evaluation aligned with industry benchmarks.`;
      }

      fullList.push({
        id: currentId++,
        role,
        department: deptSpec.department,
        courseName: deptSpec.course,
        difficulty,
        question: questionText,
        options,
        correctIndex,
        explanation,
      });
    }
  });

  return fullList;
};

// ==========================================
// SCORING & READINESS ALGORITHM
// ==========================================

export const evaluateRoleAssessment = (
  role: CareerGoalRole,
  userAnswers: Record<number, number>,
  timeSpentSeconds: number,
  customQuestions?: RoleAssessmentQuestion[]
): ComprehensiveAssessmentResult => {
  let questions: RoleAssessmentQuestion[] = [];
  if (customQuestions && customQuestions.length > 0) {
    questions = customQuestions;
  } else if (role === 'Machine Learning Engineer') {
    const answeredIds = Object.keys(userAnswers).map(Number);
    if (answeredIds.length > 0) {
      const idSet = new Set(answeredIds);
      questions = ML_500_QUESTION_BANK.filter((q) => idSet.has(q.id));
    }
    if (questions.length === 0) {
      questions = sampleML50Questions();
    }
  } else if (role === 'Data Scientist') {
    if (customQuestions && customQuestions.length > 0) {
      questions = customQuestions;
    } else {
      const answeredIds = Object.keys(userAnswers).map(Number);
      if (answeredIds.length > 0) {
        const idSet = new Set(answeredIds);
        const matched = DATA_SCIENTIST_DIAGNOSTIC_QUESTIONS.filter((q) => idSet.has(q.id));
        if (matched.length > 0) {
          questions = matched;
        }
      }
      if (questions.length === 0) {
        questions = DATA_SCIENTIST_DIAGNOSTIC_QUESTIONS;
      }
    }
  } else {
    questions = getQuestionsForRole(role);
  }

  const totalQuestions = questions.length || 50;

  // Group by department
  const deptMap: Record<
    string,
    {
      courseName: string;
      total: number;
      correct: number;
    }
  > = {};

  let overallCorrect = 0;

  questions.forEach((q) => {
    if (!deptMap[q.department]) {
      deptMap[q.department] = {
        courseName: q.courseName,
        total: 0,
        correct: 0,
      };
    }

    deptMap[q.department].total += 1;

    const selectedOpt = userAnswers[q.id];
    if (selectedOpt !== undefined && selectedOpt === q.correctIndex) {
      deptMap[q.department].correct += 1;
      overallCorrect += 1;
    }
  });

  const departmentBreakdowns: DepartmentAnalysis[] = Object.entries(deptMap).map(
    ([deptName, data]) => {
      const scorePercent = Math.round((data.correct / data.total) * 100);

      // Ranking on 5-point scale as specifically requested:
      // 5: Outstanding (85%+)
      // 4: Very Good (70-84%) -> needs just more practice
      // 3: Good (50-69%) -> needs more concept clarity and experience
      // 2: Needs a Course (30-49%) -> needs a course
      // 1: Needs to start acting on this subject (<30%) -> needs start acting
      let rating: DepartmentRatingScale = 1;
      let ratingLabel = 'Needs to start acting on this subject';
      let feedback = 'Critical foundational gap detected. Immediate study and structured coursework are required.';
      let statusColor = 'text-rose-600 bg-rose-50 border-rose-200';
      let recommendedAction = `Enroll in foundational curriculum for ${deptName}.`;

      if (scorePercent >= 85) {
        rating = 5;
        ratingLabel = 'Outstanding';
        feedback = 'Exceptional mastery demonstrated! You exceed entry-level industry hiring benchmarks for this domain.';
        statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
        recommendedAction = `Contribute to advanced open-source repositories and tackle portfolio-grade capstones in ${deptName}.`;
      } else if (scorePercent >= 70) {
        rating = 4;
        ratingLabel = 'Very Good (Needs just more practice)';
        feedback = 'Strong core competency. You understand the architecture well and need just more hands-on practice.';
        statusColor = 'text-green-700 bg-green-50 border-green-200';
        recommendedAction = `Solve 10-15 scenario-based interview problems and implement hands-on exercises in ${deptName}.`;
      } else if (scorePercent >= 50) {
        rating = 3;
        ratingLabel = 'Good (Needs more concept clarity & experience)';
        feedback = 'Moderate understanding with noticeable conceptual ambiguities in complex and hard scenarios.';
        statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
        recommendedAction = `Review core documentation, re-study intermediate chapters, and build mini-projects in ${deptName}.`;
      } else if (scorePercent >= 30) {
        rating = 2;
        ratingLabel = 'Needs a Course';
        feedback = 'Substantial knowledge gaps identified. Systematic coursework is strongly recommended before job interviews.';
        statusColor = 'text-orange-700 bg-orange-50 border-orange-200';
        recommendedAction = `Take structured comprehensive course: "${data.courseName}".`;
      } else {
        rating = 1;
        ratingLabel = 'Needs to start acting on this subject';
        feedback = 'Minimal baseline grasp. Starting focused learning in this subject is essential to pursue this career role.';
        statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
        recommendedAction = `Start with beginner modules in "${data.courseName}" immediately.`;
      }

      // Skill Gap Calculation: Benchmark is role-specific or 85%
      const benchmark = role === 'Data Scientist' ? (DS_BENCHMARKS[deptName] || 75) : 85;
      const skillGapPercent = Math.max(0, benchmark - scorePercent);

      return {
        department: deptName,
        courseName: data.courseName,
        totalQuestions: data.total,
        correctCount: data.correct,
        scorePercent,
        rating,
        ratingLabel,
        feedback,
        skillGapPercent,
        statusColor,
        recommendedAction,
        recommendedCourse: data.courseName,
      };
    }
  );

  const totalScorePercent = Math.round((overallCorrect / totalQuestions) * 100);

  // Derive strongest and weakest (Primary Improvement Area) skills
  let strongestSkill = departmentBreakdowns[0]?.department || '';
  let weakestSkill = departmentBreakdowns[0]?.department || '';
  let maxScore = -1;
  let minScore = 101;

  departmentBreakdowns.forEach((dept) => {
    if (dept.scorePercent > maxScore) {
      maxScore = dept.scorePercent;
      strongestSkill = dept.department;
    }
    if (dept.scorePercent < minScore) {
      minScore = dept.scorePercent;
      weakestSkill = dept.department;
    }
  });

  // Calculate Cumulative Grand Scale of Readiness
  // Average rating across all departments (1.0 to 5.0)
  const averageRating = Number(
    (
      departmentBreakdowns.reduce((acc, d) => acc + d.rating, 0) /
      departmentBreakdowns.length
    ).toFixed(1)
  );

  let readinessTier: GrandReadinessScale['readinessTier'] = 'Foundational (Needs Immediate Action)';
  let summary = '';
  let nextBestStep = '';

  if (totalScorePercent >= 85) {
    readinessTier = 'Outstanding (Role Ready)';
    summary = `You demonstrate tier-1 readiness for ${role}. Your technical fundamentals and problem-solving depth surpass entry-level industry thresholds across all measured departments.`;
    nextBestStep = `Apply directly for premium internships and high-growth full-time roles in ${role}.`;
  } else if (totalScorePercent >= 70) {
    readinessTier = 'Very Good (High Competence)';
    summary = `You have strong candidate readiness for ${role}. With targeted practice on your moderate departments, you will be in the top quartile of job applicants.`;
    nextBestStep = `Target minor department gaps and polish your portfolio project implementations.`;
  } else if (totalScorePercent >= 50) {
    readinessTier = 'Good (Concept Solidification)';
    summary = `You have healthy foundational awareness for ${role}, but lack depth in specialized departments. Focused conceptual study will bridge your remaining gaps.`;
    nextBestStep = `Review your department gap report and take recommended modular courses.`;
  } else if (totalScorePercent >= 30) {
    readinessTier = 'Emerging (Requires Coursework)';
    summary = `You are at an emerging stage for ${role}. Dedicated structured curriculum and hands-on coding are required to meet industry hiring standards.`;
    nextBestStep = `Complete recommended foundational courses and retake the assessment in 2 weeks.`;
  } else {
    readinessTier = 'Foundational (Needs Immediate Action)';
    summary = `Significant skill gaps exist across primary departments for ${role}. Early-stage commitment to fundamentals is critical.`;
    nextBestStep = `Start with introductory tutorials and fundamental prerequisites today.`;
  }

  const grandReadiness: GrandReadinessScale = {
    cumulativeScore: totalScorePercent,
    cumulativeRating: averageRating,
    readinessTier,
    summary,
    nextBestStep,
  };

  return {
    id: `eval_${Date.now()}`,
    role,
    completedAt: new Date().toISOString(),
    totalQuestions,
    correctCount: overallCorrect,
    totalScorePercent,
    timeSpentSeconds,
    grandReadiness,
    departmentBreakdowns,
    userAnswers,
    questions,
    strongestSkill,
    weakestSkill,
    assessmentStatus: 'Assessed',
  };
};
