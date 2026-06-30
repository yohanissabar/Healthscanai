// js/ai-engine.js
import { Store } from './store.js';

export async function processAiMedicalAdvice(bpm, pi, stress, energy, hrv, rr) {
    // Sinkronisasikan parameter data terbaru ke dalam Store global
    Store.savedBpm = bpm;
    Store.savedPi = pi;
    Store.savedStress = stress;
    Store.savedEnergy = energy;
    Store.savedHrv = hrv;
    Store.savedRr = rr;

    const prompt = `
        Bertindaklah sebagai asisten kebugaran ahli. Analisis data kesehatan berikut secara objektif:
        - Detak Jantung: ${bpm} BPM
        - Perfusion Index (PI): ${pi}%
        - Indeks Stress: ${stress}%
        - Kapasitas Energi: ${energy}%
        - Variabilitas Jantung (HRV): ${hrv} ms
        - Laju Respirasi: ${rr} x/m

        Berikan saran kesehatan yang bersifat personal, produktif, dan edukatif maksimal dalam 3 paragraf pendek. 
        Jangan gunakan format judul markdown yang berlebihan. Fokus utama pada efisiensi kardiovaskular dan ritme pernapasan.
    `;

    try {
        // Panggil endpoint proxy serverless Cloudflare Functions Anda
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) throw new Error("Gagal terhubung ke API Cloudflare Pages");

        const data = await response.json();
        const textAdvice = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textAdvice) throw new Error("Format balasan dari server AI kosong");

        Store.rawAiAdvice = textAdvice;

    } catch (error) {
        console.warn("AI Engine Cloudflare offline, menjalankan sistem penalaran statis lokal...", error);
        // MENJALANKAN RICH FALLBACK ENGINE (Penalaran statis komprehensif tanpa kuota internet)
        Store.rawAiAdvice = generateStaticInsight(bpm, pi, stress, energy, hrv, rr);
    }
}

/**
 * SISTEM PENALARAN LOKAL (FALLBACK RICH ENGINE)
 * Merangkai interpretasi analisa kaya bahasa manusia berdasarkan logika rentang klinis.
 */
function generateStaticInsight(bpm, pi, stress, energy, hrv, rr) {
    let insight = [];

    // Paragraf 1: Analisis Kardiovaskular & Aliran Pembuluh Darah Tepi (BPM & PI)
    if (bpm < 60) {
        insight.push(`Laju detak jantung istirahat Anda berada di angka ${bpm} BPM (kategori rendah). Sepanjang tidak disertai keluhan klinis seperti pusing, ritme ini merefleksikan efisiensi pompa otot jantung yang sangat terlatih layaknya seorang atlet.`);
    } else if (bpm <= 100) {
        insight.push(`Detak jantung istirahat Anda tercatat ${bpm} BPM, berada dalam kurva normal, ritme teratur, dan menunjukkan efisiensi kerja jantung yang sehat saat kondisi tubuh rileks.`);
    } else {
        insight.push(`Laju denyut jantung Anda cukup tinggi (${bpm} BPM). Kondisi ini mengindikasikan adanya stimulasi aktif, faktor kelelahan fisik, kecemasan, atau dehidrasi ringan. Disarankan mengistirahatkan tubuh sejenak.`);
    }

    if (pi >= 1 && pi <= 15) {
        insight.push(`Didukung oleh nilai Perfusion Index (PI) sebesar ${pi}%, sirkulasi darah tepi di pembuluh kapiler perifer Anda berjalan optimal, lancar, dan bersih.`);
    } else if (pi < 1) {
        insight.push(`Indeks perfusi tepi Anda terdeteksi sedikit rendah (${pi}%), kemungkinan disebabkan oleh respons penyempitan pembuluh darah (vasokonstriksi) ringan atau kondisi suhu jari tangan yang dingin saat pengukuran.`);
    } else {
        insight.push(`Pulsasi kapiler perifer Anda terbaca sangat kuat dengan indeks perfusi mencapai ${pi}%, menandakan elastisitas vaskular yang tegas serta pasokan oksigen jaringan yang melimpah.`);
    }

    insight.push("\n\n");

    // Paragraf 2: Analisis Sistem Saraf Otonom & Keseimbangan Paru (Stress, HRV, RR)
    if (hrv > 50 && stress < 40) {
        insight.push(`Variabilitas detak jantung (HRV) Anda sangat adaptif di angka ${hrv} ms bersanding dengan indeks stres yang sangat rendah (${stress}%). Kombinasi metrik ini merefleksikan dominasi sistem saraf parasimpatis yang bekerja maksimal menjaga metabolisme Anda dalam mode restorasi atau pemulihan penuh.`);
    } else {
        insight.push(`Keseimbangan sistem otonom Anda (HRV: ${hrv} ms, Stres: ${stress}%) menunjukkan indikasi beban kerja fisik atau pikiran yang moderat. Tubuh Anda sedang melakukan kompensasi energi aktif terhadap ketegangan harian tersebut.`);
    }

    if (rr >= 12 && rr <= 20) {
        insight.push(`Sistem ventilasi paru Anda dinilai sangat stabil dengan laju respirasi normal sebanyak ${rr} siklus per menit.`);
    } else {
        insight.push(`Laju napas Anda terdeteksi sedikit lebih cepat dari kurva standar harian (${rr} x/m). Cobalah mengadopsi teknik latihan pernapasan lambat (box breathing) untuk merilekskan kembali sistem pernapasan Anda.`);
    }

    insight.push("\n\n");

    // Paragraf 3: Evaluasi Energi & Saran Gaya Hidup (Energy)
    if (energy >= 70) {
        insight.push(`Dengan tingkat kapasitas energi relatif sebesar ${energy}%, metabolisme tubuh Anda berada dalam kondisi prima untuk mendukung performa aktivitas harian maupun olahraga intensitas menengah. Pertahankan kondisi ini dengan hidrasi harian yang seimbang.`);
    } else {
        insight.push(`Cadangan energi relatif Anda tergolong minim (${energy}%). Tubuh Anda memberikan sinyal kuat untuk segera memprioritaskan istirahat tidur malam yang berkualitas dan membatasi aktivitas berat sementara waktu agar sel tubuh dapat meregenerasi dengan sempurna.`);
    }

    return insight.join(" ");
}
