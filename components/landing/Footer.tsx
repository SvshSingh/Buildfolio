"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#07070f] border-t border-white/5 py-16 px-6 z-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="md:col-span-2 flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center shadow-md shadow-violet-500/20">
              <span className="text-white font-jakarta font-extrabold text-sm tracking-wider">F</span>
            </div>
            <span className="font-jakarta font-bold text-white text-lg tracking-tight">
              FolioFast
            </span>
          </Link>
          <p className="font-sans text-sm text-white/50 max-w-xs leading-relaxed">
            The portfolio that gets you hired. Build, customize, and share in minutes.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-4">
          <span className="font-jakarta font-semibold text-xs tracking-wider text-[#c084fc] uppercase">
            Product
          </span>
          <div className="flex flex-col gap-2.5">
            <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#templates" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Templates
            </a>
            <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Pricing
            </a>
          </div>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-4">
          <span className="font-jakarta font-semibold text-xs tracking-wider text-[#c084fc] uppercase">
            Company
          </span>
          <div className="flex flex-col gap-2.5">
            <Link href="/auth" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link href="/auth" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Blog
            </Link>
            <Link href="/auth" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Twitter
            </Link>
          </div>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col gap-4">
          <span className="font-jakarta font-semibold text-xs tracking-wider text-[#c084fc] uppercase">
            Legal
          </span>
          <div className="flex flex-col gap-2.5">
            <Link href="/auth" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/auth" className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="text-xs text-white/35 text-center sm:text-left">
          &copy; 2026 FolioFast &middot; Built with &hearts; in Hyderabad, India 🇮🇳
        </span>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            aria-label="Follow us on Twitter"
          >
            <Twitter size={14} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            aria-label="Follow us on GitHub"
          >
            <Github size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
