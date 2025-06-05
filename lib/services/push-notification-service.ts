"use client";

/**
 * Servicio de notificaciones push (completamente deshabilitado)
 * Este archivo existe solo para evitar errores de importación
 * NO implementa ninguna funcionalidad real
 *
 * IMPORTANTE: Este servicio está completamente deshabilitado para evitar
 * errores de runtime relacionados con Supabase channels
 */

// Función de logging segura para depuración
const safeLog = (message: string, data?: any) => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log(`[PushNotificationService] ${message}`, data || "");
  }
};

// Objeto stub completamente vacío y seguro
export const pushNotificationService = {
  setupRealtimeNotifications: () => {
    safeLog("setupRealtimeNotifications called - service disabled");
    // Función completamente vacía - no hace nada para evitar errores
    return Promise.resolve();
  },
  subscribe: () => {
    safeLog("subscribe called - service disabled");
    // Función completamente vacía - no hace nada para evitar errores
    return Promise.resolve();
  },
  unsubscribe: () => {
    safeLog("unsubscribe called - service disabled");
    // Función completamente vacía - no hace nada para evitar errores
    return Promise.resolve();
  },
};

// Clase stub para compatibilidad - completamente segura
export class PushNotificationService {
  private static instance: PushNotificationService;

  private constructor() {
    safeLog("PushNotificationService constructor called - service disabled");
    // Constructor vacío y seguro
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  public setupRealtimeNotifications(): Promise<void> {
    safeLog("setupRealtimeNotifications called - service disabled");
    // Función completamente vacía que retorna una promesa resuelta
    // NO intenta usar Supabase para evitar errores de runtime
    return Promise.resolve();
  }

  public subscribe(): Promise<void> {
    safeLog("subscribe called - service disabled");
    // Función completamente vacía que retorna una promesa resuelta
    return Promise.resolve();
  }

  public unsubscribe(): Promise<void> {
    safeLog("unsubscribe called - service disabled");
    // Función completamente vacía que retorna una promesa resuelta
    return Promise.resolve();
  }
}
