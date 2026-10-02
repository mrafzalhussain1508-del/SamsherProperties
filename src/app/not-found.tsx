'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Search, 
  ArrowRight, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Compass, 
  Sparkles 
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleQuickFilter = (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#163a34] font-sans flex flex-col justify-between selection:bg-[#1a4332] selection:text-white">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#e5ebe3] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo size={38} />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#163a34]">
                Samsher
              </span>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#b47a3c]">
                Properties
              </span>
            </div>
          </Link>

          <a
            href="tel:+917011007968"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1a4332] hover:text-[#b47a3c] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#1a4332]" />
            <span className="hidden sm:inline">Helpline:</span>
            <span>+91 70110 07968</span>
          </a>
        </div>
      </header>

      {/* Main 404 Hero Section */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#eef3ed] text-[#1a4332] border border-[#d6e3d5] text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-4">
          <Compass className="w-3.5 h-3.5 text-[#b47a3c]" />
          <span>Page or Listing Not Found • 404</span>
        </div>

        {/* Big Stylized Number */}
        <div className="relative mb-2">
          <span className="text-7xl sm:text-9xl font-serif font-black tracking-tighter text-[#1a4332]/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#163a34]">
              Property Not Found or Relocated
            </h1>
          </div>
        </div>

        {/* Explanatory description */}
        <p className="text-sm sm:text-base text-[#567566] max-w-lg mb-8 leading-relaxed">
          The property listing or page you are looking for may have been sold, archived, or the link address might have changed. Don&apos;t worry, your next dream home is right around the corner.
        </p>

        {/* Interactive Search Bar to Reduce Bounce Rate */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-lg bg-white rounded-2xl p-1.5 sm:p-2 border border-[#d6e3d5] shadow-lg shadow-[#163a34]/5 flex items-center gap-2 mb-6"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#7b988b] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by locality, BHK, or title (e.g. 4 BHK Greenfield)..."
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm font-medium text-[#163a34] bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1a4332] hover:bg-[#123325] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Suggestions / Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
          <span className="text-[#728f81] font-medium text-[11px] mr-1">Popular:</span>
          {['GreenField Colony', '4 BHK Luxury', '5 BHK Apartment', 'Near South Delhi'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickFilter(tag)}
              className="bg-[#f0f5ee] hover:bg-[#e4ede2] text-[#1a4332] px-3 py-1 rounded-full text-xs font-semibold border border-[#d2dfd0] transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto bg-[#1a4332] hover:bg-[#123325] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#1a4332]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#e6ca85]" />
            <span>Explore Curated Properties</span>
          </Link>

          <a
            href="tel:+917011007968"
            className="w-full sm:w-auto bg-white hover:bg-[#f4f7f3] text-[#1a4332] font-semibold py-3 px-6 rounded-xl text-xs sm:text-sm border border-[#cbe0d4] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Phone className="w-4 h-4 text-[#b47a3c]" />
            <span>Call Property Concierge</span>
          </a>
        </div>

        {/* Trust verification pill */}
        <div className="mt-12 flex items-center gap-2 text-xs text-[#6e8a7d]">
          <ShieldCheck className="w-4 h-4 text-[#1a4332]" />
          <span>100% RERA Verified Residences • Samsher Properties Official Portal</span>
        </div>

      </main>

      {/* Footer minimal */}
      <footer className="border-t border-[#e2e8df] py-4 text-center text-xs text-[#7b988b]">
        <span>© {new Date().getFullYear()} Samsher Properties. All verified rights reserved.</span>
      </footer>
    </div>
  );
}
