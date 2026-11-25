import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (customUrl?: string, customKey?: string): SupabaseClient | null => {
  const url = customUrl || import.meta.env.VITE_SUPABASE_URL;
  const anonKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.trim() === '' || anonKey.trim() === '') {
    return null;
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseClient;
};

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && !url.includes('example.supabase.co'));
};
