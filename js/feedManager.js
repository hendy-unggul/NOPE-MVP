// File: /js/feedManager.js
// Fetch & render rant untuk jejak.html dan frekuensi.html

import { supabase } from './supabaseClient.js';

export async function loadUserRants(username, containerId = 'feed') {
  const { data, error } = await supabase
    .from('rants')
    .select('*')
    .eq('username', username)
    .order('created_at', { ascending: false });

  const feedEl = document.getElementById(containerId);
  if (error || !data?.length) {
    feedEl.innerHTML = `<p style="text-align:center; color:#666; padding:40px;">Belum ada jejak...</p>`;
    return;
  }

  feedEl.innerHTML = data.map(rant => {
    const zoneClass = 
      rant.zone === 'Hype Haus' ? 'zone-hype' :
      rant.zone === 'Ngusahain' ? 'zone-ngusahain' : 'zone-spill';
    return `
      <div class="rant-card">
        <div>${rant.content}</div>
        <div class="zone-tag ${zoneClass}">${rant.zone}</div>
        <div style="font-size:12px; color:#666; margin-top:8px;">
          ${new Date(rant.created_at).toLocaleDateString('id-ID')}
        </div>
      </div>
    `;
  }).join('');
}

export async function loadFrekuensiFeed(currentUsername, containerId = 'feed') {
  const { data: freqData, error: freqError } = await supabase
    .from('user_frequencies')
    .select('detected_zone')
    .eq('username', currentUsername)
    .single();

  const feedEl = document.getElementById(containerId);

  if (freqError || !freqData) {
    feedEl.innerHTML = `
      <p style="text-align:center; color:#666; padding:40px;">
        Jejak 3 kali dulu, nanti NOPE kasih tahu siapa yang sefrekuensi 🫶
      </p>
    `;
    return;
  }

  const myZone = freqData.detected_zone;

  const { data: matchingUsers, error: userError } = await supabase
    .from('user_frequencies')
    .select('username')
    .eq('detected_zone', myZone);

  if (userError || !matchingUsers?.length) {
    feedEl.innerHTML = `<p>Tak ada yang sefrekuensi... tapi kamu nggak sendiri.</p>`;
    return;
  }

  const usernames = matchingUsers.map(u => u.username).filter(u => u !== currentUsername);

  const { data: rants, error: rantError } = await supabase
    .from('rants')
    .select('*')
    .in('username', usernames)
    .order('created_at', { ascending: false })
    .limit(20);

  if (rantError || !rants?.length) {
    feedEl.innerHTML = `<p>Belum ada jejak dari yang sefrekuensi.</p>`;
    return;
  }

  feedEl.innerHTML = rants.map(rant => `
    <div class="rant-card">
      <div style="font-size:12px; color:#666; margin-bottom:4px;">@${rant.username}</div>
      <div>${rant.content}</div>
      <div style="font-size:12px; color:#666; margin-top:8px;">
        ${new Date(rant.created_at).toLocaleDateString('id-ID')}
      </div>
    </div>
  `).join('');

  // Tampilkan zona di header (opsional)
  const zoneMap = {
    "Hype Haus": "Hype Haus",
    "Ngusahain": "Ngusahain",
    "Spill Zone": "Spill Zone"
  };
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    headerEl.innerHTML = `
      <div>Se frekuensi</div>
      <div class="zone-indicator">${zoneMap[myZone] || myZone}</div>
    `;
  }
}
