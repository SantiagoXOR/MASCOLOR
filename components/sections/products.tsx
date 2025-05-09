"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubtleButton } from "@/components/ui/subtle-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProductCarousel,
  ProductCarouselItem,
} from "@/components/ui/product-carousel";
import { ProductBadge } from "@/components/ui/product-badge";
import { ProductIcon } from "@/components/ui/product-icon";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Droplet,
  Home,
  Building,
  Layers,
  Palette,
  Brush,
  Leaf,
  Shield,
  Star,
} from "lucide-react";

// Interfaces para tipado
interface ProductCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  badge?: "new" | "bestseller" | "featured" | "limited";
  brand?: "facilfix" | "ecopainting" | "newhouse" | "premium" | "expression";
  icon?:
    | "interior"
    | "exterior"
    | "pool"
    | "sports"
    | "metal"
    | "wood"
    | "concrete"
    | "waterproof"
    | "thermal"
    | "protective"
    | "eco"
    | "texture";
}

// Datos de ejemplo para productos
const productCategories: ProductCategory[] = [
  { id: "especiales", name: "Especiales", icon: <Droplet size={16} /> },
  { id: "exteriores", name: "Para Exteriores", icon: <Building size={16} /> },
  { id: "interiores", name: "Para Interiores", icon: <Home size={16} /> },
  { id: "recubrimientos", name: "Recubrimientos", icon: <Layers size={16} /> },
];

// Categorías de marcas
const brandCategories: ProductCategory[] = [
  {
    id: "premium",
    name: "Premium",
    icon: <Star size={16} />,
  },
  {
    id: "expression",
    name: "Expression",
    icon: <Palette size={16} />,
  },
  {
    id: "newhouse",
    name: "New House",
    icon: <Brush size={16} />,
  },
  {
    id: "ecopainting",
    name: "EcoPainting",
    icon: <Leaf size={16} />,
  },
  {
    id: "facilfix",
    name: "Facil Fix",
    icon: <Shield size={16} />,
  },
];

const products: Product[] = [
  // EXTERIORES
  {
    id: 1,
    name: "Látex Exterior Premium",
    category: "exteriores",
    description:
      "Pintura de alta calidad para exteriores con máxima resistencia a la intemperie.",
    image: "/images/products/PREMIUM-LATEXEXT.png",
    badge: "bestseller",
    icon: "exterior",
    brand: "premium",
  },
  {
    id: 2,
    name: "Látex Interior Expression",
    category: "exteriores",
    description:
      "Pintura acrílica para interiores con excelente rendimiento y acabado.",
    image: "/images/products/EXPRESSION-LATEX-ACRILICO-INTERIOR-1.png",
    badge: "featured",
    icon: "exterior",
    brand: "expression",
  },
  {
    id: 3,
    name: "Barniz Marino NEW HOUSE",
    category: "exteriores",
    description:
      "Barniz resistente para uso marino con protección UV y contra la humedad.",
    image: "/images/products/NEW-HOUSE-BARNIZ-MARINO.png",
    badge: "new",
    icon: "wood",
    brand: "newhouse",
  },
  {
    id: 4,
    name: "Impregnante NEW HOUSE",
    category: "exteriores",
    description:
      "Protector para maderas exteriores que realza la veta natural.",
    image: "/images/products/NEW-HOUSE-IMPREGNANTE.png",
    brand: "newhouse",
  },
  {
    id: 5,
    name: "Frentes Impermeabilizantes",
    category: "exteriores",
    description:
      "Revestimiento impermeable para frentes con protección contra lluvias.",
    image: "/images/products/PREMIUM-FRENTESIMPERMEABILIZANTES.png",
    brand: "premium",
  },
  {
    id: 6,
    name: "Membrana Líquida Premium",
    category: "exteriores",
    description: "Impermeabilizante elástico para techos y terrazas.",
    image: "/images/products/PREMIUM-MEMBRANA-1.png",
    brand: "premium",
  },
  {
    id: 7,
    name: "Membrana Líquida Expression",
    category: "exteriores",
    description: "Impermeabilizante para techos con excelente elasticidad.",
    image: "/images/products/EXPRESSION-MEMBRANA.png",
    brand: "expression",
  },
  {
    id: 8,
    name: "Membrana EcoPainting",
    category: "exteriores",
    description: "Impermeabilizante ecológico para techos y terrazas.",
    image: "/images/products/ECOPAINTINGMEMBRANA.png",
    brand: "ecopainting",
  },
  {
    id: 9,
    name: "FACIL FIX Exterior Blanco",
    category: "exteriores",
    description: "Adhesivo flexible para revestimientos exteriores.",
    image: "/images/products/FACIL FIX EXTERIOR BLANCO.png",
    brand: "facilfix",
  },
  {
    id: 10,
    name: "FACIL FIX Exterior Gris",
    category: "exteriores",
    description: "Adhesivo cementicio para exteriores de alta resistencia.",
    image: "/images/products/FACIL FIX EXTERIOR GRIS.png",
    brand: "facilfix",
  },

  // INTERIORES
  {
    id: 11,
    name: "Látex Interior Premium",
    category: "interiores",
    description:
      "Pintura de alta calidad para interiores con acabado mate perfecto.",
    image: "/images/products/PREMIUM-LATEXINT.png",
    brand: "premium",
  },
  {
    id: 12,
    name: "Látex Interior Expression",
    category: "interiores",
    description: "Pintura acrílica para interiores con excelente rendimiento.",
    image: "/images/products/EXPRESSION-LATEX-ACRILICO-INTERIOR-1.png",
    brand: "expression",
  },
  {
    id: 13,
    name: "Látex Interior/Exterior",
    category: "interiores",
    description: "Pintura versátil para uso en interiores y exteriores.",
    image: "/images/products/PREMIUM-LATEXINTEXT.png",
    brand: "premium",
  },
  {
    id: 14,
    name: "Látex Obra EcoPainting",
    category: "interiores",
    description: "Pintura ecológica para obras con excelente rendimiento.",
    image: "/images/products/ECOPAINTINGLATEX.png",
    brand: "ecopainting",
  },
  {
    id: 15,
    name: "Látex Lavable Premium",
    category: "interiores",
    description: "Pintura lavable para interiores de alto tránsito.",
    image: "/images/products/PREMIUM-LAVABLE.png",
    brand: "premium",
  },
  {
    id: 16,
    name: "Látex Super Lavable Premium",
    category: "interiores",
    description: "Pintura super lavable con máxima resistencia a manchas.",
    image: "/images/products/PREMIUM-SUPERLAVABLE.png",
    brand: "premium",
  },
  {
    id: 17,
    name: "Barniz al Agua Premium",
    category: "interiores",
    description: "Barniz ecológico al agua para maderas interiores.",
    image: "/images/products/PREMIUM-BARNIZALAGUA.png",
    brand: "premium",
  },
  {
    id: 18,
    name: "Esmalte al Agua Premium",
    category: "interiores",
    description: "Esmalte ecológico al agua para maderas y metales.",
    image: "/images/products/PREMIUM-ESMALTEALAGUA.png",
    brand: "premium",
  },
  {
    id: 19,
    name: "Hidrolaca Premium",
    category: "interiores",
    description: "Laca al agua para maderas con secado rápido.",
    image: "/images/products/PREMIUM-HIDROLACA.png",
    brand: "premium",
  },
  {
    id: 20,
    name: "FACIL FIX Interior Blanco",
    category: "interiores",
    description: "Adhesivo para revestimientos interiores.",
    image: "/images/products/FACIL FIX INTERIOR BLANCO.png",
    brand: "facilfix",
  },

  // ESPECIALES
  {
    id: 21,
    name: "Piscinas Premium",
    category: "especiales",
    description: "Pintura especial para piscinas con resistencia al cloro.",
    image: "/images/products/PREMIUM-PISCINAS.png",
    badge: "bestseller",
    icon: "pool",
    brand: "premium",
  },
  {
    id: 22,
    name: "Pisos Deportivos Premium",
    category: "especiales",
    description:
      "Revestimiento para pisos deportivos con alta resistencia al desgaste.",
    image: "/images/products/PREMIUM-PISOSDEPORTIVOS.png",
    badge: "featured",
    icon: "sports",
    brand: "premium",
  },
  {
    id: 23,
    name: "Esmalte Sintético NEW HOUSE",
    category: "especiales",
    description: "Esmalte sintético de alta calidad para maderas y metales.",
    image: "/images/products/NEW-HOUSE-ESMALTE-SINTETICO.png",
    badge: "new",
    icon: "metal",
    brand: "newhouse",
  },
  {
    id: 24,
    name: "Cielorrasos Expression",
    category: "especiales",
    description: "Pintura especial para cielorrasos con máxima blancura.",
    image: "/images/products/EXPRESSION-CIELORRASO.png",
    brand: "expression",
  },
  {
    id: 25,
    name: "Enduido Expression",
    category: "especiales",
    description: "Enduido plástico para interiores de fácil lijado.",
    image: "/images/products/EXPRESSION-ENDUIDO-1.png",
    brand: "expression",
  },
  {
    id: 26,
    name: "Fibrado Expression",
    category: "especiales",
    description: "Impermeabilizante fibrado para techos y terrazas.",
    image: "/images/products/EXPRESSION-FIBRADO-1.png",
    brand: "expression",
  },
  {
    id: 27,
    name: "Fijador Expression",
    category: "especiales",
    description: "Fijador sellador concentrado para paredes.",
    image: "/images/products/EXPRESSION-FIJADOR-1.png",
    brand: "expression",
  },
  {
    id: 28,
    name: "Imprimación Expression",
    category: "especiales",
    description: "Imprimación para superficies difíciles.",
    image: "/images/products/EXPRESSION-IMPRIMACION-1.png",
    brand: "expression",
  },
  {
    id: 29,
    name: "Ladrillo Visto Expression",
    category: "especiales",
    description: "Barniz protector para ladrillos vistos.",
    image: "/images/products/EXPRESSION-LADRILLO-VISTO-1.png",
    brand: "expression",
  },
  {
    id: 30,
    name: "Masilla para Yeso Expression",
    category: "especiales",
    description: "Masilla para reparación de yeso y durlock.",
    image: "/images/products/EXPRESSION-MASILLA-PARA-YESO-1.png",
    brand: "expression",
  },

  // RECUBRIMIENTOS
  {
    id: 31,
    name: "Base Niveladora",
    category: "recubrimientos",
    description: "Base niveladora para pisos irregulares.",
    image: "/images/products/BASE NIVELADORA.png",
    brand: "facilfix",
  },
  {
    id: 32,
    name: "Revestimiento Cerámico",
    category: "recubrimientos",
    description: "Revestimiento símil cerámico para paredes.",
    image: "/images/products/CERAMICO FRENTE.png",
    brand: "facilfix",
  },
  {
    id: 33,
    name: "Revestimiento Porcelanato",
    category: "recubrimientos",
    description: "Revestimiento símil porcelanato para pisos.",
    image: "/images/products/PORCELANATO FRENTE.png",
    brand: "facilfix",
  },
  {
    id: 34,
    name: "Revoque Fino",
    category: "recubrimientos",
    description: "Revoque fino para acabados perfectos.",
    image: "/images/products/REVOQUE FINO FRENTE.png",
    brand: "facilfix",
  },
  {
    id: 35,
    name: "FACIL FIX Microcemento",
    category: "recubrimientos",
    description:
      "Revestimiento de microcemento para pisos y paredes con acabado moderno.",
    image: "/images/products/FACIL FIX MICROCEMENTO.png",
    badge: "new",
    icon: "texture",
    brand: "facilfix",
  },
  {
    id: 36,
    name: "Entonador Universal",
    category: "especiales",
    description:
      "Entonador universal para personalizar colores en pinturas al agua.",
    image: "/images/products/ENTONADORUNIVERSAL.png",
    badge: "featured",
    icon: "texture",
    brand: "expression",
  },
];

export function ProductsSection() {
  // Estado para el tipo de filtro (categoría o marca)
  const [filterType, setFilterType] = useState<"category" | "brand">(
    "category"
  );

  // Intentar obtener la categoría de la URL si existe
  const [activeCategory, setActiveCategory] = useState(() => {
    // Solo se ejecuta en el cliente
    if (typeof window !== "undefined") {
      // Verificar si hay un hash en la URL que indique una categoría
      const hash = window.location.hash;
      if (hash && hash.includes("categoria=")) {
        const categoria = hash.split("categoria=")[1];
        // Verificar si es una categoría válida
        if (
          ["especiales", "exteriores", "interiores", "recubrimientos"].includes(
            categoria
          )
        ) {
          return categoria;
        }
      }
    }
    return "especiales"; // Valor por defecto
  });

  // Estado para la marca activa, inicializado con la primera marca
  const [activeBrand, setActiveBrand] = useState<string>(brandCategories[0].id);

  // Efecto para escuchar cambios en el hash de la URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.includes("categoria=")) {
        const categoria = hash.split("categoria=")[1];
        if (
          ["especiales", "exteriores", "interiores", "recubrimientos"].includes(
            categoria
          )
        ) {
          setActiveCategory(categoria);
          setFilterType("category");

          // Activar visualmente la pestaña correspondiente
          setTimeout(() => {
            const tabElement = document.querySelector(
              `[data-value="${categoria}"]`
            );
            if (tabElement) {
              (tabElement as HTMLElement).click();
            }
          }, 100);
        }
      }
    };

    // Escuchar cambios en el hash
    window.addEventListener("hashchange", handleHashChange);

    // Ejecutar una vez al montar para manejar la URL inicial
    handleHashChange();

    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Filtrar productos según el tipo de filtro (categoría o marca)
  const filteredProducts = useMemo(() => {
    if (filterType === "category") {
      return activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory);
    } else {
      return activeBrand
        ? products.filter((product) => product.brand === activeBrand)
        : [];
    }
  }, [filterType, activeCategory, activeBrand, products]);

  // Agrupar productos en filas para el carrusel (3 productos por slide en móvil, 4 en desktop)
  const groupedProducts: Product[][] = [];
  for (let i = 0; i < filteredProducts.length; i += 4) {
    groupedProducts.push(filteredProducts.slice(i, i + 4));
  }

  // Animaciones con Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="productos" className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-mascolor-primary/5 opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-mascolor-dark mb-4">
            Más <span className="text-mascolor-primary">color</span> para tu
            hogar
          </h2>
          <p className="text-mascolor-gray-600 max-w-2xl mx-auto">
            Descubre nuestra amplia gama de productos de alta calidad para tus
            proyectos de pintura y renovación
          </p>
        </motion.div>

        {/* Selector de tipo de filtro */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-md border border-mascolor-gray-200 inline-flex">
            <button
              onClick={() => setFilterType("category")}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${
                filterType === "category"
                  ? "bg-mascolor-primary text-white shadow-md"
                  : "hover:bg-mascolor-primary/10"
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers size={16} />
                <span className="font-medium">Por Categoría</span>
              </span>
            </button>
            <button
              onClick={() => {
                // Asegurarse de que activeBrand tenga un valor al cambiar a la pestaña "Por Marca"
                setFilterType("brand");
                // Si no hay una marca activa, establecer la primera marca como activa
                if (!activeBrand) {
                  setActiveBrand(brandCategories[0].id);
                }
              }}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${
                filterType === "brand"
                  ? "bg-mascolor-primary text-white shadow-md"
                  : "hover:bg-mascolor-primary/10"
              }`}
            >
              <span className="flex items-center gap-2">
                <Star size={16} />
                <span className="font-medium">Por Marca</span>
              </span>
            </button>
          </div>
        </div>

        {/* Tabs de categorías */}
        {filterType === "category" && (
          <Tabs
            defaultValue="especiales"
            className="w-full"
            onValueChange={(value) => {
              setActiveCategory(value);
              setFilterType("category");
            }}
          >
            <div className="flex justify-center mb-10 overflow-x-auto pb-2 md:overflow-visible md:pb-0">
              <TabsList className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-md border border-mascolor-gray-200">
                {productCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    data-value={category.id}
                    className="px-5 md:px-7 py-2.5 rounded-full data-[state=active]:bg-mascolor-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 whitespace-nowrap hover:bg-mascolor-primary/10"
                  >
                    <span className="flex items-center gap-2.5">
                      {category.icon}
                      <span className="hidden md:inline font-medium">
                        {category.name}
                      </span>
                      <span className="md:hidden font-medium">
                        {category.name}
                      </span>
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {productCategories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-0"
              >
                <ProductCarousel className="mb-8">
                  {groupedProducts.length > 0 ? (
                    groupedProducts.map((group, groupIndex) => (
                      <ProductCarouselItem
                        key={groupIndex}
                        className="w-full md:w-[calc(100%-24px)] px-3"
                      >
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.1 }}
                        >
                          {group.map((product) => (
                            <motion.div
                              key={product.id}
                              variants={itemVariants}
                            >
                              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 group bg-white/80 backdrop-blur-sm h-full flex flex-col rounded-xl">
                                <div className="relative h-64 flex items-center justify-center p-4 overflow-hidden">
                                  {/* Círculo con blur */}
                                  <div className="absolute w-[90%] h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-mascolor-primary/5 backdrop-blur-[3px] z-0"></div>

                                  {/* Badge de producto */}
                                  {product.badge && (
                                    <div className="absolute top-2 right-2 z-10">
                                      <ProductBadge
                                        type={product.badge as any}
                                      />
                                    </div>
                                  )}

                                  {/* Icono de categoría */}
                                  {product.icon && (
                                    <div className="absolute top-2 left-2 z-10">
                                      <Badge
                                        variant="outline"
                                        className="bg-white/80 backdrop-blur-sm border-mascolor-gray-200"
                                      >
                                        <ProductIcon
                                          type={product.icon as any}
                                          size={14}
                                          className="text-mascolor-primary"
                                        />
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Logo de la marca */}
                                  {product.brand && (
                                    <div className="absolute bottom-2 right-2 z-10">
                                      <div className="bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm border border-mascolor-gray-200 transition-all duration-300 group-hover:shadow-md group-hover:border-mascolor-primary/30">
                                        <div className="relative h-6 w-20">
                                          <Image
                                            src={`/images/logos/${product.brand}.svg`}
                                            alt={`Logo ${product.brand}`}
                                            fill
                                            className="object-contain transition-all duration-300"
                                            style={{
                                              filter:
                                                "brightness(0) saturate(100%) invert(10%) sepia(83%) saturate(5728%) hue-rotate(307deg) brightness(77%) contrast(111%)",
                                              opacity: 0.9,
                                              transform: "scale(1)",
                                              transition:
                                                "all 0.3s ease-in-out",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Efecto hover */}
                                  <div className="absolute w-[90%] h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-mascolor-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-[1]"></div>

                                  {/* Imagen del producto */}
                                  <div className="relative z-10 w-[95%] h-[95%] flex items-center justify-center">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                      className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                                      style={{ objectFit: "contain" }}
                                      priority={
                                        product.badge === "bestseller" ||
                                        product.badge === "new"
                                      }
                                    />
                                  </div>
                                </div>
                                <CardHeader className="pb-1 pt-3">
                                  <CardTitle className="text-lg text-mascolor-dark group-hover:text-mascolor-primary transition-colors duration-300">
                                    {product.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-1 flex-grow">
                                  <p className="text-mascolor-gray-600 text-sm">
                                    {product.description}
                                  </p>
                                </CardContent>
                                <CardFooter className="flex justify-center pt-2 pb-3 mt-auto">
                                  <SubtleButton className="text-xs px-3 py-1.5 hover:bg-mascolor-primary/10 w-full text-center">
                                    Ver detalles
                                  </SubtleButton>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      </ProductCarouselItem>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-mascolor-gray-500">
                        No hay productos disponibles en esta categoría.
                      </p>
                    </div>
                  )}
                </ProductCarousel>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Tabs de marcas */}
        {filterType === "brand" && (
          <Tabs
            defaultValue={activeBrand}
            value={activeBrand}
            className="w-full"
            onValueChange={(value) => {
              setActiveBrand(value);
              setFilterType("brand");
            }}
          >
            <div className="flex justify-center mb-10 overflow-x-auto pb-2 md:overflow-visible md:pb-0">
              <TabsList className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-md border border-mascolor-gray-200">
                {brandCategories.map((brand) => (
                  <TabsTrigger
                    key={brand.id}
                    value={brand.id}
                    data-value={brand.id}
                    className="px-5 md:px-7 py-2.5 rounded-full data-[state=active]:bg-mascolor-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 whitespace-nowrap hover:bg-mascolor-primary/10"
                  >
                    <span className="flex items-center gap-2.5">
                      {brand.icon}
                      <span className="hidden md:inline font-medium">
                        {brand.name}
                      </span>
                      <span className="md:hidden font-medium">
                        {brand.name}
                      </span>
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {brandCategories.map((brand) => (
              <TabsContent key={brand.id} value={brand.id} className="mt-0">
                <ProductCarousel className="mb-8">
                  {groupedProducts.length > 0 ? (
                    groupedProducts.map((group, groupIndex) => (
                      <ProductCarouselItem
                        key={groupIndex}
                        className="w-full md:w-[calc(100%-24px)] px-3"
                      >
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                          variants={containerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.1 }}
                        >
                          {group.map((product) => (
                            <motion.div
                              key={product.id}
                              variants={itemVariants}
                            >
                              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 group bg-white/80 backdrop-blur-sm h-full flex flex-col rounded-xl">
                                <div className="relative h-64 flex items-center justify-center p-4 overflow-hidden">
                                  {/* Círculo con blur */}
                                  <div className="absolute w-[90%] h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-mascolor-primary/5 backdrop-blur-[3px] z-0"></div>

                                  {/* Badge de producto */}
                                  {product.badge && (
                                    <div className="absolute top-2 right-2 z-10">
                                      <ProductBadge
                                        type={product.badge as any}
                                      />
                                    </div>
                                  )}

                                  {/* Icono de categoría */}
                                  {product.icon && (
                                    <div className="absolute top-2 left-2 z-10">
                                      <Badge
                                        variant="outline"
                                        className="bg-white/80 backdrop-blur-sm border-mascolor-gray-200"
                                      >
                                        <ProductIcon
                                          type={product.icon as any}
                                          size={14}
                                          className="text-mascolor-primary"
                                        />
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Logo de la marca */}
                                  {product.brand && (
                                    <div className="absolute bottom-2 right-2 z-10">
                                      <div className="bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm border border-mascolor-gray-200 transition-all duration-300 group-hover:shadow-md group-hover:border-mascolor-primary/30">
                                        <div className="relative h-6 w-20">
                                          <Image
                                            src={`/images/logos/${product.brand}.svg`}
                                            alt={`Logo ${product.brand}`}
                                            fill
                                            className="object-contain transition-all duration-300"
                                            style={{
                                              filter:
                                                "brightness(0) saturate(100%) invert(10%) sepia(83%) saturate(5728%) hue-rotate(307deg) brightness(77%) contrast(111%)",
                                              opacity: 0.9,
                                              transform: "scale(1)",
                                              transition:
                                                "all 0.3s ease-in-out",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Efecto hover */}
                                  <div className="absolute w-[90%] h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-mascolor-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-[1]"></div>

                                  {/* Imagen del producto */}
                                  <div className="relative z-10 w-[95%] h-[95%] flex items-center justify-center">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                      className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                                      style={{ objectFit: "contain" }}
                                      priority={
                                        product.badge === "bestseller" ||
                                        product.badge === "new"
                                      }
                                    />
                                  </div>
                                </div>
                                <CardHeader className="pb-1 pt-3">
                                  <CardTitle className="text-lg text-mascolor-dark group-hover:text-mascolor-primary transition-colors duration-300">
                                    {product.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-1 flex-grow">
                                  <p className="text-mascolor-gray-600 text-sm">
                                    {product.description}
                                  </p>
                                </CardContent>
                                <CardFooter className="flex justify-center pt-2 pb-3 mt-auto">
                                  <SubtleButton className="text-xs px-3 py-1.5 hover:bg-mascolor-primary/10 w-full text-center">
                                    Ver detalles
                                  </SubtleButton>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      </ProductCarouselItem>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-mascolor-gray-500">
                        No hay productos disponibles de esta marca.
                      </p>
                    </div>
                  )}
                </ProductCarousel>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
}
