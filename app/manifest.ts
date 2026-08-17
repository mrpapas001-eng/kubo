import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kubo Anuncios",
    short_name: "Kubo",
    description: "Compra, vende y encuentra servicios cerca de ti con Kubo.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5F7FB",
    theme_color: "#0F3C8C",
    icons: [
      {
        src: "/icons/kubo-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/kubo-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    prefer_related_applications: false,
  };
}