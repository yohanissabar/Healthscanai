let deferredPrompt;

export function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); 
    deferredPrompt = e;
    const banner = document.getElementById('installBanner');
    if (banner) {
      banner.classList.remove('hidden');
      setTimeout(() => { banner.classList.remove('translate-y-[-150%]'); }, 1000);
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('[PWA] SW Premium registered', reg.scope))
        .catch(err => console.error('[PWA] SW Error:', err));
    });
  }
}

export function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') { 
        const banner = document.getElementById('installBanner');
        if (banner) banner.classList.add('translate-y-[-150%]'); 
      }
      deferredPrompt = null;
    });
  }
}
