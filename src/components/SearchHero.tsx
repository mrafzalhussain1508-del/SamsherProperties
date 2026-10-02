'use client';

import React from 'react';
import Image from 'next/image';
import { PropertyPurpose } from '@/types/property';
import { Search, ChevronDown } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export interface FilterState {
  purpose: PropertyPurpose;
  city: string;
  searchQuery: string;
  bhk: number | null;
  budgetRange: string;
  propertyType: string;
}

interface SearchHeroProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSearchSubmit?: () => void;
  customHeroUrl?: string;
  onOpenBrandingModal?: () => void;
}

const CITIES = ['All cities', 'Faridabad', 'Gurgaon', 'Noida', 'Delhi'];

const BUDGET_OPTIONS = [
  { label: 'Any budget', value: 'all' },
  { label: 'Under ₹1 Cr', value: '0-10000000' },
  { label: '₹1 Cr - ₹2.5 Cr', value: '10000000-25000000' },
  { label: '₹2.5 Cr - ₹5 Cr', value: '25000000-50000000' },
  { label: 'Above ₹5 Cr', value: '50000000-1000000000' },
];

// Default to the luxury interior cove photo shown in the user's screenshot
const DEFAULT_HERO_IMAGE = '/images/luxury-interior-cove.jpg';

// Cinematic animation variants for staggered masked text reveal
const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

const textLineVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function SearchHero({
  filters,
  onFilterChange,
  onSearchSubmit,
  customHeroUrl,
  onOpenBrandingModal,
}: SearchHeroProps) {

  const handleCitySelect = (city: string) => {
    onFilterChange({
      ...filters,
      city: city === 'All cities' ? 'All India' : city,
    });
  };

  const handleBhkSelect = (value: string) => {
    if (value === 'all') {
      onFilterChange({ ...filters, bhk: null });
    } else {
      onFilterChange({ ...filters, bhk: Number(value) });
    }
  };

  const selectedCityValue = filters.city === 'All India' ? 'All cities' : filters.city;
  const heroImageSrc = customHeroUrl || DEFAULT_HERO_IMAGE;

  return (
    <section className="bg-[#edf3eb] pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* 1. EDITORIAL HEADINGS - CINEMATIC MASKED STAGGER REVEAL */}
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3.5 sm:space-y-4 pt-1"
        >
          {/* Main Large Serif Heading with Masked Overflow - Staggered Line by Line */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#163a34] leading-[1.18] tracking-tight">
            <span className="block overflow-hidden">
              <motion.span variants={textLineVariants} className="block">
                A home that
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={textLineVariants} className="block">
                feels <span className="italic font-serif text-[#b47a3c]">like yours.</span>
              </motion.span>
            </span>
          </h1>

          {/* Description Paragraph with Masked Overflow */}
          <div className="overflow-hidden">
            <motion.p
              variants={textLineVariants}
              className="text-xs sm:text-sm md:text-base text-[#4a6b5e] leading-relaxed font-normal max-w-lg"
            >
              Thoughtfully selected homes, trusted guidance, and a simpler journey from search to doorstep.
            </motion.p>
          </div>

          {/* Social Proof Avatar Cluster with Masked Overflow */}
          <div className="overflow-hidden">
            <motion.div
              variants={textLineVariants}
              className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1"
            >
              <div className="flex -space-x-1.5 shrink-0">
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#d5ded4] text-[#163a34] font-bold text-[10px] sm:text-[11px] flex items-center justify-center border-2 border-[#edf3eb]">
                  A
                </div>
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#e6d0b8] text-[#7d5026] font-bold text-[10px] sm:text-[11px] flex items-center justify-center border-2 border-[#edf3eb]">
                  S
                </div>
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#bccdc0] text-[#163a34] font-bold text-[10px] sm:text-[11px] flex items-center justify-center border-2 border-[#edf3eb]">
                  R
                </div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-[#2d4d42]">
                A home search with people at heart
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* 2. HERO INTERIOR IMAGE - CINEMATIC SCALE REVEAL (Scale 1.1 -> 1.0, Opacity 0.8 -> 1.0 over 1.8s) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm aspect-[16/10] sm:aspect-[16/9] bg-[#dbe5db] group border border-[#d6e2d4] w-full"
        >
          <motion.div
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1], // Unhurried, luxurious ease-out curve
            }}
            className="w-full h-full relative"
          >
            {/* High-resolution hero interior image with unoptimized={true} and quality={100} to bypass Vercel compression */}
            {/* Note: The "Replace Image" overlay button has been completely removed for public/production views */}
            <Image
              src={heroImageSrc}
              alt="Luxury home interior"
              fill
              priority
              quality={100}
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover w-full h-full"
            />
          </motion.div>
        </motion.div>

        {/* 3. SEARCH & FILTER CARD (Stacks on mobile grid-cols-1, 2 on sm, 4 on lg) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-[#e3ebe2] space-y-3.5 sm:space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-[#355246] mb-1">
                  City
                </label>
                <div className="relative">
                  <select
                    value={selectedCityValue}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    className="w-full bg-[#fbfdfa] border border-[#dce5db] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#163a34] font-medium focus:outline-none focus:border-[#1a4332] appearance-none pr-8 cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#668274] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Locality */}
              <div>
                <label className="block text-[11px] font-bold text-[#355246] mb-1">
                  Locality
                </label>
                <input
                  type="text"
                  placeholder="Any locality"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                  className="w-full bg-[#fbfdfa] border border-[#dce5db] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#163a34] font-medium placeholder:text-[#95ab9e] focus:outline-none focus:border-[#1a4332]"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[11px] font-bold text-[#355246] mb-1">
                  Budget
                </label>
                <div className="relative">
                  <select
                    value={filters.budgetRange}
                    onChange={(e) => onFilterChange({ ...filters, budgetRange: e.target.value })}
                    className="w-full bg-[#fbfdfa] border border-[#dce5db] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#163a34] font-medium focus:outline-none focus:border-[#1a4332] appearance-none pr-8 cursor-pointer"
                  >
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#668274] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-[11px] font-bold text-[#355246] mb-1">
                  BHK
                </label>
                <div className="relative">
                  <select
                    value={filters.bhk === null ? 'all' : String(filters.bhk)}
                    onChange={(e) => handleBhkSelect(e.target.value)}
                    className="w-full bg-[#fbfdfa] border border-[#dce5db] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#163a34] font-medium focus:outline-none focus:border-[#1a4332] appearance-none pr-8 cursor-pointer"
                  >
                    <option value="all">Any BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#668274] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Property Type & Search Action */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-[#355246] mb-1">
                  Property type
                </label>
                <div className="relative">
                  <select
                    value={filters.propertyType}
                    onChange={(e) => onFilterChange({ ...filters, propertyType: e.target.value })}
                    className="w-full bg-[#fbfdfa] border border-[#dce5db] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#163a34] font-medium focus:outline-none focus:border-[#1a4332] appearance-none pr-8 cursor-pointer"
                  >
                    <option value="all">All types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#668274] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={onSearchSubmit}
                  className="w-full bg-[#1a4332] hover:bg-[#123325] active:scale-[0.99] text-white font-bold py-2.5 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Homes</span>
                </button>
              </div>
            </div>
        </motion.div>

      </div>
    </section>
  );
}
