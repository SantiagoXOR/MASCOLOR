# Configuración del Repositorio Remoto para +COLOR

Este documento describe los pasos necesarios para configurar el repositorio remoto de GitHub para el proyecto +COLOR.

## Prerrequisitos

1. Tener una cuenta en GitHub
2. Tener permisos para crear repositorios en la organización o en tu cuenta personal
3. Tener Git instalado y configurado localmente

## Pasos para la configuración

### 1. Crear un nuevo repositorio en GitHub

1. Inicia sesión en [GitHub](https://github.com)
2. Haz clic en el botón "New" (Nuevo) en la página principal o navega a https://github.com/new
3. Configura el repositorio:
   - **Nombre del repositorio**: mas-color
   - **Descripción**: Landing page para la marca de pinturas y revestimientos +COLOR
   - **Visibilidad**: Private (Privado)
   - **Inicializar con README**: No (ya tenemos uno)
   - **Añadir .gitignore**: No (ya tenemos uno)
   - **Añadir licencia**: No (ya tenemos una configuración de licencia)
4. Haz clic en "Create repository" (Crear repositorio)

### 2. Conectar el repositorio local con el remoto

Ejecuta los siguientes comandos en la terminal, desde la raíz del proyecto:

```bash
# Añadir el repositorio remoto
git remote add origin https://github.com/SantiagoXOR/mas-color.git

# Verificar que se ha añadido correctamente
git remote -v
```

### 3. Subir las ramas principales

```bash
# Subir la rama main y establecer seguimiento
git push -u origin main

# Subir la rama develop y establecer seguimiento
git push -u origin develop

# Subir todas las etiquetas (tags)
git push --tags
```

### 4. Proteger las ramas principales

Es importante configurar reglas de protección para las ramas principales:

1. Ve a la página del repositorio en GitHub
2. Navega a "Settings" > "Branches"
3. Haz clic en "Add rule" (Añadir regla)
4. Configura las siguientes reglas:

#### Para la rama `main`:

- **Branch name pattern**: main
- **Require pull request reviews before merging**: ✓
  - **Required approving reviews**: 1
- **Require status checks to pass before merging**: ✓
  - **Require branches to be up to date before merging**: ✓
  - **Status checks that are required**:
    - build
    - test
    - lint
- **Include administrators**: ✓
- **Restrict who can push to matching branches**: ✓

#### Para la rama `develop`:

- **Branch name pattern**: develop
- **Require pull request reviews before merging**: ✓
  - **Required approving reviews**: 1
- **Require status checks to pass before merging**: ✓
  - **Status checks that are required**:
    - build
    - test
    - lint
- **Include administrators**: ✓

### 5. Configurar GitHub Actions

1. Asegúrate de que el directorio `.github/workflows` esté presente en el repositorio
2. Verifica que los archivos de configuración de GitHub Actions estén correctamente configurados
3. Configura los secretos necesarios para las acciones:
   - Ve a "Settings" > "Secrets" > "Actions"
   - Añade los siguientes secretos:
     - `VERCEL_TOKEN`: Token de API de Vercel
     - `VERCEL_ORG_ID`: ID de la organización en Vercel
     - `VERCEL_PROJECT_ID`: ID del proyecto en Vercel

### 6. Configurar integración con Vercel

1. Inicia sesión en [Vercel](https://vercel.com)
2. Importa el proyecto desde GitHub
3. Configura las variables de entorno necesarias
4. Configura los dominios personalizados si es necesario
5. Configura los ajustes de despliegue:
   - **Production Branch**: main
   - **Preview Branches**: All branches except main
   - **Ignored Build Step**: No

## Flujo de trabajo después de la configuración

Una vez configurado el repositorio remoto, el flujo de trabajo será:

1. Desarrollar en ramas de feature/bugfix locales
2. Crear Pull Requests a la rama develop
3. Después de la revisión y aprobación, hacer merge a develop
4. Para releases, crear una rama release/vX.Y.Z desde develop
5. Después de pruebas, hacer merge a main y develop
6. Vercel desplegará automáticamente:
   - Producción: cuando hay cambios en main
   - Staging: cuando hay cambios en develop
   - Preview: para cada Pull Request

## Solución de problemas comunes

### Error de permisos al hacer push

```
remote: Permission to SantiagoXOR/mas-color.git denied to SantiagoXOR.
fatal: unable to access 'https://github.com/SantiagoXOR/mas-color.git/': The requested URL returned error: 403
```

**Solución**: Verifica tus credenciales de GitHub y asegúrate de tener los permisos necesarios.

### Error al hacer merge

```
error: failed to push some refs to 'https://github.com/SantiagoXOR/mas-color.git'
```

**Solución**: Haz un `git pull` antes de intentar hacer push para asegurarte de tener la última versión.

### Fallos en los checks de CI

Si los checks de CI fallan en un Pull Request, revisa los logs para identificar el problema y haz los cambios necesarios en tu rama antes de solicitar una nueva revisión.
