# Documentación del Proyecto +COLOR

## Descripción General

Este proyecto es una landing page para la marca +COLOR, especializada en pinturas y revestimientos de alta calidad. La página web está diseñada con una estética moderna y profesional, utilizando una paleta de colores púrpura/magenta que refleja la identidad de la marca.

## Tecnologías Utilizadas

- **Framework**: Next.js 15
- **Biblioteca UI**: React 18
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui, Radix UI
- **Animaciones**: Framer Motion
- **Carruseles**: Embla Carousel
- **Backend** (opcional): Supabase

## Estructura del Proyecto

```
+COLOR/
├── app/                    # Componentes, rutas y lógica principal
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes de interfaz básicos
│   ├── sections/           # Secciones principales de la página
│   └── layout/             # Componentes estructurales (Header, Footer)
├── lib/                    # Código utilitario y lógica compartida
├── public/                 # Archivos estáticos
│   └── images/             # Imágenes del proyecto
│       ├── logos/          # Logos de la marca y submarcas
│       ├── products/       # Imágenes de productos
│       └── buckets/        # Imágenes de fondos y baldes
├── types/                  # Definiciones de tipos TypeScript
├── hooks/                  # Hooks personalizados
└── config/                 # Configuraciones de la aplicación
```

## Paleta de Colores

La paleta de colores principal de +COLOR se basa en el color primario de la marca:

```typescript
// Colores principales
primary: "#870064",    // Cardinal Pink 900 (color principal)
secondary: "#870064",  // Cambiado a color primario de la marca
accent: "#870064",     // Cambiado a color primario de la marca

// Escala completa de Cardinal Pink
pink: {
  50: "#FFF1FB",
  100: "#FFE1F7",
  200: "#FFC3EE",
  300: "#FF94DD",
  400: "#FF54C9",
  500: "#FF16B8",
  600: "#FF00C7",
  700: "#D900A9",
  800: "#B10087",
  900: "#870064",
  950: "#63004A",
}

// Escala de grises
gray: {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#EEEEEE",
  300: "#E0E0E0",
  400: "#BDBDBD",
  500: "#9E9E9E",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
}
```

## Tipografía

- **Principal**: Poppins (variable: `--font-poppins`)
- **Secundaria**: Inter (variable: `--font-inter`)
- **Adicional**: Stolzl (importada vía Typekit)

## Componentes Principales

### Secciones

1. **HeroSection**: Sección principal con carrusel de marcas interactivo
2. **TrustBlocks**: Sección de bloques de confianza con estadísticas
3. **CategoriesSection**: Categorías de productos
4. **ProductsSection**: Productos organizados por categorías
5. **BenefitsSection**: Beneficios de los productos
6. **PaintCalculator**: Calculadora de pintura
7. **ContactSection**: Información de contacto

### Componentes UI Personalizados

1. **AnimatedButton**: Botón con animaciones de hover y transiciones
2. **SubtleButton**: Botón sutil para acciones secundarias
3. **ProductCarousel**: Carrusel especializado para productos
4. **ProductBadge**: Insignias para productos (Nuevo, + Vendido, etc.)
5. **ProductIcon**: Iconos para categorías de productos

## Sección de Productos

La sección de productos (`components/sections/products.tsx`) es un componente clave que muestra los productos organizados por categorías:

### Características

- Tabs para filtrar por categorías (Especiales, Exteriores, Interiores, Recubrimientos)
- Carrusel horizontal para navegar entre grupos de productos
- Tarjetas de producto con:
  - Imagen del producto con fondo transparente
  - Círculo con efecto blur detrás del producto
  - Badges indicativos (Nuevo, + Vendido, etc.)
  - Iconos ilustrativos de uso
  - Botón "Ver detalles" sutil
- Animaciones con Framer Motion para mejorar la experiencia de usuario
- Diseño responsive que se adapta a diferentes tamaños de pantalla

### Estructura de Datos

```typescript
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
```

## Logos e Imágenes

- **Logos**: Ubicados en `/public/images/logos/`
  - `+color.svg`: Logo principal con texto
  - `+colorsolo.svg`: Logo solo (símbolo)
  - Logos de submarcas: `facilfix.svg`, `premium.svg`, `expression.svg`, etc.
- **Productos**: Ubicados en `/public/images/products/`
- **Fondos y Baldes**: Ubicados en `/public/images/buckets/`

## Requisitos Específicos

- El logo de +COLOR debe mostrarse en color blanco en el header cuando está en la parte superior
- El logo cambia al color de la marca (#870064) cuando se hace scroll
- Los botones "Ver detalles" deben ser sutiles, pequeños y usar un símbolo "+" en lugar de ">"
- El botón "Ver todos los productos" debe estar centrado
- Las imágenes de productos deben mostrarse con fondo transparente y un círculo con efecto blur

## Desarrollo y Despliegue

1. **Instalación**: `npm install`
2. **Desarrollo**: `npm run dev`
3. **Construcción**: `npm run build`
4. **Inicio en producción**: `npm run start`
5. **Despliegue**: Configurado para Vercel

## Contacto

- **Teléfono**: 0800-555-0189
- **Horario de atención**: Lunes a viernes de 8:00 a 16:00
- **Créditos**: Diseñado y desarrollado por XOR
