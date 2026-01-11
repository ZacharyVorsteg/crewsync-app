import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/schedule/', '/crew/', '/sites/', '/mobile/'],
    },
    sitemap: 'https://crewsync.app/sitemap.xml',
  }
}
