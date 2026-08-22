import { Nunito } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import MobileBottomNav from "@/components/MobileBottomNav";
import PushNotificationsInit from "@/components/PushNotificationsInit";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/brand/kubo-symbol.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F3C8C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={nunito.className}>
        <AuthProvider>
          <PushNotificationsInit />
          {children}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}