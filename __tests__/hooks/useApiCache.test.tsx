import { renderHook, act } from '@testing-library/react';
import { useApiCache } from '@/hooks/useApiCache';
import { DebugProvider } from '@/contexts/DebugContext';
import React from 'react';

// Mock para el contexto de depuración
jest.mock('@/contexts/DebugContext', () => {
  const originalModule = jest.requireActual('@/contexts/DebugContext');
  
  return {
    ...originalModule,
    useDebug: () => ({
      logDebug: jest.fn(),
      isDebugEnabled: true,
      activeDebuggers: [],
    }),
  };
});

// Función para envolver el hook en el proveedor de contexto
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DebugProvider>{children}</DebugProvider>
);

describe('useApiCache', () => {
  // Limpiar mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  
  // Prueba básica de carga exitosa
  it('should fetch data successfully', async () => {
    // Mock de la función de fetch
    const mockData = { test: 'data' };
    const mockFetch = jest.fn().mockResolvedValue(mockData);
    
    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(
      () => useApiCache(mockFetch, { cacheKey: 'test-key' }),
      { wrapper }
    );
    
    // Verificar estado inicial
    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    
    // Esperar a que se complete la carga
    await waitForNextUpdate();
    
    // Verificar estado final
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
  
  // Prueba de manejo de errores
  it('should handle fetch errors', async () => {
    // Mock de la función de fetch con error
    const mockError = new Error('Test error');
    const mockFetch = jest.fn().mockRejectedValue(mockError);
    const onErrorMock = jest.fn();
    
    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(
      () => useApiCache(mockFetch, { 
        cacheKey: 'test-error', 
        retryCount: 0, // Sin reintentos para simplificar la prueba
        onError: onErrorMock
      }),
      { wrapper }
    );
    
    // Esperar a que se complete la carga
    await waitForNextUpdate();
    
    // Verificar estado final
    expect(result.current.status).toBe('error');
    expect(result.current.error).toEqual(mockError);
    expect(result.current.isError).toBe(true);
    expect(onErrorMock).toHaveBeenCalledWith(mockError);
  });
  
  // Prueba de caché
  it('should use cached data when available', async () => {
    // Mock de la función de fetch
    const mockData = { test: 'cached-data' };
    const mockFetch = jest.fn().mockResolvedValue(mockData);
    
    // Renderizar el hook por primera vez
    const { result: result1, waitForNextUpdate: wait1 } = renderHook(
      () => useApiCache(mockFetch, { cacheKey: 'test-cache' }),
      { wrapper }
    );
    
    // Esperar a que se complete la carga
    await wait1();
    
    // Verificar que se llamó a fetch
    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    // Renderizar el hook por segunda vez con la misma clave de caché
    const { result: result2 } = renderHook(
      () => useApiCache(mockFetch, { cacheKey: 'test-cache' }),
      { wrapper }
    );
    
    // Verificar que se usó la caché y no se llamó a fetch de nuevo
    expect(result2.current.data).toEqual(mockData);
    expect(result2.current.status).toBe('success');
    expect(mockFetch).toHaveBeenCalledTimes(1); // Sigue siendo 1
  });
  
  // Prueba de refetch
  it('should refetch data when refetch is called', async () => {
    // Mock de la función de fetch
    const mockData1 = { test: 'data1' };
    const mockData2 = { test: 'data2' };
    const mockFetch = jest.fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);
    
    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(
      () => useApiCache(mockFetch, { cacheKey: 'test-refetch' }),
      { wrapper }
    );
    
    // Esperar a que se complete la carga inicial
    await waitForNextUpdate();
    
    // Verificar datos iniciales
    expect(result.current.data).toEqual(mockData1);
    
    // Llamar a refetch
    act(() => {
      result.current.refetch();
    });
    
    // Esperar a que se complete la recarga
    await waitForNextUpdate();
    
    // Verificar que se actualizaron los datos
    expect(result.current.data).toEqual(mockData2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
  
  // Prueba de reintentos
  it('should retry failed requests', async () => {
    // Usar temporizadores falsos para controlar el tiempo
    jest.useFakeTimers();
    
    // Mock de la función de fetch que falla y luego tiene éxito
    const mockError = new Error('Test error');
    const mockData = { test: 'retry-success' };
    const mockFetch = jest.fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockData);
    
    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(
      () => useApiCache(mockFetch, { 
        cacheKey: 'test-retry',
        retryCount: 1,
        retryDelay: 1000,
        retryBackoff: false
      }),
      { wrapper }
    );
    
    // Esperar a que falle la primera solicitud
    await waitForNextUpdate();
    
    // Verificar que está en estado de error pero no final
    expect(mockFetch).toHaveBeenCalledTimes(1);
    
    // Avanzar el tiempo para que se ejecute el reintento
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Esperar a que se complete el reintento
    await waitForNextUpdate();
    
    // Verificar que se recuperó con éxito
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
