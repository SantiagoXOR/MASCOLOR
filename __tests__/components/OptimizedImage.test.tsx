import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OptimizedImage } from '@/components/ui/optimized-image';

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, onError, ...props }: any) => {
    // Simular el evento onLoad después de renderizar
    setTimeout(() => {
      if (onLoad) onLoad();
    }, 0);
    
    return (
      <img 
        src={src} 
        alt={alt} 
        {...props} 
        data-testid="next-image"
      />
    );
  },
}));

describe('OptimizedImage Component', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('renderiza correctamente con propiedades básicas', async () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={200}
        height={150}
      />
    );

    // Verificar que la imagen se renderiza
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
    
    // Verificar que el indicador de carga desaparece después de cargar
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('muestra un placeholder mientras carga la imagen', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        placeholderSrc="/placeholder.jpg"
        alt="Test image"
        width={200}
        height={150}
        usePlaceholder={true}
      />
    );

    // Verificar que inicialmente se muestra el placeholder
    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', '/placeholder.jpg');
    
    // Verificar que se muestra el indicador de carga
    const loadingIndicator = screen.getByRole('status');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('cambia del placeholder a la imagen real después de cargar', async () => {
    const { rerender } = render(
      <OptimizedImage
        src="/test-image.jpg"
        placeholderSrc="/placeholder.jpg"
        alt="Test image"
        width={200}
        height={150}
        usePlaceholder={true}
      />
    );

    // Verificar que inicialmente se muestra el placeholder
    let image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', '/placeholder.jpg');
    
    // Simular que la imagen ha cargado
    await waitFor(() => {
      rerender(
        <OptimizedImage
          src="/test-image.jpg"
          placeholderSrc="/placeholder.jpg"
          alt="Test image"
          width={200}
          height={150}
          usePlaceholder={false}
        />
      );
    });
    
    // Verificar que ahora se muestra la imagen real
    image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    
    // Verificar que el indicador de carga ha desaparecido
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('muestra la imagen de fallback en caso de error', async () => {
    // Modificar el mock para simular un error
    jest.mock('next/image', () => ({
      __esModule: true,
      default: ({ src, alt, onError, ...props }: any) => {
        // Simular el evento onError después de renderizar
        setTimeout(() => {
          if (onError) onError();
        }, 0);
        
        return (
          <img 
            src={src} 
            alt={alt} 
            {...props} 
            data-testid="next-image"
          />
        );
      },
    }));

    render(
      <OptimizedImage
        src="/test-image.jpg"
        fallbackSrc="/fallback.jpg"
        alt="Test image"
        width={200}
        height={150}
      />
    );

    // Verificar que después del error se muestra la imagen de fallback
    await waitFor(() => {
      const image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('src', '/fallback.jpg');
    });
  });

  it('aplica clases CSS personalizadas', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={200}
        height={150}
        className="custom-image-class"
        containerClassName="custom-container-class"
        loadingClassName="custom-loading-class"
      />
    );

    // Verificar que se aplican las clases personalizadas
    const image = screen.getByTestId('next-image');
    expect(image).toHaveClass('custom-image-class');
    
    const container = image.closest('div');
    expect(container).toHaveClass('custom-container-class');
    
    const loadingIndicator = screen.getByRole('status');
    expect(loadingIndicator).toHaveClass('custom-loading-class');
  });
});
