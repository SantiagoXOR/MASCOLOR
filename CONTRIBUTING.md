# Guía para Contribuidores de +COLOR

¡Gracias por tu interés en contribuir al proyecto +COLOR! Esta guía te ayudará a entender el proceso de contribución y a asegurarte de que tus aportes se integren sin problemas.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Git

## Configuración inicial

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/mas-color.git
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

## Flujo de trabajo de desarrollo

Seguimos un flujo de trabajo basado en GitFlow. Para contribuir:

### 1. Sincroniza tu fork

Si estás trabajando desde un fork, asegúrate de mantenerlo actualizado:

```bash
git checkout develop
git fetch upstream
git merge upstream/develop
git push origin develop
```

### 2. Crea una rama para tu contribución

```bash
# Para nuevas características
git checkout -b feature/nombre-de-la-caracteristica develop

# Para correcciones de errores
git checkout -b bugfix/descripcion-del-error develop

# Para correcciones urgentes (hotfixes)
git checkout -b hotfix/descripcion-del-error main
```

### 3. Desarrolla tu contribución

Mientras trabajas en tu contribución:

- Escribe código limpio y mantenible
- Sigue las convenciones de estilo del proyecto
- Añade pruebas para tu código cuando sea posible
- Documenta los cambios importantes

### 4. Realiza commits de tus cambios

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial claro:

```bash
git commit -m "feat: añadir filtrado por categoría en productos"
git commit -m "fix: corregir validación del formulario de contacto"
git commit -m "docs: actualizar instrucciones de instalación"
```

Tipos de commits comunes:
- `feat`: Nueva característica
- `fix`: Corrección de errores
- `docs`: Cambios en la documentación
- `style`: Cambios que no afectan el significado del código
- `refactor`: Cambio de código que no corrige un error ni añade una característica
- `test`: Adición o corrección de pruebas
- `chore`: Otros cambios que no modifican src o test

### 5. Envía tus cambios

```bash
git push origin nombre-de-tu-rama
```

### 6. Crea un Pull Request

1. Ve al repositorio en GitHub
2. Selecciona tu rama y haz clic en "New Pull Request"
3. Selecciona la rama base correcta (`develop` para características y correcciones, `main` para hotfixes)
4. Proporciona un título claro y una descripción detallada
5. Referencia cualquier issue relacionado usando #numero-de-issue

## Estándares de código

### Estilo de código

- Utilizamos ESLint y Prettier para mantener un estilo consistente
- Ejecuta `npm run lint` antes de enviar tus cambios

### Pruebas

- Añade pruebas para cualquier nueva funcionalidad
- Asegúrate de que todas las pruebas pasen antes de enviar tus cambios
- Ejecuta `npm test` para verificar

## Proceso de revisión

Una vez que hayas enviado tu Pull Request:

1. Los mantenedores revisarán tu código
2. Se ejecutarán pruebas automatizadas
3. Se pueden solicitar cambios o mejoras
4. Una vez aprobado, tu código será fusionado

## Versionado

Utilizamos [Versionado Semántico](https://semver.org/):

- **MAJOR (X)**: Cambios incompatibles con versiones anteriores
- **MINOR (Y)**: Nuevas funcionalidades compatibles con versiones anteriores
- **PATCH (Z)**: Correcciones de errores compatibles con versiones anteriores

## Recursos adicionales

- [Documentación del flujo de trabajo de Git](docs/git-workflow.md)
- [Changelog](CHANGELOG.md)
- [Código de conducta](CODE_OF_CONDUCT.md)

¡Gracias por contribuir a +COLOR!
