/**
 * AuthContext
 * Simple placeholder auth state.
 * In production you'd connect this to Supabase / Firebase.
 */

import React, { createContext, useContext, useState, type ReactNode } from 'react';

type AuthContextType = {
  isSignedIn: boolean;
  userName: string;
  signIn: (name?: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('Jhirick');

  const signIn = (name?: string) => {
    if (name) setUserName(name);
    setIsSignedIn(true);
  };

  const signOut = () => {
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, userName, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
