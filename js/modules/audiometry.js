import { Store } from '../store.js';
import { triggerHaptic } from '../utils.js';

let audioCtx = null, audioOscillator = null, audioGain = null;
let currentTestingEar = null, currentFreqIndex = 0, volumeRampInterval = null, currentDb = 0;

function initAudioContext() { if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if(audioCtx.state === 'suspended') audioCtx.resume(); }

export function stopAudiometryAudio() {
    if(volumeRampInterval){ clearInterval(volumeRampInterval); volumeRampInterval=null; }
    if(audioOscillator){ try{ audioOscillator.stop(); }catch(e){} try{ audioOscillator.disconnect(); }catch(e){} audioOscillator=null; }
    if(audioGain){ try{ audioGain.disconnect(); }catch(e){} audioGain=null; }
    const el = document.getElementById('audioProgress'); if(el) el.style.width='0%';
}

export function startAudiometry(ear) {
    triggerHaptic(); initAudioContext(); currentTestingEar = ear; currentFreqIndex = 0;
    document.getElementById('btnAudioLeft').classList.add('hidden'); document.getElementById('btnAudioRight').classList.add('hidden'); document.getElementById('btnAudioHear').classList.remove('hidden');
    let targetId = ear === 'Left' ? 'statusAudioKiri' : 'statusAudioKanan';
    document.getElementById(targetId).innerText = "Tes..."; document.getElementById(targetId).className = "text-xs font-bold text-amber-400 animate-pulse";
    playNextFrequency();
}

function playNextFrequency() {
    if(currentFreqIndex >= Store.audioFreqList.length) { finishEarTest(); return; }
    let freq = Store.audioFreqList[currentFreqIndex]; document.getElementById('audioProgress').style.width = '0%';
    
    audioOscillator = audioCtx.createOscillator(); audioGain = audioCtx.createGain();
    audioOscillator.type = 'sine'; audioOscillator.frequency.value = freq; audioGain.gain.value = 0; currentDb = -10; 
    
    const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
    if(panner) { panner.pan.value = currentTestingEar === 'Left' ? -1 : 1; audioOscillator.connect(panner); panner.connect(audioGain); } 
    else audioOscillator.connect(audioGain);
    audioGain.connect(audioCtx.destination); audioOscillator.start();
    
    volumeRampInterval = setInterval(() => {
        currentDb += 2; let simulatedGain = Math.pow(10, (currentDb - 100) / 20); if(simulatedGain > 1) simulatedGain = 1;
        audioGain.gain.setTargetAtTime(simulatedGain, audioCtx.currentTime, 0.1);
        let visualPct = Math.min(100, Math.max(0, ((currentDb + 10) / 100) * 100)); document.getElementById('audioProgress').style.width = visualPct + '%';
        if(currentDb >= 100) recordAudioHear(true); 
    }, 700); 
}

export function recordAudioHear(isTimeout = false) {
    triggerHaptic('light'); stopAudiometryAudio();
    let recordedDb = isTimeout ? 100 : Math.max(0, currentDb);
    let freq = Store.audioFreqList[currentFreqIndex]; Store.audiometryResults[currentTestingEar][freq] = recordedDb;
    currentFreqIndex++; setTimeout(playNextFrequency, 500); 
}

function finishEarTest() {
    stopAudiometryAudio(); triggerHaptic('success'); Store.isAudiometryDone[currentTestingEar] = true;
    let targetId = currentTestingEar === 'Left' ? 'statusAudioKiri' : 'statusAudioKanan';
    document.getElementById(targetId).innerText = "Selesai"; document.getElementById(targetId).className = "text-xs font-bold text-emerald-400";
    document.getElementById('audioProgress').style.width = '0%';
    document.getElementById('btnAudioHear').classList.add('hidden'); document.getElementById('btnAudioLeft').classList.remove('hidden'); document.getElementById('btnAudioRight').classList.remove('hidden');
}
