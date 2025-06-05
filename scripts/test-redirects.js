#!/usr/bin/env node

/**
 * Script para probar los redirects implementados
 * Verifica que las URLs antiguas redirijan correctamente a las nuevas
 */

const https = require('https');
const http = require('http');

// Configuración
const BASE_URL = process.env.TEST_URL || 'http://localhost:3003';
const TIMEOUT = 5000;

// URLs a probar
const REDIRECT_TESTS = [
  {
    from: '/etiqueta-producto/facil-fix',
    to: '/productos?marca=facilfix',
    description: 'Redirect de etiqueta Facil Fix'
  },
  {
    from: '/etiqueta-producto/facilfix',
    to: '/productos?marca=facilfix',
    description: 'Redirect de etiqueta Facilfix'
  },
  {
    from: '/etiqueta-producto/premium',
    to: '/productos?marca=premium',
    description: 'Redirect de etiqueta Premium'
  },
  {
    from: '/etiqueta-producto/expression',
    to: '/productos?marca=expression',
    description: 'Redirect de etiqueta Expression'
  },
  {
    from: '/etiqueta-producto/ecopainting',
    to: '/productos?marca=ecopainting',
    description: 'Redirect de etiqueta Ecopainting'
  },
  {
    from: '/etiqueta-producto/newhouse',
    to: '/productos?marca=newhouse',
    description: 'Redirect de etiqueta New House'
  },
  {
    from: '/etiqueta-producto/inexistente',
    to: '/productos',
    description: 'Redirect de etiqueta inexistente (fallback)'
  },
  {
    from: '/productos-facilfix',
    to: '/productos?marca=facilfix',
    description: 'Redirect legacy productos-facilfix'
  },
  {
    from: '/facilfix',
    to: '/productos?marca=facilfix',
    description: 'Redirect legacy facilfix'
  },
  {
    from: '/catalogo',
    to: '/productos',
    description: 'Redirect legacy catálogo'
  }
];

/**
 * Realiza una petición HTTP y sigue redirects
 */
function testRedirect(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const options = {
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'RedirectTester/1.0'
      }
    };

    const req = client.get(url, options, (res) => {
      const { statusCode, headers } = res;
      
      resolve({
        statusCode,
        location: headers.location,
        finalUrl: url
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Ejecuta todas las pruebas de redirect
 */
async function runTests() {
  console.log('🧪 Iniciando pruebas de redirects...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of REDIRECT_TESTS) {
    const fullUrl = `${BASE_URL}${test.from}`;
    
    try {
      console.log(`🔍 Probando: ${test.description}`);
      console.log(`   FROM: ${test.from}`);
      console.log(`   TO:   ${test.to}`);
      
      const result = await testRedirect(fullUrl);
      
      if (result.statusCode === 301 || result.statusCode === 302) {
        if (result.location && result.location.includes(test.to)) {
          console.log(`   ✅ PASS - Redirect ${result.statusCode} a ${result.location}`);
          passed++;
        } else {
          console.log(`   ❌ FAIL - Redirect a URL incorrecta: ${result.location}`);
          failed++;
        }
      } else if (result.statusCode === 200) {
        console.log(`   ⚠️  WARN - No hay redirect (200), verificar middleware`);
        failed++;
      } else {
        console.log(`   ❌ FAIL - Status code inesperado: ${result.statusCode}`);
        failed++;
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
      failed++;
    }
    
    console.log('');
  }

  // Resumen
  console.log('📊 Resumen de pruebas:');
  console.log(`   ✅ Pasaron: ${passed}`);
  console.log(`   ❌ Fallaron: ${failed}`);
  console.log(`   📈 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisar la implementación.');
    process.exit(1);
  }
}

/**
 * Prueba adicional: verificar que las páginas de destino cargan correctamente
 */
async function testDestinationPages() {
  console.log('\n🔍 Probando páginas de destino...\n');
  
  const destinationUrls = [
    '/productos',
    '/productos?marca=facilfix',
    '/productos?marca=premium',
    '/productos?categoria=especiales'
  ];

  for (const path of destinationUrls) {
    const fullUrl = `${BASE_URL}${path}`;
    
    try {
      console.log(`📄 Probando página: ${path}`);
      const result = await testRedirect(fullUrl);
      
      if (result.statusCode === 200) {
        console.log(`   ✅ PASS - Página carga correctamente`);
      } else {
        console.log(`   ❌ FAIL - Status code: ${result.statusCode}`);
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
    }
  }
}

// Ejecutar pruebas
if (require.main === module) {
  runTests()
    .then(() => testDestinationPages())
    .catch((error) => {
      console.error('Error ejecutando pruebas:', error);
      process.exit(1);
    });
}

module.exports = { testRedirect, runTests };
