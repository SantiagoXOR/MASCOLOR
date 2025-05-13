/**
 * Función de throttle para limitar la frecuencia de ejecución de una función
 * @param func Función a ejecutar
 * @param limit Límite de tiempo en milisegundos
 * @returns Función con throttle
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan = 0;

  return function(...args: Parameters<T>): void {
    const context = this;
    const now = Date.now();
    
    if (now - lastRan >= limit) {
      func.apply(context, args);
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (now - lastRan));
    }
  };
}

/**
 * Función de debounce para retrasar la ejecución de una función hasta que pase un tiempo sin llamadas
 * @param func Función a ejecutar
 * @param wait Tiempo de espera en milisegundos
 * @param immediate Si debe ejecutarse inmediatamente en la primera llamada
 * @returns Función con debounce
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>): void {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Función para crear una cola de ejecución que procesa tareas secuencialmente
 * @returns Objeto con métodos para encolar y procesar tareas
 */
export function createTaskQueue() {
  const queue: (() => Promise<any>)[] = [];
  let isProcessing = false;

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    
    isProcessing = true;
    
    try {
      const task = queue.shift();
      if (task) await task();
    } catch (error) {
      console.error("Error procesando tarea en cola:", error);
    } finally {
      isProcessing = false;
      if (queue.length > 0) {
        processQueue();
      }
    }
  };

  return {
    enqueue: (task: () => Promise<any>) => {
      queue.push(task);
      processQueue();
    },
    clear: () => {
      queue.length = 0;
    },
    get length() {
      return queue.length;
    },
    get isProcessing() {
      return isProcessing;
    }
  };
}
