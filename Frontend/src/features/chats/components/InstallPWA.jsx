import { useEffect, useState } from "react";
import "../style/install-pwa.scss";

// Global capture — beforeinstallprompt ko miss na ho agar component baad mein mount ho
let _capturedPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  _capturedPrompt = e;
});

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInstalled || dismissed) return;

    if (_capturedPrompt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeferredPrompt(_capturedPrompt);
      setShowInstall(true);
    }

    // Naya event aaye toh bhi pakdo
    const handler = (e) => {
      e.preventDefault();
      _capturedPrompt = e;
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => setShowInstall(false);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    _capturedPrompt = null;
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    setDismissed(true);
  };

  if (!showInstall) return null;

  return (
    <div className="install-pwa">
      <div className="install-pwa__content">
        <h4>Install Gyaan AI</h4>
        <p>Faster access directly from your home screen.</p>
      </div>
      <div className="install-pwa__actions">
        <button className="install-pwa__btn" onClick={handleInstall}>
          Install App
        </button>
        <button className="install-pwa__dismiss" onClick={handleDismiss}>
          Not now
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;
