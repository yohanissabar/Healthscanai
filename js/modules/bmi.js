import { Store } from '../store.js';
import { triggerHaptic } from '../utils.js';

export function calculateBMI() {
  triggerHaptic();
  const w = parseFloat(document.getElementById('inputBerat').value);
  const h = parseFloat(document.getElementById('inputTinggi').value);
  if(!w || !h) return alert("Masukkan berat dan tinggi badan dengan benar!");
  const m = h / 100; const bmi = (w / (m * m)).toFixed(1); let status = "Normal";
  if(bmi < 18.5) status = "Underweight"; else if(bmi > 24.9 && bmi <= 29.9) status = "Overweight"; else if(bmi > 29.9) status = "Obesitas";
  Store.savedBmi = `${bmi} (${status})`; document.getElementById('valBmi').innerText = bmi; document.getElementById('statusBmi').innerText = `Status: ${status}`;
  document.getElementById('valBmi').className = `font-black ${bmi >= 18.5 && bmi <= 24.9 ? 'text-emerald-400' : 'text-rose-400'}`;
}
