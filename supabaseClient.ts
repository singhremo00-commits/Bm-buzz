import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxhocgxfgowsmzarrcgj.supabase.co';
const supabaseAnonKey = 'sb_publishable_k_N2DfIqMl7QUrrapqgfbw_ddssyaYf';

// Initializing the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);