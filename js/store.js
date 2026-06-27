export const Store = {
  savedBpm: '--',
  savedSpo2: '--',
  savedStress: '--',
  savedEnergy: '--',
  savedTremor: '--',
  savedResp: '--',
  savedVisual: '--',
  savedCognitive: '--',
  savedBmi: '--',
  savedColorBlind: '--',
  rawAiAdvice: 'Selesaikan tes di atas untuk mendapatkan evaluasi kebugaran (wellness).',
  globalSmoothedSignal: [],
  audioFreqList: [125, 250, 500, 1000, 2000, 4000, 8000],
  audiometryResults: {
    Left: { 125: '-', 250: '-', 500: '-', 1000: '-', 2000: '-', 4000: '-', 8000: '-' },
    Right: { 125: '-', 250: '-', 500: '-', 1000: '-', 2000: '-', 4000: '-', 8000: '-' }
  },
  isAudiometryDone: { Left: false, Right: false }
};
