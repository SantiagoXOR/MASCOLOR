import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase/products";
import { ProductDetailPage } from "./page-client";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generar metadata dinámico para SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: "Producto no encontrado - +COLOR",
        description: "El producto que buscas no está disponible.",
      };
    }

    const title = `${product.name} - ${product.brand?.name || ""} | +COLOR`;
    const description =
      product.description ||
      `${product.name} de ${
        product.brand?.name || "nuestra marca"
      }. Descubre nuestros productos de alta calidad para tus proyectos.`;
    const imageUrl = product.image_url.startsWith("http")
      ? product.image_url
      : `${process.env.NEXT_PUBLIC_SITE_URL || "https://mascolor.vercel.app"}${
          product.image_url
        }`;

    return {
      title,
      description,
      keywords: [
        product.name,
        product.brand?.name,
        product.category?.name,
        "pintura",
        "revestimiento",
        "+COLOR",
        "MASCOLOR",
      ]
        .filter(Boolean)
        .join(", "),
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
        type: "website",
        siteName: "+COLOR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/productos/${product.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generando metadata:", error);
    return {
      title: "Producto - +COLOR",
      description:
        "Descubre nuestros productos de alta calidad para tus proyectos.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    return <ProductDetailPage product={product} />;
  } catch (error) {
    console.error("Error cargando producto:", error);
    notFound();
  }
}
