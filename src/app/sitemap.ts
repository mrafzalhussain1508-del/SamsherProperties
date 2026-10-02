import { MetadataRoute } from 'next';
import { INITIAL_PROPERTIES } from '@/data/mockProperties';
import { SITE_DOMAIN } from '@/utils/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const propertyUrls: MetadataRoute.Sitemap = INITIAL_PROPERTIES.map((prop) => ({
    url: `${SITE_DOMAIN}/property/${prop.slug}`,
    lastModified: new Date(prop.createdAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: SITE_DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...propertyUrls,
  ];
}
