const defaultSubjects = [
  {
    id: 1,
    title: "What is Data Science?",
    description: "Start with the basic meaning, purpose, and use of data science.",
    icon: "📊",
    level: "beginner",
    status: "Available",
  },
  {
    id: 2,
    title: "Python for Data Science",
    description: "Learn basic Python syntax, variables, and simple coding skills.",
    icon: "🐍",
    level: "beginner",
    status: "Available",
  },
  {
    id: 3,
    title: "Statistics Fundamentals",
    description: "Improve your understanding of probability, mean, and data analysis.",
    icon: "📈",
    level: "intermediate",
    status: "Available",
  },
  {
    id: 4,
    title: "Exploratory Data Analysis",
    description: "Learn how to inspect, clean, and understand datasets.",
    icon: "🔍",
    level: "intermediate",
    status: "Available",
  },
  {
    id: 5,
    title: "Machine Learning Basics",
    description: "Understand model training, prediction, and evaluation.",
    icon: "🤖",
    level: "advanced",
    status: "Available",
  },
  {
    id: 6,
    title: "Data Visualization",
    description: "Learn advanced ways to present insights using charts and dashboards.",
    icon: "🎨",
    level: "advanced",
    status: "Available",
  },
];

export const defaultSubjectsByLevel = {
  beginner: defaultSubjects.filter((subject) => subject.level === "beginner"),
  intermediate: defaultSubjects.filter((subject) => subject.level === "intermediate"),
  advanced: defaultSubjects.filter((subject) => subject.level === "advanced"),
};

const normalizeSubjects = (subjects = []) =>
  subjects.map((subject) => ({
    ...subject,
    level: String(subject.level || "beginner").toLowerCase(),
  }));

export const getStudentSubjectsForLevel = (level, savedSubjects = {}) => {
  const normalizedLevel = String(level || "beginner").toLowerCase();

  const adminBeginner = normalizeSubjects(savedSubjects.beginner || []);
  const adminIntermediate = normalizeSubjects(savedSubjects.intermediate || []);
  const adminAdvanced = normalizeSubjects(savedSubjects.advanced || []);

  const allowedSubjects = {
    beginner: [...defaultSubjectsByLevel.beginner, ...adminBeginner],
    intermediate: [
      ...defaultSubjectsByLevel.beginner,
      ...defaultSubjectsByLevel.intermediate,
      ...adminBeginner,
      ...adminIntermediate,
    ],
    advanced: [
      ...defaultSubjectsByLevel.beginner,
      ...defaultSubjectsByLevel.intermediate,
      ...defaultSubjectsByLevel.advanced,
      ...adminBeginner,
      ...adminIntermediate,
      ...adminAdvanced,
    ],
  };

  return (allowedSubjects[normalizedLevel] || allowedSubjects.beginner).map((subject) => ({
    ...subject,
    level: String(subject.level || normalizedLevel).toLowerCase(),
  }));
};

export const getStudentSubjectsByLevel = (savedSubjects = {}) => ({
  beginner: getStudentSubjectsForLevel("beginner", savedSubjects),
  intermediate: getStudentSubjectsForLevel("intermediate", savedSubjects),
  advanced: getStudentSubjectsForLevel("advanced", savedSubjects),
});
