import type { CandidateProfile } from '../types';


export const INITIAL_STUDENT_PROFILE: CandidateProfile = {
  id: 'prof_rani123',
  userId: 'user_rani_1',
  fullName: 'Rani Reddy',
  email: 'rani.reddy@university.edu',
  phone: '+91 98765 43210',
  location: 'Hyderabad, Telangana, India',
  linkedin: 'https://linkedin.com/in/ranireddy',
  github: 'https://github.com/ranireddy143',
  portfolio: 'https://ranireddy.dev',
  education: [
    {
      id: 'edu_1',
      degree: 'Bachelor of Technology (B.Tech)',
      institution: 'Indian Institute of Technology',
      field: 'Computer Science & Engineering',
      cgpa: '8.9 / 10',
      startYear: '2022',
      graduationYear: '2026'
    }
  ],
  skills: [
    { name: 'Python', category: 'Programming' },
    { name: 'Java', category: 'Programming' },
    { name: 'React.js', category: 'Web Dev' },
    { name: 'TypeScript', category: 'Web Dev' },
    { name: 'FastAPI', category: 'Web Dev' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'Git', category: 'Tools' },
    { name: 'Docker', category: 'Cloud' }
  ],
  categorizedSkills: [
    { category: 'Programming', items: ['Python', 'Java', 'C++', 'SQL'] },
    { category: 'Web Development', items: ['React.js', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Node.js'] },
    { category: 'AI & Machine Learning', items: ['Machine Learning', 'PyTorch', 'Pandas', 'Scikit-Learn', 'NLP'] },
    { category: 'Databases & Cloud', items: ['PostgreSQL', 'MongoDB', 'AWS S3', 'Docker'] },
    { category: 'Tools & Soft Skills', items: ['Git', 'Jira', 'Problem Solving', 'Team Collaboration', 'Agile'] }
  ],
  experience: [
    {
      id: 'exp_1',
      company: 'TechPulse Innovations',
      role: 'Software Development Intern',
      startDate: 'May 2025',
      endDate: 'Jul 2025',
      description: 'Built RESTful microservices using FastAPI and interactive React user dashboards. Optimized PostgreSQL query execution plans, reducing average response latency by 35%.',
      technologies: ['FastAPI', 'React', 'PostgreSQL', 'Docker']
    }
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'AI Resume & Skill Gap Analyzer',
      description: 'End-to-end web platform using LLM structured extraction to analyze student resumes and match skill profiles against internship descriptions.',
      technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'Tailwind CSS'],
      url: 'https://ai-career-companion.demo',
      githubUrl: 'https://github.com/ranireddy143/app1'
    },
    {
      id: 'proj_2',
      name: 'Smart Campus Placement Portal',
      description: 'Campus placement management portal facilitating recruiter job postings, student applications, and automated resume ATS score evaluation.',
      technologies: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      githubUrl: 'https://github.com/ranireddy143/campus-portal'
    }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Dec 2024',
      credentialUrl: 'https://aws.amazon.com/verification'
    },
    {
      id: 'cert_2',
      name: 'Machine Learning Specialization',
      issuer: 'DeepLearning.AI / Coursera',
      date: 'Aug 2024',
      credentialUrl: 'https://coursera.org/verify/ml'
    }
  ],
  careerPreferences: {
    preferredRoles: ['Software Development Intern', 'AI/ML Engineer Intern', 'Data Analyst Intern'],
    preferredDomains: ['Software Engineering', 'Artificial Intelligence', 'FinTech', 'EdTech'],
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
    workMode: 'Hybrid',
    preferredCompanies: ['Google', 'Microsoft', 'Infosys', 'TCS Research', 'Adobe'],
    graduationYear: '2026'
  },
  resumeMetadata: {
    fileName: 'Rani_Reddy_Resume_2026.pdf',
    fileType: 'application/pdf',
    fileSize: 2450000,
    uploadDate: '2026-09-01',
    parsingStatus: 'Completed',
    analysisStatus: 'Completed'
  },
  extractedResumeData: {
    fullName: 'Rani Reddy',
    email: 'rani.reddy@university.edu',
    phone: '+91 98765 43210',
    summary: 'Proactive Computer Science senior specializing in web development, Python API engineering, and machine learning solutions.',
    skills: [
      { category: 'Programming', items: ['Python', 'Java', 'C++', 'SQL'] },
      { category: 'Web Development', items: ['React.js', 'TypeScript', 'Tailwind CSS', 'FastAPI'] },
      { category: 'AI & Machine Learning', items: ['Machine Learning', 'PyTorch', 'Pandas', 'Scikit-Learn'] },
      { category: 'Tools & Cloud', items: ['Docker', 'Git', 'PostgreSQL', 'AWS S3'] }
    ],
    education: [
      {
        degree: 'B.Tech Computer Science & Engineering',
        institution: 'Indian Institute of Technology',
        field: 'Computer Science',
        cgpa: '8.9 / 10',
        startYear: '2022',
        graduationYear: '2026'
      }
    ],
    experience: [
      {
        company: 'TechPulse Innovations',
        role: 'Software Development Intern',
        startDate: 'May 2025',
        endDate: 'Jul 2025',
        description: 'Engineered Python REST endpoints and integrated React UI components.',
        technologies: ['FastAPI', 'React', 'PostgreSQL']
      }
    ],
    projects: [
      {
        name: 'AI Resume & Skill Gap Analyzer',
        description: 'Structured resume parsing using generative LLM JSON extraction.',
        technologies: ['React', 'Python', 'FastAPI']
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: 'Dec 2024'
      }
    ],
    confidenceScores: {
      skills: 0.96,
      education: 0.99,
      experience: 0.94,
      projects: 0.92
    }
  },
  profileCompletion: 85,
  createdAt: '2026-09-01T10:00:00Z',
  updatedAt: '2026-09-05T20:00:00Z'
};

export const AI_SUGGESTED_PROMPTS = [
  'What internships are suitable for me?',
  'What skills am I missing for AI roles?',
  'Help me prepare for my upcoming tech interview.',
  'How can I improve my resume content?',
  'What projects should I build next to stand out?'
];
