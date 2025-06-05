import {
  generateProductShareData,
  shareProduct,
  generateWhatsAppMessage,
  openWhatsAppContact,
  generateSocialShareUrl,
  copyProductLink
} from '@/lib/utils/share';
import { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  slug: 'test-product',
  name: 'Producto de Prueba',
  description: 'Descripción del producto de prueba para compartir',
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
  }
};

describe('Share utilities', () => {
  beforeEach(() => {
    // Mock de navigator.share
    Object.defineProperty(navigator, 'share', {
      writable: true,
      value: jest.fn().mockResolvedValue(undefined)
    });

    // Mock de navigator.canShare
    Object.defineProperty(navigator, 'canShare', {
      writable: true,
      value: jest.fn().mockReturnValue(true)
    });

    // Mock de navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    });

    // Mock de window.open
    Object.defineProperty(window, 'open', {
      writable: true,
      value: jest.fn()
    });

    // Mock de document.createElement y document.body
    const mockElement = {
      style: { cssText: '' },
      textContent: '',
      remove: jest.fn()
    };

    Object.defineProperty(document, 'createElement', {
      writable: true,
      value: jest.fn().mockReturnValue(mockElement)
    });

    Object.defineProperty(document.body, 'appendChild', {
      writable: true,
      value: jest.fn()
    });

    Object.defineProperty(document.body, 'removeChild', {
      writable: true,
      value: jest.fn()
    });

    jest.clearAllMocks();
  });

  describe('generateProductShareData', () => {
    it('genera datos de compartir correctamente', () => {
      const shareData = generateProductShareData(mockProduct);

      expect(shareData).toEqual({
        title: 'Producto de Prueba - Marca de Prueba | +COLOR',
        text: 'Descripción del producto de prueba para compartir\n\nDescubre más productos en +COLOR',
        url: 'https://mascolor.vercel.app/productos/test-product'
      });
    });

    it('genera datos de compartir con URL base personalizada', () => {
      const shareData = generateProductShareData(mockProduct, 'https://custom-domain.com');

      expect(shareData.url).toBe('https://custom-domain.com/productos/test-product');
    });

    it('maneja producto sin marca', () => {
      const productWithoutBrand = { ...mockProduct, brand: undefined };
      const shareData = generateProductShareData(productWithoutBrand);

      expect(shareData.title).toBe('Producto de Prueba -  | +COLOR');
    });
  });

  describe('shareProduct', () => {
    it('usa Web Share API cuando está disponible', async () => {
      await shareProduct(mockProduct);

      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Producto de Prueba - Marca de Prueba | +COLOR',
        text: 'Descripción del producto de prueba para compartir\n\nDescubre más productos en +COLOR',
        url: 'https://mascolor.vercel.app/productos/test-product'
      });
    });

    it('usa fallback cuando Web Share API no está disponible', async () => {
      // Simular que Web Share API no está disponible
      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: undefined
      });

      await shareProduct(mockProduct);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://mascolor.vercel.app/productos/test-product'
      );
    });

    it('usa fallback cuando canShare retorna false', async () => {
      Object.defineProperty(navigator, 'canShare', {
        writable: true,
        value: jest.fn().mockReturnValue(false)
      });

      await shareProduct(mockProduct);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://mascolor.vercel.app/productos/test-product'
      );
    });

    it('maneja errores al compartir', async () => {
      const error = new Error('Error al compartir');
      (navigator.share as jest.Mock).mockRejectedValue(error);

      await expect(shareProduct(mockProduct)).rejects.toThrow('No se pudo compartir el producto');
    });
  });

  describe('generateWhatsAppMessage', () => {
    it('genera mensaje de WhatsApp correctamente', () => {
      const message = generateWhatsAppMessage(mockProduct);

      expect(message).toBe(
        'Hola! Me interesa el producto *Producto de Prueba* de Marca de Prueba (Categoría de Prueba). ¿Podrían darme más información sobre disponibilidad y precios?'
      );
    });

    it('maneja producto sin marca', () => {
      const productWithoutBrand = { ...mockProduct, brand: undefined };
      const message = generateWhatsAppMessage(productWithoutBrand);

      expect(message).toBe(
        'Hola! Me interesa el producto *Producto de Prueba* (Categoría de Prueba). ¿Podrían darme más información sobre disponibilidad y precios?'
      );
    });

    it('maneja producto sin categoría', () => {
      const productWithoutCategory = { ...mockProduct, category: undefined };
      const message = generateWhatsAppMessage(productWithoutCategory);

      expect(message).toBe(
        'Hola! Me interesa el producto *Producto de Prueba* de Marca de Prueba. ¿Podrían darme más información sobre disponibilidad y precios?'
      );
    });
  });

  describe('openWhatsAppContact', () => {
    it('abre WhatsApp con mensaje predefinido', () => {
      openWhatsAppContact(mockProduct);

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/5493547639917?text='),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('usa número personalizado', () => {
      openWhatsAppContact(mockProduct, '1234567890');

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/1234567890?text='),
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('generateSocialShareUrl', () => {
    it('genera URL para Facebook', () => {
      const url = generateSocialShareUrl('facebook', mockProduct);

      expect(url).toContain('https://www.facebook.com/sharer/sharer.php?u=');
      expect(url).toContain(encodeURIComponent('https://mascolor.vercel.app/productos/test-product'));
    });

    it('genera URL para Twitter', () => {
      const url = generateSocialShareUrl('twitter', mockProduct);

      expect(url).toContain('https://twitter.com/intent/tweet?text=');
      expect(url).toContain(encodeURIComponent('Producto de Prueba - Marca de Prueba | +COLOR'));
    });

    it('genera URL para LinkedIn', () => {
      const url = generateSocialShareUrl('linkedin', mockProduct);

      expect(url).toContain('https://www.linkedin.com/sharing/share-offsite/?url=');
      expect(url).toContain(encodeURIComponent('https://mascolor.vercel.app/productos/test-product'));
    });

    it('genera URL para WhatsApp', () => {
      const url = generateSocialShareUrl('whatsapp', mockProduct);

      expect(url).toContain('https://wa.me/?text=');
      expect(url).toContain(encodeURIComponent('Producto de Prueba - Marca de Prueba | +COLOR'));
    });

    it('lanza error para plataforma no soportada', () => {
      expect(() => {
        generateSocialShareUrl('instagram' as any, mockProduct);
      }).toThrow('Plataforma no soportada: instagram');
    });
  });

  describe('copyProductLink', () => {
    it('copia enlace al portapapeles', async () => {
      await copyProductLink(mockProduct);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://mascolor.vercel.app/productos/test-product'
      );
    });

    it('maneja errores al copiar', async () => {
      const error = new Error('Error al copiar');
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(error);

      await expect(copyProductLink(mockProduct)).rejects.toThrow('No se pudo copiar el enlace');
    });
  });
});
