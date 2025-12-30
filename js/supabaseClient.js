// File: /js/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔑 Ganti dengan URL & anon key dari project Supabase-mu
const SUPABASE_URL = 'https://fuovfrdicdhnlymnacpz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1b3ZmcmRpY2Robmx5bW5hY3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjYxMzEsImV4cCI6MjA4MjYwMjEzMX0.oX4fVTEIWiRG2NaNJJKOV8dTnSHWhicLVMIFzZUl1o0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
