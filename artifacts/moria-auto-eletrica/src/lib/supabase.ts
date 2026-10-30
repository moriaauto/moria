import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://blpmzlapnewxqdvdpsyby.supabase.co';
export const SUPABASE_ANON_KEY =
  'sb_publishable_AYBvPb7kJWNF8vh2fU-1Jg_2JrVG0dZ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
  },
});
