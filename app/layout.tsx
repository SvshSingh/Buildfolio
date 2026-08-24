import type { Metadata } from "next";
import { 
  Inter, 
  DM_Sans, 
  Cormorant_Garamond, 
  Outfit, 
  JetBrains_Mono, 
  Bebas_Neue, 
  Noto_Serif_JP, 
  Noto_Sans,
  Plus_Jakarta_Sans
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "FolioFast - Minimalist Portfolio Builder",
  description: "Create and preview your minimalist, clean portfolio in real time.",
};

import NavigationTopLoader from "@/components/ui/navigation-top-loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${inter.variable} 
        ${dmSans.variable} 
        ${cormorant.variable} 
        ${outfit.variable} 
        ${jetBrainsMono.variable} 
        ${bebasNeue.variable} 
        ${notoSerifJp.variable} 
        ${notoSans.variable} 
        ${plusJakarta.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NavigationTopLoader />
        {children}
      </body>
    </html>
  );
}
