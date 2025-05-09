# Documentación de Componentes de Botones

## Descripción General
El sitio web +COLOR utiliza varios tipos de botones personalizados para diferentes propósitos y contextos. Estos botones están diseñados para mantener una estética coherente con la identidad visual de la marca, utilizando los colores principales y efectos visuales que mejoran la experiencia de usuario.

## Componentes de Botones

### 1. Button (Botón Básico)
**Ubicación**: `components/ui/button.tsx`

Este es el componente base de botón que utiliza shadcn/ui y Radix UI para proporcionar una base accesible y personalizable.

#### Variantes
```typescript
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
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

#### Uso
```jsx
import { Button } from "@/components/ui/button";

<Button variant="color" size="lg">Botón Principal</Button>
<Button variant="outline" size="default">Botón Secundario</Button>
<Button variant="ghost" size="sm">Botón Terciario</Button>
```

### 2. AnimatedButton (Botón Animado)
**Ubicación**: `components/ui/animated-button.tsx`

Este componente extiende la funcionalidad del botón básico añadiendo animaciones con Framer Motion para mejorar la interactividad.

#### Características
- Animaciones de hover y tap
- Transición suave entre estados
- Soporte para enlaces (con Next.js Link)
- Variantes de color personalizadas

#### Configuración de Estilos
```typescript
// Configuración de colores según variante
const getButtonStyles = () => {
  switch (variant) {
    case "default":
      return {
        background: "#870064", // Color principal de la marca
        textColor: "white",
        hoverBackground: "#FF00C7", // Color secundario de la marca
        hoverTextColor: "white",
        borderColor: "transparent",
      };
    case "outline":
      return {
        background: "transparent",
        textColor: "white",
        hoverBackground: "white",
        hoverTextColor: "#870064",
        borderColor: "white",
      };
    case "secondary":
      return {
        background: "white",
        textColor: "#870064",
        hoverBackground: "#870064",
        hoverTextColor: "white",
        borderColor: "#870064",
      };
    default:
      return {
        background: "#870064",
        textColor: "white",
        hoverBackground: "#FF00C7",
        hoverTextColor: "white",
        borderColor: "transparent",
      };
  }
};
```

#### Animaciones
```jsx
<motion.button
  className={cn(
    "animated-button relative flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all",
    sizeClasses[size as keyof typeof sizeClasses],
    className
  )}
  style={{
    backgroundColor: buttonStyles.background,
    color: buttonStyles.textColor,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: buttonStyles.borderColor,
  } as React.CSSProperties}
  whileHover={{
    backgroundColor: buttonStyles.hoverBackground,
    color: buttonStyles.hoverTextColor,
    borderRadius: "12px",
    scale: 1.02,
    transition: { duration: 0.3 },
  } as any}
  whileTap={{ scale: 0.98 } as any}
  {...props}
>
  <motion.span
    className="relative z-10"
    initial={{ x: 0 }}
    whileHover={{ x: variant === "default" ? -4 : 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {children}
  </motion.span>
</motion.button>
```

#### Uso
```jsx
import { AnimatedButton } from "@/components/ui/animated-button";

<AnimatedButton variant="default" size="lg">
  Botón Animado
</AnimatedButton>

<AnimatedButton variant="outline" size="default" href="/contacto" asChild={true}>
  <span className="flex items-center gap-2">
    Ir a Contacto
    <ArrowRight size={16} />
  </span>
</AnimatedButton>
```

### 3. SubtleButton (Botón Sutil)
**Ubicación**: `components/ui/subtle-button.tsx`

Este componente está diseñado para acciones secundarias o terciarias que requieren una presencia visual más sutil en la interfaz.

#### Características
- Diseño minimalista con transiciones suaves
- Efecto hover sutil
- Soporte para iconos
- Soporte para enlaces (con Next.js Link)

#### Implementación
```jsx
<motion.button
  className={cn(
    "subtle-button relative flex items-center justify-center gap-1.5 text-xs font-medium text-mascolor-primary hover:text-mascolor-secondary transition-colors rounded-md py-1.5 px-3 border border-transparent hover:border-mascolor-primary/20",
    className
  )}
  whileHover={{
    backgroundColor: "rgba(135, 0, 100, 0.05)",
    scale: 1.02
  } as any}
  whileTap={{ scale: 0.98 } as any}
  {...props}
>
  <span>{children}</span>
  {icon || <Plus className="h-3.5 w-3.5 stroke-current transition-all duration-300 group-hover:rotate-90" />}
</motion.button>
```

#### Uso
```jsx
import { SubtleButton } from "@/components/ui/subtle-button";

<SubtleButton>Ver detalles</SubtleButton>

<SubtleButton href="/productos/1" icon={<Eye size={14} />}>
  Ver producto
</SubtleButton>
```

## Uso en la Sección de Productos

### Botón "Ver detalles" en Tarjetas de Productos
En las tarjetas de productos se utiliza el componente `SubtleButton` para la acción "Ver detalles":

```jsx
<CardFooter className="flex justify-center pt-2 pb-3 mt-auto">
  <SubtleButton className="text-xs px-3 py-1.5 hover:bg-mascolor-primary/10 w-full text-center">
    Ver detalles
  </SubtleButton>
</CardFooter>
```

### Botón "Ver todos los productos"
Para el botón principal al final de la sección de productos se utiliza el componente `AnimatedButton`:

```jsx
<motion.div className="flex justify-center mt-14">
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

### Botones de Navegación del Carrusel
Para los botones de navegación del carrusel de productos se utiliza el componente `Button` básico:

```jsx
<div className="flex justify-center gap-3 mt-6">
  <Button
    variant="outline"
    size="icon"
    className={cn(
      "h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-mascolor-gray-200 shadow-sm hover:bg-mascolor-primary/10 transition-all duration-300",
      !canScrollPrev && "opacity-50 cursor-not-allowed"
    )}
    disabled={!canScrollPrev}
    onClick={scrollPrev}
  >
    <ArrowLeft className="h-5 w-5 text-mascolor-primary" />
    <span className="sr-only">Anterior</span>
  </Button>
  <Button
    variant="outline"
    size="icon"
    className={cn(
      "h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-mascolor-gray-200 shadow-sm hover:bg-mascolor-primary/10 transition-all duration-300",
      !canScrollNext && "opacity-50 cursor-not-allowed"
    )}
    disabled={!canScrollNext}
    onClick={scrollNext}
  >
    <ArrowRight className="h-5 w-5 text-mascolor-primary" />
    <span className="sr-only">Siguiente</span>
  </Button>
</div>
```

## Estilos Globales
En el archivo `globals.css` se definen algunos estilos adicionales para los botones:

```css
/* Estilos para el botón animado */
.animated-button {
  box-shadow: 0 4px 15px rgba(135, 0, 100, 0.2);
  transition: all 0.3s ease;
}

.animated-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(135, 0, 100, 0.3);
}

/* Mejora de accesibilidad para focus visible */
.animated-button:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

/* Estilos para el botón sutil */
.subtle-button {
  padding: 6px 12px;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}
```

## Consideraciones de Accesibilidad
- Todos los botones mantienen un contraste adecuado entre el texto y el fondo
- Se incluyen estados de focus visibles para navegación por teclado
- Los botones con iconos incluyen texto alternativo para lectores de pantalla
- Los botones deshabilitados tienen estilos visuales que indican su estado
