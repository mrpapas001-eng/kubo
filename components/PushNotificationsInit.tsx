"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function PushNotificationsInit() {
  const { data: session } = useSession();

  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;
    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator)) return;
    if (!("PushManager" in window)) return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      setShowPrompt(true);
    }
  }, [session?.user?.email]);

  async function activateNotifications() {
    try {
      setLoading(true);
      setMessage("");

      if (!("serviceWorker" in navigator)) {
        setMessage("Este navegador no soporta notificaciones.");
        return;
      }

      if (!("PushManager" in window)) {
        setMessage("Este dispositivo no soporta notificaciones Push.");
        return;
      }

      if (!("Notification" in window)) {
        setMessage("Este navegador no permite notificaciones.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setMessage("No se concedió permiso para las notificaciones.");
        return;
      }

      const vapidPublicKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        console.error("Falta NEXT_PUBLIC_VAPID_PUBLIC_KEY");
        setMessage("No se pudo configurar las notificaciones.");
        return;
      }

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription.toJSON()),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        console.error(
          "No se pudo guardar la suscripción push:",
          data?.error
        );

        setMessage("No se pudo activar las notificaciones.");
        return;
      }

      setShowPrompt(false);
      setMessage("Notificaciones activadas correctamente.");

      console.log("Suscripción push guardada correctamente.");
    } catch (error) {
      console.error("Error configurando notificaciones push:", error);
      setMessage("Ocurrió un error al activar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }

  if (!session?.user?.email) return null;
  if (!showPrompt && !message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-[100] w-[calc(100%-24px)] max-w-sm -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl md:bottom-6">
      {showPrompt ? (
        <>
          <p className="text-sm font-black text-slate-900">
            Activa las notificaciones
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Recibe un aviso cuando alguien te escriba por Kubo.
          </p>

          <button
            type="button"
            onClick={activateNotifications}
            disabled={loading}
            className="mt-3 w-full rounded-xl bg-[#0f3c8c] px-4 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Activando..."
              : "Activar notificaciones"}
          </button>
        </>
      ) : (
        <p className="text-sm font-semibold text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}