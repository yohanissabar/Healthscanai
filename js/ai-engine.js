import { Store } from './store.js';

export function processAiMedicalAdvice(bpm, spo2, stress) {
  const defaultText = document.getElementById('defaultAiText');
  const box = document.getElementById('aiRecommendationBox');
  const text = document.getElementById('aiRecommendationText');
  
  if (defaultText) defaultText.style.display = 'none';
  if (box) box.classList.remove('hidden');

  let evaluasi = "", langkah = "";
  if (spo2 < 96) { 
    evaluasi = `Saturasi (${spo2}%) perlu ditingkatkan.`; 
    langkah = "Latihan napas diafragma dan hidrasi tubuh cukup."; 
  } else if (bpm > 100) { 
    evaluasi = `Detak jantung istirahat tinggi (${bpm} BPM).`; 
    langkah = "Kurangi paparan gadget sementara waktu, coba duduk santai."; 
  } else if (stress > 50) { 
    evaluasi = `Indeks ketegangan saraf meningkat (${stress}%).`; 
    langkah = "Kurangi kafein, dan lakukan peregangan otot ringan."; 
  } else { 
    evaluasi = "Seluruh parameter primer optimal."; 
    langkah = "Pertahankan kualitas pola tidur dan aktivitas harian."; 
  }
  
  Store.rawAiAdvice = `Observasi: ${evaluasi} Saran Wellness: ${langkah}`;
  if (text) {
    text.innerHTML = `<span class="text-white font-bold block mb-1">Observasi:</span> ${evaluasi}<br><br><span class="text-white font-bold block mb-1">Action:</span> ${langkah}`;
  }
}
