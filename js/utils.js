export function triggerHaptic(type = 'light') {
  if (!navigator.vibrate) return;
  if (type === 'light') navigator.vibrate(50);
  if (type === 'heavy') navigator.vibrate([100, 50, 100]);
  if (type === 'success') navigator.vibrate([50, 50, 50, 50, 100]);
}

export function switchTab(targetId, btnEl) {
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

// --- V1.0.1 CORE ALGORITHMS ---

// Algoritma RMSSD Medis untuk mengukur Variabilitas Detak Jantung (HRV/Stress)
export function calculateRMSSD(validIntervals) {
  if (!validIntervals || validIntervals.length < 2) return 0;
  let sumOfSquares = 0;
  for (let i = 0; i < validIntervals.length - 1; i++) {
    const diff = validIntervals[i + 1] - validIntervals[i];
    sumOfSquares += Math.pow(diff, 2);
  }
  return Math.round(Math.sqrt(sumOfSquares / (validIntervals.length - 1)));
}

// Algoritma Estimasi Perfusion Index (PI) dari fluktuasi optik (AC/DC Ratio)
export function calculatePerfusionIndex(rawSignal) {
  if (!rawSignal || rawSignal.length === 0) return 0;
  const max = Math.max(...rawSignal);
  const min = Math.min(...rawSignal);
  const dc = rawSignal.reduce((a, b) => a + b, 0) / rawSignal.length;
  
  if (dc === 0) return 0;
  
  const ac = max - min;
  const pi = (ac / dc) * 100;
  return parseFloat(pi.toFixed(2));
}
