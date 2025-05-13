# Sistema de Depuración para +COLOR

Este documento describe el sistema de depuración implementado en el proyecto +COLOR, diseñado para facilitar el desarrollo y la resolución de problemas.

## Índice

1. [Introducción](#introducción)
2. [Arquitectura](#arquitectura)
3. [Componentes Principales](#componentes-principales)
4. [Uso Básico](#uso-básico)
5. [Hooks Personalizados](#hooks-personalizados)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Solución de Problemas](#solución-de-problemas)

## Introducción

El sistema de depuración de +COLOR proporciona herramientas para monitorear y depurar diferentes aspectos de la aplicación durante el desarrollo. Está diseñado para ser:

- **No intrusivo**: Solo se activa en entornos de desarrollo, nunca en producción
- **Configurable**: Permite activar/desactivar depuradores específicos según sea necesario
- **Extensible**: Facilita la adición de nuevos depuradores para diferentes partes de la aplicación
- **Eficiente**: Minimiza el impacto en el rendimiento mediante técnicas como throttling y caching

## Arquitectura

El sistema se basa en una arquitectura de contexto de React con los siguientes componentes:

```
┌─────────────────────────┐
│     DebugProvider       │
├─────────────────────────┤
│  - Estado global        │
│  - Métodos de control   │
│  - Logging              │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│      DebugPanel         │
├─────────────────────────┤
│  - UI de control        │
│  - Activar/desactivar   │
│  - Configuración        │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Componentes de Debug   │
├─────────────────────────┤
│  - ImageDebug           │
│  - SupabaseDebug        │
│  - SupabaseClientDebug  │
│  - ProductsDebug        │
└─────────────────────────┘
```

## Componentes Principales

### DebugContext

El contexto central que proporciona estado y funcionalidad a todo el sistema de depuración.

```tsx
// Ejemplo de uso
import { useDebug } from '@/contexts/DebugContext';

function MyComponent() {
  const { isDebugEnabled, activeDebuggers, logDebug } = useDebug();
  
  // Usar las funciones y estado del contexto
}
```

#### Propiedades y Métodos

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `debugMode` | `'disabled' \| 'minimal' \| 'detailed'` | Modo actual de depuración |
| `isDebugEnabled` | `boolean` | Si la depuración está habilitada |
| `activeDebuggers` | `string[]` | Lista de depuradores activos |
| `setDebugMode` | `(mode: DebugMode) => void` | Cambiar el modo de depuración |
| `toggleDebugger` | `(debuggerName: string) => void` | Alternar un depurador específico |
| `enableDebugger` | `(debuggerName: string) => void` | Activar un depurador específico |
| `disableDebugger` | `(debuggerName: string) => void` | Desactivar un depurador específico |
| `disableAllDebuggers` | `() => void` | Desactivar todos los depuradores |
| `logDebug` | `(message: string, data?: any) => void` | Registrar un mensaje de depuración |

### DebugPanel

Panel de control para gestionar el sistema de depuración. Proporciona una interfaz de usuario para:

- Cambiar el modo de depuración
- Activar/desactivar depuradores específicos
- Ver el estado actual del sistema

### Componentes de Depuración

Cada componente de depuración se enfoca en un aspecto específico de la aplicación:

- **ImageDebug**: Verifica la carga de imágenes y muestra su estado
- **SupabaseDebug**: Muestra información sobre la conexión a Supabase y los datos
- **SupabaseClientDebug**: Proporciona detalles sobre el cliente de Supabase
- **ProductsDebug**: Muestra información sobre los productos y su estado

## Uso Básico

### Configuración Inicial

El sistema de depuración ya está configurado en el archivo `app/layout-with-components.tsx`:

```tsx
<DebugProvider>
  {/* Contenido de la aplicación */}
  
  {/* Componentes de depuración */}
  {process.env.NODE_ENV !== "production" && (
    <>
      <DebugPanel />
      <ProductsDebug />
      <SupabaseDebug />
      <SupabaseClientDebug />
      <ImageDebug />
    </>
  )}
</DebugProvider>
```

### Activar/Desactivar Depuradores

1. Haz clic en el botón de engranaje (⚙️) en la esquina inferior derecha para abrir el panel de depuración
2. Selecciona el modo de depuración (Deshabilitado, Mínimo, Detallado)
3. Activa o desactiva depuradores específicos según sea necesario

### Crear un Nuevo Depurador

Para crear un nuevo depurador:

1. Crea un nuevo componente en la carpeta `components/debug/`
2. Utiliza el hook `useDebug` para acceder al contexto de depuración
3. Verifica `isDebugEnabled` y `activeDebuggers` antes de renderizar
4. Registra información con `logDebug`
5. Añade el depurador al panel en `DebugPanel.tsx`

Ejemplo:

```tsx
import { useDebug } from '@/contexts/DebugContext';

export function MyNewDebugger() {
  const { isDebugEnabled, activeDebuggers, logDebug } = useDebug();
  const [isOpen, setIsOpen] = useState(false);
  
  // No renderizar si no está habilitado
  if (!isDebugEnabled || !activeDebuggers.includes('myNewDebugger')) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Cerrar" : "Mi Depurador"}
      </button>
      
      {isOpen && (
        <div className="debug-panel">
          {/* Contenido del depurador */}
        </div>
      )}
    </div>
  );
}
```

## Hooks Personalizados

### useApiCache

Hook para gestionar llamadas a la API con caché, reintentos y backoff exponencial.

```tsx
const {
  data,
  status,
  error,
  isLoading,
  isSuccess,
  isError,
  refetch,
  clearCache,
} = useApiCache(fetchFunction, {
  cacheKey: 'unique-key',
  cacheDuration: 5 * 60 * 1000, // 5 minutos
  retryCount: 3,
  retryDelay: 1000,
  retryBackoff: true,
  onSuccess: (data) => console.log('Success!', data),
  onError: (error) => console.error('Error!', error),
});
```

#### Parámetros

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `fetchFunction` | `() => Promise<T>` | Función que realiza la llamada a la API |
| `options` | `ApiCacheOptions` | Opciones de configuración |

#### Opciones

| Nombre | Tipo | Descripción |
|--------|------|-------------|
| `cacheKey` | `string` | Clave única para identificar los datos en caché |
| `cacheDuration` | `number` | Duración de la caché en milisegundos (por defecto: 5 minutos) |
| `retryCount` | `number` | Número de reintentos en caso de error (por defecto: 3) |
| `retryDelay` | `number` | Retraso entre reintentos en milisegundos (por defecto: 1000) |
| `retryBackoff` | `boolean` | Si se debe usar backoff exponencial (por defecto: true) |
| `onSuccess` | `(data: T) => void` | Callback en caso de éxito |
| `onError` | `(error: Error) => void` | Callback en caso de error |

## Mejores Prácticas

1. **Usar el contexto de depuración**: Siempre utiliza `useDebug` para acceder al sistema de depuración
2. **Verificar el estado**: Comprueba `isDebugEnabled` y `activeDebuggers` antes de renderizar
3. **Limitar el impacto**: Usa throttling/debouncing para limitar la frecuencia de actualizaciones
4. **Limpiar recursos**: Implementa funciones de limpieza en los `useEffect` para evitar fugas de memoria
5. **Usar caché**: Utiliza `useApiCache` para evitar llamadas repetidas a la API
6. **Documentar depuradores**: Añade nuevos depuradores a esta documentación

## Solución de Problemas

### Error "Maximum update depth exceeded"

Este error ocurre cuando un componente entra en un bucle infinito de actualizaciones. Para solucionarlo:

1. Verifica las dependencias de los `useEffect`
2. Implementa throttling/debouncing para limitar las actualizaciones
3. Usa `useCallback` y `useMemo` para evitar recreaciones innecesarias
4. Asegúrate de que las funciones de actualización de estado no causen ciclos

### Componentes de Depuración No Visibles

Si los componentes de depuración no son visibles:

1. Verifica que estás en modo de desarrollo (`process.env.NODE_ENV !== 'production'`)
2. Comprueba que el depurador está activado en el panel de depuración
3. Asegúrate de que no hay errores en la consola
4. Verifica que el componente está correctamente importado y renderizado

### Problemas de Rendimiento

Si el sistema de depuración afecta al rendimiento:

1. Reduce la frecuencia de actualizaciones con throttling/debouncing
2. Limita la cantidad de datos mostrados
3. Usa el modo "Mínimo" en lugar de "Detallado"
4. Desactiva los depuradores que no estés utilizando
