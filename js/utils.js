export function triggerHaptic(type = 'light') {
  if (!navigator.vibrate) return;
  if (type === 'light') navigator.vibrate(50);
  if (type === 'heavy') navigator.vibrate([100, 50, 100]);
  if (type === 'success') navigator.vibrate([50, 50, 50, 50, 100]);
}

export function switchTab(targetId, btnEl) {
  // Pemanggilan aman memutus audio jika tab diganti saat tes audiometri berjalan
  if (window.stopAudiometryAudio) window.stopAudiometryAudio();
  
  triggerHaptic();
  document.querySelectorAll('.app-view').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(targetId);
  if(target) target.classList.add('active');
  
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if(btnEl) btnEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function toggleCard(id) {
  triggerHaptic();
  const el = document.getElementById(id);
  if(el) el.classList.toggle('hidden');
}
