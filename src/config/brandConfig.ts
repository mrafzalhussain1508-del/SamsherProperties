/**
 * BRAND & ASSET CONFIGURATION
 * 
 * Configured with Samsher Properties official logo and banner.
 */

export interface BrandConfig {
  brandName: {
    first: string;   // "Samsher"
    second: string;  // "Properties"
  };
  tagline: string;
  announcementText: string;
  logo: {
    useImage: boolean;
    imageUrl: string; 
    altText: string;
  };
  hero: {
    imageUrl: string;
    badgeTitle: string;
    badgeSubtitle: string;
  };
  contact: {
    phone: string;
    whatsappNumber: string;
    email?: string;
    whatsappPrefillMessage: string;
  };
}

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  brandName: {
    first: 'Samsher',
    second: 'Properties',
  },
  tagline: 'A home that feels like yours.',
  announcementText: 'A more thoughtful way to find your place.',
  logo: {
    useImage: true,
    imageUrl: '/images/samsher-logo.jpg',
    altText: 'Samsher Properties',
  },
  hero: {
    imageUrl: '/images/samsher-hero-banner.jpg',
    badgeTitle: 'Your next chapter starts here',
    badgeSubtitle: 'Spaces worth coming home to',
  },
  contact: {
    phone: '+917011007968',
    whatsappNumber: '917011007968',
    email: 'Samsherproperties653@gmail.com',
    whatsappPrefillMessage: 'Hi Samsher Properties, I would like to explore residential and commercial properties.',
  },
};
