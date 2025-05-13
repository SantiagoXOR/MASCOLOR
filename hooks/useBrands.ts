import { useState, useEffect } from 'react';
import { Brand } from '@/types';
import { getBrands } from '@/lib/supabase/products';

/**
 * Hook para obtener marcas de productos
 * @returns Marcas, estado de carga y error
 */
export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        
        // Usar el servicio de Supabase para obtener marcas
        const data = await getBrands();
        
        setBrands(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar marcas:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido al cargar marcas'));
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return {
    brands,
    loading,
    error
  };
}
