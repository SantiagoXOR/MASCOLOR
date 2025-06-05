#!/usr/bin/env node

/**
 * Script para diagnosticar y solucionar errores del servidor de desarrollo
 * 
 * Este script verifica y soluciona los problemas comunes que causan:
 * - Errores 404 de service workers
 * - Advertencias de themeColor en metadata
 * - Errores de runtime que causan recargas completas de Fast Refresh
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Función para logging con colores
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️ ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️ ${message}`, colors.blue);
const logSection = (message) => log(`\n🔧 ${message}`, colors.cyan + colors.bright);

/**
 * Verificar si existe un archivo
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Verificar configuración de viewport
 */
function checkViewportConfig() {
  logSection('Verificando configuración de viewport');
  
  const viewportPath = path.join(process.cwd(), 'app/viewport.ts');
  
  if (fileExists(viewportPath)) {
    logSuccess('Archivo app/viewport.ts existe');
    
    const content = fs.readFileSync(viewportPath, 'utf8');
    if (content.includes('themeColor')) {
      logSuccess('themeColor configurado en viewport.ts');
    } else {
      logWarning('themeColor no encontrado en viewport.ts');
    }
  } else {
    logError('Archivo app/viewport.ts no existe');
    return false;
  }
  
  return true;
}

/**
 * Verificar configuración de layout
 */
function checkLayoutConfig() {
  logSection('Verificando configuración de layout');
  
  const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
  
  if (fileExists(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    if (content.includes('themeColor')) {
      logWarning('themeColor encontrado en layout.tsx - debería estar en viewport.ts');
      return false;
    } else {
      logSuccess('themeColor no está en layout.tsx (correcto)');
    }
    
    if (content.includes('meta name="theme-color"')) {
      logWarning('Meta tag theme-color encontrado en layout.tsx - debería eliminarse');
      return false;
    } else {
      logSuccess('No hay meta tag theme-color en layout.tsx (correcto)');
    }
  } else {
    logError('Archivo app/layout.tsx no existe');
    return false;
  }
  
  return true;
}

/**
 * Verificar service worker
 */
function checkServiceWorker() {
  logSection('Verificando service worker');
  
  const swPath = path.join(process.cwd(), 'public/sw.js');
  
  if (fileExists(swPath)) {
    logSuccess('Archivo public/sw.js existe');
    
    const content = fs.readFileSync(swPath, 'utf8');
    if (content.includes('stub') || content.includes('no functionality')) {
      logSuccess('Service worker es un stub (correcto)');
    } else {
      logWarning('Service worker puede tener funcionalidad activa');
    }
  } else {
    logError('Archivo public/sw.js no existe');
    return false;
  }
  
  return true;
}

/**
 * Verificar servicios de notificaciones push
 */
function checkPushNotificationService() {
  logSection('Verificando servicio de notificaciones push');
  
  const servicePath = path.join(process.cwd(), 'lib/services/push-notification-service.ts');
  
  if (fileExists(servicePath)) {
    const content = fs.readFileSync(servicePath, 'utf8');
    
    if (content.includes('completamente deshabilitado')) {
      logSuccess('Servicio de notificaciones push está deshabilitado');
    } else {
      logWarning('Servicio de notificaciones push puede estar activo');
    }
    
    if (content.includes('supabase.channel')) {
      logError('Servicio contiene referencias a supabase.channel');
      return false;
    } else {
      logSuccess('No hay referencias a supabase.channel');
    }
  } else {
    logError('Archivo lib/services/push-notification-service.ts no existe');
    return false;
  }
  
  return true;
}

/**
 * Verificar configuración de Next.js
 */
function checkNextConfig() {
  logSection('Verificando configuración de Next.js');
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  if (fileExists(nextConfigPath)) {
    logSuccess('Archivo next.config.js existe');
    
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    if (content.includes('reactStrictMode: true')) {
      logInfo('React Strict Mode está habilitado');
    }
  } else {
    logWarning('Archivo next.config.js no existe');
  }
  
  return true;
}

/**
 * Función principal
 */
function main() {
  log('\n🔍 Diagnóstico de errores del servidor de desarrollo\n', colors.cyan + colors.bright);
  
  let allChecksPass = true;
  
  // Ejecutar todas las verificaciones
  allChecksPass &= checkViewportConfig();
  allChecksPass &= checkLayoutConfig();
  allChecksPass &= checkServiceWorker();
  allChecksPass &= checkPushNotificationService();
  allChecksPass &= checkNextConfig();
  
  // Resumen final
  logSection('Resumen');
  
  if (allChecksPass) {
    logSuccess('Todas las verificaciones pasaron correctamente');
    logInfo('Los errores del servidor de desarrollo deberían estar resueltos');
  } else {
    logWarning('Algunas verificaciones fallaron');
    logInfo('Revisa los errores anteriores y corrige los problemas indicados');
  }
  
  // Recomendaciones adicionales
  logSection('Recomendaciones adicionales');
  logInfo('1. Reinicia el servidor de desarrollo: npm run dev');
  logInfo('2. Limpia la caché del navegador');
  logInfo('3. Verifica que no hay extensiones del navegador interfiriendo');
  logInfo('4. Si persisten los errores, revisa la consola del navegador');
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = {
  checkViewportConfig,
  checkLayoutConfig,
  checkServiceWorker,
  checkPushNotificationService,
  checkNextConfig,
};
