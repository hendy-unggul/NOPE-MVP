// File: /js/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔑 Ganti dengan URL & anon key dari project Supabase-mu
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-public-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
