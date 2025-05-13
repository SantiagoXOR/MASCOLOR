// Tipos para productos
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: number;
  image_url: string;
  asset_id?: string; // ID del asset en la tabla de assets
  category_id?: string;
  category?: Category;
  brand_id?: string;
  brand?: Brand;
  badge?: "new" | "bestseller" | "featured" | "limited";
  icon?: string;
  coverage?: number; // m² por litro
  coats?: number; // Número de manos recomendadas
  features?: ProductFeature[];
  is_featured?: boolean; // Indica si el producto está destacado
}

// Tipos para categorías
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
}

// Tipos para marcas
export interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
}

// Tipos para características de productos
export interface ProductFeature {
  id: string;
  name: string;
  value: string;
}

// Tipos para beneficios
export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Tipos para testimonios
export interface Testimonial {
  id: number;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
}

// Tipos para formulario de contacto
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Tipos para respuesta de API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}
