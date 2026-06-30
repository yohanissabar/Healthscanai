import { switchTab, toggleCard } from './utils.js';
import { initPWA, installApp } from './pwa.js';
import { initScannerChart, startVascularScan } from './scanner.js';
import { generateNativePDF } from './pdf-report.js';

import { startTremorAnalysis } from './modules/tremor.js';
import { startAudioRespiratoryScan } from './modules/respiratory.js';
import { startCognitiveTest } from './modules/cognitive.js';
import { initVisualReflex } from './modules/visual.js';
import { calculateBMI } from './modules/bmi.js';
import { startAudiometry, recordAudioHear, stopAudiometryAudio } from './modules/audiometry.js';
import { submitColorBlind } from './modules/colorblind.js';

// MENGEKSPOS FUNGSI KE DOM BROWSER (Mempertahankan kompatibilitas HTML legacy)
window.installApp = installApp;
window.switchTab = switchTab;
window.toggleCard = toggleCard;
window.startVascularScan = startVascularScan;
window.startTremorAnalysis = startTremorAnalysis;
window.startAudioRespiratoryScan = startAudioRespiratoryScan;
window.startCognitiveTest = startCognitiveTest;
window.calculateBMI = calculateBMI;
window.startAudiometry = startAudiometry;
window.recordAudioHear = recordAudioHear;
window.stopAudiometryAudio = stopAudiometryAudio;
window.submitColorBlind = submitColorBlind;
window.generateNativePDF = generateNativePDF;

// BOOTSTRAPPING PADA BROWSER READY
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  initPWA();
  initScannerChart();
  initVisualReflex();
  console.log('✔ HealthScanAI Modular Engine Ready.');
});

