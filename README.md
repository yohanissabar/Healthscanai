# HealthScanAI - Modular PWA

Aplikasi pemantauan kebugaran biometrik berbasis Progressive Web App.

## Arsitektur Kontributor
Jika Anda ingin berkontribusi menambah/memperbaiki tes biometrik:
1. Buka folder `js/modules/`
2. Edit logika pada file tes yang bersangkutan (misal: `bmi.js`).
3. **Jangan mengubah** `store.js` atau `main.js` kecuali Anda menambah parameter baru.

## Cara Menjalankan di Komputer Lokal
Karena menggunakan ES6 Module (`type="module"`), browser tidak mengizinkan buka file lewat double-click `file://`. Gunakan local server:
```bash
npx serve .
