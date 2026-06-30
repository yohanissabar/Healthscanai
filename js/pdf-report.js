// js/pdf-report.js
import { Store } from './store.js';
import { triggerHaptic } from './utils.js';

export function generateNativePDF() {
  triggerHaptic('success');
  const userNameInput = document.getElementById('inputUserName');
  const userName = userNameInput && userNameInput.value.trim() !== "" ? userNameInput.value.trim() : 'Anonim (Tidak Diisi)';
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // HALAMAN 1: IDENTITAS & RINGKASAN UTAMA
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("HealthScanAI - Health Screening Report", 14, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("Ringkasan Pemantauan Kebugaran (Wellness) Mandiri", 14, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Nama Pengguna : ${userName}`, 14, 35);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Tanggal Tes      : ${new Date().toLocaleDateString('id-ID')}`, 14, 40);

  let stringStatusAudiometri = (Store.isAudiometryDone && (Store.isAudiometryDone.Left || Store.isAudiometryDone.Right)) ? "Lihat Lampiran (Hal 2)" : "Belum Dites";

  // V1.0.2 Update: Menambahkan metrik baru (HRV & Respirasi) ke dalam tabel
  const tableData = [
    ['1', 'Detak Jantung (Heart Rate)', Store.savedBpm !== '--' && Store.savedBpm ? Store.savedBpm + ' BPM' : 'Belum Dites', '60 - 100 BPM'],
    ['2', 'Perfusion Index (PI)', Store.savedPi !== '--' && Store.savedPi ? Store.savedPi + '%' : 'Belum Dites', '0.2% - 20% Normal'],
    ['3', 'Variabilitas Jantung (HRV)', Store.savedHrv !== undefined && Store.savedHrv !== '--' ? Store.savedHrv + ' ms' : 'Belum Dites', '> 20 ms Rileks'],
    ['4', 'Laju Respirasi (Paru)', Store.savedRr !== undefined && Store.savedRr !== '--' ? Store.savedRr + ' x/m' : 'Belum Dites', '12 - 20 x/m'],
    ['5', 'Indeks Ketegangan (Stress)', Store.savedStress !== '--' && Store.savedStress ? Store.savedStress + '%' : 'Belum Dites', '< 50% Normal'],
    ['6', 'Kapasitas Energi Relatif', Store.savedEnergy !== '--' && Store.savedEnergy ? Store.savedEnergy + '%' : 'Belum Dites', '>= 70% Optimal'],
    ['7', 'Stabilitas Tremor (Motorik)', Store.savedTremor || 'Belum Dites', '>= 80% Stabil'],
    ['8', 'Refleks Visual Interaktif', Store.savedVisual || 'Belum Dites', '< 300 ms'],
    ['9', 'Kecepatan Logika Kognitif', Store.savedCognitive || 'Belum Dites', '< 3000 ms'],
    ['10', 'Indeks Massa Tubuh (BMI)', Store.savedBmi || 'Belum Dites', '18.5 - 24.9 Normal'],
    ['11', 'Uji Ambang Suara', stringStatusAudiometri, 'Grafik Audio Metrik'],
    ['12', 'Tes Pola Warna Layar', Store.savedColorBlind || 'Belum Dites', 'Skor 3/3 Optimal']
  ];

  doc.autoTable({
    startY: 46,
    head: [['No', 'Parameter Wellness', 'Nilai Terukur', 'Nilai Acuan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 }
  });

  let finalY = doc.lastAutoTable.finalY || 46;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(3, 105, 161);
  doc.text("Health Insight Board:", 14, finalY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50);

  // V1.0.1 Markdown Cleaning (Regex)
  let cleanAiAdvice = (Store.rawAiAdvice || "")
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/##\s?(.*?)\n/g, '$1\n')
    .replace(/-\s/g, '• ');

  const splitSaran = doc.splitTextToSize(cleanAiAdvice, 180);
  doc.text(splitSaran, 14, finalY + 22);

  let disclaimerY = finalY + 22 + (splitSaran.length * 5) + 10;
  doc.setLineWidth(0.5);
  doc.setDrawColor(200);
  doc.line(14, disclaimerY, 196, disclaimerY);

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  const disclaimerText = "DISCLAIMER: Dokumen ini bukan hasil rekam medis dan DILARANG digunakan sebagai acuan diagnosis klinis. Aplikasi ini adalah alat bantu pemantauan kebugaran (wellness) mandiri. Nilai PI (Perfusion Index) adalah estimasi optik.";
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, 180);
  doc.text(splitDisclaimer, 14, disclaimerY + 8);

  // HALAMAN 2: LAMPIRAN
  doc.addPage();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("Lampiran Visualisasi Data & Interpretasi", 14, 20);

  doc.setFontSize(12);
  doc.text("1. Analisis Gelombang Photoplethysmogram (PPG)", 14, 30);

  const chartCanvas = document.getElementById('waveChart');
  let currentWaveY = 35;
  if (chartCanvas) {
    try {
      const imgData = chartCanvas.toDataURL('image/png', 1.0);
      doc.addImage(imgData, 'PNG', 14, 35, 180, 42);
      currentWaveY = 82;
    } catch(e) {
      doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.text("[Grafik Gelombang Tidak Dapat Dimuat]", 14, 35);
      currentWaveY = 40;
    }
  }

  // Interpretasi Amplitudo Sinyal
  let ampText = "Nilai Tinggi Kurva: Sinyal Belum Dipindai";
  let interpText = "Lakukan scan di menu utama untuk melihat analisis tinggi gelombang pembuluh darah.";

  if (Store.globalSmoothedSignal && Store.globalSmoothedSignal.length > 0) {
    let maxVal = Math.max(...Store.globalSmoothedSignal);
    let minVal = Math.min(...Store.globalSmoothedSignal);
    let amplitude = (maxVal - minVal).toFixed(2);
    ampText = `Nilai Tinggi Kurva (Amplitudo Sinyal): ${amplitude} unit`;
    interpText = (amplitude > 2.5) ? "Penjelasan: Tinggi kurva mengindikasikan volume pulsasi kapiler jari yang kuat dan terbaca jelas. Refleks vaskular elastis dan pasokan darah perifer optimal." : "Penjelasan: Kurva terbaca stabil. Fluktuasi kurva yang terekam mencerminkan variabilitas denyut nadi yang konsisten.";
  }

  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42); doc.text(ampText, 14, currentWaveY);
  doc.setFont("helvetica", "normal"); doc.setTextColor(70);
  let splitInterp = doc.splitTextToSize(interpText, 180); doc.text(splitInterp, 14, currentWaveY + 5);

  let nextTableY = currentWaveY + 5 + (splitInterp.length * 5) + 8;
  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42); doc.text("2. Pemetaan Hasil Uji Ambang Suara", 14, nextTableY);

  // Tabel Audiometri (Tetap dipertahankan)
  doc.autoTable({
    startY: nextTableY + 4,
    head: [['Telinga', '125 Hz', '250 Hz', '500 Hz', '1000 Hz', '2000 Hz', '4000 Hz', '8000 Hz']],
    body: [
      ['Kanan', ...Store.audioFreqList.map(f => Store.audiometryResults?.Right[f] || '-')],
      ['Kiri', ...Store.audioFreqList.map(f => Store.audiometryResults?.Left[f] || '-')]
    ],
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 9, halign: 'center' }
  });

  doc.save(userName !== 'Anonim (Tidak Diisi)' ? `HealthInsight_${userName.replace(/\s+/g, '_')}.pdf` : "HealthInsight_Report.pdf");
}
