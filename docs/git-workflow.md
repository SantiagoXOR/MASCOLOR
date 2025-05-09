# Flujo de Trabajo Git para +COLOR

Este documento describe el flujo de trabajo de Git que utilizamos en el proyecto +COLOR para mantener un control de versiones efectivo y facilitar la colaboración entre el equipo de desarrollo.

## Estructura de Ramas

Utilizamos un flujo de trabajo basado en GitFlow con algunas simplificaciones:

### Ramas Principales

- **`main`**: Contiene el código de producción. Cada commit en esta rama debe ser desplegable.
- **`develop`**: Rama de desarrollo principal donde se integran las nuevas características.

### Ramas de Soporte

- **`feature/*`**: Para desarrollar nuevas características (ej. `feature/hero-animation`).
- **`bugfix/*`**: Para corregir errores que no son críticos (ej. `bugfix/product-card-alignment`).
- **`hotfix/*`**: Para correcciones urgentes que deben aplicarse directamente a producción (ej. `hotfix/contact-form-validation`).
- **`release/*`**: Para preparar una nueva versión para producción (ej. `release/v1.2.0`).

## Convenciones de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial de commits claro y generar changelogs automáticamente:

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[nota de pie opcional]
```

### Tipos de Commits

- **feat**: Nueva característica
- **fix**: Corrección de errores
- **docs**: Cambios en la documentación
- **style**: Cambios que no afectan el significado del código (espacios en blanco, formato, etc.)
- **refactor**: Cambio de código que no corrige un error ni añade una característica
- **perf**: Cambio de código que mejora el rendimiento
- **test**: Adición o corrección de pruebas
- **build**: Cambios que afectan el sistema de compilación o dependencias externas
- **ci**: Cambios en los archivos de configuración de CI
- **chore**: Otros cambios que no modifican archivos de src o test

### Ejemplos

```
feat(productos): añadir filtrado por categoría

fix(contacto): corregir validación del formulario

docs: actualizar README con instrucciones de instalación
```

## Flujo de Trabajo

### Desarrollo de Nuevas Características

1. Crear una rama desde `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nombre-de-la-caracteristica
   ```

2. Desarrollar la característica con commits frecuentes siguiendo las convenciones.

3. Actualizar la rama `develop` y resolver conflictos:
   ```bash
   git checkout develop
   git pull
   git checkout feature/nombre-de-la-caracteristica
   git merge develop
   # Resolver conflictos si los hay
   ```

4. Crear un Pull Request a `develop`.

5. Después de la revisión y aprobación, hacer merge a `develop`.

### Corrección de Errores

1. Para errores no críticos, seguir el mismo proceso que para características pero usando `bugfix/` como prefijo.

2. Para hotfixes (errores críticos en producción):
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/descripcion-del-error
   # Corregir el error
   ```

3. Crear un Pull Request a `main` y a `develop`.

4. Después de la aprobación, hacer merge a ambas ramas.

### Releases

1. Cuando `develop` está listo para un release:
   ```bash
   git checkout develop
   git pull
   git checkout -b release/vX.Y.Z
   ```

2. Ejecutar el script de versión:
   ```bash
   node scripts/version-manager.js [major|minor|patch] "Mensaje descriptivo"
   ```

3. Realizar pruebas finales y correcciones menores en la rama de release.

4. Crear un Pull Request a `main`.

5. Después de la aprobación, hacer merge a `main` y a `develop`.

6. Crear un tag para la versión:
   ```bash
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin vX.Y.Z
   ```

## Despliegue Continuo con Vercel

Nuestro proyecto está configurado para despliegue continuo con Vercel:

- Cada push a `main` desencadena un despliegue a producción.
- Cada push a `develop` desencadena un despliegue a un entorno de staging.
- Cada Pull Request genera un despliegue de vista previa.

## Gestión de Versiones

Utilizamos [Versionado Semántico](https://semver.org/):

- **MAJOR (X)**: Cambios incompatibles con versiones anteriores
- **MINOR (Y)**: Nuevas funcionalidades compatibles con versiones anteriores
- **PATCH (Z)**: Correcciones de errores compatibles con versiones anteriores

El script `scripts/version-manager.js` automatiza este proceso, actualizando:
- La versión en `package.json`
- El archivo `CHANGELOG.md`
- Creando commits y tags de Git
