import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CandidateProfile, ResumeMetadata, ExtractedResumeData } from '../types';

import { INITIAL_STUDENT_PROFILE } from '../data/mockData';
import { useToast } from './ToastContext';

export type ParsingStage =
  | 'idle'
  | 'uploading'
  | 'parsing_doc'
  | 'text_extraction'
  | 'llm_analysis'
  | 'skill_extraction'
  | 'experience_extraction'
  | 'profile_structuring'
  | 'completed';

interface ProfileContextType {
  profile: CandidateProfile;
  parsingStage: ParsingStage;
  isParsing: boolean;
  parsingProgress: number;
  updateProfile: (updatedData: Partial<CandidateProfile>) => void;
  uploadAndParseResume: (file: File) => Promise<void>;
  resetResume: () => void;
  syncExtractedToProfile: () => void;
  calculateCompleteness: (p: CandidateProfile) => number;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('ai_career_profile');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });

  const [parsingStage, setParsingStage] = useState<ParsingStage>('idle');
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('ai_career_profile', JSON.stringify(profile));
  }, [profile]);

  const calculateCompleteness = (p: CandidateProfile): number => {
    let score = 0;
    if (p.fullName && p.email && p.phone) score += 20;
    if (p.education && p.education.length > 0) score += 20;
    if (p.skills && p.skills.length > 0) score += 20;
    if ((p.experience && p.experience.length > 0) || (p.projects && p.projects.length > 0)) score += 20;
    if (p.certifications && p.certifications.length > 0) score += 10;
    if (p.resumeMetadata && p.resumeMetadata.parsingStatus === 'Completed') score += 10;
    return Math.min(100, score);
  };

  const updateProfile = (updatedData: Partial<CandidateProfile>) => {
    setProfile((prev) => {
      const nextProfile = {
        ...prev,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      nextProfile.profileCompletion = calculateCompleteness(nextProfile);
      return nextProfile;
    });
    addToast('success', 'Profile Updated', 'Changes saved successfully.');
  };

  const uploadAndParseResume = async (file: File) => {
    setIsParsing(true);
    setParsingStage('uploading');
    setParsingProgress(10);

    const stages: { stage: ParsingStage; progress: number; delay: number }[] = [
      { stage: 'parsing_doc', progress: 25, delay: 1000 },
      { stage: 'text_extraction', progress: 45, delay: 1200 },
      { stage: 'llm_analysis', progress: 65, delay: 1400 },
      { stage: 'skill_extraction', progress: 80, delay: 1100 },
      { stage: 'experience_extraction', progress: 90, delay: 1000 },
      { stage: 'profile_structuring', progress: 95, delay: 900 },
      { stage: 'completed', progress: 100, delay: 800 }
    ];

    for (const item of stages) {
      await new Promise((res) => setTimeout(res, item.delay));
      setParsingStage(item.stage);
      setParsingProgress(item.progress);
    }

    const newResumeMeta: ResumeMetadata = {
      fileName: file.name,
      fileType: file.type || 'application/pdf',
      fileSize: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      parsingStatus: 'Completed',
      analysisStatus: 'Completed'
    };

    const newExtracted: ExtractedResumeData = {
      fullName: profile.fullName || 'Rani Reddy',
      email: profile.email || 'rani.reddy@university.edu',
      phone: profile.phone || '+91 98765 43210',
      summary: 'Computer Science & Engineering Student with experience in React, Python microservices, and Machine Learning algorithms.',
      skills: [
        { category: 'Programming', items: ['Python', 'Java', 'C++', 'SQL'] },
        { category: 'Web Development', items: ['React.js', 'TypeScript', 'Tailwind CSS', 'FastAPI'] },
        { category: 'AI & Machine Learning', items: ['Machine Learning', 'PyTorch', 'Pandas', 'Scikit-Learn'] },
        { category: 'Tools & Cloud', items: ['Docker', 'Git', 'PostgreSQL', 'AWS S3'] }
      ],
      education: profile.education,
      experience: profile.experience,
      projects: profile.projects,
      certifications: profile.certifications,
      confidenceScores: {
        skills: 0.96,
        education: 0.99,
        experience: 0.94,
        projects: 0.92
      }
    };

    setProfile((prev) => {
      const updated = {
        ...prev,
        resumeMetadata: newResumeMeta,
        extractedResumeData: newExtracted
      };
      updated.profileCompletion = calculateCompleteness(updated);
      return updated;
    });

    setIsParsing(false);
    addToast('success', 'Resume Analyzed!', 'Extracted skills and experience with high AI confidence.');
  };

  const resetResume = () => {
    setProfile((prev) => ({
      ...prev,
      resumeMetadata: {
        parsingStatus: 'Pending',
        analysisStatus: 'Pending'
      },
      extractedResumeData: undefined
    }));
    setParsingStage('idle');
    setParsingProgress(0);
    addToast('info', 'Resume Removed', 'Upload a new resume anytime.');
  };

  const syncExtractedToProfile = () => {
    if (!profile.extractedResumeData) return;
    const ext = profile.extractedResumeData;
    
    // Extract flattened skills
    const newSkills = ext.skills.flatMap((cat) =>
      cat.items.map((item) => ({ name: item, category: cat.category }))
    );

    setProfile((prev) => {
      const updated = {
        ...prev,
        skills: newSkills,
        categorizedSkills: ext.skills,
        education: ext.education.length > 0 ? ext.education : prev.education,
        experience: ext.experience.length > 0 ? ext.experience : prev.experience,
        projects: ext.projects.length > 0 ? ext.projects : prev.projects
      };
      updated.profileCompletion = calculateCompleteness(updated);
      return updated;
    });

    addToast('success', 'Profile Synced!', 'Extracted resume details updated in your profile.');
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        parsingStage,
        isParsing,
        parsingProgress,
        updateProfile,
        uploadAndParseResume,
        resetResume,
        syncExtractedToProfile,
        calculateCompleteness
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
