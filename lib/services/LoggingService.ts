"use client";

import { throttle } from "@/lib/utils/throttle";

// Tipos para el servicio de registro
export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogMode = "minimal" | "detailed";

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  source: string;
  message: string;
  data?: any;
}

export interface LoggingOptions {
  maxLogEntries?: number;
  logToConsole?: boolean;
  mode?: LogMode;
}

/**
 * Servicio de registro centralizado
 * Implementa un patrón singleton para asegurar una única instancia
 */
class LoggingService {
  private static instance: LoggingService;
  private logs: LogEntry[] = [];
  private listeners: Set<(logs: LogEntry[]) => void> = new Set();
  private options: LoggingOptions = {
    maxLogEntries: 1000,
    logToConsole: true,
    mode: "minimal",
  };
  private isEnabled: boolean = process.env.NODE_ENV !== "production";

  // Constructor privado para evitar instanciación directa
  private constructor() {
    // Inicializar el servicio
    console.log("🔍 Inicializando servicio de registro centralizado");
  }

  // Método para obtener la instancia única
  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  // Configurar opciones
  public configure(options: Partial<LoggingOptions>): void {
    this.options = { ...this.options, ...options };
  }

  // Habilitar o deshabilitar el registro
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Establecer el modo de registro
  public setMode(mode: LogMode): void {
    this.options.mode = mode;
  }

  // Método principal para registrar
  public log(
    level: LogLevel,
    source: string,
    message: string,
    data?: any
  ): void {
    if (!this.isEnabled) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      source,
      message,
      data: this.options.mode === "detailed" ? data : undefined,
    };

    // Añadir al registro interno
    this.logs.push(entry);

    // Limitar el tamaño del registro
    if (this.logs.length > (this.options.maxLogEntries || 1000)) {
      this.logs = this.logs.slice(-this.options.maxLogEntries!);
    }

    // Registrar en la consola si está habilitado
    if (this.options.logToConsole) {
      this.logToConsole(entry);
    }

    // Notificar a los listeners (con throttling)
    this.notifyListeners();
  }

  // Método para registrar en nivel debug
  public debug(source: string, message: string, data?: any): void {
    this.log("debug", source, message, data);
  }

  // Método para registrar en nivel info
  public info(source: string, message: string, data?: any): void {
    this.log("info", source, message, data);
  }

  // Método para registrar en nivel warn
  public warn(source: string, message: string, data?: any): void {
    this.log("warn", source, message, data);
  }

  // Método para registrar en nivel error
  public error(source: string, message: string, data?: any): void {
    this.log("error", source, message, data);
  }

  // Obtener todos los registros
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Limpiar todos los registros
  public clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }

  // Suscribirse a cambios en los registros
  public subscribe(callback: (logs: LogEntry[]) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notificar a los listeners con throttling
  private notifyListeners = throttle(() => {
    const currentLogs = [...this.logs];
    this.listeners.forEach((listener) => {
      try {
        listener(currentLogs);
      } catch (error) {
        console.error("Error en listener de logs:", error);
      }
    });
  }, 300);

  // Registrar en la consola
  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString().split("T")[1].slice(0, -1);
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.source}]`;

    switch (entry.level) {
      case "debug":
        if (entry.data && this.options.mode === "detailed") {
          console.debug(`${prefix} ${entry.message}`, entry.data);
        } else {
          console.debug(`${prefix} ${entry.message}`);
        }
        break;
      case "info":
        if (entry.data && this.options.mode === "detailed") {
          console.info(`${prefix} ${entry.message}`, entry.data);
        } else {
          console.info(`${prefix} ${entry.message}`);
        }
        break;
      case "warn":
        if (entry.data && this.options.mode === "detailed") {
          console.warn(`${prefix} ${entry.message}`, entry.data);
        } else {
          console.warn(`${prefix} ${entry.message}`);
        }
        break;
      case "error":
        if (entry.data && this.options.mode === "detailed") {
          console.error(`${prefix} ${entry.message}`, entry.data);
        } else {
          console.error(`${prefix} ${entry.message}`);
        }
        break;
    }
  }
}

// Exportar una instancia única
export const logger = LoggingService.getInstance();

// Hook para usar el servicio de registro en componentes
export function useLogger(source: string) {
  return {
    debug: (message: string, data?: any) => logger.debug(source, message, data),
    info: (message: string, data?: any) => logger.info(source, message, data),
    warn: (message: string, data?: any) => logger.warn(source, message, data),
    error: (message: string, data?: any) => logger.error(source, message, data),
  };
}
