(function initJournalAppInstall() {
  let deferredInstallPrompt = null;
  let installButton = null;

  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const ensureInstallButton = () => {
    if (installButton || isStandalone()) return;

    installButton = document.createElement("button");
    installButton.type = "button";
    installButton.className = "pwa-install-button";
    installButton.textContent = "Install App";
    installButton.setAttribute("aria-label", "Install Futures Trading Journal app");
    installButton.hidden = !deferredInstallPrompt;

    installButton.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      if (choice.outcome === "accepted") {
        installButton.hidden = true;
      }
    });

    document.body.appendChild(installButton);
  };

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // App still works normally if service worker registration is unavailable.
      });
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    ensureInstallButton();
    if (installButton) installButton.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    if (installButton) installButton.hidden = true;
  });

  window.addEventListener("DOMContentLoaded", ensureInstallButton);
})();
