// ─── Departments, Courses & Assignments — Shared Data ────────────────────────

export interface Department {
  id: string;
  name: string;
  shortName: string;
  icon: string; // emoji icon
  color: string; // tailwind gradient classes
  description: string;
}

export interface Course {
  id: number;
  title: string;
  code: string;
  instructor: string;
  description: string;
  departmentId: string;
  category: string;
  students: number;
  progress: number;
  color: string;
  semester: string;
  credits: number;
}

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'submitted' | 'graded' | 'upcoming';
  points: number;
  type: 'lab' | 'project' | 'homework' | 'exam' | 'quiz';
  grade?: number;
  instructions?: string[];
}

// ─── Departments ──────────────────────────────────────────────────────────────

export const DEPARTMENTS: Department[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    icon: '💻',
    color: 'from-teal-600 to-emerald-600',
    description: 'Algorithms, software systems, AI and beyond',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    shortName: 'PHARM',
    icon: '🧪',
    color: 'from-violet-600 to-purple-600',
    description: 'Drug design, pharmacology, clinical sciences',
  },
  {
    id: 'bba',
    name: 'Business Administration',
    shortName: 'BBA',
    icon: '📈',
    color: 'from-amber-500 to-orange-500',
    description: 'Strategy, marketing, finance & leadership',
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    shortName: 'MECH',
    icon: '⚙️',
    color: 'from-blue-600 to-cyan-600',
    description: 'Thermodynamics, design, manufacturing',
  },
  {
    id: 'eee',
    name: 'Electrical Engineering',
    shortName: 'EEE',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-600',
    description: 'Circuits, power systems, electronics',
  },
];

// ─── Courses ──────────────────────────────────────────────────────────────────

export const ALL_COURSES: Course[] = [
  // CSE
  {
    id: 1,
    title: 'Data Structures & Algorithms',
    code: 'CSE201',
    instructor: 'Prof. Michael Chen',
    description: 'Core conceptual frameworks for efficient data organization, sorting, searching, and algorithm analysis using Big-O notation.',
    departmentId: 'cse',
    category: 'Computer Science',
    students: 200,
    progress: 60,
    color: 'from-green-500 to-emerald-500',
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    id: 2,
    title: 'Web Development',
    code: 'CSE301',
    instructor: 'Dr. Emily Davis',
    description: 'Master modern web applications with React, Node.js, REST APIs, and cloud deployment. Covers component architecture to full-stack integration.',
    departmentId: 'cse',
    category: 'Software Engineering',
    students: 120,
    progress: 45,
    color: 'from-primary to-accent',
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    id: 3,
    title: 'Artificial Intelligence',
    code: 'CSE401',
    instructor: 'Prof. Sarah Johnson',
    description: 'Deep dive into machine learning algorithms, neural networks, expert systems and modern large language model architectures.',
    departmentId: 'cse',
    category: 'AI & ML',
    students: 85,
    progress: 30,
    color: 'from-purple-500 to-pink-500',
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    id: 4,
    title: 'Database Systems',
    code: 'CSE205',
    instructor: 'Prof. James Wilson',
    description: 'Relational models, SQL query optimization, NoSQL architectures, and database design principles for scalable applications.',
    departmentId: 'cse',
    category: 'Computer Science',
    students: 160,
    progress: 65,
    color: 'from-cyan-600 to-teal-600',
    semester: 'Spring 2026',
    credits: 3,
  },

  // Pharmacy
  {
    id: 5,
    title: 'Pharmacology I',
    code: 'PHARM301',
    instructor: 'Dr. Anjali Mehta',
    description: 'Study of drug-receptor interactions, pharmacodynamics, pharmacokinetics, and mechanisms of action for major drug classes.',
    departmentId: 'pharmacy',
    category: 'Clinical Sciences',
    students: 90,
    progress: 50,
    color: 'from-violet-500 to-purple-600',
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    id: 6,
    title: 'Medicinal Chemistry',
    code: 'PHARM202',
    instructor: 'Prof. Ravi Kumar',
    description: 'Chemical basis of drug design, structure-activity relationships, and synthesis of bioactive compounds.',
    departmentId: 'pharmacy',
    category: 'Pharmaceutical Sciences',
    students: 75,
    progress: 40,
    color: 'from-pink-500 to-rose-500',
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    id: 7,
    title: 'Pharmacokinetics & Biopharmaceutics',
    code: 'PHARM401',
    instructor: 'Dr. Neha Gupta',
    description: 'ADME principles, bioavailability calculations, compartmental models, and clinical dose optimization strategies.',
    departmentId: 'pharmacy',
    category: 'Clinical Sciences',
    students: 60,
    progress: 35,
    color: 'from-indigo-500 to-violet-500',
    semester: 'Spring 2026',
    credits: 4,
  },

  // BBA
  {
    id: 8,
    title: 'Strategic Marketing',
    code: 'BBA301',
    instructor: 'Prof. Priya Sharma',
    description: 'Market segmentation, consumer behavior, brand strategy, digital marketing tools and integrated marketing communications.',
    departmentId: 'bba',
    category: 'Marketing',
    students: 150,
    progress: 55,
    color: 'from-amber-500 to-orange-500',
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    id: 9,
    title: 'Financial Accounting',
    code: 'BBA201',
    instructor: 'Dr. Arjun Patel',
    description: 'Fundamentals of accounting cycles, balance sheets, income statements, cash flow analysis, and IFRS standards.',
    departmentId: 'bba',
    category: 'Finance',
    students: 180,
    progress: 70,
    color: 'from-yellow-500 to-amber-500',
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    id: 10,
    title: 'Operations Management',
    code: 'BBA401',
    instructor: 'Prof. Nisha Jain',
    description: 'Supply chain dynamics, production planning, lean operations, quality control, and logistics optimization.',
    departmentId: 'bba',
    category: 'Operations',
    students: 130,
    progress: 45,
    color: 'from-orange-500 to-red-500',
    semester: 'Spring 2026',
    credits: 3,
  },

  // Mechanical
  {
    id: 11,
    title: 'Thermodynamics',
    code: 'MECH201',
    instructor: 'Dr. Rohit Verma',
    description: 'Laws of thermodynamics, heat engines, refrigeration cycles, entropy, and energy conversion systems.',
    departmentId: 'mech',
    category: 'Core Mechanical',
    students: 110,
    progress: 60,
    color: 'from-blue-600 to-cyan-500',
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    id: 12,
    title: 'Fluid Mechanics',
    code: 'MECH301',
    instructor: 'Prof. Anil Saxena',
    description: 'Fluid statics, dynamics, Bernoulli equation, pipe flow, boundary layer theory, and turbomachinery basics.',
    departmentId: 'mech',
    category: 'Core Mechanical',
    students: 95,
    progress: 40,
    color: 'from-sky-500 to-blue-600',
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    id: 13,
    title: 'CAD/CAM & Manufacturing',
    code: 'MECH401',
    instructor: 'Dr. Suresh Rao',
    description: 'SolidWorks, AutoCAD, CNC programming, additive manufacturing, tolerance analysis, and quality standards.',
    departmentId: 'mech',
    category: 'Manufacturing',
    students: 80,
    progress: 50,
    color: 'from-teal-500 to-cyan-600',
    semester: 'Spring 2026',
    credits: 3,
  },

  // EEE
  {
    id: 14,
    title: 'Circuit Theory',
    code: 'EEE201',
    instructor: 'Prof. Vijay Krishnan',
    description: 'KVL, KCL, network theorems, AC/DC circuit analysis, resonance, two-port networks, and transient analysis.',
    departmentId: 'eee',
    category: 'Electrical Fundamentals',
    students: 140,
    progress: 65,
    color: 'from-yellow-500 to-amber-500',
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    id: 15,
    title: 'Digital Electronics',
    code: 'EEE301',
    instructor: 'Dr. Kavitha Nair',
    description: 'Boolean algebra, combinational/sequential logic, flip-flops, counters, FSMs, and FPGA programming.',
    departmentId: 'eee',
    category: 'Electronics',
    students: 115,
    progress: 45,
    color: 'from-lime-500 to-green-500',
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    id: 16,
    title: 'Signals & Systems',
    code: 'EEE401',
    instructor: 'Prof. Mohan Das',
    description: 'Fourier, Laplace and Z-transforms, LTI systems, convolution, filtering, and signal sampling theory.',
    departmentId: 'eee',
    category: 'Signal Processing',
    students: 90,
    progress: 35,
    color: 'from-amber-600 to-yellow-500',
    semester: 'Spring 2026',
    credits: 4,
  },
];

// ─── Assignments ──────────────────────────────────────────────────────────────

export const ALL_ASSIGNMENTS: Assignment[] = [
  // CSE201 - Data Structures
  {
    id: 1, courseId: 1, title: 'Binary Tree Implementation',
    description: 'Implement a self-balancing AVL tree with insert, delete, and in-order traversal.',
    dueDate: '2026-05-07', status: 'pending', points: 150, type: 'project',
    instructions: [
      'Implement AVL tree with auto-balancing on insert and delete.',
      'Include unit tests for at least 10 edge cases.',
      'Write a complexity analysis report (1 page).',
      'Submit .zip with source code + report PDF.',
    ],
  },
  {
    id: 2, courseId: 1, title: 'Algorithm Analysis Quiz',
    description: 'Online quiz covering Big-O, sorting algorithms, and recursion.',
    dueDate: '2026-05-01', status: 'upcoming', points: 50, type: 'quiz',
    instructions: ['20 MCQ questions, 40-minute timer.', 'Open book — no internet.'],
  },
  {
    id: 3, courseId: 1, title: 'Linked List Midterm',
    description: 'Practical midterm — implement doubly linked list with merge sort.',
    dueDate: '2026-04-28', status: 'graded', points: 200, type: 'exam', grade: 186,
    instructions: ['In-lab exam, 2 hours.', 'No external references allowed.'],
  },

  // CSE301 - Web Dev
  {
    id: 4, courseId: 2, title: 'React Portfolio Project',
    description: 'Build a fully responsive personal portfolio using React, Tailwind, and Framer Motion.',
    dueDate: '2026-05-10', status: 'in-progress', points: 200, type: 'project',
    instructions: [
      'Must include: Hero, About, Projects, Contact sections.',
      'Deploy on Vercel or Netlify — submit live URL.',
      'Code review will be scheduled after submission.',
    ],
  },
  {
    id: 5, courseId: 2, title: 'API Integration Lab',
    description: 'Consume a public REST API (weather, news, or movies) and display real-time data.',
    dueDate: '2026-05-15', status: 'upcoming', points: 80, type: 'lab',
    instructions: [
      'Use fetch or axios to call the API.',
      'Handle loading, error, and empty states.',
      'Submit GitHub repo link + 2-minute screen recording.',
    ],
  },

  // CSE401 - AI
  {
    id: 6, courseId: 3, title: 'Neural Network from Scratch',
    description: 'Implement a 3-layer feedforward neural network using NumPy only.',
    dueDate: '2026-05-12', status: 'pending', points: 300, type: 'project',
    instructions: [
      'Implement forward pass, backpropagation, and gradient descent.',
      'Train on MNIST — achieve ≥90% accuracy.',
      'Submit Jupyter notebook + 500-word reflection.',
    ],
  },

  // CSE205 - Databases
  {
    id: 7, courseId: 4, title: 'SQL Query Assignment',
    description: 'Write 15 complex SQL queries on the provided university database schema.',
    dueDate: '2026-05-03', status: 'pending', points: 100, type: 'homework',
    instructions: [
      'Use JOINs, subqueries, window functions, and CTEs.',
      'Explain each query with an inline comment.',
      'Submit .sql file.',
    ],
  },

  // PHARM301 - Pharmacology
  {
    id: 8, courseId: 5, title: 'Drug-Receptor Binding Report',
    description: 'Analyze the binding kinetics of beta-blockers using the provided dataset.',
    dueDate: '2026-05-05', status: 'pending', points: 120, type: 'lab',
    instructions: [
      'Calculate Ki, IC50 values from the dataset.',
      'Plot dose-response curves in Excel or Python.',
      'Submit 2-page report + graphs.',
    ],
  },
  {
    id: 9, courseId: 5, title: 'Pharmacology Midterm',
    description: 'Theory exam covering CNS, CVS, and ANS pharmacology.',
    dueDate: '2026-04-25', status: 'submitted', points: 150, type: 'exam',
    instructions: ['3-hour in-person exam.', 'Short answers + case studies.'],
  },

  // PHARM202 - Medicinal Chemistry
  {
    id: 10, courseId: 6, title: 'SAR Analysis — Penicillin Derivatives',
    description: 'Study and report structure-activity relationships of beta-lactam antibiotics.',
    dueDate: '2026-05-08', status: 'pending', points: 100, type: 'homework',
    instructions: [
      'Draw chemical structures using ChemDraw.',
      'Discuss how functional group changes affect potency.',
      'Submit PDF report (min 3 pages).',
    ],
  },

  // BBA301 - Marketing
  {
    id: 11, courseId: 8, title: 'Brand Audit Presentation',
    description: 'Conduct a full brand audit for a company of your choice and present to class.',
    dueDate: '2026-05-06', status: 'in-progress', points: 150, type: 'project',
    instructions: [
      '10-slide deck covering brand identity, positioning, competitor analysis.',
      '10-minute class presentation.',
      'Submit slides 24 hours before.',
    ],
  },

  // BBA201 - Accounting
  {
    id: 12, courseId: 9, title: 'Balance Sheet Analysis',
    description: 'Analyze the financial statements of a listed company for FY2025.',
    dueDate: '2026-05-04', status: 'pending', points: 100, type: 'homework',
    instructions: [
      'Calculate liquidity, profitability, and solvency ratios.',
      'Compare with industry averages.',
      'Submit Excel model + 1-page commentary.',
    ],
  },

  // MECH201 - Thermodynamics
  {
    id: 13, courseId: 11, title: 'Carnot Cycle Simulation',
    description: 'Simulate a Carnot heat engine and calculate thermal efficiency.',
    dueDate: '2026-05-09', status: 'pending', points: 120, type: 'lab',
    instructions: [
      'Use MATLAB or Python for simulation.',
      'Plot P-V and T-S diagrams.',
      'Submit code + results report.',
    ],
  },

  // EEE201 - Circuit Theory
  {
    id: 14, courseId: 14, title: 'AC Circuit Analysis Lab',
    description: 'Build and analyze an RLC circuit — measure impedance, resonance frequency.',
    dueDate: '2026-05-07', status: 'upcoming', points: 100, type: 'lab',
    instructions: [
      'Physical lab session — come with pre-lab calculations.',
      'Record and submit oscilloscope screenshots.',
      'Complete lab report within 48 hours of session.',
    ],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getCoursesByDepartment(departmentId: string): Course[] {
  return ALL_COURSES.filter(c => c.departmentId === departmentId);
}

export function getAssignmentsByCourse(courseId: number): Assignment[] {
  return ALL_ASSIGNMENTS.filter(a => a.courseId === courseId);
}

export function getAssignmentsByDepartment(departmentId: string): Assignment[] {
  const courseIds = getCoursesByDepartment(departmentId).map(c => c.id);
  return ALL_ASSIGNMENTS.filter(a => courseIds.includes(a.courseId));
}

export function getCourseById(id: number): Course | undefined {
  return ALL_COURSES.find(c => c.id === id);
}

export function getAssignmentById(id: number): Assignment | undefined {
  return ALL_ASSIGNMENTS.find(a => a.id === id);
}

export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find(d => d.id === id);
}
