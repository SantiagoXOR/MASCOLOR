# Documentación de la Estructura del Proyecto

## Descripción General
El proyecto +COLOR es una landing page desarrollada con Next.js 15, React 18, TypeScript y Tailwind CSS. La estructura del proyecto sigue las convenciones de Next.js App Router, con una organización clara de componentes, páginas y recursos.

## Estructura de Directorios

```
+COLOR/
├── app/                    # Componentes, rutas y lógica principal (App Router)
│   ├── layout.tsx          # Layout principal de la aplicación
│   ├── page.tsx            # Página principal (Home)
│   ├── layout-with-components.tsx # Layout con componentes comunes
│   ├── globals.css         # Estilos globales CSS
│   ├── basic-styles.css    # Estilos básicos adicionales
│   ├── fonts.css           # Configuración de fuentes
│   ├── productos/          # Ruta para la página de productos
│   │   └── page.tsx        # Página de productos
│   └── nosotros/           # Ruta para la página Nosotros
│       └── page.tsx        # Página Nosotros
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes de interfaz básicos
│   │   ├── button.tsx      # Componente de botón
│   │   ├── animated-button.tsx # Botón con animaciones
│   │   ├── subtle-button.tsx # Botón sutil
│   │   ├── card.tsx        # Componente de tarjeta
│   │   ├── badge.tsx       # Componente de insignia
│   │   ├── product-badge.tsx # Insignias para productos
│   │   ├── product-icon.tsx # Iconos para productos
│   │   ├── product-carousel.tsx # Carrusel para productos
│   │   └── ...             # Otros componentes UI
│   ├── sections/           # Secciones principales de la página
│   │   ├── hero.tsx        # Sección hero
│   │   ├── products.tsx    # Sección de productos
│   │   ├── categories.tsx  # Sección de categorías
│   │   ├── benefits.tsx    # Sección de beneficios
│   │   ├── contact.tsx     # Sección de contacto
│   │   ├── trust-blocks.tsx # Sección de bloques de confianza
│   │   └── paint-calculator.tsx # Calculadora de pintura
│   └── layout/             # Componentes estructurales
│       ├── header.tsx      # Encabezado de la página
│       └── footer.tsx      # Pie de página
├── lib/                    # Código utilitario y lógica compartida
│   ├── utils.ts            # Funciones utilitarias
│   ├── supabase/           # Configuración de Supabase (opcional)
│   │   └── client.ts       # Cliente de Supabase
│   └── analytics.ts        # Configuración de analytics
├── public/                 # Archivos estáticos
│   ├── images/             # Imágenes del proyecto
│   │   ├── logos/          # Logos de la marca y submarcas
│   │   ├── products/       # Imágenes de productos
│   │   └── buckets/        # Imágenes de fondos y baldes
│   ├── favicon.ico         # Favicon
│   ├── site.webmanifest    # Manifest para PWA
│   └── ...                 # Otros archivos estáticos
├── types/                  # Definiciones de tipos TypeScript
│   └── index.ts            # Tipos principales
├── hooks/                  # Hooks personalizados
│   └── useProducts.ts      # Hook para gestionar productos
├── config/                 # Configuraciones de la aplicación
│   └── seo.ts              # Configuración de SEO
├── scripts/                # Scripts de utilidad
│   └── optimize-images.js  # Script para optimizar imágenes
├── next.config.mjs         # Configuración de Next.js
├── tailwind.config.ts      # Configuración de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
├── package.json            # Dependencias y scripts
└── components.json         # Configuración de componentes shadcn/ui
```

## Archivos Principales

### Configuración

#### `next.config.mjs`
Configuración de Next.js, incluyendo optimización de imágenes y configuraciones experimentales.

```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  output: 'standalone',
  trailingSlash: false,
  // ...
}
```

#### `tailwind.config.ts`
Configuración de Tailwind CSS, incluyendo colores personalizados, fuentes y extensiones.

```typescript
const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}',
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './src/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mascolor: {
          primary: "#870064",    // Cardinal Pink 900
          secondary: "#FF00C7",  // Cardinal Pink 600
          accent: "#FF54C9",     // Cardinal Pink 400
          // ...
        },
      },
      fontFamily: {
        mazzard: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        sans: ['var(--font-poppins)', 'sans-serif'],
        stolzl: ["stolzl", "sans-serif"],
      },
      // ...
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### `tsconfig.json`
Configuración de TypeScript con paths personalizados.

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### `components.json`
Configuración de componentes shadcn/ui.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Páginas y Layouts

#### `app/layout.tsx`
Layout principal de la aplicación con configuración de fuentes y metadatos.

```tsx
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "./basic-styles.css";
import "./fonts.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ['400', '500', '700', '900'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "+COLOR | Pinturas y revestimientos de alta calidad",
  description: "Descubre nuestra línea de pinturas y revestimientos de alta calidad para tus proyectos de construcción y decoración.",
  // ...
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/rcv4ocf.css" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
```

#### `app/layout-with-components.tsx`
Layout con componentes comunes como Header y Footer.

```tsx
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LayoutWithComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Scroll al inicio cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          id="main-content"
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
```

#### `app/page.tsx`
Página principal (Home) que compone las diferentes secciones.

```tsx
import LayoutWithComponents from "./layout-with-components";
import { HeroSection } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/products";
import { BenefitsSection } from "@/components/sections/benefits";
import { ContactSection } from "@/components/sections/contact";
import { CategoriesSection } from "@/components/sections/categories";
import { PaintCalculator } from "@/components/sections/paint-calculator";
import { TrustBlocks } from "@/components/sections/trust-blocks";

export default function Home() {
  return (
    <LayoutWithComponents>
      <HeroSection />
      <TrustBlocks />
      <CategoriesSection />
      <ProductsSection />
      <BenefitsSection />
      <PaintCalculator />
      <ContactSection />
    </LayoutWithComponents>
  );
}
```

### Utilidades

#### `lib/utils.ts`
Funciones utilitarias comunes.

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}
```

## Patrones de Diseño

### Componentes
- **Componentes de UI**: Componentes básicos reutilizables (botones, tarjetas, etc.)
- **Componentes de Secciones**: Secciones completas de la página (hero, productos, etc.)
- **Componentes de Layout**: Componentes estructurales (header, footer)

### Estado
- **useState**: Para estado local en componentes
- **useEffect**: Para efectos secundarios (cargar datos, animaciones, etc.)
- **Custom Hooks**: Para lógica reutilizable (useProducts, etc.)

### Estilos
- **Tailwind CSS**: Para estilos inline con clases utilitarias
- **CSS Modules**: Para estilos específicos de componentes
- **Framer Motion**: Para animaciones avanzadas

## Convenciones de Nomenclatura

### Archivos y Directorios
- **Componentes**: PascalCase (ej. `Button.tsx`, `ProductCard.tsx`)
- **Utilidades**: camelCase (ej. `utils.ts`, `formatDate.ts`)
- **Páginas**: kebab-case (ej. `about-us.tsx`, `contact.tsx`)

### Variables y Funciones
- **Componentes**: PascalCase (ej. `function Button()`, `const Header = ()`)
- **Funciones**: camelCase (ej. `function formatCurrency()`, `const handleClick = ()`)
- **Variables**: camelCase (ej. `const isLoading`, `let productCount`)
- **Constantes**: UPPER_SNAKE_CASE para constantes globales (ej. `const API_URL`)

### CSS
- **Clases**: kebab-case (ej. `product-card`, `hero-section`)
- **Variables**: kebab-case (ej. `--primary-color`, `--font-size-lg`)

## Integración con Servicios Externos

### Supabase (Opcional)
Configuración del cliente de Supabase en `lib/supabase/client.ts`.

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
};
```

### Analytics (Opcional)
Configuración de Google Analytics en `lib/analytics.ts`.

```typescript
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

## Notas Adicionales
- El proyecto utiliza Next.js App Router para la estructura de rutas
- Se utiliza TypeScript para tipado estático y mejor desarrollo
- Los componentes UI están basados en shadcn/ui y Radix UI para accesibilidad
- Las animaciones se implementan con Framer Motion para una experiencia fluida
- El proyecto está configurado para despliegue en Vercel
