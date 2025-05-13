/**
 * Script para depurar la carga de imágenes en el navegador
 * 
 * Este script agrega código de depuración al componente OptimizedImage para
 * registrar información detallada sobre la carga de imágenes en la consola del navegador.
 */

const fs = require('fs');
const path = require('path');

// Rutas de archivos
const OPTIMIZED_IMAGE_PATH = path.join(__dirname, '../components/ui/optimized-image.tsx');

// Función para agregar código de depuración
function addDebugCode() {
  try {
    console.log('🔍 Agregando código de depuración al componente OptimizedImage...');

    // Leer el archivo
    const content = fs.readFileSync(OPTIMIZED_IMAGE_PATH, 'utf8');

    // Agregar código de depuración
    const debuggedContent = content.replace(
      'export function OptimizedImage({',
      `// Función para registrar información de depuración
const logImageDebug = (message, data = {}) => {
  console.log(
    '%c[OptimizedImage Debug]%c ' + message,
    'background: #870064; color: white; padding: 2px 4px; border-radius: 2px;',
    'color: #870064; font-weight: bold;',
    data
  );
};

export function OptimizedImage({`
    ).replace(
      'const tryLoadImage = (currentSrc: string, attempt: number = 0) => {',
      `const tryLoadImage = (currentSrc: string, attempt: number = 0) => {
    logImageDebug(\`Intento \${attempt + 1} de cargar imagen\`, { src: currentSrc, alt });`
    ).replace(
      'img.onload = () => {',
      `img.onload = () => {
      logImageDebug('✅ Imagen cargada correctamente', { src: currentSrc, alt });`
    ).replace(
      'img.onerror = () => {',
      `img.onerror = () => {
      logImageDebug('❌ Error al cargar imagen', { src: currentSrc, alt, attempt });`
    ).replace(
      'useEffect(() => {',
      `useEffect(() => {
    logImageDebug('Iniciando carga de imagen', { 
      src, 
      isAssetPath,
      hasPlaceholder,
      formats: { webp: webpSrc, avif: avifSrc, jpg: jpgSrc, png: pngSrc }
    });`
    ).replace(
      'onError={(e) => {',
      `onError={(e) => {
          logImageDebug('Error en componente Image', { 
            src: imgSrc, 
            alt, 
            attemptCount,
            isAssetPath
          });`
    );

    // Guardar el archivo modificado
    fs.writeFileSync(OPTIMIZED_IMAGE_PATH, debuggedContent);

    console.log('✅ Código de depuración agregado correctamente');
    console.log('ℹ️ Reinicia el servidor de desarrollo para aplicar los cambios');
    console.log('ℹ️ Abre la consola del navegador para ver la información de depuración');
  } catch (error) {
    console.error('❌ Error al agregar código de depuración:', error);
  }
}

// Función para eliminar código de depuración
function removeDebugCode() {
  try {
    console.log('🔍 Eliminando código de depuración del componente OptimizedImage...');

    // Leer el archivo
    const content = fs.readFileSync(OPTIMIZED_IMAGE_PATH, 'utf8');

    // Eliminar código de depuración
    const cleanedContent = content
      .replace(/\/\/ Función para registrar información de depuración[\s\S]*?};/m, '')
      .replace(/logImageDebug\([^)]*\);/g, '')
      .replace(/logImageDebug\([^)]*\),/g, '');

    // Guardar el archivo modificado
    fs.writeFileSync(OPTIMIZED_IMAGE_PATH, cleanedContent);

    console.log('✅ Código de depuración eliminado correctamente');
    console.log('ℹ️ Reinicia el servidor de desarrollo para aplicar los cambios');
  } catch (error) {
    console.error('❌ Error al eliminar código de depuración:', error);
  }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

if (command === 'add') {
  addDebugCode();
} else if (command === 'remove') {
  removeDebugCode();
} else {
  console.log('Uso: node debug-image-loading.js [add|remove]');
  console.log('  add    - Agregar código de depuración');
  console.log('  remove - Eliminar código de depuración');
}
