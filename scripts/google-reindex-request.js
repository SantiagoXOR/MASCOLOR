#!/usr/bin/env node

/**
 * Script para generar solicitudes de re-indexación a Google Search Console
 * Este script genera las URLs y comandos necesarios para solicitar re-indexación
 */

const fs = require('fs');
const path = require('path');

// URLs problemáticas que necesitan re-indexación
const PROBLEMATIC_URLS = [
  'https://pinturasmascolor.com.ar/etiqueta-producto/facil-fix',
  'https://pinturasmascolor.com.ar/etiqueta-producto/facilfix',
  'https://pinturasmascolor.com.ar/etiqueta-producto/premium',
  'https://pinturasmascolor.com.ar/etiqueta-producto/expression',
  'https://pinturasmascolor.com.ar/etiqueta-producto/ecopainting',
  'https://pinturasmascolor.com.ar/etiqueta-producto/newhouse',
  'https://pinturasmascolor.com.ar/productos-facilfix',
  'https://pinturasmascolor.com.ar/facilfix',
  'https://pinturasmascolor.com.ar/catalogo'
];

// URLs nuevas que deben indexarse
const NEW_URLS = [
  'https://pinturasmascolor.com.ar/productos',
  'https://pinturasmascolor.com.ar/#productos'
];

/**
 * Genera el reporte de re-indexación
 */
function generateReindexReport() {
  const report = {
    timestamp: new Date().toISOString(),
    title: "Solicitud de Re-indexación - URLs con Redirects",
    description: "URLs que necesitan ser re-indexadas después de implementar redirects 301",
    
    problematicUrls: {
      description: "URLs antiguas que ahora redirigen - solicitar eliminación del índice",
      urls: PROBLEMATIC_URLS,
      action: "REMOVE_FROM_INDEX",
      method: "Google Search Console > Eliminaciones > Eliminar temporalmente"
    },
    
    newUrls: {
      description: "URLs nuevas que deben indexarse",
      urls: NEW_URLS,
      action: "REQUEST_INDEXING",
      method: "Google Search Console > Inspección de URLs > Solicitar indexación"
    },
    
    instructions: {
      step1: {
        title: "1. Acceder a Google Search Console",
        url: "https://search.google.com/search-console",
        description: "Inicia sesión con la cuenta que tiene acceso al sitio pinturasmascolor.com.ar"
      },
      
      step2: {
        title: "2. Eliminar URLs problemáticas del índice",
        description: "Para cada URL problemática:",
        substeps: [
          "Ir a 'Eliminaciones' en el menú lateral",
          "Hacer clic en 'Eliminar temporalmente'",
          "Seleccionar 'Eliminar temporalmente la URL del índice de Google'",
          "Pegar la URL problemática",
          "Hacer clic en 'Siguiente' y confirmar"
        ]
      },
      
      step3: {
        title: "3. Solicitar indexación de URLs nuevas",
        description: "Para cada URL nueva:",
        substeps: [
          "Ir a 'Inspección de URLs' en el menú lateral",
          "Pegar la URL nueva en la barra de búsqueda",
          "Hacer clic en 'Solicitar indexación'",
          "Esperar confirmación"
        ]
      },
      
      step4: {
        title: "4. Enviar sitemap actualizado",
        description: "Asegurar que Google tenga el sitemap más reciente:",
        substeps: [
          "Ir a 'Sitemaps' en el menú lateral",
          "Agregar nuevo sitemap: 'sitemap.xml'",
          "Hacer clic en 'Enviar'",
          "Verificar que no haya errores"
        ]
      },
      
      step5: {
        title: "5. Monitorear resultados",
        description: "Durante las próximas 2-4 semanas:",
        substeps: [
          "Revisar 'Cobertura' para ver reducción de errores 404",
          "Verificar 'Rendimiento' para tráfico a nuevas URLs",
          "Comprobar que las URLs problemáticas desaparezcan de los resultados"
        ]
      }
    },
    
    timeline: {
      immediate: [
        "Eliminar URLs problemáticas del índice",
        "Solicitar indexación de URLs nuevas",
        "Enviar sitemap actualizado"
      ],
      week1: [
        "Verificar que los redirects funcionen correctamente",
        "Monitorear errores 404 en Search Console",
        "Revisar tráfico a nuevas URLs en Analytics"
      ],
      week2_4: [
        "Confirmar que URLs problemáticas desaparezcan de resultados",
        "Verificar mejora en métricas SEO",
        "Documentar resultados obtenidos"
      ]
    },
    
    expectedResults: [
      "Reducción de errores 404 en Google Search Console",
      "Desaparición de URLs problemáticas de resultados de búsqueda",
      "Indexación correcta de nuevas URLs",
      "Preservación del tráfico orgánico mediante redirects",
      "Mejora en la experiencia del usuario"
    ]
  };

  return report;
}

/**
 * Genera archivo de texto con URLs para copiar/pegar
 */
function generateUrlLists() {
  const problematicList = PROBLEMATIC_URLS.join('\n');
  const newUrlsList = NEW_URLS.join('\n');
  
  const content = `# URLs para Re-indexación - ${new Date().toISOString()}

## URLs PROBLEMÁTICAS (Eliminar del índice)
${problematicList}

## URLs NUEVAS (Solicitar indexación)
${newUrlsList}

## Instrucciones rápidas:

### Para eliminar URLs problemáticas:
1. Google Search Console > Eliminaciones
2. Eliminar temporalmente > Eliminar URL del índice
3. Copiar/pegar cada URL problemática

### Para indexar URLs nuevas:
1. Google Search Console > Inspección de URLs
2. Pegar URL nueva
3. Solicitar indexación

### Sitemap:
- URL: https://pinturasmascolor.com.ar/sitemap.xml
- Enviar en: Google Search Console > Sitemaps
`;

  return content;
}

/**
 * Guarda los archivos de reporte
 */
function saveReports() {
  const reportsDir = './reports';
  
  // Crear directorio si no existe
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Generar reportes
  const report = generateReindexReport();
  const urlLists = generateUrlLists();
  
  // Guardar archivos
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = path.join(reportsDir, `google-reindex-request-${timestamp}.json`);
  const urlsFile = path.join(reportsDir, `urls-for-reindex-${timestamp}.txt`);
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  fs.writeFileSync(urlsFile, urlLists);
  
  console.log('📊 Reportes de re-indexación generados:');
  console.log(`📄 Reporte completo: ${reportFile}`);
  console.log(`📋 Lista de URLs: ${urlsFile}`);
  
  return { reportFile, urlsFile, report };
}

/**
 * Muestra resumen en consola
 */
function showSummary(report) {
  console.log('\n🎯 RESUMEN DE ACCIONES REQUERIDAS');
  console.log('==================================');
  
  console.log(`\n🗑️  URLs a ELIMINAR del índice (${report.problematicUrls.urls.length}):`);
  report.problematicUrls.urls.forEach(url => {
    console.log(`   - ${url}`);
  });
  
  console.log(`\n📈 URLs NUEVAS a indexar (${report.newUrls.urls.length}):`);
  report.newUrls.urls.forEach(url => {
    console.log(`   - ${url}`);
  });
  
  console.log('\n🚀 PRÓXIMOS PASOS:');
  console.log('1. Acceder a Google Search Console');
  console.log('2. Eliminar URLs problemáticas del índice');
  console.log('3. Solicitar indexación de URLs nuevas');
  console.log('4. Enviar sitemap actualizado');
  console.log('5. Monitorear resultados durante 2-4 semanas');
  
  console.log('\n⏱️  TIEMPO ESTIMADO:');
  console.log('- Configuración inicial: 15-30 minutos');
  console.log('- Procesamiento por Google: 1-4 semanas');
  console.log('- Resultados visibles: 2-6 semanas');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  console.log('🔄 Generando solicitud de re-indexación para Google...\n');
  
  const { report } = saveReports();
  showSummary(report);
  
  console.log('\n✅ ¡Archivos generados exitosamente!');
  console.log('📝 Usa los archivos generados para realizar las acciones en Google Search Console');
}

module.exports = { generateReindexReport, generateUrlLists, saveReports };
