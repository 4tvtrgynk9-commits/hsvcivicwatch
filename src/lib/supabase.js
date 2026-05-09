import { createClient } from '@supabase/supabase-js';

const HSV_SUPABASE_URL = 'https://idtzqminkklydbuooilk.supabase.co';

function cleanSupabaseUrl(value) {
  const raw = String(value || '').trim();

  if (!raw) return HSV_SUPABASE_URL;

  // If someone pasted the REST endpoint, strip it back to project URL.
  const withoutRest = raw.replace(/\/rest\/v1\/?$/i, '');

  if (/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(withoutRest)) {
    return withoutRest;
  }

  return HSV_SUPABASE_URL;
}

const supabaseUrl = cleanSupabaseUrl(process.env.REACT_APP_SUPABASE_URL);
const supabaseKey = String(process.env.REACT_APP_SUPABASE_ANON_KEY || '').trim();

export const supabase = createClient(supabaseUrl, supabaseKey);
