import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://samsherproperties.in"),
  title: {
    default: "Samsher Properties | Verified Luxury Residences",
    template: "%s",
  },
  description: "Explore curated RERA-verified luxury residences, 4 BHK & 5 BHK apartments in GreenField Colony, Faridabad and South Delhi with Samsher Properties.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Samsher Properties | Curated Real Estate",
    description: "Thoughtfully selected homes, trusted guidance, and a simpler journey from search to doorstep across Faridabad, Gurugram, and South Delhi.",
    url: "https://samsherproperties.in",
    siteName: "Samsher Properties",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/luxury-interior-cove.jpg",
        width: 1200,
        height: 630,
        alt: "Samsher Properties Luxury Living",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samsher Properties | Curated Real Estate",
    description: "Verified 4BHK & 5BHK residences in GreenField Colony Faridabad & South Delhi border.",
    images: ["/images/luxury-interior-cove.jpg"],
  },
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f7faf6] text-[#1a2e26] selection:bg-[#1a4332] selection:text-white overflow-x-hidden w-full max-w-[100vw]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
