import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ClientProvider } from "@/providers/client.privider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reconhecimento Facial - Sistemas Distribuidos e Mobile",
  description:
    "Repositório criado para a UC de Sistemas Distribuidos e Mobile da UNP Campus Salgado Filho - Natal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <ClientProvider>
        <body className="min-h-full flex flex-col">
          <Navbar />
          {children}
        </body>
      </ClientProvider>
    </html>
  );
}
