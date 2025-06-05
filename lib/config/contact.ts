// Configuración centralizada de información de contacto y horarios de +COLOR

export const CONTACT_CONFIG = {
  // Información de contacto principal
  phone: "0800-555-0189",
  whatsapp: "5493547639917",
  email: "info@mascolor.com",
  
  // Horarios de atención actualizados
  businessHours: {
    weekdays: "Lunes - Viernes",
    weekdaysTime: "8:00 - 16:00",
    weekends: "Sábados y Domingos",
    weekendsTime: "Cerrado"
  },
  
  // Información de la empresa
  company: {
    name: "+COLOR",
    address: "Av. Siempreviva 742, Buenos Aires",
    description: "Pinturas y revestimientos de alta calidad"
  },
  
  // URLs de WhatsApp
  whatsappUrls: {
    general: `https://wa.me/5493547639917?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20productos%20de%20%2BCOLOR.`,
    advisor: `https://wa.me/5493547639917?text=Hola%20Leandro,%20necesito%20asesoramiento%20técnico%20sobre%20productos%20%2BCOLOR.`
  },
  
  // Información del asesor
  advisor: {
    name: "Leandro",
    role: "Asesor de +COLOR",
    roleExtended: "Asesor técnico"
  }
} as const;

// Función helper para formatear horarios
export function getFormattedBusinessHours(): string {
  return `${CONTACT_CONFIG.businessHours.weekdays}: ${CONTACT_CONFIG.businessHours.weekdaysTime}`;
}

// Función helper para obtener mensaje de WhatsApp personalizado
export function getWhatsAppMessage(type: 'general' | 'advisor' = 'general'): string {
  return CONTACT_CONFIG.whatsappUrls[type];
}
