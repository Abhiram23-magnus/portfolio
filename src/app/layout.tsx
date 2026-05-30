import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bikkina Abhiram Choudhary — Embedded Firmware Engineer",
  description:
    "Embedded systems & firmware engineer specializing in bare-metal C/C++ on STM32, ESP32, and ARM Cortex-M. Building reliable, interrupt-driven firmware for IoT and real-time systems.",
  keywords: [
    "Embedded Systems",
    "Firmware Engineer",
    "STM32",
    "ESP32",
    "ARM Cortex-M",
    "Bare-metal C",
    "FreeRTOS",
    "IoT",
  ],
  authors: [{ name: "Bikkina Abhiram Choudhary" }],
  openGraph: {
    title: "Bikkina Abhiram Choudhary — Embedded Firmware Engineer",
    description:
      "Bare-metal C/C++ on STM32, ESP32, ARM Cortex-M. IoT, FreeRTOS, BSP. NI CLAD certified.",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
