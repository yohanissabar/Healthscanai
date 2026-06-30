// js/store.js
export const Store = {
    // Data Sensor V1.0.1
    savedBpm: "--",
    savedPi: "--",       // Menggantikan savedSpo2
    savedHrv: "--",      // Baru: untuk nilai RMSSD
    savedStress: "--",
    savedEnergy: "--",
    
    // Data Tambahan
    savedTremor: "--",
    savedResp: "--",
    savedVisual: "--",
    savedCognitive: "--",
    savedBmi: "--",
    savedColorBlind: "--",
    
    // Status & Logic
    isAudiometryDone: { Left: false, Right: false },
    audiometryResults: { Left: {}, Right: {} },
    audioFreqList: [125, 250, 500, 1000, 2000, 4000, 8000],
    
    // AI & System
    rawAiAdvice: "",
    globalSmoothedSignal: []
};
