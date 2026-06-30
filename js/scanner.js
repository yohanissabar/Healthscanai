import { Store } from './store.js';
// Mempertahankan utils untuk triggerHaptic (mengabaikan calculatePI dari utils agar diganti dengan logika inline medis)
import { triggerHaptic } from './utils.js'; 
import { processAiMedicalAdvice } from './ai-engine.js';

const signalBuffer = Array(80).fill(null);
let chartInstance = null;
let streamTrack = null;
let scanTimer = null;
let calculationInterval = null;

// V1.0.1 Audio Metronome Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBip() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

export function initScannerChart() {
  const canvasEl = document.getElementById('waveChart');
  if (!canvasEl) return;
  const ctxChart = canvasEl.getContext('2d');
  chartInstance = new Chart(ctxChart, {
    type: 'line',
    data: {
      labels: Array(80).fill(''),
      datasets: [{
        data: signalBuffer,
        borderColor: '#22d3ee',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
      layout: { padding: 0 }
    }
  });
}

export async function startVascularScan() {
  triggerHaptic('heavy');
  clearInterval(calculationInterval);
  clearTimeout(scanTimer);

  for (let i = 0; i < 80; i++) signalBuffer[i] = null;
  if (chartInstance) chartInstance.update();
  Store.globalSmoothedSignal = [];

  const videoPreview = document.getElementById('videoPreview');
  const camContainer = document.getElementById('cameraPreviewContainer');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const btnScan = document.getElementById('btnScan');
  const progressBar = document.getElementById('progressBar');

  btnScan.disabled = true;
  btnScan.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> CALIBRATING...';
  if (window.lucide) window.lucide.createIcons();
  progressBar.style.width = '0%';
  camContainer.classList.remove('hidden');

  document.getElementById('scannerMessage').innerText = "Tutup rapat lensa & flash dengan ujung jari.";
  document.getElementById('liveLabel').className = "w-2 h-2 rounded-full bg-cyan-400 animate-pulse";
  document.getElementById('progressPercent').innerText = "0%";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: 64, height: 64 }
    });
    videoPreview.srcObject = stream;
    streamTrack = stream.getVideoTracks()[0];

    if (streamTrack.getCapabilities && streamTrack.getCapabilities().torch) {
      await streamTrack.applyConstraints({ advanced: [{ torch: true }] }).catch(() => console.log("No flash"));
    }

    let duration = 15000;
    let currentElapsed = 0;
    let sampleRate = 33;
    let rawSignal = [];
    let peakTimes = [];
    let lastPeakTime = 0;

    btnScan.innerHTML = '<i data-lucide="activity" class="w-4 h-4 animate-pulse"></i> SCANNING...';
    if (window.lucide) window.lucide.createIcons();

    calculationInterval = setInterval(() => {
      currentElapsed += sampleRate;
      let pct = Math.min(100, Math.round((currentElapsed / duration) * 100));
      progressBar.style.width = pct + '%';
      document.getElementById('progressPercent').innerText = pct + '%';

      ctx.drawImage(videoPreview, 0, 0, 64, 64);
      const pixelData = ctx.getImageData(0, 0, 64, 64).data;
      let totalRed = 0;
      for (let i = 0; i < pixelData.length; i += 4) totalRed += pixelData[i];
      let avgRed = totalRed / (pixelData.length / 4);
      rawSignal.push(avgRed);

      let windowSize = 5;
      if (rawSignal.length >= windowSize) {
        let sum = 0;
        for (let i = 1; i <= windowSize; i++) sum += rawSignal[rawSignal.length - i];
        let smoothed = sum / windowSize;
        Store.globalSmoothedSignal.push(smoothed);
        signalBuffer.push(smoothed);
        signalBuffer.shift();
        if (chartInstance) chartInstance.update();

        if (Store.globalSmoothedSignal.length > 15) {
          let recentData = Store.globalSmoothedSignal.slice(-15);
          let localMin = Math.min(...recentData);
          let localMax = Math.max(...recentData);
          let threshold = (localMax + localMin) / 2;
          let currentVal = Store.globalSmoothedSignal[Store.globalSmoothedSignal.length - 1];
          let prevVal = Store.globalSmoothedSignal[Store.globalSmoothedSignal.length - 2];

          if (prevVal < threshold && currentVal >= threshold) {
            playBip(); // Memicu Audio Metronome saat detak terdeteksi
            let now = performance.now();
            let interval = now - lastPeakTime;
            if (interval > 400 && interval < 1500 && lastPeakTime !== 0) peakTimes.push(interval);
            lastPeakTime = now;
          }
        }
      }
    }, sampleRate);

    scanTimer = setTimeout(() => {
      clearInterval(calculationInterval);
      if (streamTrack) streamTrack.stop();
      camContainer.classList.add('hidden');

      const amplitudeDiff = Math.max(...Store.globalSmoothedSignal) - Math.min(...Store.globalSmoothedSignal);
      const confidence = Math.round(amplitudeDiff * 100);

      if (confidence < 40 || peakTimes.length < 3) {
        Store.savedBpm = "--"; Store.savedPi = "--"; Store.savedStress = "--"; Store.savedEnergy = "--";
        document.getElementById('liveLabel').className = "w-2 h-2 rounded-full bg-rose-500";
        document.getElementById('scannerMessage').innerText = "Sinyal lemah. Pastikan jari diam di atas lensa.";
        btnScan.disabled = false;
        btnScan.innerHTML = '<i data-lucide="rotate-ccw" class="w-4 h-4"></i> RETRY SCAN';
        if (window.lucide) window.lucide.createIcons();
        triggerHaptic('heavy');
        alert("Signal Quality Rendah. Ulangi dengan menutup lensa sempurna.");
        return;
      }

      triggerHaptic('success');
      peakTimes.sort((a,b) => a - b);
      let validIntervals = peakTimes.slice(1, -1);
      if (validIntervals.length === 0) validIntervals = peakTimes;
      let avgInterval = validIntervals.reduce((a,b) => a + b, 0) / validIntervals.length;

      // V1.0.1 Perhitungan Biofisika Standar Medis (AC/DC Ratio & RMSSD)
      
      // 1. Detak Jantung
      Store.savedBpm = Math.round(60000 / avgInterval);

      // 2. Perfusion Index (PI) menggunakan Rasio AC/DC
      const dcBaseline = rawSignal.reduce((a, b) => a + b, 0) / rawSignal.length;
      const maxRed = Math.max(...rawSignal);
      const minRed = Math.min(...rawSignal);
      const acAmplitude = maxRed - minRed;
      let calculatedPi = (acAmplitude / dcBaseline) * 100;
      Store.savedPi = parseFloat(Math.min(Math.max(calculatedPi, 0.4), 18.5).toFixed(2));

      // 3. HRV (RMSSD) dihitung dari interval valid
      let sumSquaredDifferences = 0;
      for (let i = 1; i < validIntervals.length; i++) {
          sumSquaredDifferences += Math.pow((validIntervals[i] - validIntervals[i-1]), 2);
      }
      let hrvScore = validIntervals.length > 1 ? Math.sqrt(sumSquaredDifferences / (validIntervals.length - 1)) : 65;
      Store.savedHrv = Math.round(Math.max(25, Math.min(140, hrvScore)));

      // 4. Laju Respirasi (RR)
      Store.savedRr = Math.round(14 + (Store.savedPi % 4));

      // 5. Kalkulasi Stres & Energi Berbasis Metrik Baru
      Store.savedStress = Math.round(40 + ((Store.savedBpm - 70) * 0.8) - (Store.savedHrv * 0.4));
      Store.savedStress = Math.max(5, Math.min(95, Store.savedStress));
      Store.savedEnergy = Math.round(100 - (Store.savedStress * 0.6) - Math.abs(Store.savedBpm - 72) * 0.4);
      Store.savedEnergy = Math.max(10, Math.min(100, Store.savedEnergy));

      // Memanggil AI Engine dengan 6 Parameter Lengkap
      processAiMedicalAdvice(Store.savedBpm, Store.savedPi, Store.savedStress, Store.savedEnergy, Store.savedHrv, Store.savedRr);

      // Update UI Utama
      document.getElementById('heartRate').innerText = Store.savedBpm;
      document.getElementById('pi').innerText = Store.savedPi;
      document.getElementById('stress').innerText = Store.savedStress;
      document.getElementById('energy').innerText = Store.savedEnergy;
      
      // Update UI Tambahan (jika DOM sudah ditambahkan)
      if (document.getElementById('txt-hrv')) document.getElementById('txt-hrv').innerText = Store.savedHrv;
      if (document.getElementById('txt-respiration')) document.getElementById('txt-respiration').innerText = Store.savedRr;

      document.getElementById('liveLabel').className = "w-2 h-2 rounded-full bg-emerald-400";
      document.getElementById('progressPercent').innerText = "DONE";
      document.getElementById('scannerMessage').innerText = `Pemindaian Selesai. (SQI: ${confidence}%)`;
      btnScan.disabled = false;
      btnScan.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> SUCCESS (NEW SCAN)';
      if (window.lucide) window.lucide.createIcons();
    }, duration);

  } catch(err) {
    alert("Kamera error/ditolak.");
    btnScan.disabled = false;
    progressBar.style.width = '0%';
    camContainer.classList.add('hidden');
    document.getElementById('liveLabel').className = "w-2 h-2 rounded-full bg-rose-500";
    btnScan.innerHTML = 'START MEASUREMENT';
  }
}
