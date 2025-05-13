import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DebugProvider } from '@/contexts/DebugContext';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { ImageDebug } from '@/components/debug/ImageDebug';
import { ProductsDebug } from '@/components/debug/ProductsDebug';
import React from 'react';

// Mock de los hooks y componentes necesarios
jest.mock('@/hooks/useProducts', () => ({
  useProducts: () => ({
    products: [
      {
        id: 'test-product-1',
        name: 'Producto de prueba 1',
        slug: 'producto-prueba-1',
        image_url: '/test-image-1.jpg',
        asset_id: 'test-asset-1',
        is_featured: true,
        category: { id: 'cat1', name: 'Categoría 1', slug: 'categoria-1' },
        brand: { id: 'brand1', name: 'Marca 1', slug: 'marca-1', logo_url: '/logo1.png' }
      },
      {
        id: 'test-product-2',
        name: 'Producto de prueba 2',
        slug: 'producto-prueba-2',
        image_url: null,
        asset_id: null,
        category: { id: 'cat2', name: 'Categoría 2', slug: 'categoria-2' },
        brand: { id: 'brand2', name: 'Marca 2', slug: 'marca-2', logo_url: '/logo2.png' }
      }
    ],
    loading: false,
    error: null
  })
}));

// Mock de window.Image
class MockImage {
  onload: () => void = () => {};
  onerror: () => void = () => {};
  src: string = '';
  
  constructor() {
    // Simular carga exitosa después de un breve retraso
    setTimeout(() => {
      if (this.src && this.src !== '/test-image-error.jpg') {
        this.onload();
      } else {
        this.onerror();
      }
    }, 10);
  }
}

// Reemplazar window.Image con nuestro mock
beforeAll(() => {
  // @ts-ignore
  global.Image = MockImage;
});

// Restaurar window.Image después de las pruebas
afterAll(() => {
  // @ts-ignore
  delete global.Image;
});

// Componente de prueba que integra todos los componentes de depuración
const TestDebugSystem = () => {
  return (
    <DebugProvider>
      <div data-testid="app-container">
        <DebugPanel />
        <ProductsDebug 
          products={[
            {
              id: 'test-product-1',
              name: 'Producto de prueba 1',
              slug: 'producto-prueba-1',
              image_url: '/test-image-1.jpg',
              asset_id: 'test-asset-1',
              is_featured: true,
              category: { id: 'cat1', name: 'Categoría 1', slug: 'categoria-1' },
              brand: { id: 'brand1', name: 'Marca 1', slug: 'marca-1', logo_url: '/logo1.png' }
            }
          ]}
          filterType="category"
          activeCategory="categoria-1"
          activeBrand={null}
          loading={false}
        />
        <ImageDebug imagePaths={['/test-image-1.jpg', '/test-image-error.jpg']} />
      </div>
    </DebugProvider>
  );
};

describe('Debug System Integration', () => {
  // Espiar console.log para verificar los logs
  let consoleLogSpy: jest.SpyInstance;
  
  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Forzar NODE_ENV a development para las pruebas
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    return () => {
      process.env.NODE_ENV = originalNodeEnv;
    };
  });
  
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });
  
  it('should render the debug panel and allow toggling debuggers', async () => {
    render(<TestDebugSystem />);
    
    // Verificar que el panel de depuración está presente
    const debugPanelButton = screen.getByLabelText(/abrir panel de depuración/i);
    expect(debugPanelButton).toBeInTheDocument();
    
    // Abrir el panel de depuración
    fireEvent.click(debugPanelButton);
    
    // Verificar que el panel se abrió
    expect(screen.getByText(/Panel de Depuración/i)).toBeInTheDocument();
    
    // Expandir el panel
    const expandButton = screen.getByLabelText(/expandir panel/i);
    fireEvent.click(expandButton);
    
    // Activar el depurador de productos
    const productsDebuggerButton = screen.getByText(/Productos/i).closest('div')?.querySelector('button');
    if (productsDebuggerButton) {
      fireEvent.click(productsDebuggerButton);
    }
    
    // Verificar que ahora el botón de Products Debug está visible
    await waitFor(() => {
      expect(screen.getByText(/Products Debug/i)).toBeInTheDocument();
    });
  });
  
  it('should allow interaction between debuggers', async () => {
    render(<TestDebugSystem />);
    
    // Abrir el panel de depuración
    const debugPanelButton = screen.getByLabelText(/abrir panel de depuración/i);
    fireEvent.click(debugPanelButton);
    
    // Expandir el panel
    const expandButton = screen.getByLabelText(/expandir panel/i);
    fireEvent.click(expandButton);
    
    // Activar todos los depuradores
    const debuggerButtons = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.includes('Habilitar') || 
      button.getAttribute('aria-label')?.includes('Deshabilitar')
    );
    
    debuggerButtons.forEach(button => {
      fireEvent.click(button);
    });
    
    // Abrir el depurador de productos
    const productsDebugButton = screen.getByText(/Products Debug/i);
    fireEvent.click(productsDebugButton);
    
    // Verificar que se muestra la información de productos
    expect(screen.getByText(/Depuración de Productos/i)).toBeInTheDocument();
    
    // Hacer clic en "Log en consola"
    const logButton = screen.getByText(/Log en consola/i);
    fireEvent.click(logButton);
    
    // Verificar que se llamó a console.log
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG: Productos actuales'),
      expect.anything()
    );
    
    // Abrir el depurador de imágenes
    const imageDebugButton = screen.getByText(/Image Debug/i);
    fireEvent.click(imageDebugButton);
    
    // Verificar que se muestra la información de imágenes
    expect(screen.getByText(/Depuración de Imágenes/i)).toBeInTheDocument();
    
    // Esperar a que se verifiquen las imágenes
    await waitFor(() => {
      expect(screen.getByText(/Verificación completada/i)).toBeInTheDocument();
    });
    
    // Verificar que hay una imagen con error y otra con éxito
    const statusIndicators = screen.getAllByTestId('image-status-indicator');
    expect(statusIndicators.some(indicator => indicator.classList.contains('bg-green-500'))).toBe(true);
    expect(statusIndicators.some(indicator => indicator.classList.contains('bg-red-500'))).toBe(true);
  });
  
  it('should disable all debuggers when clicking "Deshabilitar todos"', async () => {
    render(<TestDebugSystem />);
    
    // Abrir el panel de depuración
    const debugPanelButton = screen.getByLabelText(/abrir panel de depuración/i);
    fireEvent.click(debugPanelButton);
    
    // Expandir el panel
    const expandButton = screen.getByLabelText(/expandir panel/i);
    fireEvent.click(expandButton);
    
    // Activar todos los depuradores
    const debuggerButtons = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.includes('Habilitar')
    );
    
    debuggerButtons.forEach(button => {
      fireEvent.click(button);
    });
    
    // Verificar que los depuradores están activos
    expect(screen.getByText(/Products Debug/i)).toBeInTheDocument();
    expect(screen.getByText(/Image Debug/i)).toBeInTheDocument();
    
    // Hacer clic en "Deshabilitar todos"
    const disableAllButton = screen.getByText(/Deshabilitar todos/i);
    fireEvent.click(disableAllButton);
    
    // Verificar que los depuradores ya no están visibles
    await waitFor(() => {
      expect(screen.queryByText(/Products Debug/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Image Debug/i)).not.toBeInTheDocument();
    });
  });
});
