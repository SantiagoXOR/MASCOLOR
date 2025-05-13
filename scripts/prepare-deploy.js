/**
 * Script para preparar el deploy en Vercel
 * 
 * Este script:
 * 1. Verifica que todas las variables de entorno necesarias estén configuradas
 * 2. Optimiza las imágenes para producción
 * 3. Elimina código de depuración
 * 4. Actualiza la versión del proyecto
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: '.env.production' });

// Rutas de archivos
const ROOT_DIR = path.join(__dirname, '..');
const ENV_PRODUCTION_PATH = path.join(ROOT_DIR, '.env.production');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
const DEBUG_CSS_PATH = path.join(ROOT_DIR, 'app/hide-debug.css');
const DEBUG_JS_PATH = path.join(ROOT_DIR, 'app/hide-debug.js');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Función para mostrar un mensaje con formato
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Función para mostrar un título de sección
function logSection(title) {
  console.log('\n' + colors.magenta + '='.repeat(50) + colors.reset);
  console.log(colors.magenta + ` ${title} ` + colors.reset);
  console.log(colors.magenta + '='.repeat(50) + colors.reset + '\n');
}

// Función para verificar variables de entorno
function checkEnvironmentVariables() {
  logSection('Verificando variables de entorno');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SITE_NAME',
    'NEXT_PUBLIC_SITE_DESCRIPTION',
    'NEXT_PUBLIC_CONTACT_EMAIL',
    'NEXT_PUBLIC_CONTACT_PHONE',
    'NEXT_PUBLIC_WHATSAPP_NUMBER'
  ];
  
  let allVarsPresent = true;
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      log(`❌ Variable ${varName} no está definida en .env.production`, colors.red);
      allVarsPresent = false;
    } else {
      log(`✅ Variable ${varName} está definida`, colors.green);
    }
  }
  
  if (!allVarsPresent) {
    log('\n⚠️ Algunas variables de entorno requeridas no están definidas. Por favor, configúralas en .env.production', colors.yellow);
    process.exit(1);
  }
  
  log('\n✅ Todas las variables de entorno requeridas están configuradas', colors.green);
}

// Función para optimizar imágenes
function optimizeImages() {
  logSection('Optimizando imágenes para producción');
  
  try {
    log('Ejecutando optimización de imágenes...', colors.blue);
    execSync('npm run optimize-images-advanced', { stdio: 'inherit' });
    log('✅ Imágenes optimizadas correctamente', colors.green);
  } catch (error) {
    log(`❌ Error al optimizar imágenes: ${error.message}`, colors.red);
    log('Continuando con el proceso...', colors.yellow);
  }
}

// Función para eliminar código de depuración
function removeDebugCode() {
  logSection('Eliminando código de depuración');
  
  // Verificar si existen los archivos de depuración
  const debugCssExists = fs.existsSync(DEBUG_CSS_PATH);
  const debugJsExists = fs.existsSync(DEBUG_JS_PATH);
  
  if (debugCssExists) {
    log(`Encontrado archivo de depuración CSS: ${DEBUG_CSS_PATH}`, colors.blue);
    try {
      // Modificar el archivo para ocultar todos los elementos de depuración
      const cssContent = `/* Ocultar todos los elementos de depuración en producción */
.debug-component,
.debug-info,
.debug-panel,
.debug-overlay,
.debug-button,
[data-debug="true"],
[data-testid^="debug-"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}`;
      
      fs.writeFileSync(DEBUG_CSS_PATH, cssContent);
      log('✅ Código CSS de depuración modificado para ocultar elementos', colors.green);
    } catch (error) {
      log(`❌ Error al modificar CSS de depuración: ${error.message}`, colors.red);
    }
  } else {
    log('No se encontró archivo CSS de depuración', colors.yellow);
  }
  
  if (debugJsExists) {
    log(`Encontrado archivo de depuración JS: ${DEBUG_JS_PATH}`, colors.blue);
    try {
      // Modificar el archivo para deshabilitar la depuración
      const jsContent = `// Deshabilitar depuración en producción
window.__DEBUG_ENABLED = false;
window.__DEBUG_LEVEL = 'none';
console.debug = () => {};`;
      
      fs.writeFileSync(DEBUG_JS_PATH, jsContent);
      log('✅ Código JS de depuración modificado para deshabilitar funcionalidad', colors.green);
    } catch (error) {
      log(`❌ Error al modificar JS de depuración: ${error.message}`, colors.red);
    }
  } else {
    log('No se encontró archivo JS de depuración', colors.yellow);
  }
}

// Función para actualizar la versión del proyecto
function updateVersion() {
  logSection('Actualizando versión del proyecto');
  
  try {
    // Leer package.json
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    const currentVersion = packageJson.version;
    
    // Incrementar versión patch
    log(`Versión actual: ${currentVersion}`, colors.blue);
    
    // Ejecutar el script de versión
    log('Incrementando versión patch...', colors.blue);
    execSync('npm run version:patch -- "Preparación para deploy en Vercel"', { stdio: 'inherit' });
    
    // Leer la nueva versión
    const updatedPackageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    log(`✅ Versión actualizada: ${updatedPackageJson.version}`, colors.green);
  } catch (error) {
    log(`❌ Error al actualizar versión: ${error.message}`, colors.red);
    log('Continuando con el proceso...', colors.yellow);
  }
}

// Función principal
async function main() {
  console.log('\n' + colors.cyan + '🚀 PREPARACIÓN PARA DEPLOY EN VERCEL 🚀' + colors.reset + '\n');
  
  try {
    // Verificar variables de entorno
    checkEnvironmentVariables();
    
    // Optimizar imágenes
    optimizeImages();
    
    // Eliminar código de depuración
    removeDebugCode();
    
    // Actualizar versión
    updateVersion();
    
    // Mensaje final
    logSection('Resumen');
    log('✅ Preparación para deploy completada con éxito', colors.green);
    log('Ahora puedes ejecutar:', colors.blue);
    log('  npm run build', colors.cyan);
    log('  vercel', colors.cyan);
    log('\nO crear un Pull Request para desplegar automáticamente', colors.blue);
  } catch (error) {
    log(`❌ Error durante la preparación para deploy: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Ejecutar la función principal
main().catch(error => {
  log(`❌ Error inesperado: ${error.message}`, colors.red);
  process.exit(1);
});
