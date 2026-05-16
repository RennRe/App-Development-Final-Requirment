/**
 * AuthContext
 * Manages whether the user is logged in or not.
 * Now uses AsyncStorage to remember the user even after closing the app.
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isSignedIn: boolean;
  userName: string;
  isAuthLoading: boolean; // Tells the app if we are still checking storage
  signIn: (name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('Jhirick');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load from storage when the app opens
  useEffect(() => {
    async function loadAuth() {
      try {
        const savedSignIn = await AsyncStorage.getItem('@auth_signed_in');
        const savedName = await AsyncStorage.getItem('@auth_user_name');

        if (savedSignIn === 'true') {
          setIsSignedIn(true);
          if (savedName) setUserName(savedName);
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setIsAuthLoading(false); // Done loading
      }
    }
    loadAuth();
  }, []);

  const signIn = async (name?: string) => {
    try {
      const newName = name || userName;
      if (name) setUserName(newName);
      setIsSignedIn(true);

      // Save to storage
      await AsyncStorage.setItem('@auth_signed_in', 'true');
      await AsyncStorage.setItem('@auth_user_name', newName);
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  };

  const signOut = async () => {
    try {
      setIsSignedIn(false);
      // Remove from storage
      await AsyncStorage.removeItem('@auth_signed_in');
      await AsyncStorage.removeItem('@auth_user_name');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, userName, isAuthLoading, signIn, signOut }}>
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
