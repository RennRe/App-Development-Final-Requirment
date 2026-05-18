/**
 * Supabase Client
 * Initializes the Supabase connection using the project URL and anon key.
 * Uses AsyncStorage so the user's session persists after closing the app.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://luoncpiobcjhqfjhbuvv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b25jcGlvYmNqaHFmamhidXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTgwODQsImV4cCI6MjA5NDQ5NDA4NH0.gwvjoBWlhLWaKqCSMMx246jdO7flw7vDFqaxQ8D4Qxc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Use AsyncStorage so the session survives app restarts
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
