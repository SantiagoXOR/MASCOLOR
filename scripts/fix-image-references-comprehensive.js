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

// Mapeo de imágenes problemáticas a sus nombres correctos
const IMAGE_MAPPING = {
  // Imágenes que fueron renombradas durante la estandarización
  'PREMIUM-SUPERLAVABLE.png': 'premium-lavable-super.png',
  'FACIL FIX EXTERIOR BLANCO.png': 'facilfix-exterior-blanco.png',
  'ECOPAINTINGMEMBRANA.png': 'ecopainting-membrana.png',
  'NEW-HOUSE-BARNIZ-MARINO.png': 'newhouse-barniz-marino.png',
  'EXPRESSION-LATEX-INTERIOR.png': 'expression-latex-interior.png',
  
  // Variaciones comunes que pueden aparecer
  'PREMIUM-LAVABLE.png': 'premium-lavable-super.png',
  'FACILFIX-EXTERIOR-BLANCO.png': 'facilfix-exterior-blanco.png',
  'ECOPAINTING-MEMBRANA.png': 'ecopainting-membrana.png',
  'NEWHOUSE-BARNIZ-MARINO.png': 'newhouse-barniz-marino.png',
  'EXPRESSION-LATEX-INTERIOR.png': 'expression-latex-interior.png',
};

// Directorios a buscar
const SEARCH_DIRS = [
  'components',
  'hooks',
  'lib',
  'app',
  'pages',
  'styles'
];

// Extensiones de archivos a procesar
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'];

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
 * Función para verificar si una imagen existe en el directorio de productos
 */
function imageExists(imageName) {
  const imagePath = path.join(__dirname, '..', 'public', 'images', 'products', imageName);
  return fileExists(imagePath);
}

/**
 * Función para buscar archivos recursivamente
 */
function findFiles(dir, extensions) {
  let results = [];
  
  if (!fileExists(dir)) {
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Excluir directorios específicos
      if (!['node_modules', '.next', '.git', 'out', 'dist'].includes(file)) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  }
  
  return results;
}

/**
 * Función para procesar un archivo y reemplazar referencias de imágenes
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    const changes = [];
    
    // Buscar y reemplazar cada imagen problemática
    for (const [oldImage, newImage] of Object.entries(IMAGE_MAPPING)) {
      // Buscar referencias con diferentes formatos de ruta
      const patterns = [
        new RegExp(`/images/products/${oldImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        new RegExp(`"images/products/${oldImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
        new RegExp(`'images/products/${oldImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
        new RegExp(`\`images/products/${oldImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\``, 'g'),
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(newContent)) {
          const oldPath = `/images/products/${oldImage}`;
          const newPath = `/images/products/${newImage}`;
          
          newContent = newContent.replace(pattern, (match) => {
            return match.replace(oldImage, newImage);
          });
          
          hasChanges = true;
          changes.push({
            from: oldPath,
            to: newPath
          });
        }
      }
    }
    
    // Si hay cambios, escribir el archivo
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return { success: true, changes, filePath };
    }
    
    return { success: true, changes: [], filePath };
  } catch (error) {
    return { success: false, error: error.message, filePath };
  }
}

/**
 * Función principal
 */
function main() {
  log('🔧 REPARACIÓN INTEGRAL DE REFERENCIAS DE IMÁGENES', colors.bold);
  log('=' .repeat(60), colors.blue);
  
  // Verificar que las imágenes de destino existen
  log('\n📋 Verificando imágenes de destino...', colors.blue);
  let missingImages = 0;
  
  for (const [oldImage, newImage] of Object.entries(IMAGE_MAPPING)) {
    if (imageExists(newImage)) {
      log(`   ✅ ${newImage} existe`, colors.green);
    } else {
      log(`   ❌ ${newImage} NO existe`, colors.red);
      missingImages++;
    }
  }
  
  if (missingImages > 0) {
    log(`\n⚠️ Se encontraron ${missingImages} imágenes faltantes. Continuando con la reparación...`, colors.yellow);
  }
  
  // Buscar todos los archivos a procesar
  log('\n🔍 Buscando archivos a procesar...', colors.blue);
  let allFiles = [];
  
  for (const dir of SEARCH_DIRS) {
    const dirPath = path.join(__dirname, '..', dir);
    const files = findFiles(dirPath, FILE_EXTENSIONS);
    allFiles = allFiles.concat(files);
  }
  
  log(`   📁 Se encontraron ${allFiles.length} archivos para procesar`, colors.blue);
  
  // Procesar archivos
  log('\n🔄 Procesando archivos...', colors.blue);
  let processedFiles = 0;
  let filesWithChanges = 0;
  let totalChanges = 0;
  const errors = [];
  
  for (const filePath of allFiles) {
    const result = processFile(filePath);
    processedFiles++;
    
    if (result.success) {
      if (result.changes.length > 0) {
        filesWithChanges++;
        totalChanges += result.changes.length;
        
        const relativePath = path.relative(path.join(__dirname, '..'), result.filePath);
        log(`   ✅ ${relativePath}`, colors.green);
        
        for (const change of result.changes) {
          log(`      ${change.from} → ${change.to}`, colors.yellow);
        }
      }
    } else {
      errors.push(result);
      log(`   ❌ Error en ${result.filePath}: ${result.error}`, colors.red);
    }
  }
  
  // Resumen final
  log('\n📊 RESUMEN FINAL', colors.bold);
  log('=' .repeat(30), colors.blue);
  log(`Archivos procesados: ${processedFiles}`, colors.blue);
  log(`Archivos modificados: ${filesWithChanges}`, filesWithChanges > 0 ? colors.green : colors.blue);
  log(`Total de cambios: ${totalChanges}`, totalChanges > 0 ? colors.green : colors.blue);
  log(`Errores: ${errors.length}`, errors.length === 0 ? colors.green : colors.red);
  
  if (totalChanges > 0) {
    log('\n🎉 ¡Reparación completada exitosamente!', colors.green);
    log('💡 Se recomienda verificar que la aplicación funcione correctamente', colors.yellow);
  } else {
    log('\n✨ No se encontraron referencias problemáticas', colors.green);
  }
  
  // Crear reporte
  const report = {
    timestamp: new Date().toISOString(),
    filesProcessed: processedFiles,
    filesModified: filesWithChanges,
    totalChanges: totalChanges,
    errors: errors.length,
    imageMappings: IMAGE_MAPPING
  };
  
  const reportPath = path.join(__dirname, '..', 'reports', 'image-references-fix-report.json');
  
  // Crear directorio de reportes si no existe
  const reportsDir = path.dirname(reportPath);
  if (!fileExists(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Reporte guardado en: ${reportPath}`, colors.blue);
  
  process.exit(totalChanges > 0 ? 0 : 1);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main, processFile, IMAGE_MAPPING };
