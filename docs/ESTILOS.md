# Documentación de Estilos y Colores

## Descripción General
El sitio web +COLOR utiliza una paleta de colores específica basada en tonos de púrpura/magenta que refleja la identidad visual de la marca. Los estilos están implementados principalmente con Tailwind CSS, con algunas personalizaciones adicionales en archivos CSS.

## Paleta de Colores

### Colores Principales
La paleta de colores principal está definida en `tailwind.config.ts`:

```typescript
colors: {
  mascolor: {
    primary: "#870064",    // Cardinal Pink 900 como color principal
    secondary: "#FF00C7",  // Cardinal Pink 600 como acento
    accent: "#FF54C9",     // Cardinal Pink 400 como acento secundario
    neutral: "#9E9E9E",    // Gris neutro
    dark: "#212121",       // Casi negro
    light: "#F5F5F5",      // Casi blanco
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
    },
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
    },
  },
}
```

### Variables CSS
Las variables CSS para los colores están definidas en `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 328 100% 39%;  /* Cardinal Pink 900 - #870064 */
  --primary-foreground: 210 40% 98%;
  --secondary: 322 100% 50%;  /* Cardinal Pink 600 - #FF00C7 */
  --secondary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 325 100% 66%;  /* Cardinal Pink 400 - #FF54C9 */
  --accent-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 328 100% 39%;
  --radius: 0.5rem;
}
```

## Tipografía

### Fuentes Principales
Las fuentes utilizadas en el proyecto están definidas en `app/layout.tsx` y `tailwind.config.ts`:

```typescript
// app/layout.tsx
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ['400', '500', '700', '900'],
  subsets: ["latin"],
  variable: "--font-poppins"
});

// tailwind.config.ts
fontFamily: {
  mazzard: ["var(--font-poppins)", "sans-serif"],
  inter: ["var(--font-inter)", "sans-serif"],
  sans: [
    'var(--font-poppins)',
    'sans-serif'
  ],
  stolzl: ["stolzl", "sans-serif"],
}
```

### Pesos de Fuente
```typescript
fontWeight: {
  thin: "100",
  light: "200",
  book: "300",
  regular: "400",
  medium: "500",
  bold: "700",
}
```

## Componentes de Estilo

### Botones
Los botones tienen estilos específicos según su variante:

```typescript
// button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        color: "bg-mascolor-primary text-white hover:bg-mascolor-primary/90",
      },
      // ...
    }
  }
)
```

### Badges (Insignias)
Las insignias tienen estilos específicos según su variante:

```typescript
// badge.tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        color: "border-transparent bg-mascolor-primary text-white hover:bg-mascolor-primary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

### Product Badges
Las insignias de productos tienen colores específicos según su tipo:

```typescript
// product-badge.tsx
const badgeConfig = {
  new: {
    label: "Nuevo",
    icon: <Sparkles className="h-3 w-3 mr-1" />,
    className: "bg-blue-500 hover:bg-blue-600",
  },
  bestseller: {
    label: "+ Vendido",
    icon: <TrendingUp className="h-3 w-3 mr-1" />,
    className: "bg-amber-500 hover:bg-amber-600",
  },
  featured: {
    label: "Destacado",
    icon: <Star className="h-3 w-3 mr-1" />,
    className: "bg-mascolor-primary hover:bg-mascolor-primary/90",
  },
  limited: {
    label: "Edición Limitada",
    icon: <Clock className="h-3 w-3 mr-1" />,
    className: "bg-purple-600 hover:bg-purple-700",
  },
};
```

## Efectos Visuales

### Fondos con Blur
Se utilizan fondos con efecto blur en varios componentes para dar profundidad:

```jsx
// Ejemplo en TabsList
<TabsList className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-md border border-mascolor-gray-200">
  {/* ... */}
</TabsList>

// Ejemplo en Card
<Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 group bg-white/80 backdrop-blur-sm h-full flex flex-col rounded-xl">
  {/* ... */}
</Card>

// Ejemplo en Badge
<Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-mascolor-gray-200">
  {/* ... */}
</Badge>
```

### Gradientes
Se utilizan gradientes para crear efectos visuales en fondos:

```jsx
// Ejemplo en ProductsSection
<section className="py-16 bg-white relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-mascolor-primary/5 opacity-30"></div>
  {/* ... */}
</section>
```

### Sombras
Se utilizan sombras para dar profundidad a los elementos:

```jsx
// Ejemplo en AnimatedButton
<AnimatedButton
  className="group mx-auto bg-mascolor-primary hover:bg-mascolor-primary/90 text-white shadow-lg shadow-mascolor-primary/20 hover:shadow-mascolor-primary/30"
>
  {/* ... */}
</AnimatedButton>

// Estilos CSS para AnimatedButton
.animated-button {
  box-shadow: 0 4px 15px rgba(135, 0, 100, 0.2);
  transition: all 0.3s ease;
}
```

## Animaciones

### Framer Motion
Se utiliza Framer Motion para crear animaciones fluidas:

```jsx
// Ejemplo de animación de entrada
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {/* ... */}
</motion.div>

// Ejemplo de animación de hover
<motion.button
  whileHover={{
    backgroundColor: buttonStyles.hoverBackground,
    color: buttonStyles.hoverTextColor,
    borderRadius: "12px",
    scale: 1.02,
    transition: { duration: 0.3 },
  }}
  whileTap={{ scale: 0.98 }}
>
  {/* ... */}
</motion.button>
```

### Transiciones CSS
Se utilizan transiciones CSS para efectos más simples:

```jsx
// Ejemplo en TabsTrigger
<TabsTrigger
  className="px-5 md:px-7 py-2.5 rounded-full data-[state=active]:bg-mascolor-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 whitespace-nowrap hover:bg-mascolor-primary/10"
>
  {/* ... */}
</TabsTrigger>

// Ejemplo en Image
<Image
  className="object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
  {/* ... */}
/>
```

## Responsive Design

### Breakpoints
Se utilizan los breakpoints estándar de Tailwind CSS:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Ejemplos de Diseño Responsive
```jsx
// Grid responsive para productos
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* ... */}
</div>

// Texto responsive
<h2 className="text-4xl md:text-5xl font-bold text-mascolor-dark text-center">
  {/* ... */}
</h2>

// Visibilidad responsive
<span className="hidden md:inline font-medium">{category.name}</span>
<span className="md:hidden font-medium">{category.name}</span>
```

## Logos e Imágenes

### Logos
Los logos tienen estilos específicos según el contexto:

```jsx
// Logo en el header
<Image
  src="/images/logos/+color.svg"
  alt="Logo +COLOR"
  fill
  className="object-contain transition-all duration-300"
  style={{
    filter: isScrolled
      ? `brightness(0) saturate(100%) invert(10%) sepia(83%) saturate(5728%) hue-rotate(307deg) brightness(77%) contrast(111%)` // Color #870064
      : "brightness(0) invert(1)", // Blanco
    opacity: 1
  }}
  priority
/>

// Logo en el carrusel de marcas
<Image
  src="/images/logos/facilfix.svg"
  alt="Logo Facil Fix"
  width={140}
  height={56}
  className="object-contain w-full h-full cursor-pointer transition-all duration-300"
  style={{
    filter: "brightness(0) invert(1)",
    opacity: activeBrand === "facilfix" ? 1 : 0.6,
    transform: activeBrand === "facilfix" ? "scale(1.15)" : "scale(1)",
    transition: "all 0.3s ease-in-out"
  }}
  priority
/>
```

### Imágenes de Productos
Las imágenes de productos tienen estilos específicos:

```jsx
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
```

## Notas Adicionales
- Se utiliza `clsx` y `tailwind-merge` (a través de la función `cn()`) para combinar clases de Tailwind de manera eficiente
- Se utilizan variables CSS para mantener la coherencia en los colores y facilitar cambios globales
- Se aplican efectos visuales sutiles (blur, sombras, gradientes) para mejorar la estética sin comprometer el rendimiento
- Se prioriza la accesibilidad con contrastes adecuados y estados de focus visibles
