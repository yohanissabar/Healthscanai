import { Store } from '../store.js';
import { triggerHaptic } from '../utils.js';

export async function startAudioRespiratoryScan() {
 triggerHaptic(); const btn=document.getElementById('btnAudio'), inst=document.getElementById('instResp');
 btn.disabled=true; inst.innerText='Merekam audio (10s)...'; btn.innerText='MEREKAM...'; document.getElementById('valResp').innerText='...';
 
 try {
   const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
   const audioCtx=new (window.AudioContext||window.webkitAudioContext)();
   const source=audioCtx.createMediaStreamSource(stream);
   
   const gainNode = audioCtx.createGain(); gainNode.gain.value = 8.0; 
   const analyser=audioCtx.createAnalyser(); analyser.fftSize=1024; 
   source.connect(gainNode); gainNode.connect(analyser);
   
   const data=new Uint8Array(analyser.frequencyBinCount);
   let breaths=0, active=false;
   
   const loop=setInterval(() => {
     analyser.getByteTimeDomainData(data);
     let v=0; for(let i=0;i<data.length;i++) v+=Math.abs(data[i]-128); v/=data.length;
     if(v > 1.8 && !active){ breaths++; active=true; triggerHaptic('light'); }
     if(v < 1.0) active=false;
   }, 80);
   
   setTimeout(() => {
     clearInterval(loop); stream.getTracks().forEach(t=>t.stop()); audioCtx.close();
     let rpm = breaths > 0 ? breaths * 6 : 0; 
     if(rpm < 8 || rpm > 40) { 
         Store.savedResp = "Tidak Valid"; document.getElementById('valResp').innerText = "Err";
         alert("Siklus tidak terdeteksi baik. Dekatkan mulut ke mic dan hembuskan perlahan.");
     } else {
         Store.savedResp = rpm + ' x/m'; document.getElementById('valResp').innerText = Store.savedResp; triggerHaptic('success');
     }
     inst.innerText = 'Selesai'; btn.disabled = false; btn.innerText='ULANGI TES';
   }, 10000); 
 } catch(e) { btn.disabled=false; inst.innerText='Mic Error'; btn.innerText='MULAI TES'; }
}
