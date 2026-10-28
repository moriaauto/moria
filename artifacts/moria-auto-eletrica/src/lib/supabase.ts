import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://blpmzlapnewxqdvdpsyby.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscG16bGFwbmV3eHFkdnBzeWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMDk0NDEsImV4cCI6MjEwODc4NTQ0MX0.lY3eci2855m65CUW98cTljpWeN6z02TKqYYg4HvrA04';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
});
