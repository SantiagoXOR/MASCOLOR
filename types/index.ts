// Tipos para productos
export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  stock?: number;
  rating?: number;
}

// Tipos para categorías
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
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
