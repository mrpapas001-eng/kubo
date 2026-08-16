import { Nunito } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import MobileBottomNav from "@/components/MobileBottomNav";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata = {
  icons: {
    icon: "/brand/favicon.png",
    shortcut: "/brand/favicon.png",
    apple: "/brand/kubo-symbol.png",
  },
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
          {children}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
