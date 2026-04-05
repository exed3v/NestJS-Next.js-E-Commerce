import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers/Providers";
import Navbar from "../components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NOIRSTORE | Tienda de ropa minimalista",
    template: "%s | NOIRSTORE",
  },
  description:
    "Descubre NOIRSTORE, tu tienda de ropa minimalista con prendas de alta calidad. Moda atemporal para el día a día. Envíos rápidos y atención personalizada.",
  keywords: [
    "tienda de ropa",
    "moda minimalista",
    "ropa casual",
    "camisetas",
    "pantalones",
    "chaquetas",
    "zapatos",
    "NOIRSTORE",
  ],
  authors: [{ name: "NOIRSTORE" }],
  creator: "NOIRSTORE",
  publisher: "NOIRSTORE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "NOIRSTORE | Tienda de ropa minimalista",
    description:
      "Prendas minimalistas de alta calidad diseñadas para el día a día. Define tu estilo con NOIRSTORE.",
    url: "https://noirstore.com",
    siteName: "NOIRSTORE",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://noirstore.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOIRSTORE - Tienda de ropa minimalista",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOIRSTORE | Tienda de ropa minimalista",
    description:
      "Prendas minimalistas de alta calidad diseñadas para el día a día. Define tu estilo con NOIRSTORE.",
    images: ["https://noirstore.com/twitter-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://noirstore.com"),
  alternates: {
    canonical: "/",
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
