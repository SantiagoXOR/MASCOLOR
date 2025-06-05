const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuración para imágenes móviles
const MOBILE_CONFIG = {
  width: 390,
  height: 844,
  quality: 85,
  format: 'jpeg'
};

// Mapeo de archivos de origen a nombres de salida
const IMAGE_MAPPING = {
  'FACILFIX.jpg': 'FACILFIX-mobile.jpg',
  'FACILFIX (2).jpg': 'FACILFIX-mobile-alt.jpg',
  'ECOPAINTING.jpg': 'ECOPAINTING-mobile.jpg',
  'ECOPAINTING (2).jpg': 'ECOPAINTING-mobile-alt.jpg',
  'NEWHOUSE.jpg': 'NEWHOUSE-mobile.jpg',
  'NEWHOUSE (2).jpg': 'NEWHOUSE-mobile-alt.jpg',
  'PREMIUM.jpg': 'PREMIUM-mobile.jpg',
  'PREMIUM (2).jpg': 'PREMIUM-mobile-alt.jpg',
  'EXPRESSION.jpg': 'EXPRESSION-mobile.jpg',
  'EXPRESSION (2).jpg': 'EXPRESSION-mobile-alt.jpg'
};

const BUCKETS_DIR = path.join(__dirname, '..', 'public', 'images', 'buckets');

/**
 * Función para verificar si un archivo existe
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Función para generar imagen móvil optimizada
 */
async function generateMobileImage(sourcePath, outputPath) {
  try {
    console.log(`🔄 Procesando: ${path.basename(sourcePath)}`);
    
    // Verificar que el archivo fuente existe
    if (!fileExists(sourcePath)) {
      console.error(`❌ Archivo fuente no encontrado: ${sourcePath}`);
      return false;
    }

    // Obtener información de la imagen original
    const metadata = await sharp(sourcePath).metadata();
    console.log(`   Dimensiones originales: ${metadata.width}x${metadata.height}`);

    // Procesar imagen para móvil
    await sharp(sourcePath)
      .resize(MOBILE_CONFIG.width, MOBILE_CONFIG.height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: MOBILE_CONFIG.quality,
        progressive: true
      })
      .toFile(outputPath);

    console.log(`✅ Imagen móvil generada: ${path.basename(outputPath)}`);
    console.log(`   Dimensiones móviles: ${MOBILE_CONFIG.width}x${MOBILE_CONFIG.height}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error al procesar ${path.basename(sourcePath)}:`, error.message);
    return false;
  }
}

/**
 * Función principal
 */
async function generateAllMobileImages() {
  console.log('🚀 Iniciando generación de imágenes móviles optimizadas...');
  console.log(`📱 Configuración móvil: ${MOBILE_CONFIG.width}x${MOBILE_CONFIG.height} (9:16 ratio)`);
  console.log(`📁 Directorio: ${BUCKETS_DIR}\n`);

  // Verificar que existe el directorio
  if (!fileExists(BUCKETS_DIR)) {
    console.error(`❌ Error: No existe el directorio ${BUCKETS_DIR}`);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  // Procesar cada imagen
  for (const [sourceFile, outputFile] of Object.entries(IMAGE_MAPPING)) {
    const sourcePath = path.join(BUCKETS_DIR, sourceFile);
    const outputPath = path.join(BUCKETS_DIR, outputFile);

    // Verificar si ya existe la imagen móvil
    if (fileExists(outputPath)) {
      console.log(`⏭️ Ya existe: ${outputFile}`);
      continue;
    }

    const success = await generateMobileImage(sourcePath, outputPath);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    console.log(''); // Línea en blanco para separar
  }

  // Resumen final
  console.log('📊 RESUMEN:');
  console.log(`✅ Imágenes generadas exitosamente: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📱 Total de imágenes móviles disponibles: ${successCount}`);

  if (successCount > 0) {
    console.log('\n🎉 ¡Generación de imágenes móviles completada!');
    console.log('💡 Las imágenes están optimizadas para dispositivos móviles (390x844px)');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateAllMobileImages().catch(console.error);
}

module.exports = { generateAllMobileImages, generateMobileImage };
