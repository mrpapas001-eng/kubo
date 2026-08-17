"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallKuboButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice;
  }

  return (
    <section className="mt-6 rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm md:flex md:items-center md:justify-between md:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f3c8c]">
          Kubo en tu celular
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">
          Instala Kubo en tu celular
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Próximamente disponible en Google Play.
        </p>
      </div>

      {installPrompt ? (
        <button
          type="button"
          onClick={handleInstall}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3c8c] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0c2f6d] md:mt-0"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Instalar Kubo
        </button>
      ) : null}
    </section>
  );
}