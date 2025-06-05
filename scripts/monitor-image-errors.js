const fs = require('fs');
const path = require('path');
const http = require('http');

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
 * Función para verificar si una imagen es accesible vía HTTP
 */
function checkImageUrl(url, port = 3000) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: url,
      method: 'HEAD',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        accessible: res.statusCode === 200
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        error: err.message,
        accessible: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        error: 'Timeout',
        accessible: false
      });
    });

    req.end();
  });
}

/**
 * Función para extraer URLs de imágenes del código
 */
function extractImageUrls() {
  const imageUrls = new Set();
  
  // Patrones para buscar URLs de imágenes
  const patterns = [
    /\/images\/products\/[^"'\s]+\.(jpg|jpeg|png|webp|avif)/g,
    /\/images\/buckets\/[^"'\s]+\.(jpg|jpeg|png|webp|avif)/g,
    /\/images\/logos\/[^"'\s]+\.(svg|png|jpg)/g
  ];
  
  // Directorios a buscar
  const searchDirs = ['components', 'hooks', 'lib', 'app'];
  
  function searchInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => imageUrls.add(match));
        }
      });
    } catch (error) {
      // Ignorar errores de lectura de archivos
    }
  }
  
  function searchInDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !['node_modules', '.next', '.git'].includes(file)) {
          searchInDirectory(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
          searchInFile(filePath);
        }
      });
    } catch (error) {
      // Ignorar errores de directorio
    }
  }
  
  searchDirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(dirPath)) {
      searchInDirectory(dirPath);
    }
  });
  
  return Array.from(imageUrls);
}

/**
 * Función para verificar si el servidor de desarrollo está corriendo
 */
async function checkDevServer(port = 3000) {
  try {
    const result = await checkImageUrl('/', port);
    return result.accessible || result.status === 200 || result.status === 404;
  } catch (error) {
    return false;
  }
}

/**
 * Función principal de monitoreo
 */
async function monitorImages(port = 3000) {
  log('🔍 MONITOR DE ERRORES DE IMÁGENES - PROYECTO +COLOR', colors.bold);
  log('=' .repeat(60), colors.blue);
  
  // Verificar si el servidor de desarrollo está corriendo
  log('\n📡 Verificando servidor de desarrollo...', colors.blue);
  const serverRunning = await checkDevServer(port);
  
  if (!serverRunning) {
    log(`❌ El servidor de desarrollo no está corriendo en el puerto ${port}`, colors.red);
    log('💡 Inicia el servidor con: npm run dev', colors.yellow);
    process.exit(1);
  }
  
  log(`✅ Servidor de desarrollo detectado en puerto ${port}`, colors.green);
  
  // Extraer URLs de imágenes del código
  log('\n🔍 Extrayendo URLs de imágenes del código...', colors.blue);
  const imageUrls = extractImageUrls();
  log(`📊 Se encontraron ${imageUrls.length} referencias de imágenes`, colors.blue);
  
  if (imageUrls.length === 0) {
    log('⚠️ No se encontraron referencias de imágenes en el código', colors.yellow);
    process.exit(0);
  }
  
  // Verificar cada imagen
  log('\n🔄 Verificando accesibilidad de imágenes...', colors.blue);
  const results = [];
  let accessible = 0;
  let inaccessible = 0;
  
  for (const url of imageUrls) {
    const result = await checkImageUrl(url, port);
    results.push(result);
    
    if (result.accessible) {
      accessible++;
      log(`   ✅ ${url}`, colors.green);
    } else {
      inaccessible++;
      if (result.status === 404) {
        log(`   ❌ ${url} (404 - No encontrada)`, colors.red);
      } else if (result.error) {
        log(`   ❌ ${url} (Error: ${result.error})`, colors.red);
      } else {
        log(`   ❌ ${url} (Status: ${result.status})`, colors.red);
      }
    }
  }
  
  // Resumen
  log('\n📊 RESUMEN DEL MONITOREO', colors.bold);
  log('=' .repeat(30), colors.blue);
  log(`Total de imágenes verificadas: ${imageUrls.length}`, colors.blue);
  log(`✅ Accesibles: ${accessible}`, colors.green);
  log(`❌ Inaccesibles: ${inaccessible}`, inaccessible > 0 ? colors.red : colors.green);
  
  if (inaccessible > 0) {
    log('\n🔧 RECOMENDACIONES:', colors.yellow);
    log('1. Ejecuta: npm run fix-image-references', colors.yellow);
    log('2. Verifica: npm run verify-image-integrity', colors.yellow);
    log('3. Genera imágenes faltantes si es necesario', colors.yellow);
    
    // Detectar patrones comunes de errores
    const problematicUrls = results.filter(r => !r.accessible);
    const hasOldNaming = problematicUrls.some(r => 
      r.url.includes('PREMIUM-SUPERLAVABLE') ||
      r.url.includes('FACIL FIX EXTERIOR') ||
      r.url.includes('ECOPAINTINGMEMBRANA')
    );
    
    if (hasOldNaming) {
      log('\n⚠️ Se detectaron imágenes con nomenclatura antigua', colors.yellow);
      log('💡 Ejecuta: npm run fix-image-references', colors.yellow);
    }
  } else {
    log('\n🎉 ¡Todas las imágenes son accesibles!', colors.green);
    log('✨ El sistema de imágenes está funcionando correctamente', colors.green);
  }
  
  // Crear reporte
  const report = {
    timestamp: new Date().toISOString(),
    serverPort: port,
    totalImages: imageUrls.length,
    accessible: accessible,
    inaccessible: inaccessible,
    results: results
  };
  
  const reportPath = path.join(__dirname, '..', 'reports', 'image-monitoring-report.json');
  
  // Crear directorio de reportes si no existe
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Reporte guardado en: ${reportPath}`, colors.blue);
  
  process.exit(inaccessible > 0 ? 1 : 0);
}

/**
 * Función para modo de monitoreo continuo
 */
async function continuousMonitoring(port = 3000, interval = 30000) {
  log('🔄 MODO DE MONITOREO CONTINUO ACTIVADO', colors.bold);
  log(`⏱️ Verificando cada ${interval / 1000} segundos...`, colors.blue);
  log('🛑 Presiona Ctrl+C para detener\n', colors.yellow);
  
  while (true) {
    const timestamp = new Date().toLocaleTimeString();
    log(`[${timestamp}] Ejecutando verificación...`, colors.blue);
    
    try {
      await monitorImages(port);
    } catch (error) {
      log(`❌ Error durante la verificación: ${error.message}`, colors.red);
    }
    
    log(`⏳ Esperando ${interval / 1000} segundos...\n`, colors.yellow);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2);
const port = args.find(arg => arg.startsWith('--port='))?.split('=')[1] || 3000;
const continuous = args.includes('--continuous');
const interval = args.find(arg => arg.startsWith('--interval='))?.split('=')[1] || 30000;

// Ejecutar
if (require.main === module) {
  if (continuous) {
    continuousMonitoring(parseInt(port), parseInt(interval));
  } else {
    monitorImages(parseInt(port));
  }
}

module.exports = { monitorImages, continuousMonitoring, checkImageUrl, extractImageUrls };
