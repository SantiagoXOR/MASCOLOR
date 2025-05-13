# Convención para Nombres de Archivos de Imágenes en +COLOR

Este documento establece las convenciones para nombrar archivos de imágenes en el proyecto +COLOR, con el objetivo de mantener consistencia y facilitar la gestión de archivos.

## Principios Generales

1. **Consistencia**: Todos los archivos deben seguir el mismo patrón de nomenclatura
2. **Legibilidad**: Los nombres deben ser fáciles de leer y entender
3. **Búsqueda**: Los nombres deben facilitar la búsqueda y filtrado
4. **Organización**: La estructura debe reflejar la organización lógica del contenido

## Convención de Nombres

### Formato General

```
[marca]-[producto]-[variante].[extensión]
```

Ejemplo: `premium-latex-interior.png`

### Reglas Específicas

1. **Usar minúsculas**: Todos los nombres de archivo deben estar en minúsculas
   - ✅ `premium-latex-interior.png`
   - ❌ `PREMIUM-LATEX-INTERIOR.png`

2. **Usar guiones (-) como separadores**: No usar espacios ni guiones bajos
   - ✅ `facilfix-microcemento.png`
   - ❌ `facilfix microcemento.png`
   - ❌ `facilfix_microcemento.png`

3. **Evitar caracteres especiales**: No usar acentos, ñ, símbolos o caracteres especiales
   - ✅ `premium-latex-acrilico.png`
   - ❌ `premium-látex-acrílico.png`

4. **Evitar números secuenciales**: Si se necesitan versiones, usar sufijos descriptivos
   - ✅ `facilfix-exterior-blanco-bolsa.png`
   - ❌ `facilfix-exterior-blanco-1.png`

5. **Estructura jerárquica**: Ordenar de lo general a lo específico
   - ✅ `marca-producto-variante.png`
   - ❌ `variante-producto-marca.png`

6. **Extensiones en minúsculas**: Usar extensiones de archivo en minúsculas
   - ✅ `.png`, `.jpg`, `.webp`
   - ❌ `.PNG`, `.JPG`, `.WEBP`

## Estructura de Directorios

Mantener la estructura de directorios actual:

```
public/
└── images/
    ├── logos/       # Logos de marca y submarcas
    ├── products/    # Imágenes de productos
    ├── buckets/     # Imágenes de fondos y baldes
    └── backgrounds/ # Imágenes de fondo
```

## Ejemplos de Nombres Correctos

### Productos

- `facilfix-microcemento.png`
- `premium-latex-interior.png`
- `newhouse-barniz-marino.png`
- `expression-latex-acrilico-exterior.png`

### Logos

- `facilfix-logo.svg`
- `premium-logo.svg`
- `mascolor-logo.svg`
- `mascolor-logo-solo.svg`

## Proceso de Migración

Para migrar los archivos existentes a la nueva convención:

1. Ejecutar el script de renombrado (`scripts/rename-images.js`)
2. Actualizar las referencias en la base de datos
3. Actualizar las referencias en el código

## Validación de Nombres

Usar el script de validación (`scripts/validate-image-names.js`) para verificar que los nombres de archivo cumplen con la convención.

## Manejo de Errores

Si se encuentra un archivo que no cumple con la convención:

1. No rechazar la carga, pero mostrar una advertencia
2. Registrar el error en los logs
3. Sugerir un nombre correcto según la convención
