import { Store } from '../store.js';
import { triggerHaptic } from '../utils.js';

export function startTremorAnalysis() {
  triggerHaptic(); 
  const btn = document.getElementById('btnTremor'), inst = document.getElementById('instTremor');
  btn.disabled = true; btn.innerText = "MEREKAM..."; document.getElementById('valTremor').innerText = "...";
  let motionData = [];
  function captureMotion(e) { 
    if(e.acceleration) {
      let x = e.acceleration.x || 0; let y = e.acceleration.y || 0; let z = e.acceleration.z || 0;
      let magnitude = Math.sqrt(x*x + y*y + z*z); motionData.push(magnitude);
    } 
  }
  window.addEventListener('devicemotion', captureMotion);
  setTimeout(() => {
    window.removeEventListener('devicemotion', captureMotion);
    if (motionData.length === 0) {
      alert("Sensor gerak tidak terdeteksi."); btn.disabled = false; inst.innerText = "Gagal membaca sensor."; document.getElementById('valTremor').innerText = "--"; return;
    }
    let avgMagnitude = motionData.reduce((a, b) => a + b, 0) / motionData.length;
    let variance = motionData.reduce((a, b) => a + Math.pow(b - avgMagnitude, 2), 0) / motionData.length;
    let standardDeviation = Math.sqrt(variance);
    let stabilityScore = Math.max(0, Math.min(100, 100 - (standardDeviation * 70))); 
    Store.savedTremor = Math.round(stabilityScore) + '%';
    document.getElementById('valTremor').innerText = Store.savedTremor; inst.innerText = "Selesai."; btn.disabled = false; btn.innerText="ULANGI TES"; triggerHaptic('success');
  }, 4000);
}
