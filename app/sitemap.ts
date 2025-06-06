import { getProducts, getCategories, getBrands } from "@/lib/supabase/products";
import { MetadataRoute } from "next";

/**
 * Genera un sitemap dinámico para el sitio
 * @returns Sitemap en formato compatible con Next.js
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mascolor.com";

  // Páginas estáticas
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/donde-comprar`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Obtener productos
  const productsResult = await getProducts({});
  const products = Array.isArray(productsResult)
    ? productsResult
    : productsResult && "data" in productsResult
    ? productsResult.data
    : [];

  const productPages = products.map((product: any) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Obtener categorías
  const categories = await getCategories();
  const categoryPages = categories.map((category: any) => ({
    url: `${baseUrl}/productos?categoria=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Obtener marcas
  const brands = await getBrands();
  const brandPages = brands.map((brand: any) => ({
    url: `${baseUrl}/productos?marca=${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages];
}
