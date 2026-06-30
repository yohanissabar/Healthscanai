## 🩺 Pendekatan Perhitungan Setiap Parameter

HealthScanAI menggunakan sensor bawaan smartphone dan algoritma estimasi untuk membantu pemantauan kebugaran (wellness). Seluruh hasil merupakan estimasi berbasis sinyal digital dan bukan hasil pemeriksaan medis klinis.

---

### ❤️ 1. Heart Rate (Detak Jantung)

**Apa itu?**

Jumlah denyut jantung setiap menit (Beats Per Minute/BPM).

**Pendekatan Perhitungan**

- Kamera merekam perubahan intensitas cahaya merah pada ujung jari (Photoplethysmography/PPG).
- Puncak gelombang dideteksi.
- Jarak antar puncak dihitung.
- BPM diperoleh dari rata-rata interval denyut.

Rumus pendekatan:

```
BPM = 60 / rata-rata interval denyut (detik)
```

Nilai referensi dewasa:

- 60–100 BPM

---

### 🩸 2. Perfusion Index (PI)

**Apa itu?**

PI menunjukkan seberapa kuat aliran darah yang terbaca oleh sensor optik.

Semakin tinggi PI berarti sinyal pembuluh darah semakin jelas.

PI bukan tekanan darah.

**Pendekatan Perhitungan**

Menggunakan rasio amplitudo sinyal pulsasi terhadap intensitas cahaya dasar.

Pendekatan sederhana:

```
PI = (Amplitudo Pulsa / Intensitas Dasar) × 100%
```

Referensi umum:

0.2%–20%

---

### 💓 3. Heart Rate Variability (HRV)

**Apa itu?**

HRV adalah variasi waktu antar denyut jantung.

HRV tinggi biasanya menunjukkan tubuh lebih rileks.

HRV rendah dapat muncul saat stres atau kelelahan.

**Pendekatan**

Menggunakan variasi interval RR dari sinyal PPG.

Pendekatan:

```
HRV = SDNN interval denyut
```

Satuan:

ms (millisecond)

---

### 🌬 4. Respiratory Rate

**Apa itu?**

Jumlah napas per menit.

Pendekatan:

- Analisis pola suara napas
- atau ritme ketukan
- atau perubahan kecil sinyal PPG

Rumus:

```
Jumlah siklus napas / menit
```

Normal:

12–20 kali/menit

---

### 😓 5. Stress Index

**Apa itu?**

Estimasi tingkat stres fisiologis.

Bukan diagnosis psikologis.

Pendekatan menggunakan kombinasi:

- HRV
- Heart Rate
- kestabilan sinyal

Contoh pendekatan:

```
Stress = kombinasi HRV + BPM + variabilitas sinyal
```

Semakin kecil nilainya semakin baik.

---

### ⚡ 6. Energy Index

**Apa itu?**

Perkiraan tingkat energi tubuh berdasarkan kombinasi parameter fisiologis.

Pendekatan:

- Heart Rate
- HRV
- Stress
- kestabilan sinyal

Skor:

0–100%

Semakin tinggi semakin baik.

---

### ⚖ 7. Body Mass Index (BMI)

**Apa itu?**

Perbandingan berat badan terhadap tinggi badan.

Tidak mengukur kadar lemak secara langsung.

Rumus:

```
BMI = Berat (kg) / Tinggi² (m)
```

Kategori umum

<18.5 = Kurang

18.5–24.9 = Normal

25–29.9 = Berlebih

≥30 = Obesitas

---

### ✋ 8. Tremor Stability

**Apa itu?**

Mengukur kestabilan tangan menggunakan accelerometer.

Pendekatan:

- amplitudo getaran
- frekuensi getaran
- variasi gerakan

Semakin stabil semakin tinggi skornya.

Skala:

0–100%

---

### 👁 9. Visual Reflex

**Apa itu?**

Mengukur kecepatan respon mata dan tangan terhadap stimulus visual.

Pendekatan:

```
Waktu respon = waktu klik − waktu stimulus
```

Satuan:

millisecond (ms)

Semakin kecil semakin cepat.

---

### 🧠 10. Cognitive Response

**Apa itu?**

Mengukur kecepatan berpikir sederhana.

Tes melibatkan:

- logika
- perhatian
- kecepatan keputusan

Output:

ms

Semakin kecil semakin baik.

---

### 📈 11. PPG Signal Quality

**Apa itu?**

Mengukur kualitas sinyal pembuluh darah yang diterima kamera.

Pendekatan:

Menghitung:

- amplitudo
- noise
- kestabilan
- konsistensi

Digunakan untuk menentukan apakah hasil Heart Rate dan HRV layak dianalisis.

---

### 👂 12. Audiometry

**Apa itu?**

Tes ambang pendengaran menggunakan Web Audio API.

Frekuensi yang diuji:

- 125 Hz
- 250 Hz
- 500 Hz
- 1000 Hz
- 2000 Hz
- 4000 Hz
- 8000 Hz

Pengguna menekan tombol ketika mulai mendengar nada.

Semakin kecil kebutuhan intensitas suara (dB), semakin baik kemampuan pendengaran.

---

## 🧠 AI Insight Engine

HealthScanAI menggunakan dua lapis interpretasi:

### 1. Local AI Engine

Berjalan sepenuhnya di perangkat.

Menganalisis:

- BPM
- PI
- HRV
- Respiratory Rate
- BMI
- Tremor
- Visual
- Cognitive

Kemudian menghasilkan rekomendasi wellness otomatis.

---

### 2. Gemini AI (Opsional)

Apabila API tersedia, seluruh hasil dikirim dalam bentuk ringkasan numerik untuk menghasilkan interpretasi yang lebih mudah dipahami.

Jika API tidak tersedia, sistem otomatis kembali menggunakan Local AI Engine sehingga aplikasi tetap dapat digunakan secara offline.

---

## 📌 Penting

HealthScanAI bukan alat diagnosis medis.

Seluruh hasil merupakan estimasi berbasis sensor smartphone dan algoritma digital yang ditujukan sebagai pemantauan kebugaran (wellness) mandiri.

Apabila hasil menunjukkan nilai yang tidak biasa atau keluhan kesehatan berlanjut, lakukan pemeriksaan kepada tenaga kesehatan yang berwenang.
