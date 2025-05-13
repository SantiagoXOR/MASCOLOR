import { MetadataRoute } from 'next';

/**
 * Genera un archivo robots.txt dinámico
 * @returns Configuración de robots en formato compatible con Next.js
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mascolor.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
