// js/ai-engine.js
import { Store } from './store.js';

export async function processAiMedicalAdvice(bpm, pi, stress) {
    // Update Store dengan data terbaru
    Store.savedBpm = bpm;
    Store.savedPi = pi;
    Store.savedStress = stress;

    const prompt = `
        Analisis kesehatan untuk user:
        - Detak Jantung: ${bpm} BPM
        - Perfusion Index (PI): ${pi}%
        - Indeks Stress: ${stress}%
        
        Berikan saran gaya hidup singkat, padat, dan informatif (maksimal 3 paragraf). 
        Jangan gunakan format judul yang rumit. Fokus pada kesehatan kardiovaskular.
    `;

    try {
        // Asumsi fungsi fetch ke API Gemini Anda
        // Ganti dengan endpoint atau method fetch milik Anda
        const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });
        
        const data = await response.json();
        
        // Simpan hasil ke Store (Sudah dibersihkan nanti di pdf-report.js)
        Store.rawAiAdvice = data.advice || "Data kesehatan Anda dalam rentang normal. Tetap jaga pola makan dan istirahat yang cukup.";
        
    } catch (error) {
        console.error("AI Engine Error:", error);
        Store.rawAiAdvice = "Saat ini insight AI tidak dapat dimuat, namun secara umum, pastikan Anda tetap terhidrasi dan cukup istirahat.";
    }
}
