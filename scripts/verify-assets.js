/**
 * Script para verificar la existencia de assets y sus formatos
 * 
 * Este script:
 * 1. Verifica que existan los directorios de assets
 * 2. Verifica que existan las imágenes en los formatos correctos
 * 3. Genera un reporte de los assets faltantes o con problemas
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración
const ASSETS_DIR = path.join(__dirname, '../public/assets/images/products');
const REPORT_FILE = path.join(__dirname, '../reports/assets-verification-report.json');

// Crear directorio de reportes si no existe
if (!fs.existsSync(path.join(__dirname, '../reports'))) {
  fs.mkdirSync(path.join(__dirname, '../reports'));
}

// Verificar si existe un archivo
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Verificar si existe un directorio
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    console.error(`Error al verificar si existe el directorio ${dirPath}:`, error);
    return false;
  }
}

// Inicializar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función principal
async function verifyAssets() {
  console.log('🔍 Verificando assets...');
  
  // Verificar si existe el directorio de assets
  if (!directoryExists(ASSETS_DIR)) {
    console.error(`❌ Error: No existe el directorio de assets: ${ASSETS_DIR}`);
    return;
  }
  
  // Obtener todos los productos con asset_id
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, asset_id, image_url')
    .not('asset_id', 'is', null);
  
  if (error) {
    console.error('❌ Error al obtener productos:', error);
    return;
  }
  
  console.log(`✅ Se encontraron ${products.length} productos con asset_id`);
  
  // Verificar cada producto
  const report = {
    totalProducts: products.length,
    productsWithValidAssets: 0,
    productsWithMissingAssets: 0,
    productsWithMissingFormats: 0,
    productsWithIssues: [],
  };
  
  for (const product of products) {
    const assetDir = path.join(ASSETS_DIR, product.asset_id);
    const assetExists = directoryExists(assetDir);
    
    if (!assetExists) {
      console.log(`❌ No existe el directorio de asset para el producto ${product.name} (${product.id}): ${assetDir}`);
      report.productsWithMissingAssets++;
      report.productsWithIssues.push({
        id: product.id,
        name: product.name,
        asset_id: product.asset_id,
        issue: 'missing_directory',
        image_url: product.image_url,
      });
      continue;
    }
    
    // Verificar formatos
    const formats = ['webp', 'jpg', 'png', 'avif'];
    const missingFormats = [];
    
    for (const format of formats) {
      const originalPath = path.join(assetDir, `original.${format}`);
      const placeholderPath = path.join(assetDir, `placeholder.${format}`);
      
      if (!fileExists(originalPath)) {
        missingFormats.push(`original.${format}`);
      }
      
      if (format === 'webp' && !fileExists(placeholderPath)) {
        missingFormats.push(`placeholder.${format}`);
      }
    }
    
    if (missingFormats.length > 0) {
      console.log(`⚠️ El producto ${product.name} (${product.id}) tiene formatos faltantes: ${missingFormats.join(', ')}`);
      report.productsWithMissingFormats++;
      report.productsWithIssues.push({
        id: product.id,
        name: product.name,
        asset_id: product.asset_id,
        issue: 'missing_formats',
        missingFormats,
        image_url: product.image_url,
      });
      continue;
    }
    
    report.productsWithValidAssets++;
  }
  
  // Guardar reporte
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  
  // Mostrar resumen
  console.log('\n📊 Resumen:');
  console.log(`Total de productos: ${report.totalProducts}`);
  console.log(`Productos con assets válidos: ${report.productsWithValidAssets}`);
  console.log(`Productos con assets faltantes: ${report.productsWithMissingAssets}`);
  console.log(`Productos con formatos faltantes: ${report.productsWithMissingFormats}`);
  console.log(`\nSe ha guardado un reporte detallado en: ${REPORT_FILE}`);
}

// Ejecutar función principal
verifyAssets().catch(error => {
  console.error('❌ Error al verificar assets:', error);
});
