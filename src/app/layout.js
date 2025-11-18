import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ThemeInitializer from "@/components/ThemeInitializer";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Z-SUIT | Plataforma Educativa",
  description: "Suite de herramientas para profesores de tecnología",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeInitializer />
        <Toaster position="top-right" richColors theme="dark" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
