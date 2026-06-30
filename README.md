# 🫀 HealthScanAI — Modular Biometric PWA

[![Live Demo](https://img.shields.io/badge/DEMO-LIVE_ON_CLOUDFLARE-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://healthscanai.pages.dev)
[![PWA Ready](https://img.shields.io/badge/PWA-Progressive_Web_App-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla_ES6_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **"Menjembatani sensor smartphone komersial menjadi antarmuka skrining medis awal yang cepat, privat, dan tanpa instalasi berat."**

🌐 **COBA APLIKASI SEKARANG:** [https://healthscanai.pages.dev](https://healthscanai.pages.dev)

---

## 📖 Latar Belakang & Filosofi

Sebagian besar aplikasi pemantauan kesehatan modern terjebak dalam dua masalah besar: **Bloatware** (harus mengunduh file berukuran ratusan Megabyte) dan **Privasi** (data biometrik pengguna dikirim ke server pihak ketiga untuk diproses). 

**HealthScanAI** lahir dengan filosofi yang sebaliknya:
1. **Zero-Backend Processing:** Seluruh komputasi sinyal (kamera, akselerometer, audio) diproses 100% secara lokal di dalam *RAM/CPU Smartphone* pengguna menggunakan Vanilla JavaScript.
2. **ES6 Native Modular:** Tidak menggunakan bundler raksasa (Webpack/Vite) atau framework berat. Setiap modul tes medis hidup secara independen.
3. **Offline-First:** Setelah dibuka sekali, aplikasi dapat digunakan di pedalaman tanpa sinyal internet sama sekali.

---

## 🔬 Cakupan Modul Biometrik

| Modul Tes | Sensor yang Digunakan | Target Skrining |
| :--- | :--- | :--- |
| **Core Pulse Scan** | Kamera Depan/Belakang (PPG) | BPM; PI; Stres; Energi; HRV;Repirasi |
| **Tremor Analysis** | Device Accelerometer | Skrining kelelahan otot & indikasi awal Parkinson |
| **Respiratory Rate** | Mikrofon / Tap Cadence | Menghitung siklus pernapasan per menit |
| **Cognitive Reflex** | Visual UI Response | Mengukur waktu reaksi sistem saraf pusat (ms) |
| **Visual Acuity** | High-Contrast Display | Skrining ketajaman penglihatan jarak dekat |
| **Colorblind Test** | Ishihara Ishihara Matrix | Deteksi buta warna parsial (Protanopia/Deuteranopia) |
| **Audiometry** | Web Audio API Oscillator | Skrining ambang batas pendengaran (Hz to dB) |
| **Smart BMI** | Calibrated Logic Engine | Kalkulasi rasio massa tubuh & matriks risiko |

---

## 📐 Arsitektur Sistem

Proyek ini sengaja dirancang secara *Flat-Modular* agar ramah bagi kontributor pemula maupun peneliti yang ingin mengekstrak satu logika algoritma saja:

```text
healthscan-ai/
├── css/
│   └── main.css              <-- Single-source Styling & Dark UI System
├── js/
│   ├── modules/              <-- [KUMPULAN ALGORITMA TES]
│   │   ├── tremor.js
│   │   ├── respiratory.js
│   │   ├── cognitive.js
│   │   ├── visual.js
│   │   ├── bmi.js
│   │   ├── audiometry.js
│   │   └── colorblind.js
│   ├── ai-engine.js          <-- Mesin agregator penyusun kesimpulan medis
│   ├── scanner.js            <-- Core Kamera & pemrosesan piksel merah (rPPG)
│   ├── pdf-report.js         <-- Generator dokumen medik berstandar tabel
│   ├── store.js              <-- State Management lokal berbasis Proxy/Object
│   └── main.js               <-- Jembatan utama (Facade) event-listener HTML
├── index.html
└── sw.js                     <-- Service Worker (PWA Offline Cache Controller)
