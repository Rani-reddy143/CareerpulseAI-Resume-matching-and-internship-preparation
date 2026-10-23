import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';

import { ToastContainer } from './components/common/ToastContainer';
import { Sidebar } from './components/common/Sidebar';
import type { NavTab } from './components/common/Sidebar';
import { Topbar } from './components/common/Topbar';

import { AIChatDrawer } from './components/common/AIChatDrawer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResumeAnalysisPage } from './pages/ResumeAnalysisPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { InternshipsPage } from './pages/InternshipsPage';

import { SkillGapPage } from './pages/SkillGapPage';
import { ApplicationCustomizationPage } from './pages/ApplicationCustomizationPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { CareerAssistantPage } from './pages/CareerAssistantPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, fillDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // If user is not authenticated, show landing page or auth forms
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage
          onNavigateSignUp={() => setAuthView('signup')}
          onNavigateDashboard={() => fillDemoUser()}
        />
      );
    }
    if (authView === 'signup') {
      return (
        <SignUpPage
          onNavigateLogin={() => setAuthView('login')}
          onNavigateDashboard={() => fillDemoUser()}
        />
      );
    }
    return (
      <LandingPage
        onNavigateAuth={(mode) => setAuthView(mode)}
        onNavigateDashboard={() => fillDemoUser()}
      />
    );
  }

  // Authenticated Student App View
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsOpenMobile={setIsOpenMobile}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && <StudentProfilePage />}
          {activeTab === 'resume' && <ResumeUploadPage setActiveTab={setActiveTab} />}
          {(activeTab as string) === 'resume-analysis' && <ResumeAnalysisPage setActiveTab={setActiveTab} />}
          {activeTab === 'architecture' && <ArchitecturePage />}
          {activeTab === 'internships' && <InternshipsPage />}
          {activeTab === 'applications' && <ApplicationTrackerPage />}
          {activeTab === 'skill-gap' && <SkillGapPage />}
          {activeTab === 'cover-letter' && <ApplicationCustomizationPage />}
          {activeTab === 'interview-prep' && <InterviewPrepPage />}
          {activeTab === 'assistant' && <CareerAssistantPage />}

          {/* Placeholder Views for Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
              <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-bold text-lg">
                  ⚙️
                </div>
                <h2 className="text-xl font-bold text-slate-900 capitalize">Settings</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Manage your account preferences, notification settings, and API integrations.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating AI Career Assistant Drawer */}
      <AIChatDrawer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProfileProvider>
          <MainAppContent />
          <ToastContainer />
        </ProfileProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
