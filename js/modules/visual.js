import { Store } from '../store.js';
import { triggerHaptic } from '../utils.js';

let visualState = 0, visualStartTime = 0;

export function initVisualReflex() {
  const vBox = document.getElementById('visualBox');
  if(!vBox) return;
  vBox.addEventListener('click', () => {
    if (visualState === 0) {
      visualState = 1; document.getElementById('valVisual').innerText = "..."; vBox.innerText = "TUNGGU MERAH..."; triggerHaptic('light');
      vBox.className = "w-full h-[60px] rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold tracking-wider text-amber-500 cursor-pointer select-none transition-colors";
      setTimeout(() => { if (visualState === 1) { visualState = 2; visualStartTime = performance.now(); vBox.innerText = "TAP SEKARANG!!!"; vBox.className = "w-full h-[60px] rounded-xl bg-rose-600 flex items-center justify-center text-sm font-black tracking-widest text-white cursor-pointer select-none shadow-[0_0_20px_rgba(225,29,72,0.6)]"; triggerHaptic('heavy'); } }, 1500 + Math.random() * 2500);
    } else if (visualState === 2) {
      let diff = Math.round(performance.now() - visualStartTime); Store.savedVisual = diff + ' ms'; document.getElementById('valVisual').innerText = Store.savedVisual;
      vBox.innerText = `${diff}ms - RESET?`; vBox.className = "w-full h-[60px] rounded-xl bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold tracking-wider cursor-pointer select-none"; visualState = 0; triggerHaptic('success');
    } else if (visualState === 1) {
      alert("Terlalu cepat!"); visualState = 0; vBox.innerText = "TAP TO START"; vBox.className = "w-full h-[60px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-slate-300 font-bold tracking-wider cursor-pointer active:scale-95 transition-all select-none";
    }
  });
}
