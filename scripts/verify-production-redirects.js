#!/usr/bin/env node

/**
 * Script para verificar redirects en producción
 * Uso: node scripts/verify-production-redirects.js https://tu-dominio.com
 */

const https = require('https');
const http = require('http');

// URLs a verificar en producción
const PRODUCTION_TESTS = [
  {
    path: '/etiqueta-producto/facil-fix',
    expectedRedirect: '/productos?marca=facilfix',
    priority: 'CRITICAL'
  },
  {
    path: '/etiqueta-producto/facilfix',
    expectedRedirect: '/productos?marca=facilfix',
    priority: 'HIGH'
  },
  {
    path: '/etiqueta-producto/premium',
    expectedRedirect: '/productos?marca=premium',
    priority: 'MEDIUM'
  },
  {
    path: '/facilfix',
    expectedRedirect: '/productos?marca=facilfix',
    priority: 'MEDIUM'
  },
  {
    path: '/catalogo',
    expectedRedirect: '/productos',
    priority: 'LOW'
  }
];

/**
 * Verifica un redirect en producción
 */
function checkRedirect(baseUrl, testCase) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${baseUrl}${testCase.path}`;
    const isHttps = baseUrl.startsWith('https://');
    const client = isHttps ? https : http;
    
    const options = {
      method: 'HEAD', // Usar HEAD para ser más eficiente
      timeout: 10000,
      headers: {
        'User-Agent': 'ProductionRedirectChecker/1.0'
      }
    };

    const req = client.request(fullUrl, options, (res) => {
      const { statusCode, headers } = res;
      
      resolve({
        ...testCase,
        statusCode,
        location: headers.location,
        success: (statusCode === 301 || statusCode === 302) && 
                headers.location && 
                headers.location.includes(testCase.expectedRedirect)
      });
    });

    req.on('error', (error) => {
      resolve({
        ...testCase,
        error: error.message,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ...testCase,
        error: 'Request timeout',
        success: false
      });
    });

    req.end();
  });
}

/**
 * Ejecuta todas las verificaciones
 */
async function verifyProduction(baseUrl) {
  if (!baseUrl) {
    console.error('❌ Error: Debes proporcionar la URL base');
    console.log('Uso: node scripts/verify-production-redirects.js https://tu-dominio.com');
    process.exit(1);
  }

  console.log('🔍 Verificando redirects en producción...');
  console.log(`🌐 URL base: ${baseUrl}\n`);

  const results = [];
  let criticalFailures = 0;
  let totalFailures = 0;

  for (const testCase of PRODUCTION_TESTS) {
    console.log(`🧪 Verificando: ${testCase.path} (${testCase.priority})`);
    
    try {
      const result = await checkRedirect(baseUrl, testCase);
      results.push(result);
      
      if (result.success) {
        console.log(`   ✅ PASS - Redirect ${result.statusCode} a ${result.location}`);
      } else {
        console.log(`   ❌ FAIL - ${result.error || `Status: ${result.statusCode}, Location: ${result.location}`}`);
        totalFailures++;
        
        if (result.priority === 'CRITICAL') {
          criticalFailures++;
        }
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
      totalFailures++;
      
      if (testCase.priority === 'CRITICAL') {
        criticalFailures++;
      }
    }
    
    console.log('');
  }

  // Resumen
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('==========================');
  console.log(`✅ Exitosos: ${results.filter(r => r.success).length}`);
  console.log(`❌ Fallidos: ${totalFailures}`);
  console.log(`🚨 Críticos fallidos: ${criticalFailures}`);
  console.log(`📈 Total verificados: ${results.length}`);

  // Generar reporte
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    results,
    summary: {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: totalFailures,
      criticalFailures
    }
  };

  // Guardar reporte si es posible
  try {
    const fs = require('fs');
    const reportPath = `./reports/production-redirects-${Date.now()}.json`;
    
    if (!fs.existsSync('./reports')) {
      fs.mkdirSync('./reports', { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Reporte guardado en: ${reportPath}`);
  } catch (error) {
    console.log('\n⚠️  No se pudo guardar el reporte:', error.message);
  }

  // Determinar código de salida
  if (criticalFailures > 0) {
    console.log('\n🚨 FALLO CRÍTICO: Hay redirects críticos que no funcionan');
    process.exit(2);
  } else if (totalFailures > 0) {
    console.log('\n⚠️  ADVERTENCIA: Algunos redirects no funcionan correctamente');
    process.exit(1);
  } else {
    console.log('\n🎉 ¡Todos los redirects funcionan correctamente!');
    process.exit(0);
  }
}

/**
 * Función para verificar que el sitio esté accesible
 */
async function checkSiteHealth(baseUrl) {
  console.log('🏥 Verificando salud del sitio...');
  
  try {
    const result = await checkRedirect(baseUrl, { 
      path: '/', 
      expectedRedirect: null,
      priority: 'CRITICAL'
    });
    
    if (result.statusCode === 200) {
      console.log('✅ Sitio accesible\n');
      return true;
    } else {
      console.log(`❌ Sitio no accesible (Status: ${result.statusCode})\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error verificando sitio: ${error.message}\n`);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.log('🔧 Uso: node scripts/verify-production-redirects.js <URL_BASE>');
    console.log('📝 Ejemplo: node scripts/verify-production-redirects.js https://mascolor.vercel.app');
    process.exit(1);
  }

  // Verificar salud del sitio primero
  checkSiteHealth(baseUrl)
    .then(isHealthy => {
      if (isHealthy) {
        return verifyProduction(baseUrl);
      } else {
        console.log('🚫 Cancelando verificación de redirects debido a problemas de accesibilidad');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error durante la verificación:', error);
      process.exit(1);
    });
}

module.exports = { verifyProduction, checkRedirect };
