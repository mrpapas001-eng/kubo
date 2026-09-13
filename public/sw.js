self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Kubo Anuncios",
      body: event.data
        ? event.data.text()
        : "Tienes una nueva notificación.",
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

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const canonicalOrigin = "https://www.kuboanuncios.com";
  const allowedOrigins = new Set([
    "https://www.kuboanuncios.com",
    "https://kuboanuncios.com",
  ]);

  function getSafeTarget(rawValue) {
    const value = String(rawValue ?? "").trim();

    if (!value) {
      return `${canonicalOrigin}/`;
    }

    const lowerValue = value.toLowerCase();
    if (
      lowerValue.startsWith("javascript:") ||
      lowerValue.startsWith("data:") ||
      lowerValue.startsWith("file:") ||
      lowerValue.startsWith("blob:")
    ) {
      return `${canonicalOrigin}/`;
    }

    if (lowerValue.startsWith("/")) {
      return new URL(value, canonicalOrigin).toString();
    }

    try {
      const parsed = new URL(value);
      const protocol = parsed.protocol.toLowerCase();

      if (protocol !== "http:" && protocol !== "https:") {
        return `${canonicalOrigin}/`;
      }

      if (parsed.username || parsed.password) {
        return `${canonicalOrigin}/`;
      }

      if (parsed.hostname === "localhost" || parsed.hostname.endsWith(".localhost")) {
        return `${canonicalOrigin}/`;
      }

      const origin = parsed.origin.toLowerCase();
      if (!allowedOrigins.has(origin)) {
        return `${canonicalOrigin}/`;
      }

      return new URL(
        `${parsed.pathname}${parsed.search}${parsed.hash}`,
        canonicalOrigin,
      ).toString();
    } catch {
      return `${canonicalOrigin}/`;
    }
  }

  const url = getSafeTarget(event.notification.data?.url || "/chat");

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windows) => {
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