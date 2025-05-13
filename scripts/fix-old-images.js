/**
 * Script para verificar y corregir los formatos de imagen en el directorio de imágenes antiguas
 * 
 * Este script verifica que todas las imágenes en el directorio de imágenes antiguas
 * tengan los formatos necesarios (webp, avif, jpg, png) y genera los formatos faltantes.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Rutas de archivos
const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const PRODUCTS_IMAGES_DIR = path.join(IMAGES_DIR, 'products');

// Verificar si sharp está instalado
let sharpInstalled = false;
try {
  require.resolve('sharp');
  sharpInstalled = true;
} catch (e) {
  console.warn('⚠️ Sharp no está instalado. Se intentará instalarlo automáticamente.');
  try {
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    sharpInstalled = true;
    console.log('✅ Sharp instalado correctamente');
  } catch (error) {
    console.error('❌ Error al instalar Sharp:', error);
    console.error('Por favor, instala Sharp manualmente: npm install sharp --save-dev');
  }
}

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Función para convertir una imagen a diferentes formatos
async function convertImage(inputPath, outputDir, baseName) {
  if (!sharpInstalled) {
    console.error('❌ Sharp no está instalado. No se pueden convertir imágenes.');
    return false;
  }

  try {
    const sharp = require('sharp');
    const formats = ['webp', 'avif', 'jpg', 'png'];
    let success = true;

    for (const format of formats) {
      const outputPath = path.join(outputDir, `${baseName}.${format}`);
      
      // Verificar si ya existe el archivo
      if (fileExists(outputPath)) {
        console.log(`   El archivo ${baseName}.${format} ya existe`);
        continue;
      }
      
      console.log(`   Generando ${baseName}.${format}...`);
      
      try {
        const image = sharp(inputPath);
        
        // Configurar opciones según el formato
        switch (format) {
          case 'webp':
            await image.webp({ quality: 80 }).toFile(outputPath);
            break;
          case 'avif':
            await image.avif({ quality: 65 }).toFile(outputPath);
            break;
          case 'jpg':
            await image.jpeg({ quality: 85 }).toFile(outputPath);
            break;
          case 'png':
            await image.png({ compressionLevel: 9 }).toFile(outputPath);
            break;
        }
        
        console.log(`   ✅ Generado ${baseName}.${format}`);
      } catch (error) {
        console.error(`   ❌ Error al generar ${baseName}.${format}:`, error);
        success = false;
      }
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error al convertir imagen:', error);
    return false;
  }
}

// Función principal
async function fixOldImages() {
  try {
    console.log('🔄 Verificando y corrigiendo formatos de imagen en el directorio de imágenes antiguas...');

    // Verificar si existe el directorio de imágenes de productos
    if (!fileExists(PRODUCTS_IMAGES_DIR)) {
      console.error(`❌ El directorio de imágenes de productos no existe: ${PRODUCTS_IMAGES_DIR}`);
      return;
    }

    // Obtener todas las imágenes
    const images = fs.readdirSync(PRODUCTS_IMAGES_DIR);
    console.log(`📊 Se encontraron ${images.length} imágenes`);

    // Filtrar solo archivos de imagen
    const imageFiles = images.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
    });

    console.log(`📊 Se encontraron ${imageFiles.length} archivos de imagen`);

    // Agrupar imágenes por nombre base
    const imageGroups = {};
    for (const file of imageFiles) {
      const baseName = path.basename(file, path.extname(file));
      const ext = path.extname(file).toLowerCase().substring(1);
      
      if (!imageGroups[baseName]) {
        imageGroups[baseName] = { formats: [] };
      }
      
      imageGroups[baseName].formats.push(ext);
    }

    console.log(`📊 Se encontraron ${Object.keys(imageGroups).length} grupos de imágenes`);

    let fixedCount = 0;
    let errorCount = 0;
    let okCount = 0;

    // Procesar cada grupo de imágenes
    for (const [baseName, group] of Object.entries(imageGroups)) {
      console.log(`\n🔍 Verificando imagen: ${baseName}`);
      console.log(`   Formatos existentes: ${group.formats.join(', ') || 'ninguno'}`);
      
      // Verificar si faltan formatos
      const missingFormats = ['webp', 'avif', 'jpg', 'png'].filter(format => !group.formats.includes(format));
      console.log(`   Formatos faltantes: ${missingFormats.join(', ') || 'ninguno'}`);
      
      // Si faltan formatos y existe al menos uno, generar los faltantes
      if (missingFormats.length > 0 && group.formats.length > 0) {
        console.log(`   Generando formatos faltantes...`);
        
        // Usar el primer formato existente como fuente
        const sourceFormat = group.formats[0];
        const sourcePath = path.join(PRODUCTS_IMAGES_DIR, `${baseName}.${sourceFormat}`);
        
        // Convertir a los formatos faltantes
        const success = await convertImage(sourcePath, PRODUCTS_IMAGES_DIR, baseName);
        
        if (success) {
          console.log(`   ✅ Formatos generados correctamente`);
          fixedCount++;
        } else {
          console.error(`   ❌ Error al generar formatos`);
          errorCount++;
        }
      } else if (missingFormats.length === 0) {
        console.log(`   ✅ La imagen ya tiene todos los formatos necesarios`);
        okCount++;
      } else {
        console.error(`   ❌ No hay ningún formato existente para usar como fuente`);
        errorCount++;
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   Imágenes correctas: ${okCount}`);
    console.log(`   Imágenes corregidas: ${fixedCount}`);
    console.log(`   Errores: ${errorCount}`);
    
    if (fixedCount > 0) {
      console.log('✅ Se han corregido los formatos de imagen en el directorio de imágenes antiguas');
    } else if (okCount === Object.keys(imageGroups).length) {
      console.log('✅ Todas las imágenes tienen los formatos necesarios');
    } else {
      console.log('⚠️ No se ha podido corregir todos los formatos de imagen');
    }
  } catch (error) {
    console.error('❌ Error al corregir formatos de imagen:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixOldImages();
