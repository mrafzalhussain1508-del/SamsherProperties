'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { useWishlist } from '@/context/WishlistContext';
import { formatIndianCurrency, formatSqFt } from '@/utils/formatters';
import { 
  ShieldCheck, 
  MapPin, 
  Heart, 
  Bed, 
  Maximize, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelectProperty?: (property: Property) => void;
  onOpenEnquiry?: (property: Property) => void;
}

export default function PropertyCard({
  property,
  onSelectProperty,
}: PropertyCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(property.id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [autoPlayKey, setAutoPlayKey] = useState(0);

  const rawImages = property.images && property.images.length > 0 ? property.images : [];
  const imageList: string[] = rawImages.map((img: any) => typeof img === 'string' ? img : img.url);
  if (imageList.length === 0) {
    imageList.push('/images/greenfield-luxury-living.jpg');
  }

  const hasMultipleImages = imageList.length > 1;
  const priceDisplay = property.priceDisplayCustom || formatIndianCurrency(property.priceInInr, property.purpose);

  // Auto-Play: Transition every 2000ms (2s) with smooth loop and hover pause
  useEffect(() => {
    if (!hasMultipleImages || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, [hasMultipleImages, isHovered, autoPlayKey, imageList.length]);

  const resetAutoPlay = () => {
    setAutoPlayKey((k) => k + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetAutoPlay();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetAutoPlay();
    setCurrentIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    resetAutoPlay();
    setCurrentIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      resetAutoPlay();
      setCurrentIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
    } else if (diff < -45) {
      resetAutoPlay();
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
    }
    setTouchStart(null);
  };

  // Fixed floating badges & Heart that never slide away
  const renderFloatingBadges = () => (
    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-20">
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <span className="bg-white/95 backdrop-blur-md text-[#163a34] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs border border-[#edf3ec]">
          {property.purpose === 'sale' ? 'For sale' : 'For rent'}
        </span>
        <span className="bg-white/95 backdrop-blur-md text-[#163a34] text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs border border-[#edf3ec] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1a4332]" />
          <span>Verified</span>
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(property);
        }}
        className={`w-8 h-8 rounded-full backdrop-blur-md transition-all duration-200 shadow-2xs flex items-center justify-center pointer-events-auto cursor-pointer active:scale-90 ${
          wishlisted
            ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 ring-1 ring-rose-200'
            : 'bg-white/95 hover:bg-white text-[#567366] hover:text-rose-500'
        }`}
        aria-label={wishlisted ? 'Remove from saved residences' : 'Save to wishlist'}
        title={wishlisted ? 'Remove from saved residences' : 'Save to wishlist'}
      >
        <Heart className={`w-4 h-4 transition-transform duration-200 stroke-[1.8] ${wishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
      </button>
    </div>
  );

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering card-level handler if clicking on interactive elements
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    if (onSelectProperty) {
      onSelectProperty(property);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-3xl overflow-hidden border border-[#e3ebe2] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer group"
    >
      {/* Property Image Container */}
      {!hasMultipleImages ? (
        /* 1. Single static image */
        <div className="relative aspect-[16/10] overflow-hidden bg-[#e8eee7]">
          <Link href={`/property/${property.slug}`} className="block w-full h-full">
            <img
              src={imageList[0]}
              alt={property.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
          </Link>
          {renderFloatingBadges()}
        </div>
      ) : (
        /* 2. Smooth Image Carousel/Slider when images.length > 1 with 2s Auto-Play & Hover Pause */
        <div 
          className="relative aspect-[16/10] overflow-hidden bg-[#e8eee7]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track with duration-700 ease-in-out */}
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {imageList.map((imgUrl, idx) => (
              <div key={idx} className="w-full h-full shrink-0 relative">
                <Link href={`/property/${property.slug}`} className="block w-full h-full">
                  <img
                    src={imgUrl}
                    alt={`${property.title} - photo ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 select-none"
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* Left (<) Navigation Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-85 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 cursor-pointer shadow-md"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Right (>) Navigation Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-85 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 cursor-pointer shadow-md"
            aria-label="Next photo"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleDotClick(e, idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-5 h-1.5 bg-white shadow-sm'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/90'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Fixed Floating Badges (stays on top, never slides) */}
          {renderFloatingBadges()}
        </div>
      )}

      {/* Property Card Body (Matches Screenshot 1 & 4) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Price (Bronze/Amber Warm Text) */}
          <div className="text-xl sm:text-2xl font-bold text-[#b47a3c] tracking-tight">
            {priceDisplay}
          </div>

          {/* Title in Editorial Serif */}
          <h2 className="text-lg font-serif font-bold text-[#163a34] tracking-tight group-hover:text-[#b47a3c] transition-colors line-clamp-1">
            <Link
              href={`/property/${property.slug}`}
              className="hover:text-[#b47a3c] transition-colors"
            >
              {property.title}
            </Link>
          </h2>

          {/* Location */}
          <p className="text-xs text-[#6e8a7d] flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#6e8a7d] shrink-0" />
            <span>{property.locality}{property.cityName && !property.locality.toLowerCase().includes(property.cityName.toLowerCase()) ? `, ${property.cityName}` : ''}</span>
          </p>

          {/* Specifications Highlight Tag if present */}
          {property.specificationsSummary && (
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1a4332] bg-[#edf4ec] px-2.5 py-0.5 rounded-md border border-[#dae6d8]">
                {property.specificationsSummary}
              </span>
            </div>
          )}

          {/* Property Type / Approval Tag if present */}
          {property.propertyTypeCustom && (
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#925f2b] bg-[#fbf5ed] px-2.5 py-0.5 rounded-md border border-[#eddccb]">
                ✓ {property.propertyTypeCustom}
              </span>
            </div>
          )}

          {/* Specs Row: BHK, sqft, Type */}
          <div className="pt-3 flex items-center justify-between text-xs text-[#526f62] font-medium border-t border-[#f0f4ef] mt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-[#829e92]" />
                <span>{property.bhk} BHK</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize className="w-3.5 h-3.5 text-[#829e92]" />
                <span>{property.areaDisplayCustom || formatSqFt(property.carpetAreaSqFt)}</span>
              </span>
            </div>

            <span className="capitalize text-[#7c978b] font-medium">
              {property.propertyType}
            </span>
          </div>
        </div>

        {/* View Details & Enquire Button */}
        <Link
          href={`/property/${property.slug}`}
          className="w-full bg-white hover:bg-[#f4f7f3] text-[#1a4332] font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm border border-[#cbe0d4] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group-hover:border-[#1a4332]"
        >
          <span>View details & enquire</span>
          <ArrowRight className="w-4 h-4 text-[#1a4332] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
