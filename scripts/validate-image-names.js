/**
 * Script para validar nombres de archivos de imágenes según la convención establecida
 * 
 * Este script:
 * 1. Recorre todos los archivos de imágenes en los directorios especificados
 * 2. Verifica que los nombres cumplan con la convención establecida
 * 3. Genera un reporte con los archivos que no cumplen y sugerencias de nombres correctos
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuración
const IMAGE_DIRS = [
  path.join(__dirname, '../public/images/products'),
  path.join(__dirname, '../public/images/logos'),
  path.join(__dirname, '../public/images/buckets'),
  path.join(__dirname, '../public/images/backgrounds')
];

// Expresión regular para validar nombres según la convención
const VALID_NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*\.[a-z]+$/;

// Función para recorrer directorios recursivamente
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

// Función para verificar si un archivo es una imagen
function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'].includes(ext);
}

// Función para sugerir un nombre correcto
function suggestCorrectName(filename) {
  // Obtener nombre base y extensión
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext);
  
  // Convertir a minúsculas
  let suggested = basename.toLowerCase();
  
  // Reemplazar espacios por guiones
  suggested = suggested.replace(/\s+/g, '-');
  
  // Reemplazar guiones bajos por guiones
  suggested = suggested.replace(/_+/g, '-');
  
  // Eliminar caracteres especiales
  suggested = suggested.replace(/[^a-z0-9-]/g, '');
  
  // Eliminar guiones múltiples
  suggested = suggested.replace(/-+/g, '-');
  
  // Eliminar guiones al inicio y final
  suggested = suggested.replace(/^-|-$/g, '');
  
  return `${suggested}${ext.toLowerCase()}`;
}

// Función principal
async function validateImageNames() {
  try {
    console.log('🔍 Validando nombres de archivos de imágenes...');
    
    let allValid = true;
    const invalidFiles = [];
    
    // Procesar cada directorio
    for (const dir of IMAGE_DIRS) {
      try {
        // Obtener todos los archivos
        const files = await getFiles(dir);
        
        // Filtrar solo imágenes
        const imageFiles = files.filter(isImage);
        
        console.log(`\n📁 Directorio: ${path.relative(path.join(__dirname, '..'), dir)}`);
        console.log(`🖼️ Encontradas ${imageFiles.length} imágenes`);
        
        // Validar cada imagen
        for (const file of imageFiles) {
          const filename = path.basename(file);
          const isValid = VALID_NAME_REGEX.test(filename);
          
          if (!isValid) {
            allValid = false;
            const suggestedName = suggestCorrectName(filename);
            invalidFiles.push({
              path: path.relative(path.join(__dirname, '..'), file),
              currentName: filename,
              suggestedName
            });
            
            console.log(`❌ ${filename} -> ${suggestedName}`);
          }
        }
      } catch (error) {
        console.error(`Error al procesar directorio ${dir}:`, error);
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 Resumen:');
    if (allValid) {
      console.log('✅ Todos los archivos cumplen con la convención de nombres');
    } else {
      console.log(`❌ Se encontraron ${invalidFiles.length} archivos que no cumplen con la convención`);
      
      // Generar reporte
      const reportPath = path.join(__dirname, '../invalid-image-names.json');
      fs.writeFileSync(reportPath, JSON.stringify(invalidFiles, null, 2));
      console.log(`📄 Se ha generado un reporte en ${reportPath}`);
      
      // Mostrar comando para renombrar
      console.log('\n💡 Para renombrar automáticamente los archivos, ejecute:');
      console.log('node scripts/rename-images.js');
    }
  } catch (error) {
    console.error('Error durante la validación:', error);
  }
}

// Ejecutar la función principal
validateImageNames();
