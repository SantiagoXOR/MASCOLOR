"use client";

import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubtleButton } from "@/components/ui/subtle-button";
import { ProductBadge } from "@/components/ui/product-badge";
import { ProductIcon } from "@/components/ui/product-icon";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

/**
 * Componente reutilizable para mostrar una tarjeta de producto
 * @param product Datos del producto a mostrar
 * @param onClick Función a ejecutar al hacer clic en el botón "Ver detalles"
 */
// Función para registrar información de depuración solo en desarrollo
const logProductDebug = (message: string, data: Record<string, any> = {}) => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "%c[ProductCard Debug]%c " + message,
      "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
      "color: #870064; font-weight: bold;",
      data
    );
  }
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  // Registrar información del producto
  logProductDebug("Renderizando ProductCard", {
    id: product.id,
    name: product.name,
    image_url: product.image_url,
    asset_id: product.asset_id,
    category: product.category?.name,
    brand: product.brand?.name,
  });

  // Depuración adicional: Verificar si el producto tiene todas las propiedades necesarias
  if (
    !product.id ||
    !product.name ||
    !product.image_url ||
    !product.category ||
    !product.brand
  ) {
    logProductDebug("⚠️ Producto con propiedades faltantes", {
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      category: product.category?.name,
      brand: product.brand?.name,
    });
  }

  // Verificar si la imagen está definida
  const hasValidImage = !!product.image_url;
  const fallbackImage = "/images/products/placeholder.jpg";

  // Determinar la URL de la imagen a usar
  let imageUrl = fallbackImage;
  // Mantener un registro de formatos alternativos para intentar si falla la carga
  const alternativeFormats: string[] = [];

  if (hasValidImage) {
    if (product.asset_id) {
      // Si tiene asset_id, usar WebP como formato principal (más eficiente)
      imageUrl = `/assets/images/products/${product.asset_id}/original.webp`;

      // Reducir la cantidad de formatos alternativos para mejorar rendimiento
      // Solo usar JPG como alternativa principal y placeholder como último recurso
      alternativeFormats.push(
        `/assets/images/products/${product.asset_id}/original.jpg`,
        `/assets/images/products/${product.asset_id}/placeholder.webp`
      );

      logProductDebug("Usando imagen de asset", {
        id: product.id,
        name: product.name,
        asset_id: product.asset_id,
        imageUrl,
      });
    } else {
      // Si no tiene asset_id, usar la URL original normalizada
      imageUrl = product.image_url;

      // Si la URL no comienza con http:// o https:// o /, añadir /
      if (
        !imageUrl.startsWith("http://") &&
        !imageUrl.startsWith("https://") &&
        !imageUrl.startsWith("/")
      ) {
        imageUrl = "/" + imageUrl;
      }

      logProductDebug("Usando imagen original", {
        id: product.id,
        name: product.name,
        imageUrl,
      });
    }
  } else {
    logProductDebug("Usando imagen de fallback", {
      id: product.id,
      name: product.name,
      fallbackImage,
    });
  }

  // Detectar si es un dispositivo móvil o de bajo rendimiento
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  useEffect(() => {
    // Detectar dispositivos móviles o de bajo rendimiento
    const isMobile = window.innerWidth < 768;
    const isLowCPU = navigator.hardwareConcurrency <= 4;

    // La propiedad deviceMemory no está disponible en todos los navegadores
    // y no está incluida en el tipo Navigator de TypeScript
    const deviceMemory = (navigator as any).deviceMemory;
    const isLowMemory = deviceMemory && deviceMemory < 4;

    setIsLowPerformanceDevice(isMobile || isLowCPU || Boolean(isLowMemory));
  }, []);

  // Renderizar versión optimizada para dispositivos de bajo rendimiento
  if (isLowPerformanceDevice) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-0 group bg-white/80 backdrop-blur-sm h-full flex flex-col rounded-lg">
        <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2 right-2 z-20">
              <ProductBadge type={product.badge} />
            </div>
          )}

          {/* Icon */}
          {product.icon && (
            <div className="absolute bottom-2 left-2 z-20">
              <ProductIcon type={product.icon} />
            </div>
          )}

          {/* Brand logo */}
          {product.brand && (
            <div className="absolute bottom-2 right-2 z-30">
              {logProductDebug("Renderizando logo de marca", {
                brand: product.brand?.name,
                slug: product.brand?.slug,
                logo_url: product.brand?.logo_url,
                fallback: `/images/logos/${product.brand?.slug}.svg`,
              })}
              <div className="h-8 bg-white shadow-md rounded-md flex items-center justify-center px-2 py-1 border border-gray-100 z-10">
                {/* Usar una imagen estática según el slug de la marca con img en lugar de Image */}
                {product.brand.slug === "premium" && (
                  <img
                    src="/images/logos/premium.svg"
                    alt="Logo Premium"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "expression" && (
                  <img
                    src="/images/logos/expression.svg"
                    alt="Logo Expression"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "facilfix" && (
                  <img
                    src="/images/logos/facilfix.svg"
                    alt="Logo Facilfix"
                    width={60}
                    height={20}
                    className="object-contain max-h-6 scale-75"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "ecopainting" && (
                  <img
                    src="/images/logos/ecopainting.svg"
                    alt="Logo Ecopainting"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "newhouse" && (
                  <img
                    src="/images/logos/newhouse.svg"
                    alt="Logo Newhouse"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {![
                  "premium",
                  "expression",
                  "facilfix",
                  "ecopainting",
                  "newhouse",
                ].includes(product.brand.slug) && (
                  <img
                    src={
                      product.brand.logo_url ||
                      `/images/logos/${product.brand.slug}.svg`
                    }
                    alt={`Logo ${product.brand.name}`}
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                    onError={(e) => {
                      const imgElement = e.currentTarget as HTMLImageElement;
                      imgElement.src = "/images/logos/placeholder.svg";
                      logProductDebug(
                        "Error al cargar logo de marca, usando placeholder",
                        {
                          brand: product.brand?.name,
                          originalSrc:
                            product.brand?.logo_url ||
                            `/images/logos/${product.brand?.slug}.svg`,
                        }
                      );
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Product image */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative w-[85%] h-[85%]">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain drop-shadow-lg"
                style={{ objectFit: "contain" }}
                priority={
                  product.badge === "bestseller" || product.badge === "new"
                }
                onError={(e) => {
                  const imgElement = e.currentTarget as HTMLImageElement;
                  if (alternativeFormats.length > 0) {
                    const nextFormat = alternativeFormats.shift();
                    if (nextFormat) {
                      imgElement.src = nextFormat;
                      return;
                    }
                  }
                  imgElement.src = fallbackImage;
                }}
              />
            </div>
          </div>
        </div>

        <CardHeader className="pb-0 pt-1">
          <CardTitle className="text-sm text-mascolor-dark group-hover:text-mascolor-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="py-0 flex-grow">
          <p className="text-mascolor-gray-600 text-xs line-clamp-2">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="flex justify-center pt-0 pb-1 mt-auto">
          <SubtleButton
            className="text-xs px-2 py-0.5 hover:bg-mascolor-primary/10 w-full text-center"
            onClick={onClick}
          >
            Ver detalles
          </SubtleButton>
        </CardFooter>
      </Card>
    );
  }

  // Versión con animaciones para dispositivos de alto rendimiento
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-0 group bg-white/80 backdrop-blur-sm h-full flex flex-col rounded-lg">
        <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2 right-2 z-20">
              <ProductBadge type={product.badge} />
            </div>
          )}

          {/* Icon */}
          {product.icon && (
            <div className="absolute bottom-2 left-2 z-20">
              <ProductIcon type={product.icon} />
            </div>
          )}

          {/* Brand logo */}
          {product.brand && (
            <div className="absolute bottom-2 right-2 z-30">
              {logProductDebug("Renderizando logo de marca", {
                brand: product.brand?.name,
                slug: product.brand?.slug,
                logo_url: product.brand?.logo_url,
                fallback: `/images/logos/${product.brand?.slug}.svg`,
              })}
              <div className="h-8 bg-white shadow-md rounded-md flex items-center justify-center px-2 py-1 border border-gray-100 z-10">
                {/* Usar una imagen estática según el slug de la marca con img en lugar de Image */}
                {product.brand.slug === "premium" && (
                  <img
                    src="/images/logos/premium.svg"
                    alt="Logo Premium"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "expression" && (
                  <img
                    src="/images/logos/expression.svg"
                    alt="Logo Expression"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "facilfix" && (
                  <img
                    src="/images/logos/facilfix.svg"
                    alt="Logo Facilfix"
                    width={60}
                    height={20}
                    className="object-contain max-h-6 scale-75"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "ecopainting" && (
                  <img
                    src="/images/logos/ecopainting.svg"
                    alt="Logo Ecopainting"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {product.brand.slug === "newhouse" && (
                  <img
                    src="/images/logos/newhouse.svg"
                    alt="Logo Newhouse"
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                  />
                )}
                {![
                  "premium",
                  "expression",
                  "facilfix",
                  "ecopainting",
                  "newhouse",
                ].includes(product.brand.slug) && (
                  <img
                    src={
                      product.brand.logo_url ||
                      `/images/logos/${product.brand.slug}.svg`
                    }
                    alt={`Logo ${product.brand.name}`}
                    width={60}
                    height={20}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                    }}
                    onError={(e) => {
                      const imgElement = e.currentTarget as HTMLImageElement;
                      imgElement.src = "/images/logos/placeholder.svg";
                      logProductDebug(
                        "Error al cargar logo de marca, usando placeholder",
                        {
                          brand: product.brand?.name,
                          originalSrc:
                            product.brand?.logo_url ||
                            `/images/logos/${product.brand?.slug}.svg`,
                        }
                      );
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Hover effect */}
          <div className="absolute w-[90%] h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-mascolor-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-[1]"></div>

          {/* Product image */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* Debug */}
            {logProductDebug("Renderizando imagen", {
              image_url: imageUrl,
              hasValidImage,
            })}
            <div className="relative w-[85%] h-[85%]">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                style={{ objectFit: "contain" }}
                priority={
                  product.badge === "bestseller" || product.badge === "new"
                }
                onError={(e) => {
                  logProductDebug(
                    "Error al cargar imagen, intentando con formatos alternativos",
                    {
                      fallback: fallbackImage,
                      originalSrc: imageUrl,
                      alternativeFormats,
                    }
                  );

                  const imgElement = e.currentTarget as HTMLImageElement;

                  // Intentar con formatos alternativos si hay disponibles
                  if (alternativeFormats.length > 0) {
                    // Tomar el primer formato alternativo
                    const nextFormat = alternativeFormats.shift();

                    if (nextFormat) {
                      logProductDebug("Intentando con formato alternativo", {
                        nextFormat,
                        remainingFormats: alternativeFormats.length,
                      });

                      // Cambiar la fuente de la imagen al siguiente formato
                      imgElement.src = nextFormat;
                      return; // Salir para dar oportunidad al nuevo formato
                    }
                  }

                  // Si no hay más formatos alternativos o no es un asset, usar el fallback
                  logProductDebug(
                    "No hay más formatos para intentar, usando fallback",
                    {
                      fallback: fallbackImage,
                    }
                  );
                  imgElement.src = fallbackImage;
                }}
              />
            </div>
          </div>
        </div>

        <CardHeader className="pb-0 pt-1">
          <CardTitle className="text-sm text-mascolor-dark group-hover:text-mascolor-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="py-0 flex-grow">
          <p className="text-mascolor-gray-600 text-xs line-clamp-2">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="flex justify-center pt-0 pb-1 mt-auto">
          <SubtleButton
            className="text-xs px-2 py-0.5 hover:bg-mascolor-primary/10 w-full text-center"
            onClick={onClick}
          >
            Ver detalles
          </SubtleButton>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
