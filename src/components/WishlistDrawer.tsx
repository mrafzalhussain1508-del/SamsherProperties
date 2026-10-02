'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { formatIndianCurrency, formatSqFt } from '@/utils/formatters';
import { 
  Heart, 
  X, 
  Trash2, 
  MapPin, 
  Bed, 
  Maximize, 
  MessageSquare, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';

export default function WishlistDrawer() {
  const { 
    isWishlistOpen, 
    closeWishlist, 
    wishlistProperties, 
    wishlistCount, 
    removeFromWishlist, 
    clearWishlist,
    toast,
    dismissToast,
    openWishlist
  } = useWishlist();

  const [copied, setCopied] = React.useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistOpen, closeWishlist]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen]);

  // Generate multi-property WhatsApp consultation message
  const handleConsultAllWhatsApp = () => {
    if (wishlistProperties.length === 0) return;

    const propertyList = wishlistProperties.map((p, idx) => 
      `${idx + 1}. *${p.title}*\n   📍 ${p.locality}, ${p.cityName} | 💰 ${p.priceDisplayCustom || formatIndianCurrency(p.priceInInr, p.purpose)}\n   🔗 https://samsherproperties.in/property/${p.slug}`
    ).join('\n\n');

    const message = `Hi Samsher Properties, I have curated ${wishlistProperties.length} saved residence${wishlistProperties.length > 1 ? 's' : ''} on your website and would like verified brochures, pricing details, and to schedule private site visits:\n\n${propertyList}\n\nPlease guide me on the next steps!`;

    const url = `https://wa.me/917011007968?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Share Wishlist
  const handleShareWishlist = () => {
    if (wishlistProperties.length === 0) return;

    const textSummary = `Curated Luxury Residences on Samsher Properties:\n\n` + 
      wishlistProperties.map((p, i) => `${i + 1}. ${p.title} - ${p.locality} (${p.priceDisplayCustom || formatIndianCurrency(p.priceInInr, p.purpose)})`).join('\n') +
      `\n\nExplore verified homes at https://samsherproperties.in`;

    if (navigator.share) {
      navigator.share({
        title: 'My Saved Residences | Samsher Properties',
        text: textSummary,
        url: 'https://samsherproperties.in',
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* 1. FLOATING TOAST NOTIFICATION FOR WISHLIST ACTIONS */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
          <div className="bg-[#163a34] text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-[#2d5c4b] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${toast.isAdded ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white/70'}`}>
                <Heart className={`w-4 h-4 ${toast.isAdded ? 'fill-rose-500 text-rose-500' : ''}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold truncate text-white">
                  {toast.message}
                </p>
                {toast.propertyTitle && (
                  <p className="text-[11px] text-[#a9cfbe] truncate">
                    {toast.propertyTitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  dismissToast();
                  openWishlist();
                }}
                className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                View
              </button>
              <button
                type="button"
                onClick={dismissToast}
                className="text-white/60 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SLIDE-OVER DRAWER BACKDROP & PANEL */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[90] overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={closeWishlist}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md bg-[#f7faf6] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[#e3ebe2]">
              
              {/* Drawer Header */}
              <div className="bg-white px-5 py-4 border-b border-[#e3ebe2] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-serif font-bold text-[#163a34]">
                        Saved Residences
                      </h2>
                      <span className="bg-[#eef3ed] text-[#1a4332] text-xs font-bold px-2 py-0.5 rounded-full border border-[#dae6d8]">
                        {wishlistCount}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6e8a7d]">
                      Your private luxury shortlist
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {wishlistCount > 0 && (
                    <button
                      type="button"
                      onClick={clearWishlist}
                      className="text-xs font-semibold text-[#80988d] hover:text-rose-600 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Clear all saved residences"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeWishlist}
                    className="w-8 h-8 rounded-full hover:bg-[#f0f4ef] text-[#163a34] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close saved residences"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {wishlistProperties.length === 0 ? (
                  /* Empty State */
                  <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center px-4 py-12">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-[#e3ebe2] shadow-xs flex items-center justify-center text-[#99b5a8] mb-4">
                      <Heart className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#163a34] mb-1">
                      No saved residences yet
                    </h3>
                    <p className="text-xs text-[#6e8a7d] max-w-xs mb-6 leading-relaxed">
                      Tap the heart icon on any residence to curate your private collection for quick comparison and private site visits.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        closeWishlist();
                        const el = document.getElementById('featured-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-[#1a4332] hover:bg-[#123325] text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#e6ca85]" />
                      <span>Browse Curated Homes</span>
                    </button>
                  </div>
                ) : (
                  /* List of Wishlisted Properties */
                  wishlistProperties.map((property) => {
                    const primaryImage =
                      property.images && property.images.length > 0
                        ? typeof property.images[0] === 'string'
                          ? property.images[0]
                          : (property.images[0] as any).url
                        : '/images/greenfield-luxury-living.jpg';
                    const priceDisplay =
                      property.priceDisplayCustom ||
                      formatIndianCurrency(property.priceInInr, property.purpose);

                    const whatsappLink = `https://wa.me/917011007968?text=${encodeURIComponent(
                      `Hi Samsher Properties, I am enquiring about this residence from my saved wishlist:\n\n*${property.title}*\n📍 ${property.locality}, ${property.cityName}\n💰 ${priceDisplay}\n🔗 https://samsherproperties.in/property/${property.slug}\n\nPlease share the brochure and site visit timings.`
                    )}`;

                    return (
                      <div
                        key={property.id}
                        className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#e3ebe2] shadow-2xs hover:shadow-xs transition-all space-y-3 relative group"
                      >
                        <div className="flex gap-3">
                          {/* Image */}
                          <Link
                            href={`/property/${property.slug}`}
                            onClick={closeWishlist}
                            className="w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden bg-[#e8eee7] shrink-0 block relative"
                          >
                            <img
                              src={primaryImage}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-1 left-1">
                              <span className="bg-white/95 text-[9px] font-bold text-[#163a34] px-1.5 py-0.5 rounded shadow-2xs">
                                {property.purpose === 'sale' ? 'For sale' : 'For rent'}
                              </span>
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-sm sm:text-base font-bold text-[#b47a3c] tracking-tight">
                                  {priceDisplay}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeFromWishlist(property.id)}
                                  className="text-[#99b5a8] hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                                  title="Remove from saved"
                                  aria-label={`Remove ${property.title} from saved`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <h4 className="text-xs sm:text-sm font-serif font-bold text-[#163a34] line-clamp-1 group-hover:text-[#b47a3c] transition-colors mt-0.5">
                                <Link href={`/property/${property.slug}`} onClick={closeWishlist}>
                                  {property.title}
                                </Link>
                              </h4>

                              <p className="text-[11px] text-[#6e8a7d] flex items-center gap-1 font-medium mt-0.5 line-clamp-1">
                                <MapPin className="w-3 h-3 shrink-0 text-[#829e92]" />
                                <span>{property.locality}</span>
                              </p>
                            </div>

                            {/* Specs */}
                            <div className="flex items-center gap-2.5 text-[10.5px] text-[#6e8a7d] font-medium pt-1 border-t border-[#f0f4ef] mt-1.5">
                              <span className="flex items-center gap-1">
                                <Bed className="w-3 h-3 text-[#829e92]" />
                                <span>{property.bhk} BHK</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Maximize className="w-3 h-3 text-[#829e92]" />
                                <span>{property.areaDisplayCustom || formatSqFt(property.carpetAreaSqFt)}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Quick Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t border-[#f0f4ef]">
                          <Link
                            href={`/property/${property.slug}`}
                            onClick={closeWishlist}
                            className="flex-1 bg-[#f4f7f3] hover:bg-[#eaf1e9] text-[#1a4332] font-semibold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center"
                          >
                            <span>View details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>

                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1a4332] hover:bg-[#123325] text-white font-semibold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
                            title="Consult on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3 fill-current" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer Actions (When properties are saved) */}
              {wishlistProperties.length > 0 && (
                <div className="bg-white p-4 border-t border-[#e3ebe2] space-y-2 shrink-0 shadow-lg">
                  {/* WhatsApp consultation for ALL saved properties */}
                  <button
                    type="button"
                    onClick={handleConsultAllWhatsApp}
                    className="w-full bg-[#1a4332] hover:bg-[#123325] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-current text-emerald-400" />
                    <span>Enquire on All {wishlistCount} via WhatsApp</span>
                  </button>

                  {/* Share Wishlist button */}
                  <button
                    type="button"
                    onClick={handleShareWishlist}
                    className="w-full bg-[#f4f7f3] hover:bg-[#eaf1e9] text-[#1a4332] font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#dae6d8]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">List copied to clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#b47a3c]" />
                        <span>Share My Saved Shortlist</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
