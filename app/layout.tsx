import { Nunito } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={nunito.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}