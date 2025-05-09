import { useState, useEffect } from 'react';
import { Category } from '@/types';

// Datos de ejemplo para categorías
const mockCategories: Category[] = [
  { id: "pinturas", name: "Pinturas" },
  { id: "revestimientos", name: "Revestimientos" },
  { id: "esmaltes", name: "Esmaltes" },
  { id: "accesorios", name: "Accesorios" },
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simular una llamada a API
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setCategories(mockCategories);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido al cargar categorías'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error
  };
}
