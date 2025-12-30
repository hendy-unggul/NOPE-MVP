// File: /js/reactionHandler.js
// Handle emoji reaction di saynope.html

import { supabase } from './supabaseClient.js';

export async function react(rantId, emojiType) {
  const currentUser = localStorage.getItem('nope_username') || 'anonymous';

  // Simpan reaksi ke tabel reactions (jika sudah dibuat)
  const { error } = await supabase.from('reactions').insert({
    rant_id: rantId,
    reactor_username: currentUser,
    emoji_type: emojiType,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.warn('Gagal simpan reaksi:', error);
    alert('Reaksi gagal disimpan. Coba lagi nanti.');
  } else {
    // Update UI sementara (tanpa refresh)
    const btn = event.target;
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 1000);
  }
}
