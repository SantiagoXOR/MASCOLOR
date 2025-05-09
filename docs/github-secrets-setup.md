# Configuración de Secretos para GitHub Actions

Este documento describe cómo configurar los secretos necesarios para que GitHub Actions pueda desplegar automáticamente el proyecto +COLOR en Vercel.

## Secretos Requeridos

Para que el flujo de CI/CD funcione correctamente, necesitas configurar los siguientes secretos en tu repositorio de GitHub:

1. `VERCEL_TOKEN`: Token de API de Vercel
2. `VERCEL_ORG_ID`: ID de la organización en Vercel
3. `VERCEL_PROJECT_ID`: ID del proyecto en Vercel

## Pasos para Obtener los Valores

### 1. Obtener el Token de Vercel

1. Inicia sesión en tu cuenta de [Vercel](https://vercel.com)
2. Ve a la página de [Tokens](https://vercel.com/account/tokens)
3. Haz clic en "Create" para crear un nuevo token
4. Dale un nombre descriptivo como "GitHub Actions - +COLOR"
5. Selecciona el alcance "Full Account" para permitir todas las operaciones
6. Haz clic en "Create Token"
7. **¡IMPORTANTE!** Copia el token generado inmediatamente, ya que no podrás verlo de nuevo

### 2. Obtener el ID de la Organización

1. Ve a la [página de configuración general](https://vercel.com/dashboard/settings) de tu cuenta de Vercel
2. Desplázate hacia abajo hasta la sección "Your ID"
3. Copia el valor del ID

### 3. Obtener el ID del Proyecto

1. Ve al [dashboard de Vercel](https://vercel.com/dashboard)
2. Selecciona el proyecto "+COLOR"
3. Ve a la pestaña "Settings" del proyecto
4. Desplázate hacia abajo hasta la sección "Project ID"
5. Copia el valor del ID del proyecto

## Configurar los Secretos en GitHub

1. Ve a la página de tu repositorio en GitHub
2. Navega a "Settings" > "Secrets and variables" > "Actions"
3. Haz clic en "New repository secret"
4. Añade cada uno de los secretos:

   - Nombre: `VERCEL_TOKEN`
     Valor: [El token que copiaste en el paso 1]
     
   - Nombre: `VERCEL_ORG_ID`
     Valor: [El ID de la organización que copiaste en el paso 2]
     
   - Nombre: `VERCEL_PROJECT_ID`
     Valor: [El ID del proyecto que copiaste en el paso 3]

5. Haz clic en "Add secret" para cada uno

## Verificar la Configuración

Para verificar que los secretos están configurados correctamente:

1. Crea una nueva rama de feature
2. Realiza un cambio pequeño
3. Crea un Pull Request a la rama develop
4. Verifica que las acciones de GitHub se ejecuten correctamente
5. Si todo está bien, deberías ver un enlace a un despliegue de preview en los comentarios del PR

## Solución de Problemas

### Error: "Vercel CLI Error: Missing required token"

**Causa**: El token de Vercel no está configurado correctamente o ha expirado.
**Solución**: Genera un nuevo token y actualiza el secreto `VERCEL_TOKEN`.

### Error: "Vercel CLI Error: Not authorized"

**Causa**: El token no tiene los permisos necesarios o los IDs de organización/proyecto son incorrectos.
**Solución**: Verifica que el token tenga el alcance "Full Account" y que los IDs sean correctos.

### Error: "Vercel CLI Error: Project not found"

**Causa**: El ID del proyecto es incorrecto o el proyecto ha sido eliminado.
**Solución**: Verifica el ID del proyecto en la configuración de Vercel.

## Notas Adicionales

- Los secretos en GitHub están encriptados y solo se revelan a las acciones de GitHub durante la ejecución.
- Si cambias alguno de estos valores en Vercel, deberás actualizar los secretos correspondientes en GitHub.
- Para mayor seguridad, considera usar tokens con el menor alcance posible que permita realizar las operaciones necesarias.
