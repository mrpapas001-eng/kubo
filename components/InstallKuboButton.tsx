"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallKuboButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    function updateStandaloneMode() {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

      setIsStandalone(standalone);
    }

    function updateIOSMode() {
      const iOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      setIsIOS(iOSDevice);
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setShowInstallInstructions(false);
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
      setShowInstallInstructions(false);
      setIsStandalone(true);
    }

    updateStandaloneMode();
    updateIOSMode();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = () => updateStandaloneMode();

    mediaQuery.addEventListener?.("change", handleMediaChange);
    if ("addListener" in mediaQuery) {
      mediaQuery.addListener(handleMediaChange);
    }

    if (!/iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener?.("change", handleMediaChange);
      if ("removeListener" in mediaQuery) {
        mediaQuery.removeListener(handleMediaChange);
      }
      if (!/iPad|iPhone|iPod/.test(navigator.userAgent) && !(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      }
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) {
      setShowInstallInstructions(true);
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
  }

  if (isStandalone) {
    return null;
  }

  return (
    <section className="mt-6 rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm md:flex md:items-center md:justify-between md:px-6 md:py-4">
      <div className="md:flex md:min-w-0 md:items-center md:gap-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f3c8c] md:hidden">
          Kubo en tu celular
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-900 md:mt-0 md:text-lg">
          Instala Kubo en tu celular
        </h2>
        <p className="mt-2 text-sm text-slate-600 md:mt-0 md:truncate">
          Próximamente disponible en Google Play.
        </p>
      </div>

      <div className="md:flex md:flex-col md:items-end">
        <button
          type="button"
          onClick={handleInstall}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3c8c] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#0c2f6d] md:mt-0"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {installPrompt ? "Instalar Kubo" : "Agregar a pantalla de inicio"}
        </button>

        {showInstallInstructions && !installPrompt ? (
          <p className="mt-3 max-w-sm text-left text-sm text-slate-600 md:text-right">
            {isIOS
              ? "En Safari, pulsa Compartir y selecciona ‘Añadir a pantalla de inicio’."
              : "Abre el menú ⋮ de Chrome y elige “Agregar a pantalla de inicio” o “Instalar aplicación”."}
          </p>
        ) : null}
      </div>
    </section>
  );
}