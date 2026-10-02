'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Property, LeadEnquiry } from '@/types/property';
import Navbar from '@/components/Navbar';
import PropertyDetail from '@/components/PropertyDetail';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import BrandingSettingsModal from '@/components/BrandingSettingsModal';
import { useAuth } from '@/context/AuthContext';
import { generatePropertyJsonLd, getPropertyCanonicalUrl } from '@/utils/seo';

interface PropertyDetailPageClientProps {
  property: Property;
}

export default function PropertyDetailPageClient({ property }: PropertyDetailPageClientProps) {
  const router = useRouter();
  const { user, role, isAuthenticated, openLoginModal } = useAuth();

  // Enquiry modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProperty, setModalProperty] = useState<Property | null>(null);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);

  const jsonLd = generatePropertyJsonLd(property);
  const canonicalUrl = getPropertyCanonicalUrl(property.slug);

  // Canonical slug redirect history fix:
  // If the page was loaded with an unformatted slug, property ID, or non-canonical casing,
  // use router.replace() instead of router.push() to prevent adding an extra intermediate step to history.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canonicalPath = `/property/${property.slug}`;
      if (window.location.pathname !== canonicalPath) {
        router.replace(canonicalPath);
      }
    }
  }, [property.slug, router]);

  const handleOpenEnquiry = (prop?: Property | null) => {
    setModalProperty(prop || property);
    setIsModalOpen(true);
  };

  const handleLeadSubmit = (leadData: {
    propertyId: string;
    leadName: string;
    leadPhone: string;
    leadEmail?: string;
    message: string;
    preferredContact?: 'whatsapp' | 'call';
    scheduledDate?: string;
  }) => {
    // Lead successfully submitted
    setIsModalOpen(false);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf6] text-[#163a34] font-sans overflow-x-hidden w-full max-w-[100vw]">
      {/* Schema.org JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Navbar */}
      <Navbar
        currentRole="visitor"
        onRoleChange={() => router.push('/')}
        onNavigateHome={() => router.push('/')}
        onOpenEnquiry={() => handleOpenEnquiry(property)}
        onOpenBrandingModal={() => {
          if (isAuthenticated && (role === 'admin' || role === 'agent')) {
            setIsBrandingModalOpen(true);
          }
        }}
      />

      {/* Main Property Detail */}
      <main className="flex-1">
        <PropertyDetail
          property={property}
          onBack={handleBack}
          onOpenEnquiry={handleOpenEnquiry}
        />
      </main>

      {/* Footer */}
      <Footer customLogoUrl="/images/samsher-logo.jpg" />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={modalProperty}
        onSubmitLead={handleLeadSubmit}
      />

      {/* Branding Settings Modal for Agent / Admin */}
      <BrandingSettingsModal
        isOpen={isBrandingModalOpen}
        currentLogoUrl="/images/samsher-logo.jpg"
        currentHeroUrl="/images/luxury-interior-cove.jpg"
        onClose={() => setIsBrandingModalOpen(false)}
        onSaveBranding={() => setIsBrandingModalOpen(false)}
        onResetBranding={() => setIsBrandingModalOpen(false)}
      />
    </div>
  );
}
