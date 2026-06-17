(function registerJournalServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // App still works normally if service worker registration is unavailable.
    });
  });
})();
