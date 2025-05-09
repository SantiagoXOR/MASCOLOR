# Documentación de la Sección de Productos

## Descripción General
La sección de productos es un componente clave del sitio web +COLOR que muestra los diferentes productos organizados por categorías. Utiliza un sistema de pestañas (tabs) para filtrar los productos y un carrusel horizontal para navegar entre grupos de productos.

## Ubicación del Archivo
`components/sections/products.tsx`

## Dependencias
```typescript
import { useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { SubtleButton } from "@/components/ui/subtle-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCarousel, ProductCarouselItem } from "@/components/ui/product-carousel";
import { ProductBadge } from "@/components/ui/product-badge";
import { ProductIcon } from "@/components/ui/product-icon";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import { Droplet, Home, Building, Paintbrush, Waves, Hammer, Brush, Palette, Thermometer, Shield, Leaf, Layers } from "lucide-react";
```

## Estructura de Datos

### Categorías de Productos
```typescript
interface ProductCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const productCategories: ProductCategory[] = [
  { id: "especiales", name: "Especiales", icon: <Droplet size={16} /> },
  { id: "exteriores", name: "Para Exteriores", icon: <Building size={16} /> },
  { id: "interiores", name: "Para Interiores", icon: <Home size={16} /> },
  { id: "recubrimientos", name: "Recubrimientos", icon: <Layers size={16} /> },
];
```

### Productos
```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  badge?: "new" | "bestseller" | "featured" | "limited";
  icon?: "interior" | "exterior" | "pool" | "sports" | "metal" | "wood" | "concrete" | "waterproof" | "thermal" | "protective" | "eco" | "texture";
}
```

## Funcionalidades Principales

### 1. Filtrado por Categorías
El componente utiliza el estado `activeCategory` para filtrar los productos según la categoría seleccionada:

```typescript
const [activeCategory, setActiveCategory] = useState("especiales");

const filteredProducts = activeCategory === "all"
  ? products
  : products.filter(product => product.category === activeCategory);
```

### 2. Agrupación de Productos para el Carrusel
Los productos se agrupan en filas para mostrarlos en el carrusel (4 productos por slide en desktop, menos en móvil):

```typescript
const groupedProducts: Product[][] = [];
for (let i = 0; i < filteredProducts.length; i += 4) {
  groupedProducts.push(filteredProducts.slice(i, i + 4));
}
```

### 3. Animaciones con Framer Motion
Se utilizan animaciones para mejorar la experiencia de usuario:

```typescript
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
```

## Estructura del Componente

### 1. Sección Principal
```jsx
<section className="py-16 bg-white relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-mascolor-primary/5 opacity-30"></div>
  <div className="container mx-auto px-4 relative z-10">
    {/* Título y descripción */}
    <motion.div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-mascolor-dark mb-4">
        Más <span className="text-mascolor-primary">color</span> para tu hogar
      </h2>
      <p className="text-mascolor-gray-600 max-w-2xl mx-auto">
        Descubre nuestra amplia gama de productos de alta calidad para tus proyectos de pintura y renovación
      </p>
    </motion.div>
    
    {/* Tabs y contenido */}
    {/* ... */}
  </div>
</section>
```

### 2. Sistema de Tabs
```jsx
<Tabs defaultValue="especiales" className="w-full" onValueChange={setActiveCategory}>
  <div className="flex justify-center mb-10 overflow-x-auto pb-2 md:overflow-visible md:pb-0">
    <TabsList className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-md border border-mascolor-gray-200">
      {productCategories.map((category) => (
        <TabsTrigger
          key={category.id}
          value={category.id}
          className="px-5 md:px-7 py-2.5 rounded-full data-[state=active]:bg-mascolor-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 whitespace-nowrap hover:bg-mascolor-primary/10"
        >
          <span className="flex items-center gap-2.5">
            {category.icon}
            <span className="hidden md:inline font-medium">{category.name}</span>
            <span className="md:hidden font-medium">{category.name}</span>
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  </div>
  
  {/* Contenido de las tabs */}
  {/* ... */}
</Tabs>
```

### 3. Carrusel de Productos
```jsx
{productCategories.map((category) => (
  <TabsContent key={category.id} value={category.id} className="mt-0">
    <ProductCarousel className="mb-8">
      {groupedProducts.length > 0 ? (
        groupedProducts.map((group, groupIndex) => (
          <ProductCarouselItem key={groupIndex} className="w-full md:w-[calc(100%-24px)] px-3">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {/* Tarjetas de productos */}
              {/* ... */}
            </motion.div>
          </ProductCarouselItem>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-mascolor-gray-500">No hay productos disponibles en esta categoría.</p>
        </div>
      )}
    </ProductCarousel>
  </TabsContent>
))}
```

### 4. Tarjeta de Producto
```jsx
<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 group bg-white/80 backdrop-blur-sm h-full flex flex-col rounded-xl">
  <div className="relative h-64 flex items-center justify-center p-4 overflow-hidden">
    {/* Círculo con blur */}
    <div className="absolute w-[90%] h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-mascolor-primary/5 backdrop-blur-[3px] z-0"></div>

    {/* Badge de producto */}
    {product.badge && (
      <div className="absolute top-2 right-2 z-10">
        <ProductBadge type={product.badge as any} />
      </div>
    )}

    {/* Icono de categoría */}
    {product.icon && (
      <div className="absolute top-2 left-2 z-10">
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-mascolor-gray-200">
          <ProductIcon type={product.icon as any} size={14} className="text-mascolor-primary" />
        </Badge>
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
        style={{ objectFit: 'contain' }}
        priority={product.badge === "bestseller" || product.badge === "new"}
      />
    </div>
  </div>
  <CardHeader className="pb-1 pt-3">
    <CardTitle className="text-lg text-mascolor-dark group-hover:text-mascolor-primary transition-colors duration-300">{product.name}</CardTitle>
  </CardHeader>
  <CardContent className="pb-1 flex-grow">
    <p className="text-mascolor-gray-600 text-sm">{product.description}</p>
  </CardContent>
  <CardFooter className="flex justify-center pt-2 pb-3 mt-auto">
    <SubtleButton className="text-xs px-3 py-1.5 hover:bg-mascolor-primary/10 w-full text-center">
      Ver detalles
    </SubtleButton>
  </CardFooter>
</Card>
```

### 5. Botón "Ver todos los productos"
```jsx
<motion.div
  className="flex justify-center mt-14"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.3, duration: 0.5 }}
>
  <AnimatedButton
    variant="default"
    size="lg"
    asChild={true}
    href="/productos"
    className="group mx-auto bg-mascolor-primary hover:bg-mascolor-primary/90 text-white shadow-lg shadow-mascolor-primary/20 hover:shadow-mascolor-primary/30"
  >
    <span className="flex items-center gap-3 px-2">
      Ver todos los productos
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </svg>
    </span>
  </AnimatedButton>
</motion.div>
```

## Componentes Relacionados

### ProductCarousel
Componente personalizado para mostrar productos en un carrusel horizontal con navegación.
Ubicación: `components/ui/product-carousel.tsx`

### ProductBadge
Componente para mostrar insignias en los productos (Nuevo, + Vendido, etc.).
Ubicación: `components/ui/product-badge.tsx`

### ProductIcon
Componente para mostrar iconos relacionados con las categorías de productos.
Ubicación: `components/ui/product-icon.tsx`

### SubtleButton
Botón sutil utilizado para la acción "Ver detalles" en las tarjetas de productos.
Ubicación: `components/ui/subtle-button.tsx`

## Notas Adicionales
- El componente está diseñado para ser responsive, adaptándose a diferentes tamaños de pantalla.
- Las animaciones mejoran la experiencia de usuario al navegar por los productos.
- Las imágenes de productos se muestran con fondo transparente y un círculo con efecto blur detrás.
- Los botones "Ver detalles" son sutiles y pequeños, alineados en un mismo lugar en cada tarjeta.
