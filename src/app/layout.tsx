import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const title = "Bikkina Abhiram Choudhary | Embedded Systems & Firmware Engineer";
const description =
  "Entry-level embedded systems engineer (B.Tech ECE, 2026) building firmware in Embedded C on ARM Cortex-M (STM32) and ESP32: bare-metal GPIO, UART, SPI, I2C, interrupts, ADC and FreeRTOS concepts. View projects and download the resume.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the deployed origin so social previews resolve.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  keywords: [
    "Embedded Systems Engineer",
    "Embedded Software Engineer",
    "Firmware Engineer",
    "Embedded C",
    "ARM Cortex-M",
    "STM32",
    "ESP32",
    "FreeRTOS",
    "Bare-metal programming",
    "Firmware development",
    "UART",
    "SPI",
    "I2C",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    siteName: `${profile.shortName} — Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b100e",
  colorScheme: "dark",
};

// Structured data: only facts that are on the resume.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  address: { "@type": "PostalAddress", addressLocality: "Bargarh", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "KL University (KLEF)" },
  knowsAbout: [
    "Embedded C",
    "ARM Cortex-M",
    "STM32",
    "ESP32",
    "FreeRTOS",
    "UART",
    "SPI",
    "I2C",
    "Firmware development",
  ],
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
