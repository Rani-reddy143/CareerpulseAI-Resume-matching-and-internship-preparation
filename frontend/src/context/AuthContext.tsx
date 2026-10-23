import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  fillDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ai_career_user');
    return saved ? JSON.parse(saved) : {
      id: 'user_rani_1',
      name: 'Rani Reddy',
      email: 'rani.reddy@university.edu',
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  });

  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_career_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_career_user');
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substring(2, 7),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    setUser(newUser);
    addToast('success', 'Welcome Back!', `Signed in successfully as ${newUser.email}`);
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substring(2, 7),
      name,
      email,
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    setUser(newUser);
    addToast('success', 'Account Created!', 'Welcome to AI Career Companion.');
    return true;
  };

  const logout = () => {
    setUser(null);
    addToast('info', 'Logged Out', 'You have been signed out.');
  };

  const fillDemoUser = () => {
    const demoUser: User = {
      id: 'user_rani_1',
      name: 'Rani Reddy',
      email: 'rani.reddy@university.edu',
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    setUser(demoUser);
    addToast('success', 'Demo Account Loaded', 'Logged in as Rani Reddy (IIT CSE B.Tech)');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        fillDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
