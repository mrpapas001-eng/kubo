import webpush from "web-push";
import { prisma } from "@/lib/db";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  console.warn("Faltan las claves VAPID para notificaciones push.");
} else {
  webpush.setVapidDetails(
    "mailto:admin@kuboanuncios.com",
    publicKey,
    privateKey
  );
}

type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushToUser(
  userEmail: string,
  payload: PushPayload
) {
  if (!publicKey || !privateKey) {
    console.log("PUSH DEBUG: faltan claves VAPID");
    return;
  }

  const normalizedEmail = userEmail.toLowerCase().trim();

  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      userEmail: normalizedEmail,
    },
  });

  console.log("PUSH DEBUG:", {
    userEmail: normalizedEmail,
    subscriptions: subscriptions.length,
  });

  if (!subscriptions.length) {
    console.log(
      "PUSH DEBUG: no hay suscripciones para",
      normalizedEmail
    );
    return;
  }

  const serializedPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || "/chat",
  });

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        console.log(
          "PUSH DEBUG: enviando notificación a",
          subscription.endpoint
        );

        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          serializedPayload
        );

        console.log(
          "PUSH DEBUG: notificación enviada correctamente"
        );
      } catch (error: any) {
        console.error("PUSH SEND ERROR:", {
          statusCode: error?.statusCode,
          body: error?.body,
          message: error?.message,
        });

        if (error?.statusCode === 404 || error?.statusCode === 410) {
          console.log(
            "PUSH DEBUG: eliminando suscripción vencida"
          );

          await prisma.pushSubscription.delete({
            where: {
              endpoint: subscription.endpoint,
            },
          });
        }
      }
    })
  );
}