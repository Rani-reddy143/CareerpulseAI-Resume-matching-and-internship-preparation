import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import type { Education, Experience, Project, Skill, SkillCategory } from '../types';

import {
  User,
  GraduationCap,
  Wrench,
  Briefcase,
  FolderGit2,
  Compass,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  Sparkles
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);

  // Form Local State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    portfolio: profile.portfolio || ''
  });

  const [educationList, setEducationList] = useState<Education[]>(
    profile.education.length > 0
      ? profile.education
      : [
          {
            id: 'edu_1',
            degree: 'Bachelor of Technology (B.Tech)',
            institution: 'Indian Institute of Technology',
            field: 'Computer Science & Engineering',
            cgpa: '8.9 / 10',
            startYear: '2022',
            graduationYear: '2026'
          }
        ]
  );

  const [skillsList, setSkillsList] = useState<Skill[]>(profile.skills || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming');

  const [experienceList, setExperienceList] = useState<Experience[]>(profile.experience || []);
  const [projectList, setProjectList] = useState<Project[]>(profile.projects || []);

  const [careerPref, setCareerPref] = useState({
    preferredRoles: profile.careerPreferences.preferredRoles.join(', '),
    preferredDomains: profile.careerPreferences.preferredDomains.join(', '),
    preferredLocations: profile.careerPreferences.preferredLocations.join(', '),
    workMode: profile.careerPreferences.workMode || 'Hybrid',
    preferredCompanies: profile.careerPreferences.preferredCompanies.join(', '),
    graduationYear: profile.careerPreferences.graduationYear || '2026'
  });

  const steps = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Education', icon: GraduationCap },
    { num: 3, title: 'Skills', icon: Wrench },
    { num: 4, title: 'Experience', icon: Briefcase },
    { num: 5, title: 'Projects', icon: FolderGit2 },
    { num: 6, title: 'Preferences', icon: Compass }
  ];

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (skillsList.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    setSkillsList([
      ...skillsList,
      { name: newSkillName.trim(), category: newSkillCategory }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (nameToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s.name !== nameToRemove));
  };

  const handleAddEducation = () => {
    setEducationList([
      ...educationList,
      {
        id: 'edu_' + Date.now(),
        degree: '',
        institution: '',
        field: '',
        cgpa: '',
        startYear: '2022',
        graduationYear: '2026'
      }
    ]);
  };

  const handleAddExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        id: 'exp_' + Date.now(),
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: []
      }
    ]);
  };

  const handleAddProject = () => {
    setProjectList([
      ...projectList,
      {
        id: 'proj_' + Date.now(),
        name: '',
        description: '',
        technologies: [],
        url: '',
        githubUrl: ''
      }
    ]);
  };

  const handleSaveAll = () => {
    // Re-categorize skills
    const categorizedMap: Record<string, string[]> = {};
    skillsList.forEach((s) => {
      if (!categorizedMap[s.category]) categorizedMap[s.category] = [];
      categorizedMap[s.category].push(s.name);
    });

    const newCategorized: SkillCategory[] = Object.keys(categorizedMap).map((cat) => ({
      category: cat,
      items: categorizedMap[cat]
    }));

    updateProfile({
      ...personalInfo,
      education: educationList,
      skills: skillsList,
      categorizedSkills: newCategorized,
      experience: experienceList,
      projects: projectList,
      careerPreferences: {
        preferredRoles: careerPref.preferredRoles.split(',').map((s) => s.trim()).filter(Boolean),
        preferredDomains: careerPref.preferredDomains.split(',').map((s) => s.trim()).filter(Boolean),
        preferredLocations: careerPref.preferredLocations.split(',').map((s) => s.trim()).filter(Boolean),
        workMode: careerPref.workMode,
        preferredCompanies: careerPref.preferredCompanies.split(',').map((s) => s.trim()).filter(Boolean),
        graduationYear: careerPref.graduationYear
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Candidate Profile Wizard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step wizard to build your comprehensive candidate profile.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </div>

      {/* Progress Wizard Steps Indicator */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[640px]">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => setCurrentStep(s.num)}
                  className="flex items-center gap-2 text-left group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
                      Step {s.num}
                    </span>
                    <span
                      className={`text-xs font-bold block leading-tight mt-0.5 ${
                        isCurrent ? 'text-indigo-600' : 'text-slate-700'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 mx-3 rounded-full" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm min-h-[420px] flex flex-col justify-between">
        <div>
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 1: Personal Information</h3>
                <p className="text-xs text-slate-500">Provide your basic contact details and portfolio links.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="Rani Reddy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="rani.reddy@university.edu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="Hyderabad, Telangana, India"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={personalInfo.linkedin}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="https://linkedin.com/in/ranireddy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="https://github.com/ranireddy143"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio / Website URL</label>
                  <input
                    type="url"
                    value={personalInfo.portfolio}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="https://ranireddy.dev"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 2: Academic Background</h3>
                  <p className="text-xs text-slate-500">Add your university degree and academic accomplishments.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education</span>
                </button>
              </div>

              {educationList.map((edu, idx) => (
                <div key={edu.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                  {educationList.length > 1 && (
                    <button
                      onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].degree = e.target.value;
                          setEducationList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="B.Tech Computer Science & Engineering"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">College / University</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].institution = e.target.value;
                          setEducationList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="Indian Institute of Technology"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch / Specialization</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].field = e.target.value;
                          setEducationList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="Computer Science & Engineering"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">CGPA / Percentage</label>
                      <input
                        type="text"
                        value={edu.cgpa}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].cgpa = e.target.value;
                          setEducationList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="8.9 / 10"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Year</label>
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].startYear = e.target.value;
                          setEducationList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="2022"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].graduationYear = e.target.value;
                          setEducationList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="2026"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Skills */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 3: Technical & Soft Skills</h3>
                <p className="text-xs text-slate-500">Add programming languages, frameworks, cloud tools & soft skills.</p>
              </div>

              {/* Add Skill Control */}
              <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                <input
                  type="text"
                  placeholder="Enter skill name (e.g. Python, Docker, PyTorch)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-500"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Dev">Web Development</option>
                  <option value="AI/ML">AI & Machine Learning</option>
                  <option value="Databases">Databases</option>
                  <option value="Cloud">Cloud & DevOps</option>
                  <option value="Tools">Tools</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill Chip</span>
                </button>
              </div>

              {/* Display Skill Chips */}
              <div className="pt-3 space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Added Skills ({skillsList.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((sk, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-800 group hover:border-indigo-300 transition-all"
                    >
                      <span>{sk.name}</span>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md">
                        {sk.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk.name)}
                        className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Experience */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 4: Internship & Work Experience</h3>
                  <p className="text-xs text-slate-500">Document past internships, work history, or assistantships.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              {experienceList.map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                  {experienceList.length > 1 && (
                    <button
                      onClick={() => setExperienceList(experienceList.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...experienceList];
                          updated[idx].company = e.target.value;
                          setExperienceList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="TechPulse Innovations"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Role Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...experienceList];
                          updated[idx].role = e.target.value;
                          setExperienceList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="Software Development Intern"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...experienceList];
                          updated[idx].startDate = e.target.value;
                          setExperienceList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="May 2025"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = [...experienceList];
                          updated[idx].endDate = e.target.value;
                          setExperienceList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="Jul 2025"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Description & Key Contributions</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...experienceList];
                          updated[idx].description = e.target.value;
                          setExperienceList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none"
                        placeholder="Built microservices using FastAPI and React dashboard..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: Projects */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Step 5: Key Projects</h3>
                  <p className="text-xs text-slate-500">Showcase technical software projects and open-source contributions.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {projectList.map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                  {projectList.length > 1 && (
                    <button
                      onClick={() => setProjectList(projectList.filter((_, i) => i !== idx))}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...projectList];
                          updated[idx].name = e.target.value;
                          setProjectList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="AI Resume & Skill Gap Analyzer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">GitHub Repo URL</label>
                      <input
                        type="url"
                        value={proj.githubUrl || ''}
                        onChange={(e) => {
                          const updated = [...projectList];
                          updated[idx].githubUrl = e.target.value;
                          setProjectList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        placeholder="https://github.com/user/repo"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...projectList];
                          updated[idx].description = e.target.value;
                          setProjectList(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none"
                        placeholder="End-to-end fullstack platform extracting candidate skills..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: Career Preferences */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900">Step 6: Internship & Career Preferences</h3>
                <p className="text-xs text-slate-500">Configure target job roles, preferred domains, work modes, and dream companies.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Job Roles (comma separated)</label>
                  <input
                    type="text"
                    value={careerPref.preferredRoles}
                    onChange={(e) => setCareerPref({ ...careerPref, preferredRoles: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    placeholder="Software Development Intern, AI/ML Intern"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Internship Domains</label>
                  <input
                    type="text"
                    value={careerPref.preferredDomains}
                    onChange={(e) => setCareerPref({ ...careerPref, preferredDomains: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    placeholder="Software Engineering, Artificial Intelligence"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Locations</label>
                  <input
                    type="text"
                    value={careerPref.preferredLocations}
                    onChange={(e) => setCareerPref({ ...careerPref, preferredLocations: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    placeholder="Bengaluru, Hyderabad, Remote"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={careerPref.workMode}
                    onChange={(e) => setCareerPref({ ...careerPref, workMode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target / Preferred Companies</label>
                  <input
                    type="text"
                    value={careerPref.preferredCompanies}
                    onChange={(e) => setCareerPref({ ...careerPref, preferredCompanies: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                    placeholder="Google, Microsoft, Infosys, TCS Research, Adobe"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Wizard Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors"
            >
              Save Profile
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAll}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Wizard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
