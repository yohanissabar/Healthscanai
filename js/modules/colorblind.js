import { Store } from '../store.js';
import { triggerHaptic } from '../utils.js';

let cbStage = 0, cbScore = 0;
const cbQuestions = [ { bg: [239, 68, 68], color: [34, 197, 94], ans: 12 }, { bg: [34, 197, 94], color: [239, 68, 68], ans: 74 }, { bg: [59, 130, 246], color: [234, 179, 8], ans: 6 } ];

function drawPseudoIshihara(q) {
    const canvas = document.getElementById('cbCanvas'); document.getElementById('cbPlaceholder').style.display = 'none';
    canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 400; i++) {
        ctx.beginPath(); let x = Math.random() * canvas.width; let y = Math.random() * canvas.height; let r = Math.random() * 4 + 2;
        ctx.arc(x, y, r, 0, Math.PI * 2); let shadeOffset = (Math.random() - 0.5) * 50;
        ctx.fillStyle = `rgb(${q.bg[0] + shadeOffset}, ${q.bg[1] + shadeOffset}, ${q.bg[2] + shadeOffset})`; ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-atop'; ctx.font = "900 36px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < 150; i++) {
        let shadeOffset = (Math.random() - 0.5) * 50; ctx.fillStyle = `rgb(${q.color[0] + shadeOffset}, ${q.color[1] + shadeOffset}, ${q.color[2] + shadeOffset})`;
        let xOffset = (Math.random() - 0.5) * 8; let yOffset = (Math.random() - 0.5) * 8;
        ctx.fillText(q.ans, (canvas.width / 2) + xOffset, (canvas.height / 2) + yOffset);
    }
    ctx.globalCompositeOperation = 'source-over';
}

export function submitColorBlind() {
  triggerHaptic('light'); const btn = document.getElementById('btnCb'), input = document.getElementById('cbInput');
  if(cbStage === 0) { cbScore = 0; input.disabled = false; input.value = ""; input.focus(); btn.innerText = "JAWAB"; document.getElementById('valColorBlind').innerText = "..."; showCbQuestion(); } 
  else {
    if(parseInt(input.value) === cbQuestions[cbStage-1].ans) cbScore++;
    if(cbStage < 3) { input.value = ""; input.focus(); showCbQuestion(); } 
    else {
      triggerHaptic('success'); input.disabled = true; input.value = ""; btn.innerText = "ULANGI TES"; 
      let status = cbScore === 3 ? "Optimal" : "Cek Ulang Lanjut"; Store.savedColorBlind = `${cbScore}/3 (${status})`;
      document.getElementById('valColorBlind').innerText = `${cbScore}/3`;
      const canvas = document.getElementById('cbCanvas'); const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById('cbPlaceholder').style.display = 'flex'; document.getElementById('cbPlaceholder').innerText = 'OK'; cbStage = 0; 
    }
  }
}
function showCbQuestion() { drawPseudoIshihara(cbQuestions[cbStage]); cbStage++; }
