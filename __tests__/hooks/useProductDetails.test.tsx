import { renderHook, waitFor } from '@testing-library/react';
import { useProductDetails, useRelatedProducts } from '@/hooks/useProductDetails';
import { getProductById, getProductBySlug, getProducts } from '@/lib/supabase/products';
import { Product } from '@/types';

// Mock de las funciones de Supabase
jest.mock('@/lib/supabase/products');

const mockGetProductById = getProductById as jest.MockedFunction<typeof getProductById>;
const mockGetProductBySlug = getProductBySlug as jest.MockedFunction<typeof getProductBySlug>;
const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

const mockProduct: Product = {
  id: '1',
  slug: 'test-product',
  name: 'Producto de Prueba',
  description: 'Descripción del producto de prueba',
  image_url: '/test-image.jpg',
  category: {
    id: '1',
    slug: 'test-category',
    name: 'Categoría de Prueba'
  },
  brand: {
    id: '1',
    slug: 'test-brand',
    name: 'Marca de Prueba'
  },
  features: [
    {
      id: '1',
      name: 'Característica 1',
      value: 'Valor 1'
    }
  ]
};

const mockRelatedProducts: Product[] = [
  {
    id: '2',
    slug: 'related-product-1',
    name: 'Producto Relacionado 1',
    description: 'Descripción del producto relacionado 1',
    image_url: '/related-image-1.jpg',
    category: mockProduct.category,
    brand: mockProduct.brand
  },
  {
    id: '3',
    slug: 'related-product-2',
    name: 'Producto Relacionado 2',
    description: 'Descripción del producto relacionado 2',
    image_url: '/related-image-2.jpg',
    category: mockProduct.category,
    brand: mockProduct.brand
  }
];

describe('useProductDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('con productId', () => {
    it('obtiene producto por ID exitosamente', async () => {
      mockGetProductById.mockResolvedValue(mockProduct);

      const { result } = renderHook(() => 
        useProductDetails({ productId: '1' })
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.product).toBe(null);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(mockProduct);
      expect(result.current.error).toBe(null);
      expect(mockGetProductById).toHaveBeenCalledWith('1');
    });

    it('maneja error al obtener producto por ID', async () => {
      const error = new Error('Producto no encontrado');
      mockGetProductById.mockRejectedValue(error);

      const { result } = renderHook(() => 
        useProductDetails({ productId: '1' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toBe(null);
      expect(result.current.error).toEqual(error);
    });

    it('maneja producto no encontrado', async () => {
      mockGetProductById.mockResolvedValue(null);

      const { result } = renderHook(() => 
        useProductDetails({ productId: '1' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toBe(null);
      expect(result.current.error?.message).toBe('Producto no encontrado');
    });
  });

  describe('con productSlug', () => {
    it('obtiene producto por slug exitosamente', async () => {
      mockGetProductBySlug.mockResolvedValue(mockProduct);

      const { result } = renderHook(() => 
        useProductDetails({ productSlug: 'test-product' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(mockProduct);
      expect(result.current.error).toBe(null);
      expect(mockGetProductBySlug).toHaveBeenCalledWith('test-product');
    });

    it('maneja error al obtener producto por slug', async () => {
      const error = new Error('Producto no encontrado');
      mockGetProductBySlug.mockRejectedValue(error);

      const { result } = renderHook(() => 
        useProductDetails({ productSlug: 'test-product' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toBe(null);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('sin parámetros', () => {
    it('maneja error cuando no se proporciona productId ni productSlug', async () => {
      const { result } = renderHook(() => 
        useProductDetails({})
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toBe(null);
      expect(result.current.error?.message).toBe('Se requiere productId o productSlug');
    });
  });

  describe('refetch', () => {
    it('permite refetch del producto', async () => {
      mockGetProductById.mockResolvedValue(mockProduct);

      const { result } = renderHook(() => 
        useProductDetails({ productId: '1' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetProductById).toHaveBeenCalledTimes(1);

      // Llamar refetch
      await result.current.refetch();

      expect(mockGetProductById).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useRelatedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obtiene productos relacionados por categoría', async () => {
    mockGetProducts.mockResolvedValue(mockRelatedProducts);

    const { result } = renderHook(() => 
      useRelatedProducts(mockProduct, 4)
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.relatedProducts).toEqual(mockRelatedProducts);
    expect(result.current.error).toBe(null);
    expect(mockGetProducts).toHaveBeenCalledWith({
      category: 'test-category',
      limit: 5 // +1 para excluir el producto actual
    });
  });

  it('obtiene productos relacionados por marca cuando no hay suficientes por categoría', async () => {
    const limitedCategoryProducts = [mockRelatedProducts[0]];
    const brandProducts = [mockRelatedProducts[1]];

    mockGetProducts
      .mockResolvedValueOnce(limitedCategoryProducts) // Primera llamada por categoría
      .mockResolvedValueOnce(brandProducts); // Segunda llamada por marca

    const { result } = renderHook(() => 
      useRelatedProducts(mockProduct, 4)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.relatedProducts).toHaveLength(2);
    expect(mockGetProducts).toHaveBeenCalledTimes(2);
    expect(mockGetProducts).toHaveBeenNthCalledWith(1, {
      category: 'test-category',
      limit: 5
    });
    expect(mockGetProducts).toHaveBeenNthCalledWith(2, {
      brand: 'test-brand',
      limit: 5
    });
  });

  it('maneja error al obtener productos relacionados', async () => {
    const error = new Error('Error al obtener productos');
    mockGetProducts.mockRejectedValue(error);

    const { result } = renderHook(() => 
      useRelatedProducts(mockProduct, 4)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.relatedProducts).toEqual([]);
    expect(result.current.error).toEqual(error);
  });

  it('no hace nada cuando no hay producto actual', () => {
    const { result } = renderHook(() => 
      useRelatedProducts(null, 4)
    );

    expect(result.current.relatedProducts).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockGetProducts).not.toHaveBeenCalled();
  });

  it('filtra el producto actual de los resultados', async () => {
    const productsWithCurrent = [...mockRelatedProducts, mockProduct];
    mockGetProducts.mockResolvedValue(productsWithCurrent);

    const { result } = renderHook(() => 
      useRelatedProducts(mockProduct, 4)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.relatedProducts).toEqual(mockRelatedProducts);
    expect(result.current.relatedProducts).not.toContain(mockProduct);
  });
});
