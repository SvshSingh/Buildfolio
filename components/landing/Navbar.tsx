"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 left-0 w-full h-16 bg-[#07070f]/80 backdrop-blur-[20px] border-b border-white/6 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Left: App Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-jakarta font-extrabold text-sm tracking-wider">F</span>
          </div>
          <span className="font-jakarta font-bold text-white text-lg tracking-tight group-hover:text-white/90 transition-colors">
            FolioFast
          </span>
        </Link>

        {/* Center: Nav links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
          >
            Features
          </a>
          <a
            href="#templates"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
          >
            Templates
          </a>
          <a
            href="#pricing"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
          >
            Pricing
          </a>
        </div>

        {/* Right: CTAs (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/auth"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
          >
            Log in
          </Link>
          <Link
            href="/auth"
            className="text-sm font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-5 py-2 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-[1.02] transition-all duration-200"
          >
            Get started free &rarr;
          </Link>
        </div>

        {/* Mobile: Hamburger menu */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white/80 hover:text-white p-1 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-16 w-full h-[calc(100vh-64px)] bg-[#07070f] z-40 flex flex-col px-8 py-12 justify-between md:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-8 text-center mt-8">
            <a
              href="#features"
              onClick={toggleMenu}
              className="text-xl font-jakarta font-bold text-white/70 hover:text-white transition-colors py-2"
            >
              Features
            </a>
            <a
              href="#templates"
              onClick={toggleMenu}
              className="text-xl font-jakarta font-bold text-white/70 hover:text-white transition-colors py-2"
            >
              Templates
            </a>
            <a
              href="#pricing"
              onClick={toggleMenu}
              className="text-xl font-jakarta font-bold text-white/70 hover:text-white transition-colors py-2"
            >
              Pricing
            </a>
          </div>

          <div className="flex flex-col gap-4 text-center pb-12">
            <Link
              href="/auth"
              onClick={toggleMenu}
              className="text-white/60 hover:text-white py-3 text-lg font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth"
              onClick={toggleMenu}
              className="w-full text-center text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] py-4 rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] active:scale-[0.98] transition-all"
            >
              Get started free &rarr;
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
