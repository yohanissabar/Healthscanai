import { Store } from '../store.js';
import { triggerHaptic } from '../utils.js';

let currentCorrect = 0, cognitiveStartTime = 0;

export function startCognitiveTest() {
  triggerHaptic('light'); const btn = document.getElementById('btnCognitive'), input = document.getElementById('mathAnswer');
  let bpmVal = parseInt(Store.savedBpm) || 75; const difficulty = bpmVal > 90 ? 1 : bpmVal > 75 ? 2 : 3; 
  let num1, num2;
  if(difficulty === 1) { num1 = 5 + Math.floor(Math.random() * 5); num2 = 5 + Math.floor(Math.random() * 5); } 
  else { num1 = 20 + Math.floor(Math.random() * 30); num2 = 10 + Math.floor(Math.random() * 20); }
  
  currentCorrect = num1 + num2;
  document.getElementById('mathQuestion').innerText = `${num1} + ${num2} =`; document.getElementById('valCognitive').innerText = "...";
  input.disabled = false; input.value = ""; input.focus(); btn.disabled = true; cognitiveStartTime = performance.now();
  input.oninput = function() {
    if(parseInt(input.value) === currentCorrect) {
      Store.savedCognitive = Math.round(performance.now() - cognitiveStartTime) + ' ms';
      document.getElementById('valCognitive').innerText = Store.savedCognitive; input.disabled = true; btn.disabled = false; btn.innerText = "ULANGI TES"; triggerHaptic('success');
    }
  };
}
