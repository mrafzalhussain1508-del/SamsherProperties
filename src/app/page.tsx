'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Property, LeadEnquiry, UserRole } from '@/types/property';
import { INITIAL_PROPERTIES, INITIAL_LEADS } from '@/data/mockProperties';
import Navbar from '@/components/Navbar';
import SearchHero, { FilterState } from '@/components/SearchHero';
import PropertyCard from '@/components/PropertyCard';
import PropertyDetail from '@/components/PropertyDetail';
import AgentDashboard from '@/components/AgentDashboard';
import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import BrandingSettingsModal from '@/components/BrandingSettingsModal';
import ScrollReveal from '@/components/ScrollReveal';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from '@/components/AccessDenied';
import { 
  ArrowRight, 
  MessageSquare, 
  Phone,
  ExternalLink,
  Play
} from 'lucide-react';

export default function Home() {
  const { user, role, isAuthenticated, openLoginModal } = useAuth();

  // State Management
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Custom Asset Placeholders (Logo & Hero Image)
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('/images/samsher-logo.jpg');
  const [customHeroUrl, setCustomHeroUrl] = useState<string>('/images/luxury-interior-cove.jpg');
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);

  // Load custom branding from localStorage if previously uploaded
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('samsher_custom_logo');
      const savedHero = localStorage.getItem('samsher_custom_hero');
      if (savedLogo) {
        setCustomLogoUrl(savedLogo);
      } else {
        setCustomLogoUrl('/images/samsher-logo.jpg');
      }
      if (savedHero && !savedHero.startsWith('data:image')) {
        setCustomHeroUrl(savedHero);
      } else {
        setCustomHeroUrl('/images/luxury-interior-cove.jpg');
      }
    } catch {
      // LocalStorage not available or SSR
    }
  }, []);

  const handleSaveBranding = (newLogo: string, newHero: string) => {
    setCustomLogoUrl(newLogo);
    setCustomHeroUrl(newHero);
    try {
      localStorage.setItem('samsher_custom_logo', newLogo);
      localStorage.setItem('samsher_custom_hero', newHero);
    } catch {}
  };

  const handleResetBranding = () => {
    setCustomLogoUrl('/images/samsher-logo.jpg');
    setCustomHeroUrl('/images/luxury-interior-cove.jpg');
    try {
      localStorage.removeItem('samsher_custom_logo');
      localStorage.removeItem('samsher_custom_hero');
    } catch {}
  };

  // Data Store with LocalStorage synchronization
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<LeadEnquiry[]>(INITIAL_LEADS);

  // Synchronize properties state with LocalStorage and real-time reassignment events
  useEffect(() => {
    try {
      const stored = localStorage.getItem('samsher_properties_v1');
      if (stored) {
        setProperties(JSON.parse(stored));
      } else {
        localStorage.setItem('samsher_properties_v1', JSON.stringify(INITIAL_PROPERTIES));
      }
    } catch (e) {
      console.error('Error loading properties from storage:', e);
    }

    const handlePropertiesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Property[]>;
      if (customEvent.detail) {
        setProperties(customEvent.detail);
      } else {
        try {
          const stored = localStorage.getItem('samsher_properties_v1');
          if (stored) setProperties(JSON.parse(stored));
        } catch {}
      }
    };

    window.addEventListener('samsher_properties_updated', handlePropertiesUpdated);
    return () => {
      window.removeEventListener('samsher_properties_updated', handlePropertiesUpdated);
    };
  }, []);

  // Enquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProperty, setModalProperty] = useState<Property | null>(null);

  // Search & Filter State
  const [filters, setFilters] = useState<FilterState>({
    purpose: 'sale',
    city: 'All India',
    searchQuery: '',
    bhk: null,
    budgetRange: 'all',
    propertyType: 'all',
  });

  // URL Query and Clean Slug Synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const queryParam = searchParams.get('q');
      if (queryParam) {
        setFilters((prev) => ({ ...prev, searchQuery: queryParam }));
      }

      const handlePopState = () => {
        if (window.location.pathname === '/' || window.location.pathname === '') {
          setSelectedProperty(null);
        } else if (window.location.pathname.startsWith('/property/')) {
          const slug = window.location.pathname.replace('/property/', '');
          const match = properties.find((p) => p.slug === slug || p.id === slug);
          if (match) setSelectedProperty(match);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [properties]);

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    if (typeof window !== 'undefined') {
      window.history.pushState({ slug: prop.slug }, '', `/property/${prop.slug}`);
    }
  };

  const handleBackToHome = () => {
    setSelectedProperty(null);
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/property/')) {
      window.history.pushState(null, '', '/');
    }
  };

  // Open Enquiry Modal
  const handleOpenEnquiry = (property?: Property | null) => {
    setModalProperty(property || null);
    setIsModalOpen(true);
  };

  // Direct Lead Submission Handler
  const handleLeadSubmit = (leadData: {
    propertyId: string;
    leadName: string;
    leadPhone: string;
    leadEmail?: string;
    message: string;
    preferredContact?: 'whatsapp' | 'call';
    scheduledDate?: string;
  }) => {
    const propertyObj = properties.find((p) => p.id === leadData.propertyId);

    const newLead: LeadEnquiry = {
      id: `lead-${Date.now()}`,
      propertyId: leadData.propertyId,
      propertyTitle: propertyObj ? propertyObj.title : 'General Consultation Request',
      propertyPrice: propertyObj ? propertyObj.priceInInr : 0,
      leadName: leadData.leadName,
      leadPhone: leadData.leadPhone,
      leadEmail: leadData.leadEmail,
      message: leadData.message,
      preferredContact: leadData.preferredContact || 'whatsapp',
      scheduledDate: leadData.scheduledDate,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
  };

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (prop.approvalStatus !== 'approved' && prop.approvalStatus !== 'published' && prop.approvalStatus !== 'live') return false;

      if (filters.city !== 'All India') {
        const selectedCity = filters.city.toLowerCase();
        const propCity = prop.cityName.toLowerCase();
        const isGurgaonMatch = (selectedCity === 'gurgaon' || selectedCity === 'gurugram') && 
                              (propCity === 'gurgaon' || propCity === 'gurugram');
        if (propCity !== selectedCity && !isGurgaonMatch) {
          return false;
        }
      }

      if (filters.bhk !== null) {
        if (filters.bhk >= 4) {
          if (prop.bhk < 4) return false;
        } else if (prop.bhk !== filters.bhk) {
          return false;
        }
      }

      if (filters.propertyType !== 'all' && prop.propertyType !== filters.propertyType) {
        return false;
      }

      if (filters.budgetRange !== 'all') {
        const [min, max] = filters.budgetRange.split('-').map(Number);
        if (prop.priceInInr < min || prop.priceInInr > max) {
          return false;
        }
      }

      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesLocality = prop.locality.toLowerCase().includes(q);
        const matchesCity = prop.cityName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocality && !matchesCity) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  // Agent: Add new listing
  const handleAddNewProperty = (newProp: Partial<Property>) => {
    const fullProp: Property = {
      id: `prop-${Date.now()}`,
      slug: (newProp.title || 'new-property').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newProp.title || 'Untitled Property',
      agentId: (newProp.agentId as string) || user?.id || 'agent-curr',
      ownerId: (newProp.ownerId as string) || user?.id || 'agent-curr',
      description: newProp.description || '',
      purpose: newProp.purpose || 'sale',
      propertyType: newProp.propertyType || 'apartment',
      priceInInr: newProp.priceInInr || 5000000,
      pricePerSqFt: newProp.pricePerSqFt || 5000,
      bhk: newProp.bhk || 2,
      bathrooms: 2,
      balconies: 1,
      carpetAreaSqFt: newProp.carpetAreaSqFt || 900,
      floorNumber: 5,
      totalFloors: 14,
      furnishing: 'semi_furnished',
      facing: newProp.facing || 'East',
      possessionStatus: newProp.possessionStatus || 'Ready to Move',
      reraNumber: newProp.reraNumber || 'PRM/PENDING/2026',
      isReraVerified: true,
      approvalStatus: newProp.approvalStatus || 'approved',
      isFeatured: false,
      cityName: newProp.cityName || 'Faridabad',
      locality: newProp.locality || 'Sector 82',
      fullAddress: newProp.fullAddress || '',
      pincode: '121002',
      amenities: newProp.amenities || ['Power Backup', 'Lift', 'Security'],
      images: newProp.images || [],
      landmarks: newProp.landmarks || [],
      agent: newProp.agent as any,
      createdAt: new Date().toISOString(),
    };

    setProperties((prev) => {
      const updated = [fullProp, ...prev];
      try {
        localStorage.setItem('samsher_properties_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Admin: Approve / Reject
  const handleApproveProperty = (id: string) => {
    setProperties((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, approvalStatus: 'approved' as const } : p));
      try {
        localStorage.setItem('samsher_properties_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRejectProperty = (id: string) => {
    setProperties((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, approvalStatus: 'rejected' as const } : p));
      try {
        localStorage.setItem('samsher_properties_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateLeadStatus = (leadId: string, status: LeadEnquiry['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  };

  // Sync role when authentication state changes
  useEffect(() => {
    if (isAuthenticated && role === 'agent' && currentRole === 'visitor') {
      setCurrentRole('agent');
    } else if (!isAuthenticated && (currentRole === 'agent' || currentRole === 'admin')) {
      setCurrentRole('visitor');
    }
  }, [isAuthenticated, role]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf6] text-[#163a34] font-sans overflow-x-hidden w-full max-w-[100vw]">
      {/* Canonical URL to protect against duplicate content indexing on filtered queries */}
      <link rel="canonical" href="https://samsherproperties.in/" />

      {/* 1. HEADER (Exact match: Logo on left, Hamburger on right, Top announcement strip) */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setSelectedProperty(null);
        }}
        onNavigateHome={() => {
          setSelectedProperty(null);
          setCurrentRole('visitor');
        }}
        onOpenEnquiry={() => handleOpenEnquiry(null)}
        customLogoUrl={customLogoUrl}
        onOpenBrandingModal={() => {
          if (isAuthenticated && (role === 'admin' || role === 'agent')) {
            setIsBrandingModalOpen(true);
          }
        }}
      />

      {/* MAIN VIEW CONTENT (STRICT ROLE-BASED ACCESS CONTROL) */}
      <main className="flex-1 overflow-x-hidden w-full">
        {currentRole === 'agent' ? (
          /* STRICT ACCESS CHECK: Only authenticated agents and admins can access */
          !isAuthenticated || (role !== 'agent' && role !== 'admin') ? (
            <AccessDenied onGoHome={() => setCurrentRole('visitor')} />
          ) : (
            <AgentDashboard
              properties={properties}
              leads={leads}
              onAddNewProperty={handleAddNewProperty}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onViewProperty={(prop) => {
                setSelectedProperty(prop);
                setCurrentRole('visitor');
              }}
            />
          )
        ) : currentRole === 'admin' ? (
          /* STRICT ACCESS CHECK: Only authenticated admins can access */
          !isAuthenticated || role !== 'admin' ? (
            <AccessDenied onGoHome={() => setCurrentRole('visitor')} />
          ) : (
            <AdminPanel
              properties={properties}
              onApproveProperty={handleApproveProperty}
              onRejectProperty={handleRejectProperty}
              onViewProperty={(prop) => {
                setSelectedProperty(prop);
                setCurrentRole('visitor');
              }}
            />
          )
        ) : selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onBack={handleBackToHome}
            onOpenEnquiry={handleOpenEnquiry}
            onSubmitDirectLead={handleLeadSubmit}
          />
        ) : (
          /* MOBILE-FIRST HOMEPAGE WITH RESPONSIVE DESKTOP EXPANSION */
          <div className="pb-28">
            
            {/* HERO SECTION & INTERIOR PROPERTY IMAGE */}
            <SearchHero
              filters={filters}
              onFilterChange={setFilters}
              onSearchSubmit={() => {
                const el = document.getElementById('featured-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              customHeroUrl={customHeroUrl}
            />

            {/* CURATED FOR YOU / FEATURED PROPERTIES (1 col on mobile, 2 on md, 3 on lg) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <section id="featured-section" className="pt-4 pb-8 space-y-6 sm:space-y-8">
                <ScrollReveal delay={0} yOffset={28}>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#b47a3c] tracking-widest uppercase block">
                      CURATED FOR YOU
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#163a34] tracking-tight">
                      Featured properties
                    </h2>
                    <p className="text-xs sm:text-sm text-[#547366]">
                      Explore spaces where your next story could begin.
                    </p>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setFilters({
                            purpose: 'sale',
                            city: 'All India',
                            searchQuery: '',
                            bhk: null,
                            budgetRange: 'all',
                            propertyType: 'all',
                          });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1a4332] hover:text-[#b47a3c] transition-colors cursor-pointer"
                      >
                        <span>View all properties</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Samsher Properties Exclusive Brand Banner */}
                <ScrollReveal delay={80} yOffset={32}>
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#e3d8c8] bg-slate-900 group w-full">
                    <img
                      src="/images/samsher-banner.jpg"
                      alt="Samsher Properties - Specialized in Residential & Commercial Properties"
                      className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>
                </ScrollReveal>

                {/* Property Cards Grid: 1 col on mobile, 2 on md, 3 on lg */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProperties.map((property, idx) => (
                    <ScrollReveal
                      key={property.id}
                      delay={Math.min(idx * 75, 250)}
                      yOffset={32}
                      duration={700}
                    >
                      <PropertyCard
                        property={property}
                        onSelectProperty={handleSelectProperty}
                        onOpenEnquiry={handleOpenEnquiry}
                      />
                    </ScrollReveal>
                  ))}
                </div>

                {/* Preview Disclaimer text */}
                <ScrollReveal delay={60} yOffset={20}>
                  <div className="pt-2 pb-2">
                    <p className="text-[11px] text-[#738f82] leading-relaxed">
                      Illustrative listings for this preview. Property details, prices, verification and RERA numbers must be validated before publication.
                    </p>
                  </div>
                </ScrollReveal>

                {/* 4K YouTube Video Walkthroughs Showcase Banner */}
                <ScrollReveal delay={90} yOffset={32}>
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#234d3d] bg-gradient-to-br from-[#0e2920] via-[#14392c] to-[#1a4435] text-white p-6 sm:p-8 md:p-10 mb-8 mt-2">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
                      <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-[#cc0000] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          <span className="w-3.5 h-3.5 bg-white text-[#cc0000] rounded-full flex items-center justify-center text-[8px] font-black">▶</span>
                          <span>Official YouTube Channel • @samsherproperty</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                          Watch 4K Video Walkthroughs on <span className="text-[#ff5252]">Samsher official</span>
                        </h3>

                        <p className="text-xs sm:text-sm text-[#c1d6cc] leading-relaxed">
                          Step inside our luxury 4 BHK & 5 BHK residences before scheduling your private site visit. Subscribe to our YouTube channel for in-depth interior tours, room-by-room walkthroughs, modular kitchen showcases, and live floor plan analyses in GreenField Colony & South Delhi border.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#a3c4b5]">
                          <span className="flex items-center gap-1.5 font-medium">
                            ✓ 4K Ultra HD Tours
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            ✓ Complete Layout Walkthroughs
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            ✓ Direct Founder Explanations
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                        <a
                          href="https://www.youtube.com/@samsherproperty"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#cc0000] hover:bg-[#b00000] active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2.5 cursor-pointer text-center"
                        >
                          <span className="w-5 h-3.5 bg-white text-[#cc0000] rounded-xs flex items-center justify-center text-[9px] font-black shadow-2xs">▶</span>
                          <span>Subscribe to Samsher official</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                        </a>

                        <a
                          href="https://www.youtube.com/@samsherproperty/videos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/10 hover:bg-white/15 text-[#e0ede7] border border-white/20 font-semibold py-3 px-5 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Latest Property Videos</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Highlight Story Banner: "Home, without the guesswork." */}
                <ScrollReveal delay={100} yOffset={32}>
                  <div className="bg-[#eef3ed] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#e2eae0] shadow-xs">
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] bg-[#dbe5db] w-full">
                      <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                        alt="Serene living room"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-4 right-4 bg-[#1a4332] text-white rounded-2xl p-3 sm:p-4 shadow-lg max-w-[210px] space-y-0.5 border border-[#235842]">
                        <h3 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight">
                          Home,
                        </h3>
                        <p className="text-xs text-[#a9cfbe] font-serif italic">
                          without the guesswork.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

              </section>
            </div>
        </div>
        )}
      </main>

      {/* Footer */}
      <Footer customLogoUrl={customLogoUrl} />

      {/* Instant Lead Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={modalProperty}
        onSubmitLead={handleLeadSubmit}
      />

      {/* Custom Branding Placeholder Modal (Upload Logo & Hero Photo - Authenticated Admin & Agent only) */}
      {isAuthenticated && (role === 'admin' || role === 'agent') && (
        <BrandingSettingsModal
          isOpen={isBrandingModalOpen}
          onClose={() => setIsBrandingModalOpen(false)}
          currentLogoUrl={customLogoUrl}
          currentHeroUrl={customHeroUrl}
          onSaveBranding={handleSaveBranding}
          onResetBranding={handleResetBranding}
        />
      )}

      {/* 4. STICKY BOTTOM BAR (Green WhatsApp + White Call Agent) */}
      {!selectedProperty && currentRole !== 'agent' && currentRole !== 'admin' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#f7faf6]/95 backdrop-blur-md border-t border-[#e1e9df] px-4 py-3 shadow-lg flex items-center gap-3 max-w-xl mx-auto">
          {/* Green WhatsApp Button */}
          <a
            href="https://wa.me/917011007968?text=Hi%20Samsher%20Properties%2C%20I%20am%20interested%20in%20verified%20properties.%20Please%20guide%20me."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#1a4332] hover:bg-[#123325] active:scale-[0.98] text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* White Call Agent Button */}
          <a
            href="tel:+917011007968"
            className="flex-1 bg-white hover:bg-[#f3f7f2] active:scale-[0.98] text-[#1a4332] font-bold py-3 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-[#d8e3d6] shadow-2xs text-center"
          >
            <Phone className="w-4 h-4 text-[#1a4332]" />
            <span>Call Agent</span>
          </a>
        </div>
      )}
    </div>
  );
}
