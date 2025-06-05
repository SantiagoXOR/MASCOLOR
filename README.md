# +COLOR - Landing Page

Este proyecto es una landing page para la marca +COLOR, especializada en pinturas y revestimientos de alta calidad.

![Versión](https://img.shields.io/badge/versión-0.1.0-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-latest-38bdf8)

## Tecnologías utilizadas

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- Supabase (opcional)

## Estructura del proyecto

- `app/`: Componentes, rutas y lógica principal.
- `components/`: Componentes reutilizables organizados por tipo.
  - `ui/`: Componentes de interfaz de usuario básicos.
  - `sections/`: Secciones principales de la página.
  - `layout/`: Componentes de estructura (Header, Footer, etc.).
- `lib/`: Código utilitario y lógica compartida.
- `public/`: Archivos estáticos.
- `types/`: Definiciones de tipos TypeScript.
- `hooks/`: Hooks personalizados.
- `config/`: Configuraciones de la aplicación.

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/mas-color.git
cd mas-color
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` basado en `.env.example` y configura las variables de entorno.

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

### Desarrollo

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm run start`: Inicia la aplicación en modo producción.
- `npm run lint`: Ejecuta el linter.
- `npm run test`: Ejecuta las pruebas.

### Control de versiones

- `npm run version:patch`: Incrementa la versión patch (0.0.x).
- `npm run version:minor`: Incrementa la versión minor (0.x.0).
- `npm run version:major`: Incrementa la versión major (x.0.0).

### Optimización

- `npm run optimize-images`: Optimiza todas las imágenes.
- `npm run generate-favicon`: Genera favicons a partir del SVG base.

## Personalización

### Colores

Los colores principales de la marca se pueden modificar en `tailwind.config.ts`:

```typescript
colors: {
  mascolor: {
    primary: "#870064",    // Color principal de la marca
    secondary: "#870064",  // Color secundario (mismo que primario)
    accent: "#870064",     // Color de acento (mismo que primario)
    neutral: "#9E9E9E",    // Gris neutro
    dark: "#212121",       // Casi negro
    light: "#F5F5F5",      // Casi blanco
  },
}
```

### Fuentes

Las fuentes se configuran en `app/layout.tsx` y `tailwind.config.ts`.

## Control de Versiones

Este proyecto utiliza Git para el control de versiones y sigue un flujo de trabajo basado en GitFlow:

- La rama `main` contiene el código de producción.
- La rama `develop` es la rama principal de desarrollo.
- Las ramas `feature/*`, `bugfix/*`, `hotfix/*` y `release/*` se utilizan para el desarrollo de características, correcciones y releases.

Para más detalles, consulta [docs/git-workflow.md](docs/git-workflow.md).

### Convenciones de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro:

```bash
<tipo>[ámbito opcional]: <descripción>
```

Ejemplos:

- `feat(hero): añadir animación al carrusel de marcas`
- `fix(productos): corregir filtrado por categoría`
- `docs: actualizar README`

## Despliegue

Esta aplicación está configurada para ser desplegada en Vercel:

```bash
npm run build
vercel
```

El despliegue continuo está configurado para:

- Producción: rama `main`
- Staging: rama `develop`
- Preview: Pull Requests

## Licencia

Este proyecto es privado y no está licenciado para uso público.
