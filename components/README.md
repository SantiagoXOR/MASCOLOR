# Componentes de +COLOR

Este directorio contiene todos los componentes reutilizables de la aplicación +COLOR.

## Estructura

```
components/
├── ui/                    # Componentes de interfaz de usuario
│   ├── button.tsx        # Botón con variantes
│   ├── card.tsx          # Tarjeta con header, content y footer
│   ├── input.tsx         # Campo de entrada
│   ├── textarea.tsx      # Área de texto
│   ├── tabs.tsx          # Pestañas
│   ├── separator.tsx     # Separador
│   ├── badge.tsx         # Insignia
│   └── alert.tsx         # Alerta
├── layout/               # Componentes de layout principales
│   ├── header.tsx        # Encabezado de la página
│   └── footer.tsx        # Pie de página
└── sections/             # Secciones específicas de páginas
    ├── hero.tsx          # Sección hero
    ├── products.tsx      # Sección de productos
    ├── benefits.tsx      # Sección de beneficios
    └── contact.tsx       # Sección de contacto
```

## Componentes UI

Los componentes UI son los bloques de construcción básicos de la interfaz de usuario. Están basados en shadcn/ui y utilizan Radix UI para la accesibilidad.

### Button

```tsx
import { Button } from "@/components/ui/button";

<Button variant="color">Botón</Button>
```

Variantes disponibles:
- `default`: Estilo primario
- `destructive`: Para acciones destructivas
- `outline`: Con borde
- `secondary`: Estilo secundario
- `ghost`: Sin fondo
- `link`: Estilo de enlace
- `color`: Estilo con el color principal de la marca

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Componentes de Layout

### Header

El encabezado de la página que incluye el logo, la navegación y un botón CTA.

```tsx
import { Header } from "@/components/layout/header";

<Header />
```

### Footer

El pie de página que incluye enlaces, información de contacto y redes sociales.

```tsx
import { Footer } from "@/components/layout/footer";

<Footer />
```

## Secciones

### HeroSection

La sección principal de la página de inicio.

```tsx
import { HeroSection } from "@/components/sections/hero";

<HeroSection />
```

### ProductsSection

Sección que muestra los productos organizados por categorías.

```tsx
import { ProductsSection } from "@/components/sections/products";

<ProductsSection />
```

### BenefitsSection

Sección que muestra los beneficios de los productos.

```tsx
import { BenefitsSection } from "@/components/sections/benefits";

<BenefitsSection />
```

### ContactSection

Sección con formulario de contacto e información.

```tsx
import { ContactSection } from "@/components/sections/contact";

<ContactSection />
```

## Convenciones

1. Cada componente debe:
   - Tener un nombre descriptivo en PascalCase
   - Exportar una interfaz de props si es necesario
   - Incluir documentación básica de uso

2. Organización:
   - Componentes genéricos en `/ui`
   - Componentes específicos en `/sections`
   - Layouts principales en `/layout`

3. Importaciones:
   - Usar rutas absolutas con el alias `@/`
   - Mantener las importaciones organizadas y agrupadas
