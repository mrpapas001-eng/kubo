self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Kubo Anuncios",
      body: event.data ? event.data.text() : "Tienes una nueva notificación.",
    };
  }

  const title = data.title || "Kubo Anuncios";

  const options = {
    body: data.body || "Tienes una nueva notificación.",
    icon: "/icons/kubo-icon-192.png",
    badge: "/icons/kubo-icon-192.png",
    data: {
      url: data.url || "/chat",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/chat";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return clients.openWindow(url);
    })
  );
});