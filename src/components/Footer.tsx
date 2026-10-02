'use client';

import React from 'react';
import BrandLogo from '@/components/BrandLogo';
import { ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  customLogoUrl?: string;
}

export default function Footer({ customLogoUrl }: FooterProps) {
  return (
    <footer className="bg-[#122b22] text-[#9bb0a5] text-xs pt-12 pb-28 sm:pb-12 border-t border-[#1a382d] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Row: Brand & External Partner Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-[#1f4235]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <BrandLogo customLogoUrl={customLogoUrl} size={36} />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  Samsher
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#b47a3c] tracking-tight">
                  Properties
                </span>
              </div>
            </div>
            <p className="text-xs text-[#7f998c] max-w-sm mt-1">
              Thoughtfully selected homes, verified RERA documentation, and human-first guidance from inquiry to key handover.
            </p>
          </div>

          {/* External Links & Social Channels */}
          <div className="self-start sm:self-auto flex flex-wrap items-center gap-2.5">
            <a
              href="https://www.youtube.com/@samsherproperty"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#cc0000] hover:bg-[#b00000] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-950/20"
              title="Samsher official - YouTube (@samsherproperty)"
            >
              <span className="w-4 h-3 bg-white text-[#cc0000] rounded-xs flex items-center justify-center text-[8px] font-black">▶</span>
              <span>Samsher official (YouTube)</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>

            <a
              href="https://www.magicbricks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#193a2e] hover:bg-[#204a3b] text-[#d6e3dc] px-3.5 py-2 rounded-xl text-xs font-medium border border-[#275343] transition-colors"
            >
              <span>Find us on MagicBricks</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8aa697]" />
            </a>
          </div>
        </div>

        {/* Quick Links & Legal: Stacks on mobile (grid-cols-1), 2 cols on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider text-[10px]">
              Prime Locations
            </p>
            <ul className="space-y-1.5 text-[#86a193]">
              <li>Faridabad (Sector 14, Greater Faridabad)</li>
              <li>Gurgaon (Golf Course Road, Sector 90)</li>
              <li>Noida (Sector 150, Expressway)</li>
              <li>Delhi (Greater Kailash, South Delhi)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider text-[10px]">
              Compliance & Trust
            </p>
            <ul className="space-y-1.5 text-[#86a193]">
              <li>RERA Verification Standards</li>
              <li>Privacy Policy & PII Protection</li>
              <li>Terms of Service</li>
              <li>Fair Housing Disclosures</li>
            </ul>
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <p className="font-semibold text-white uppercase tracking-wider text-[10px]">
              Direct Concierge
            </p>
            <p className="text-[#86a193] leading-relaxed">
              Helpline: <a href="tel:+917011007968" className="hover:text-white transition-colors font-medium">+91 70110 07968</a> <br />
              Email: <a href="mailto:Samsherproperties653@gmail.com" className="hover:text-white transition-colors break-all">Samsherproperties653@gmail.com</a> <br />
              YouTube: <a href="https://www.youtube.com/@samsherproperty" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 font-medium transition-colors">@samsherproperty</a> <br />
              Faridabad • Gurgaon • Noida • Delhi
            </p>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-[#1a382d] text-[11px] text-[#6b8577] leading-relaxed flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 Samsher Properties. All rights reserved. RERA certified listings only.</p>
          <p className="flex items-center justify-center gap-1">
            <span>Crafted with care for Indian homebuyers</span>
            <Heart className="w-3 h-3 text-[#b47a3c] fill-current inline" />
          </p>
        </div>

      </div>
    </footer>
  );
}
