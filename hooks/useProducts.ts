import { useState, useEffect } from 'react';
import { Product } from '@/types';

// Datos de ejemplo para productos
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Pintura Látex Interior",
    category: "pinturas",
    description: "Pintura de alta calidad para interiores con acabado mate.",
    price: 4500,
    image: "/images/products/placeholder.jpg",
  },
  {
    id: 2,
    name: "Pintura Látex Exterior",
    category: "pinturas",
    description: "Pintura resistente a la intemperie para exteriores.",
    price: 5200,
    image: "/images/products/placeholder.jpg",
  },
  {
    id: 3,
    name: "Revestimiento Texturado",
    category: "revestimientos",
    description: "Revestimiento texturado para paredes exteriores.",
    price: 6800,
    image: "/images/products/placeholder.jpg",
  },
  {
    id: 4,
    name: "Esmalte Sintético",
    category: "esmaltes",
    description: "Esmalte sintético de secado rápido para maderas y metales.",
    price: 3900,
    image: "/images/products/placeholder.jpg",
  },
  {
    id: 5,
    name: "Rodillo Profesional",
    category: "accesorios",
    description: "Rodillo de alta calidad para pinturas látex.",
    price: 1200,
    image: "/images/products/placeholder.jpg",
  },
  {
    id: 6,
    name: "Pintura Impermeabilizante",
    category: "pinturas",
    description: "Pintura con propiedades impermeabilizantes para techos.",
    price: 7500,
    image: "/images/products/placeholder.jpg",
  },
  {
    id: 7,
    name: "Microcemento",
    category: "revestimientos",
    description: "Revestimiento de microcemento para pisos y paredes.",
    price: 8900,
    image: "/images/products/placeholder.jpg",
  },
  {
    id: 8,
    name: "Esmalte al Agua",
    category: "esmaltes",
    description: "Esmalte ecológico al agua sin olor.",
    price: 4200,
    image: "/images/products/placeholder.jpg",
  },
];

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simular una llamada a API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filtrar por categoría si se proporciona
        const filteredProducts = category 
          ? mockProducts.filter(product => product.category === category)
          : mockProducts;
        
        setProducts(filteredProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido al cargar productos'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return {
    products,
    loading,
    error
  };
}
