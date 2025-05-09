import type { Meta, StoryObj } from '@storybook/react';
import { OptimizedImage } from './optimized-image';

const meta: Meta<typeof OptimizedImage> = {
  title: 'UI/OptimizedImage',
  component: OptimizedImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
El componente OptimizedImage extiende el componente Image de Next.js con características adicionales como:
- Carga progresiva con placeholders
- Soporte para formatos modernos (WebP, AVIF)
- Manejo de errores con imagen de respaldo
- Efectos de transición personalizables
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Ruta de la imagen principal',
    },
    placeholderSrc: {
      control: 'text',
      description: 'Ruta del placeholder de baja resolución',
    },
    fallbackSrc: {
      control: 'text',
      description: 'Ruta de la imagen de respaldo en caso de error',
    },
    alt: {
      control: 'text',
      description: 'Texto alternativo para accesibilidad',
    },
    width: {
      control: { type: 'number', min: 50, max: 1000, step: 10 },
      description: 'Ancho de la imagen en píxeles',
    },
    height: {
      control: { type: 'number', min: 50, max: 1000, step: 10 },
      description: 'Alto de la imagen en píxeles',
    },
    usePlaceholder: {
      control: 'boolean',
      description: 'Activar/desactivar el uso de placeholder',
    },
    useBlur: {
      control: 'boolean',
      description: 'Activar/desactivar el efecto de desenfoque durante la carga',
    },
    className: {
      control: 'text',
      description: 'Clases CSS para la imagen',
    },
    containerClassName: {
      control: 'text',
      description: 'Clases CSS para el contenedor',
    },
    loadingClassName: {
      control: 'text',
      description: 'Clases CSS para el indicador de carga',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OptimizedImage>;

// Ejemplo básico
export const Basic: Story = {
  args: {
    src: '/images/products/PREMIUM-LATEXEXT.png',
    alt: 'Látex Exterior Premium',
    width: 300,
    height: 300,
  },
};

// Con placeholder
export const WithPlaceholder: Story = {
  args: {
    src: '/images/products/PREMIUM-LATEXEXT.png',
    placeholderSrc: '/images/products/PREMIUM-LATEXEXT-placeholder.png',
    alt: 'Látex Exterior Premium',
    width: 300,
    height: 300,
    usePlaceholder: true,
    useBlur: true,
  },
};

// Con imagen de respaldo
export const WithFallback: Story = {
  args: {
    src: '/images/non-existent-image.jpg',
    fallbackSrc: '/images/products/PREMIUM-LATEXEXT.png',
    alt: 'Imagen con fallback',
    width: 300,
    height: 300,
  },
};

// Con clases personalizadas
export const WithCustomClasses: Story = {
  args: {
    src: '/images/products/PREMIUM-LATEXEXT.png',
    alt: 'Látex Exterior Premium',
    width: 300,
    height: 300,
    className: 'rounded-lg',
    containerClassName: 'shadow-lg',
    loadingClassName: 'bg-gray-100',
  },
};

// Ejemplo completo con todas las opciones
export const FullExample: Story = {
  args: {
    src: '/images/products/PREMIUM-LATEXEXT.png',
    placeholderSrc: '/images/products/PREMIUM-LATEXEXT-placeholder.png',
    fallbackSrc: '/images/products/PREMIUM-FRENTESIMPERMEABILIZANTES.png',
    alt: 'Látex Exterior Premium',
    width: 300,
    height: 300,
    usePlaceholder: true,
    useBlur: true,
    className: 'rounded-lg',
    containerClassName: 'shadow-lg',
    loadingClassName: 'bg-gray-100',
  },
};

// Ejemplo de uso en un diseño de tarjeta de producto
export const ProductCardExample: Story = {
  render: (args) => (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
      <OptimizedImage
        {...args}
        containerClassName="mb-4"
      />
      <div className="px-2">
        <div className="font-bold text-xl mb-2 text-mascolor-primary">Látex Exterior Premium</div>
        <p className="text-gray-700 text-base">
          Pintura de alta calidad para exteriores con máxima resistencia a la intemperie.
        </p>
      </div>
      <div className="px-2 pt-4 pb-2">
        <span className="inline-block bg-mascolor-primary/10 rounded-full px-3 py-1 text-sm font-semibold text-mascolor-primary mr-2 mb-2">
          #premium
        </span>
        <span className="inline-block bg-mascolor-primary/10 rounded-full px-3 py-1 text-sm font-semibold text-mascolor-primary mr-2 mb-2">
          #exterior
        </span>
      </div>
    </div>
  ),
  args: {
    src: '/images/products/PREMIUM-LATEXEXT.png',
    placeholderSrc: '/images/products/PREMIUM-LATEXEXT-placeholder.png',
    alt: 'Látex Exterior Premium',
    width: 300,
    height: 300,
    usePlaceholder: true,
    useBlur: true,
    className: 'rounded-lg mx-auto',
  },
};
