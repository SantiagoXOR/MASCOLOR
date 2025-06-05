const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

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
 * Función para obtener el tamaño de un archivo
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Función para verificar imágenes de productos
 */
function verifyProductImages() {
  log('\n📦 VERIFICANDO IMÁGENES DE PRODUCTOS', colors.bold);
  
  const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');
  
  if (!fileExists(productsDir)) {
    log('❌ Directorio de productos no encontrado', colors.red);
    return { total: 0, valid: 0, invalid: 0, missing: 0 };
  }
  
  const files = fs.readdirSync(productsDir);
  const imageFiles = files.filter(file => 
    file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp') || file.endsWith('.avif')
  );
  
  let valid = 0;
  let invalid = 0;
  const issues = [];
  
  for (const file of imageFiles) {
    const filePath = path.join(productsDir, file);
    const size = getFileSize(filePath);
    
    if (size === 0) {
      invalid++;
      issues.push(`❌ ${file} (archivo vacío)`);
    } else if (size < 1000) {
      invalid++;
      issues.push(`⚠️ ${file} (tamaño sospechoso: ${size} bytes)`);
    } else {
      valid++;
    }
  }
  
  log(`   📊 Total de imágenes: ${imageFiles.length}`, colors.blue);
  log(`   ✅ Válidas: ${valid}`, colors.green);
  log(`   ❌ Problemáticas: ${invalid}`, invalid > 0 ? colors.red : colors.green);
  
  if (issues.length > 0) {
    log('\n   🔍 Problemas encontrados:', colors.yellow);
    issues.forEach(issue => log(`      ${issue}`, colors.yellow));
  }
  
  return { total: imageFiles.length, valid, invalid, issues };
}

/**
 * Función para verificar imágenes móviles
 */
function verifyMobileImages() {
  log('\n📱 VERIFICANDO IMÁGENES MÓVILES', colors.bold);
  
  const bucketsDir = path.join(__dirname, '..', 'public', 'images', 'buckets');
  const expectedMobileImages = [
    'FACILFIX-mobile.jpg',
    'ECOPAINTING-mobile.jpg',
    'NEWHOUSE-mobile.jpg',
    'PREMIUM-mobile.jpg',
    'EXPRESSION-mobile.jpg'
  ];
  
  let found = 0;
  let missing = 0;
  const missingImages = [];
  
  for (const imageName of expectedMobileImages) {
    const imagePath = path.join(bucketsDir, imageName);
    
    if (fileExists(imagePath)) {
      const size = getFileSize(imagePath);
      if (size > 0) {
        found++;
        log(`   ✅ ${imageName} (${Math.round(size / 1024)} KB)`, colors.green);
      } else {
        missing++;
        missingImages.push(`❌ ${imageName} (archivo vacío)`);
      }
    } else {
      missing++;
      missingImages.push(`❌ ${imageName} (no encontrada)`);
    }
  }
  
  log(`   📊 Imágenes móviles esperadas: ${expectedMobileImages.length}`, colors.blue);
  log(`   ✅ Encontradas: ${found}`, colors.green);
  log(`   ❌ Faltantes: ${missing}`, missing > 0 ? colors.red : colors.green);
  
  if (missingImages.length > 0) {
    log('\n   🔍 Imágenes faltantes:', colors.yellow);
    missingImages.forEach(issue => log(`      ${issue}`, colors.yellow));
  }
  
  return { expected: expectedMobileImages.length, found, missing, missingImages };
}

/**
 * Función para verificar imágenes de logos
 */
function verifyLogoImages() {
  log('\n🏷️ VERIFICANDO LOGOS DE MARCAS', colors.bold);
  
  const logosDir = path.join(__dirname, '..', 'public', 'images', 'logos');
  const expectedLogos = [
    'facilfix.svg',
    'ecopainting.svg',
    'newhouse.svg',
    'premium.svg',
    'expression.svg'
  ];
  
  let found = 0;
  let missing = 0;
  const missingLogos = [];
  
  for (const logoName of expectedLogos) {
    const logoPath = path.join(logosDir, logoName);
    
    if (fileExists(logoPath)) {
      const size = getFileSize(logoPath);
      if (size > 0) {
        found++;
        log(`   ✅ ${logoName} (${Math.round(size / 1024)} KB)`, colors.green);
      } else {
        missing++;
        missingLogos.push(`❌ ${logoName} (archivo vacío)`);
      }
    } else {
      missing++;
      missingLogos.push(`❌ ${logoName} (no encontrado)`);
    }
  }
  
  log(`   📊 Logos esperados: ${expectedLogos.length}`, colors.blue);
  log(`   ✅ Encontrados: ${found}`, colors.green);
  log(`   ❌ Faltantes: ${missing}`, missing > 0 ? colors.red : colors.green);
  
  if (missingLogos.length > 0) {
    log('\n   🔍 Logos faltantes:', colors.yellow);
    missingLogos.forEach(issue => log(`      ${issue}`, colors.yellow));
  }
  
  return { expected: expectedLogos.length, found, missing, missingLogos };
}

/**
 * Función para verificar imagen placeholder
 */
function verifyPlaceholderImage() {
  log('\n🖼️ VERIFICANDO IMAGEN PLACEHOLDER', colors.bold);
  
  const placeholderPath = path.join(__dirname, '..', 'public', 'images', 'products', 'placeholder.jpg');
  
  if (fileExists(placeholderPath)) {
    const size = getFileSize(placeholderPath);
    if (size > 0) {
      log(`   ✅ placeholder.jpg encontrada (${Math.round(size / 1024)} KB)`, colors.green);
      return { found: true, size };
    } else {
      log(`   ❌ placeholder.jpg está vacía`, colors.red);
      return { found: false, size: 0 };
    }
  } else {
    log(`   ❌ placeholder.jpg no encontrada`, colors.red);
    return { found: false, size: 0 };
  }
}

/**
 * Función principal
 */
function main() {
  log('🔍 VERIFICACIÓN INTEGRAL DE IMÁGENES - PROYECTO +COLOR', colors.bold);
  log('=' .repeat(60), colors.blue);
  
  // Verificar diferentes tipos de imágenes
  const productResults = verifyProductImages();
  const mobileResults = verifyMobileImages();
  const logoResults = verifyLogoImages();
  const placeholderResults = verifyPlaceholderImage();
  
  // Resumen final
  log('\n📊 RESUMEN FINAL', colors.bold);
  log('=' .repeat(30), colors.blue);
  
  const totalIssues = productResults.invalid + mobileResults.missing + logoResults.missing + (placeholderResults.found ? 0 : 1);
  
  log(`Imágenes de productos: ${productResults.valid}/${productResults.total} válidas`, 
      productResults.invalid === 0 ? colors.green : colors.yellow);
  log(`Imágenes móviles: ${mobileResults.found}/${mobileResults.expected} encontradas`, 
      mobileResults.missing === 0 ? colors.green : colors.yellow);
  log(`Logos de marcas: ${logoResults.found}/${logoResults.expected} encontrados`, 
      logoResults.missing === 0 ? colors.green : colors.yellow);
  log(`Imagen placeholder: ${placeholderResults.found ? 'OK' : 'FALTANTE'}`, 
      placeholderResults.found ? colors.green : colors.red);
  
  log(`\nTotal de problemas: ${totalIssues}`, totalIssues === 0 ? colors.green : colors.red);
  
  if (totalIssues === 0) {
    log('\n🎉 ¡Todas las imágenes están en orden!', colors.green);
    log('✨ El sistema de imágenes está funcionando correctamente', colors.green);
  } else {
    log('\n⚠️ Se encontraron algunos problemas', colors.yellow);
    log('🔧 Revisa los elementos marcados como problemáticos', colors.yellow);
    
    if (mobileResults.missing > 0) {
      log('\n💡 Para generar imágenes móviles faltantes:', colors.blue);
      log('   npm run generate-mobile-images', colors.blue);
    }
  }
  
  // Crear reporte
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues,
      productImages: productResults,
      mobileImages: mobileResults,
      logoImages: logoResults,
      placeholderImage: placeholderResults
    }
  };
  
  const reportPath = path.join(__dirname, '..', 'reports', 'image-integrity-report.json');
  
  // Crear directorio de reportes si no existe
  const reportsDir = path.dirname(reportPath);
  if (!fileExists(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Reporte detallado guardado en: ${reportPath}`, colors.blue);
  
  process.exit(totalIssues === 0 ? 0 : 1);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main, verifyProductImages, verifyMobileImages, verifyLogoImages, verifyPlaceholderImage };
