import React from "react";
import { Metadata } from "next";
import FloatingVectors from "../components/landing/FloatingVectors";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import SocialProof from "../components/landing/SocialProof";
import BentoFeatures from "../components/landing/BentoFeatures";
import HowItWorks from "../components/landing/HowItWorks";
import TemplateShowcase from "../components/landing/TemplateShowcase";
import Pricing from "../components/landing/Pricing";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export const metadata: Metadata = {
  title: 'Foliofast — The portfolio that gets you hired',
  description: 'Build a stunning, shareable portfolio in minutes — not weeks. Choose from 12 premium templates, add your experience, and go live with one click. Free forever.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Foliofast — The portfolio that gets you hired',
    description: 'Build a stunning, shareable portfolio in minutes — not weeks. Choose from 12 premium templates, add your experience, and go live with one click. Free forever.',
    siteName: 'Foliofast',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Foliofast — The portfolio that gets you hired',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foliofast — The portfolio that gets you hired',
    description: 'Build a stunning portfolio in minutes. Free forever.',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image`],
    creator: '@foliofast',
  },
};

export default function Home() {
  return (
    <div className="bg-[#07070f] text-[#f8fafc] min-h-screen relative font-sans selection:bg-violet-500/30 overflow-x-hidden">
      {/* Canvas component sitting behind all content */}
      <FloatingVectors />

      {/* Foreground contents */}
      <div className="relative z-10">
        <Navbar />
        
        <main>
          <Hero />
          <SocialProof />
          <BentoFeatures />
          <HowItWorks />
          <TemplateShowcase />
          <Pricing />
          <FinalCTA />
        </main>

        <Footer />
      </div>
    </div>
  );
}
