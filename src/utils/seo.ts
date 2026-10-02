import { Property } from '@/types/property';
import { formatIndianCurrency } from '@/utils/formatters';

export const SITE_DOMAIN = 'https://samsherproperties.in';

/**
 * Generates the SEO page title formatted as:
 * "[Title] - [BHK] in [Location] | Samsher Properties"
 */
export function getPropertySeoTitle(property: Property): string {
  const location = property.locality
    ? `${property.locality}, ${property.cityName}`
    : property.cityName || 'Faridabad';
  return `${property.title} - ${property.bhk} BHK in ${location} | Samsher Properties`;
}

/**
 * Generates the SEO meta description
 */
export function getPropertySeoDescription(property: Property): string {
  const price = property.priceDisplayCustom || formatIndianCurrency(property.priceInInr, property.purpose);
  const cleanDesc = property.description ? property.description.replace(/\s+/g, ' ').trim() : '';
  const snippet = cleanDesc.length > 150 ? `${cleanDesc.slice(0, 147)}...` : cleanDesc;
  return `${snippet} Price: ${price}. Verified RERA: ${property.reraNumber}. Call Samsher Properties: +91 70110 07968.`;
}

/**
 * Generates the clean canonical URL
 */
export function getPropertyCanonicalUrl(slug: string): string {
  return `${SITE_DOMAIN}/property/${slug}`;
}

/**
 * Generates JSON-LD Structured Data Schema (RealEstateListing & SingleFamilyResidence / Product)
 */
export function generatePropertyJsonLd(property: Property) {
  const primaryImage =
    property.images && property.images.length > 0
      ? (typeof property.images[0] === 'string' ? property.images[0] : (property.images[0] as any).url)
      : '/images/greenfield-luxury-living.jpg';

  const fullImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `${SITE_DOMAIN}${primaryImage.startsWith('/') ? '' : '/'}${primaryImage}`;

  const allImages = (property.images || []).map((img: any) => {
    const url = typeof img === 'string' ? img : img.url;
    return url.startsWith('http') ? url : `${SITE_DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`;
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: getPropertySeoTitle(property),
    description: getPropertySeoDescription(property),
    url: getPropertyCanonicalUrl(property.slug),
    image: allImages.length > 0 ? allImages : [fullImageUrl],
    datePosted: property.createdAt || '2026-03-30T10:00:00Z',
    mainEntity: {
      '@type': property.propertyType === 'villa' ? 'SingleFamilyResidence' : 'Apartment',
      name: property.title,
      description: property.description,
      numberOfRooms: property.bhk,
      numberOfBedrooms: property.bhk,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.carpetAreaSqFt,
        unitCode: 'FTK', // Square Foot
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.fullAddress || property.locality,
        addressLocality: property.locality,
        addressRegion: property.cityName,
        postalCode: property.pincode || '121009',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '28.4089',
        longitude: '77.3178',
      },
    },
    offers: {
      '@type': 'Offer',
      price: property.priceInInr,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: getPropertyCanonicalUrl(property.slug),
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'RealEstateAgent',
        name: property.agent?.name || 'Samsher Properties',
        telephone: property.agent?.phone || '+917011007968',
        image: fullImageUrl,
        url: SITE_DOMAIN,
      },
    },
  };
}
