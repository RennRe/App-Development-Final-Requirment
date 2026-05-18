import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  isSignedIn: boolean;
  userName: string;
  isAuthLoading: boolean;
  signIn: (name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: Session | null;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (name?: string) => {
    // This is kept for backward compatibility if called manually,
    // but the actual sign-in happens via Supabase OAuth in sign-in.tsx
    console.warn("Call supabase.auth.signInWithOAuth instead of signIn from AuthContext");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isSignedIn = !!session;
  // If user signed in with Google, their name will be in user_metadata.full_name
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <AuthContext.Provider value={{ isSignedIn, userName, isAuthLoading, signIn, signOut, session, user }}>
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
