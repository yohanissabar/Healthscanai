// js/store.js

export const Store = {
  // =====================
  // VITAL SIGNS
  // =====================
  savedBpm: null,
  savedPi: null,
  savedStress: null,
  savedEnergy: null,
  savedHrv: null,
  savedRr: null,

  // =====================
  // BODY
  // =====================
  savedBmi: null,

  // =====================
  // NEURO / TEST
  // =====================
  savedTremor: null,
  savedVisual: null,
  savedCognitive: null,

  // =====================
  // SIGNAL DATA
  // =====================
  globalSmoothedSignal: [],

  // =====================
  // AUDIO
  // =====================
  audioFreqList: [125, 250, 500, 1000, 2000, 4000, 8000],

  audiometryResults: {
    Left: {},
    Right: {}
  },

  isAudiometryDone: {
    Left: false,
    Right: false
  },

  // =====================
  // AI INSIGHT
  // =====================
  rawAiAdvice: "Menunggu hasil scan..."
};
