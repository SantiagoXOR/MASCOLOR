# Mejoras de SEO en +COLOR

Este documento detalla las mejoras implementadas para optimizar el SEO en el proyecto +COLOR.

## Configuración de SEO

Se ha creado un archivo de configuración centralizado para el SEO:

```typescript
// config/seo.ts
export const siteConfig = {
  name: "+COLOR",
  description: "Pinturas y revestimientos de alta calidad para tus proyectos",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.mascolor.com",
  ogImage: "/images/og-image.jpg",
  keywords: [
    "pinturas",
    "revestimientos",
    "decoración",
    "hogar",
    // ...
  ],
  // ...
};
```

## Metadatos Dinámicos

Se ha implementado un componente para generar metadatos dinámicos:

```typescript
// components/seo/metadata.tsx
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  type = 'website',
  canonical,
  noindex = false,
}: SEOProps): Metadata {
  // Título completo con el nombre del sitio
  const fullTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  
  // ...
  
  return {
    title: fullTitle,
    description: metaDescription,
    keywords: metaKeywords.join(', '),
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: { canonical: metaCanonical },
    openGraph: { /* ... */ },
    twitter: { /* ... */ },
  };
}
```

## Implementación en Páginas

Los metadatos dinámicos se han implementado en las páginas principales:

```typescript
// app/page.tsx
export const metadata: Metadata = generateMetadata({
  title: 'Pinturas y revestimientos de alta calidad',
  description: 'Descubre nuestra línea de pinturas y revestimientos de alta calidad para tus proyectos de construcción y decoración.',
  keywords: ['pinturas', 'revestimientos', 'decoración', 'hogar'],
  canonical: '/',
});
```

## Sitemap Dinámico

Se ha implementado un sitemap dinámico que se genera automáticamente:

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mascolor.com';
  
  // Páginas estáticas
  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    // ...
  ];
  
  // Obtener productos, categorías y marcas de Supabase
  const products = await getProducts({});
  const productPages = products.map((product) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  
  // ...
  
  return [...staticPages, ...productPages, ...categoryPages, ...brandPages];
}
```

## Archivo Robots.txt

Se ha implementado un archivo robots.txt dinámico:

```typescript
// app/robots.ts
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
```

## Beneficios de las Mejoras

1. **Mejor indexación**:
   - Sitemap dinámico que incluye todas las páginas del sitio
   - Archivo robots.txt que guía a los motores de búsqueda

2. **Mejor visibilidad en resultados de búsqueda**:
   - Metadatos optimizados para cada página
   - Palabras clave relevantes para el sector

3. **Mejor experiencia en redes sociales**:
   - Metadatos Open Graph para compartir en redes sociales
   - Metadatos Twitter Card para compartir en Twitter

4. **Mejor estructura de datos**:
   - URLs canónicas para evitar contenido duplicado
   - Jerarquía clara de páginas

5. **Mejor mantenibilidad**:
   - Configuración centralizada para facilitar actualizaciones
   - Generación dinámica de metadatos

## Próximos Pasos

1. Implementar Schema.org para productos y categorías
2. Mejorar la estructura de URLs para categorías y productos
3. Implementar la funcionalidad de búsqueda
