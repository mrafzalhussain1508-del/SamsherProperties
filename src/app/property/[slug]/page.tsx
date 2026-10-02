import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_PROPERTIES } from '@/data/mockProperties';
import { 
  getPropertySeoTitle, 
  getPropertySeoDescription, 
  getPropertyCanonicalUrl, 
  SITE_DOMAIN 
} from '@/utils/seo';
import PropertyDetailPageClient from './PropertyDetailPageClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return INITIAL_PROPERTIES.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = INITIAL_PROPERTIES.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase()
  );

  if (!property) {
    return {
      title: 'Property Not Found | Samsher Properties',
      description: 'The requested luxury residence could not be found or has been relocated.',
    };
  }

  const title = getPropertySeoTitle(property);
  const description = getPropertySeoDescription(property);
  const canonical = getPropertyCanonicalUrl(property.slug);
  const primaryImage =
    property.images && property.images.length > 0
      ? (typeof property.images[0] === 'string' ? property.images[0] : (property.images[0] as any).url)
      : '/images/greenfield-luxury-living.jpg';

  const absoluteImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `${SITE_DOMAIN}${primaryImage.startsWith('/') ? '' : '/'}${primaryImage}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Samsher Properties',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
    keywords: [
      property.title,
      `${property.bhk} BHK Apartment`,
      property.locality,
      property.cityName,
      'Samsher Properties',
      'RERA verified luxury apartments',
      'Faridabad real estate'
    ],
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = INITIAL_PROPERTIES.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase()
  );

  if (!property) {
    notFound();
  }

  return <PropertyDetailPageClient property={property} />;
}
