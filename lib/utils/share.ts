import { Product } from "@/types";

/**
 * Utilidades para compartir productos
 */

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Genera los datos para compartir un producto
 * @param product Producto a compartir
 * @param baseUrl URL base del sitio (opcional)
 * @returns Datos para compartir
 */
export function generateProductShareData(product: Product, baseUrl?: string): ShareData {
  const siteUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://mascolor.vercel.app";
  const productUrl = `${siteUrl}/productos/${product.slug}`;
  
  return {
    title: `${product.name} - ${product.brand?.name || ""} | +COLOR`,
    text: `${product.description}\n\nDescubre más productos en +COLOR`,
    url: productUrl,
  };
}

/**
 * Comparte un producto usando la Web Share API o fallback
 * @param product Producto a compartir
 * @param baseUrl URL base del sitio (opcional)
 * @returns Promise que se resuelve cuando se completa el compartir
 */
export async function shareProduct(product: Product, baseUrl?: string): Promise<void> {
  const shareData = generateProductShareData(product, baseUrl);

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(shareData.url);
      
      // Mostrar notificación (podrías usar un toast aquí)
      if (typeof window !== "undefined") {
        // Crear una notificación temporal
        const notification = document.createElement("div");
        notification.textContent = "Enlace copiado al portapapeles";
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    }
  } catch (error) {
    console.error("Error al compartir producto:", error);
    throw new Error("No se pudo compartir el producto");
  }
}

/**
 * Genera un mensaje de WhatsApp para consultar sobre un producto
 * @param product Producto sobre el que consultar
 * @returns Mensaje formateado para WhatsApp
 */
export function generateWhatsAppMessage(product: Product): string {
  const brandText = product.brand?.name ? ` de ${product.brand.name}` : "";
  const categoryText = product.category?.name ? ` (${product.category.name})` : "";
  
  return `Hola! Me interesa el producto *${product.name}*${brandText}${categoryText}. ¿Podrían darme más información sobre disponibilidad y precios?`;
}

/**
 * Abre WhatsApp con un mensaje predefinido sobre el producto
 * @param product Producto sobre el que consultar
 * @param phoneNumber Número de WhatsApp (opcional, usa el por defecto)
 */
export function openWhatsAppContact(product: Product, phoneNumber?: string): void {
  const phone = phoneNumber || "5493547639917"; // Número por defecto
  const message = generateWhatsAppMessage(product);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

/**
 * Genera una URL para compartir en redes sociales
 * @param platform Plataforma de red social
 * @param product Producto a compartir
 * @param baseUrl URL base del sitio (opcional)
 * @returns URL para compartir
 */
export function generateSocialShareUrl(
  platform: "facebook" | "twitter" | "linkedin" | "whatsapp",
  product: Product,
  baseUrl?: string
): string {
  const shareData = generateProductShareData(product, baseUrl);
  
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`;
    
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
    
    case "whatsapp":
      const whatsappMessage = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      return `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    
    default:
      throw new Error(`Plataforma no soportada: ${platform}`);
  }
}

/**
 * Copia el enlace del producto al portapapeles
 * @param product Producto cuyo enlace copiar
 * @param baseUrl URL base del sitio (opcional)
 * @returns Promise que se resuelve cuando se copia el enlace
 */
export async function copyProductLink(product: Product, baseUrl?: string): Promise<void> {
  const shareData = generateProductShareData(product, baseUrl);
  
  try {
    await navigator.clipboard.writeText(shareData.url);
  } catch (error) {
    console.error("Error al copiar enlace:", error);
    throw new Error("No se pudo copiar el enlace");
  }
}
