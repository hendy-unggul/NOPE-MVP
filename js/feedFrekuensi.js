// File: /js/feedFrekuensi.js
// Fetch dan render feed "sefrekuensi" di frekuensi.html

import { supabase } from './supabaseClient.js';

export async function loadFrekuensiFeed(currentUsername) {
  // 1. Ambil zona user saat ini
  const { data: freqData, error: freqError } = await supabase
    .from('user_frequencies')
    .select('detected_zone')
    .eq('username', currentUsername)
    .single();

  if (freqError || !freqData) {
    // Jika belum ada frekuensi → tampilkan dummy atau pesan
    document.getElementById('feed').innerHTML = `
      <p style="text-align:center; color:#888; padding:40px;">
        Jejak 3 kali dulu, nanti NOPE kasih tahu siapa yang sefrekuensi 🫶
      </p>
    `;
    return;
  }

  const myZone = freqData.detected_zone;

  // 2. Ambil semua user dengan zona SAMA
  const { data: matchingUsers, error: userError } = await supabase
    .from('user_frequencies')
    .select('username')
    .eq('detected_zone', myZone);

  if (userError || !matchingUsers?.length) {
    document.getElementById('feed').innerHTML = `<p>Tak ada yang sefrekuensi... tapi kamu nggak sendiri.</p>`;
    return;
  }

  const usernames = matchingUsers.map(u => u.username);

  // 3. Ambil rant terbaru dari user-user tersebut
  const { data: rants, error: rantError } = await supabase
    .from('rants')
    .select('*')
    .in('username', usernames)
    .order('created_at', { ascending: false })
    .limit(20);

  // 4. Render rant
  const feedEl = document.getElementById('feed');
  if (rantError || !rants?.length) {
    feedEl.innerHTML = `<p>Belum ada jejak dari yang sefrekuensi.</p>`;
    return;
  }

  feedEl.innerHTML = rants.map(rant => `
    <div class="rant-card" style="padding:16px; border-bottom:1px solid #222; margin-bottom:12px;">
      <div style="font-size:12px; color:#888; margin-bottom:4px;">@${rant.username}</div>
      <div style="font-size:16px; line-height:1.4;">${rant.content}</div>
      <div style="font-size:12px; color:#888; margin-top:8px;">${new Date(rant.created_at).toLocaleDateString('id-ID')}</div>
    </div>
  `).join('');
}
