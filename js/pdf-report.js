import { Store } from './store.js';
import { triggerHaptic } from './utils.js';

/* =========================
   HEALTH SCORE ENGINE
========================= */
function calculateHealthScore(S) {
  let score = 100;

  if (S.savedBpm != null && (S.savedBpm < 60 || S.savedBpm > 100)) score -= 10;
  if (S.savedStress != null && S.savedStress > 60) score -= 15;
  if (S.savedEnergy != null && S.savedEnergy < 50) score -= 10;
  if (S.savedHrv != null && S.savedHrv < 20) score -= 10;
  if (S.savedRr != null && (S.savedRr < 12 || S.savedRr > 20)) score -= 10;
  if (S.savedBmi != null && (S.savedBmi < 18.5 || S.savedBmi > 24.9)) score -= 15;

  if (S.savedTremor != null && S.savedTremor < 70) score -= 5;
  if (S.savedVisual != null && S.savedVisual > 300) score -= 5;
  if (S.savedCognitive != null && S.savedCognitive > 3000) score -= 5;

  return Math.max(score, 0);
}

function getHealthStatus(score) {
  if (score >= 80) return { text: "BAIK", color: [0, 150, 80] };
  if (score >= 50) return { text: "PERLU PERHATIAN", color: [255, 160, 0] };
  return { text: "RISIKO TINGGI", color: [200, 0, 0] };
}

/* =========================
   LOCAL AI FALLBACK
========================= */
function generateLocalInsight(S) {
  const tips = [];

  if (S.savedBpm > 100) tips.push("Detak jantung tinggi.");
  if (S.savedStress > 60) tips.push("Stres tinggi.");
  if (S.savedEnergy < 50) tips.push("Energi rendah.");
  if (S.savedHrv < 20) tips.push("HRV rendah.");
  if (S.savedRr > 20) tips.push("Respirasi cepat.");
  if (S.savedBmi >= 25) tips.push("BMI tinggi.");

  if (tips.length === 0) tips.push("Semua parameter dalam kondisi stabil.");

  return tips.join("\n\n");
}

/* =========================
   FOOTER
========================= */
function addFooter(doc) {
  doc.setDrawColor(200);
  doc.line(14, 276, 196, 276);

  doc.setFontSize(7);
  doc.setTextColor(120);

  doc.text(
    "DISCLAIMER: Dokumen ini bukan rekam medis dan tidak dapat digunakan untuk diagnosis klinis. Ini hanya alat pemantauan wellness.",
    14,
    282,
    { maxWidth: 180 }
  );
}

/* =========================
   MAIN FUNCTION
========================= */
export function generateNativePDF() {
  try {
    triggerHaptic?.('success');

    if (!window.jspdf?.jsPDF) throw new Error("jsPDF belum siap");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const S = Store;

    const name =
      document.getElementById('inputUserName')?.value?.trim() || "Anonim";

    /* =========================
       COVER PAGE
    ========================= */
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, "F");

    const logo = new Image();
    logo.src = "icon-512.png";
    doc.addImage(logo, "PNG", 80, 35, 50, 50);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("HealthScanAI Report", 105, 100, { align: "center" });

    const score = calculateHealthScore(S);
    const status = getHealthStatus(score);

    doc.setFontSize(40);
    doc.setTextColor(...status.color);
    doc.text(`${score}`, 105, 130, { align: "center" });

    doc.setFontSize(12);
    doc.text(`HEALTH SCORE: ${status.text}`, 105, 140, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(180);
    doc.text(`User: ${name}`, 105, 155, { align: "center" });
    doc.text(new Date().toLocaleString(), 105, 165, { align: "center" });

    addFooter(doc);

    /* =========================
       PAGE 1 - SUMMARY (11 ITEMS)
    ========================= */
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Ringkasan Parameter Wellness", 14, 20);

    const rows = [
      ["Heart Rate", S.savedBpm ?? "--", "60–100"],
      ["Perfusion Index (PI)", S.savedPi ?? "--", "0.2–20"],
      ["HRV", S.savedHrv ?? "--", ">20"],
      ["Respiration", S.savedRr ?? "--", "12–20"],
      ["Stress", S.savedStress ?? "--", "<50%"],
      ["Energy", S.savedEnergy ?? "--", ">=70%"],
      ["BMI", S.savedBmi ?? "--", "18.5–24.9"],

      ["Tremor Stability", S.savedTremor ?? "--", ">80%"],
      ["Visual Reflex", S.savedVisual ?? "--", "<300 ms"],
      ["Cognitive Speed", S.savedCognitive ?? "--", "<3000 ms"],
      ["Colorblind Test", S.savedColorBlind ?? "--", "3/3"]
    ];

    if (doc.autoTable) {
      doc.autoTable({
        startY: 30,
        head: [["Parameter", "Nilai", "Normal"]],
        body: rows,
        theme: "grid",
        styles: { fontSize: 9 }
      });
    }

    let y = doc.lastAutoTable?.finalY + 10 || 60;

    const insight =
      S.rawAiAdvice && S.rawAiAdvice.trim() !== ""
        ? S.rawAiAdvice
        : generateLocalInsight(S);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("AI Insight", 14, y);

    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(insight, 180), 14, y + 8);

    addFooter(doc);

    /* =========================
       PAGE 2 - PPG
    ========================= */
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Halaman 2 - Analisis Gelombang PPG", 14, 20);

    doc.rect(14, 30, 180, 60);

    const canvas = document.getElementById("waveChart");

    if (canvas) {
      try {
        const img = canvas.toDataURL("image/png");
        doc.addImage(img, "PNG", 16, 32, 176, 56);
      } catch (e) {
        doc.text("Grafik tidak tersedia", 14, 55);
      }
    }

    const signal = S.globalSmoothedSignal || [];

    const amp =
      signal.length > 1
        ? Math.max(...signal) - Math.min(...signal)
        : 0;

    doc.text(`Amplitudo: ${amp.toFixed(2)}`, 14, 105);

    const waveText =
      amp > 2
        ? "Sinyal menunjukkan aliran darah perifer yang kuat dan stabil."
        : "Sinyal stabil dengan variasi rendah.";

    doc.text(doc.splitTextToSize(waveText, 180), 14, 115);

    addFooter(doc);

    /* =========================
       PAGE 3 - AUDIO + CLASS
    ========================= */
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Halaman 3 - Audiometri", 14, 20);

    const freq = S.audioFreqList || [];

    const audioRows = [
      ["Right", ...freq.map(f => S.audiometryResults?.Right?.[f] ?? "--")],
      ["Left", ...freq.map(f => S.audiometryResults?.Left?.[f] ?? "--")]
    ];

    if (doc.autoTable) {
      doc.autoTable({
        startY: 30,
        head: [["Telinga", ...freq.map(f => `${f} Hz`)]],
        body: audioRows,
        styles: { fontSize: 8, halign: "center" }
      });
    }

    let y2 = doc.lastAutoTable?.finalY + 10 || 80;

    doc.setFont("helvetica", "bold");
    doc.text("Klasifikasi Ambang Batas", 14, y2);

    doc.autoTable({
      startY: y2 + 5,
      head: [["Rentang", "Kategori", "Keterangan"]],
      body: [
        ["0–25 dB", "Normal", "Pendengaran baik"],
        ["26–40 dB", "Ringan", "Kesulitan ringan"],
        [">40 dB", "Risiko", "Perlu evaluasi"]
      ],
      styles: { fontSize: 9 }
    });

    addFooter(doc);

    /* =========================
       SAVE
    ========================= */
    doc.save(`HealthScanAI_${name.replace(/\s+/g, "_")}.pdf`);

  } catch (err) {
    console.error(err);
    alert("PDF gagal dibuat");
  }
}
