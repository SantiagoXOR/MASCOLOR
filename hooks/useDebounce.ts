import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param value Valor a debounce
 * @param delay Tiempo de espera en milisegundos
 * @returns Valor con debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
