# Implementación de Redirects para SEO

Este documento describe la solución implementada para manejar URLs indexadas en Google que generan errores 404, específicamente la ruta `/etiqueta-producto/facil-fix`.

## Problema Identificado

- **URL problemática**: `/etiqueta-producto/facil-fix`
- **Estado**: Indexada en Google pero devuelve 404
- **Impacto SEO**: Pérdida de tráfico y autoridad de dominio

## Solución Implementada

### 1. Middleware de Next.js (`middleware.ts`)

Se creó un middleware que intercepta las solicitudes y maneja redirects automáticos:

```typescript
// Mapeo de URLs antiguas a nuevas rutas
const redirectMap: Record<string, string> = {
  'facil-fix': '/productos?marca=facilfix',
  'facilfix': '/productos?marca=facilfix',
  'premium': '/productos?marca=premium',
  'expression': '/productos?marca=expression',
  'ecopainting': '/productos?marca=ecopainting',
  'newhouse': '/productos?marca=newhouse',
};
```

**Características:**
- Redirects 301 (permanentes) para SEO
- Mapeo inteligente de marcas
- Fallback a página general de productos

### 2. Configuración en Vercel (`vercel.json`)

Se agregaron redirects a nivel de servidor como respaldo:

```json
"redirects": [
  {
    "source": "/etiqueta-producto/facil-fix",
    "destination": "/productos?marca=facilfix",
    "permanent": true
  }
]
```

### 3. Nueva Página de Productos (`/productos`)

Se creó una página dedicada que maneja filtros por URL:

**Archivos creados:**
- `app/productos/page.tsx` - Página principal
- `app/productos/page-client.tsx` - Componente cliente con lógica de filtros

**Funcionalidades:**
- Filtrado por marca: `/productos?marca=facilfix`
- Filtrado por categoría: `/productos?categoria=especiales`
- Sincronización entre URL y estado de la aplicación
- SEO optimizado con metadata dinámico

### 4. Actualización del Sitemap

Se actualizó `app/sitemap.ts` para incluir:
- Página principal de productos
- URLs de productos filtrados por marca
- URLs de productos filtrados por categoría

## URLs Disponibles Después de la Implementación

### Productos por Marca
- `/productos?marca=facilfix` - Productos Facilfix
- `/productos?marca=premium` - Productos Premium
- `/productos?marca=expression` - Productos Expression
- `/productos?marca=ecopainting` - Productos Ecopainting
- `/productos?marca=newhouse` - Productos New House

### Productos por Categoría
- `/productos?categoria=especiales` - Productos especiales
- `/productos?categoria=exteriores` - Productos para exteriores
- `/productos?categoria=interiores` - Productos para interiores
- `/productos?categoria=recubrimientos` - Recubrimientos

### Productos Individuales
- `/productos/[slug]` - Páginas individuales de productos

## Redirects Implementados

### URLs de Etiquetas de Productos
- `/etiqueta-producto/facil-fix` → `/productos?marca=facilfix`
- `/etiqueta-producto/facilfix` → `/productos?marca=facilfix`
- `/etiqueta-producto/premium` → `/productos?marca=premium`
- `/etiqueta-producto/expression` → `/productos?marca=expression`
- `/etiqueta-producto/ecopainting` → `/productos?marca=ecopainting`
- `/etiqueta-producto/newhouse` → `/productos?marca=newhouse`
- `/etiqueta-producto/*` → `/productos` (fallback)

### URLs Legacy
- `/productos-facilfix` → `/productos?marca=facilfix`
- `/facilfix` → `/productos?marca=facilfix`
- `/catalogo` → `/productos`
- `/productos-catalogo` → `/productos`

## Beneficios SEO

1. **Preservación de Link Juice**: Los redirects 301 transfieren la autoridad de las URLs antiguas
2. **Mejor Experiencia de Usuario**: Los usuarios llegan a contenido relevante en lugar de páginas 404
3. **Indexación Mejorada**: Google puede indexar correctamente las nuevas URLs
4. **Estructura Clara**: URLs semánticas y organizadas por filtros

## Verificación de la Implementación

### 1. Probar Redirects
```bash
curl -I https://tu-dominio.com/etiqueta-producto/facil-fix
# Debería devolver: HTTP/1.1 301 Moved Permanently
```

### 2. Verificar Páginas de Destino
- Visitar `/productos?marca=facilfix`
- Confirmar que se muestran productos de Facilfix
- Verificar que la URL se mantiene correcta

### 3. Comprobar Sitemap
- Acceder a `/sitemap.xml`
- Verificar que incluye las nuevas URLs de productos

## Monitoreo Continuo

1. **Google Search Console**: Monitorear errores 404 y redirects
2. **Analytics**: Verificar tráfico a las nuevas URLs
3. **Logs de Servidor**: Revisar que los redirects funcionan correctamente

## Próximos Pasos

1. **Enviar Sitemap Actualizado** a Google Search Console
2. **Solicitar Re-indexación** de las URLs problemáticas
3. **Monitorear Métricas SEO** durante las próximas semanas
4. **Identificar Otras URLs Legacy** que puedan necesitar redirects

## Notas Técnicas

- Los redirects se procesan en el middleware antes que las rutas de Next.js
- La configuración en `vercel.json` actúa como respaldo
- Los parámetros de URL se sincronizan automáticamente con el estado de la aplicación
- La implementación es compatible con SSR y SSG de Next.js
