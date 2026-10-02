'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import { 
  formatIndianCurrency, 
  formatSqFt, 
  generateWhatsAppLink 
} from '@/utils/formatters';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  Train,
  Stethoscope,
  GraduationCap,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Bed,
  Maximize,
  Compass
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { 
  getPropertySeoTitle, 
  getPropertyCanonicalUrl, 
  generatePropertyJsonLd 
} from '@/utils/seo';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onOpenEnquiry?: (property: Property) => void;
  onSubmitDirectLead?: (leadData: {
    propertyId: string;
    leadName: string;
    leadPhone: string;
    message: string;
    scheduledDate?: string;
  }) => void;
}

export default function PropertyDetail({
  property,
  onBack,
}: PropertyDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const priceDisplay = property.priceDisplayCustom || formatIndianCurrency(property.priceInInr, property.purpose);
  const seoTitle = getPropertySeoTitle(property);
  const canonicalUrl = getPropertyCanonicalUrl(property.slug);
  const jsonLd = generatePropertyJsonLd(property);

  // Dynamic document title update for client navigation
  React.useEffect(() => {
    document.title = seoTitle;
  }, [seoTitle]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} on Samsher Properties.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const handleCopyRera = () => {
    navigator.clipboard.writeText(property.reraNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const link = generateWhatsAppLink(
      property.agent.whatsapp,
      property.title,
      property.id,
      priceDisplay,
      `${property.locality}, ${property.cityName}`
    );
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#f7faf6] min-h-screen pb-28 overflow-x-hidden w-full max-w-[100vw]">
      {/* Schema.org Structured Data (JSON-LD) for Search Engine Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Top Breadcrumb Navigation */}
      <div className="sticky top-[61px] z-40 bg-white/95 backdrop-blur-md border-b border-[#e1e9df] px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1a4332] hover:text-[#b47a3c] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to curated homes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl bg-[#f0f5ee] hover:bg-[#e6efe4] text-[#163a34] flex items-center justify-center transition-colors cursor-pointer"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-xl bg-[#f0f5ee] hover:bg-rose-50 text-[#163a34] hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
              title="Save property"
            >
              <Heart className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        
        {/* 1. PHOTO GALLERY SLIDER */}
        <div className="relative rounded-3xl overflow-hidden shadow-xs bg-[#e8eee7]">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src={(typeof property.images[activeImageIndex] === 'string' ? property.images[activeImageIndex] : (property.images[activeImageIndex] as any)?.url) || (typeof property.images[0] === 'string' ? property.images[0] : (property.images[0] as any)?.url)}
              alt={property.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Previous / Next buttons */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#163a34] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:bg-white"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#163a34] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:bg-white"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Photo Counter */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-mono">
              {activeImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>

        {/* 2. TITLE & PRICING CARD */}
        <ScrollReveal delay={0} yOffset={24}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e3ebe2] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#eef3ed] text-[#1a4332] text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1a4332]" />
                    RERA Verified
                  </span>
                  <span className="bg-[#fbf4eb] text-[#b47a3c] text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                    {property.propertyType}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#163a34] tracking-tight">
                  {property.title}
                </h1>

                <p className="text-xs sm:text-sm text-[#668274] flex items-center gap-1.5 mt-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#819e90] shrink-0" />
                  <span>{property.fullAddress}</span>
                </p>

                {property.specificationsSummary && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a4332] bg-[#edf4ec] px-3 py-1 rounded-lg border border-[#dae6d8]">
                      {property.specificationsSummary}
                    </span>
                  </div>
                )}

                {property.propertyTypeCustom && (
                  <div className="pt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#925f2b] bg-[#fbf5ed] px-3 py-1 rounded-lg border border-[#eddccb]">
                      ✓ {property.propertyTypeCustom}
                    </span>
                  </div>
                )}
              </div>

              <div className="sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-[#b47a3c] tracking-tight">
                  {priceDisplay}
                </div>
                <div className="text-xs text-[#80988d] font-medium mt-0.5">
                  (₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft)
                </div>
              </div>
            </div>

            {/* RERA Strip */}
            <div className="bg-[#f5f8f4] border border-[#e1eae0] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#678275] font-medium">RERA Registration:</span>
                <span className="font-mono text-[#1a4332] font-bold">{property.reraNumber}</span>
              </div>
              <button
                onClick={handleCopyRera}
                className="text-[#1a4332] font-semibold hover:text-[#b47a3c] cursor-pointer"
              >
                {isCopied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#f0f4ef]">
              <div className="p-3 bg-[#fbfdfa] rounded-2xl border border-[#e8eee7]">
                <span className="text-[11px] font-semibold text-[#80988d] uppercase block">Carpet Area</span>
                <span className="text-sm sm:text-base font-bold text-[#163a34]">{property.areaDisplayCustom || formatSqFt(property.carpetAreaSqFt)}</span>
              </div>

              <div className="p-3 bg-[#fbfdfa] rounded-2xl border border-[#e8eee7]">
                <span className="text-[11px] font-semibold text-[#80988d] uppercase block">Configuration</span>
                <span className="text-sm sm:text-base font-bold text-[#163a34]">{property.bhk} BHK • {property.bathrooms} Baths</span>
              </div>

              <div className="p-3 bg-[#fbfdfa] rounded-2xl border border-[#e8eee7]">
                <span className="text-[11px] font-semibold text-[#80988d] uppercase block">Facing / Vastu</span>
                <span className="text-sm sm:text-base font-bold text-[#163a34]">{property.facing} Facing</span>
              </div>

              <div className="p-3 bg-[#fbfdfa] rounded-2xl border border-[#e8eee7]">
                <span className="text-[11px] font-semibold text-[#80988d] uppercase block">Possession</span>
                <span className="text-sm sm:text-base font-bold text-[#163a34]">{property.possessionStatus}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. ABOUT THIS PROPERTY */}
        <ScrollReveal delay={60} yOffset={28}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e3ebe2] shadow-xs space-y-3">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#163a34]">
              About this residence
            </h3>
            <p className="text-sm text-[#506e61] leading-relaxed">
              {property.description}
            </p>
          </div>
        </ScrollReveal>

        {/* 4. AMENITIES */}
        <ScrollReveal delay={80} yOffset={28}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e3ebe2] shadow-xs space-y-4">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#163a34]">
              Amenities & Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f7faf6] border border-[#e8eee7] text-xs font-medium text-[#2d4d40]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1a4332] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 5. LOCATION & CONNECTIVITY */}
        <ScrollReveal delay={80} yOffset={28}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e3ebe2] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#163a34]">
                Location & Connectivity
              </h3>
              <span className="text-xs text-[#80988d] font-medium">{property.locality}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.landmarks.map((landmark, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#f7faf6] border border-[#e8eee7] text-xs">
                  <div className="flex items-center gap-2 text-[#2d4d40] font-medium">
                    {landmark.type === 'metro' && <Train className="w-4 h-4 text-[#1a4332]" />}
                    {landmark.type === 'hospital' && <Stethoscope className="w-4 h-4 text-[#1a4332]" />}
                    {landmark.type === 'school' && <GraduationCap className="w-4 h-4 text-[#1a4332]" />}
                    {landmark.type === 'it_park' && <Briefcase className="w-4 h-4 text-[#1a4332]" />}
                    <span>{landmark.name}</span>
                  </div>
                  <span className="font-bold text-[#163a34] bg-white px-2 py-0.5 rounded-lg border border-[#e1eae0]">
                    {landmark.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 6. VERIFIED AGENT & FOUNDER SECTION: Schedule a Private Walkthrough */}
        <ScrollReveal delay={100} yOffset={36}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e3ebe2] shadow-xs space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#f0f4ef]">
              <img
                src={property.agent.avatarUrl}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#1a4332]"
              />
              <div>
                <h4 className="font-bold text-[#163a34] text-sm sm:text-base">
                  {property.agent.name}
                </h4>
                <p className="text-xs text-[#6e8a7d]">
                  {property.agent.agencyName}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-[#163a34] text-base mb-1">
                Schedule a Private Walkthrough
              </h4>
              <p className="text-xs text-[#6e8a7d] mb-4">
                Direct consultation with our advisor. Verified floor plans and pricing sent instantly.
              </p>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd-DRiLwnYgamw6mdnR48D6Bp50wn4hageEvniyiDnPgoj0Kg/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1a4332] hover:bg-[#123325] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Brochure & Schedule Visit</span>
              </a>

              <a
                href="https://www.youtube.com/@samsherproperty"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#fbf5ed] hover:bg-[#f6ebd9] text-[#925f2b] border border-[#ecdac7] font-bold py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 mt-2.5 cursor-pointer"
                title="Samsher official - YouTube (@samsherproperty)"
              >
                <span className="w-4 h-3 bg-red-600 text-white rounded-xs flex items-center justify-center text-[7.5px] font-black shadow-2xs">▶</span>
                <span>Watch 4K Video Tour on YouTube (@samsherproperty)</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Matches Screenshot in all views!) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#f7faf6]/95 backdrop-blur-md border-t border-[#e1e9df] px-4 py-3 shadow-lg flex items-center gap-3 max-w-lg mx-auto">
        <button
          onClick={handleDirectWhatsApp}
          className="flex-1 bg-[#1a4332] hover:bg-[#123325] active:scale-[0.98] text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>WhatsApp</span>
        </button>

        <a
          href={`tel:${property.agent.phone}`}
          className="flex-1 bg-[#f0f5ee] hover:bg-[#e4ece2] active:scale-[0.98] text-[#1a4332] font-bold py-3 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-[#d8e3d6] text-center"
        >
          <Phone className="w-4 h-4 text-[#1a4332]" />
          <span>Call Agent</span>
        </a>
      </div>
    </div>
  );
}
