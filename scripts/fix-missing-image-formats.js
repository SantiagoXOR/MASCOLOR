/**
 * Script para verificar y corregir formatos de imágenes faltantes
 * 
 * Este script:
 * 1. Verifica qué formatos de imagen están disponibles para cada producto
 * 2. Genera los formatos faltantes a partir de los existentes
 * 3. Actualiza el catálogo de assets
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración
const ASSETS_DIR = path.join(__dirname, '../public/assets/images/products');
const CATALOG_FILE = path.join(__dirname, '../public/assets/catalog.json');
const REPORT_FILE = path.join(__dirname, '../reports/image-formats-fix-report.json');

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

// Función para generar formatos faltantes
async function generateMissingFormats(assetDir, assetId) {
  const formats = ['webp', 'jpg', 'png', 'avif'];
  const existingFormats = [];
  const missingFormats = [];
  
  // Verificar qué formatos existen
  for (const format of formats) {
    const originalPath = path.join(assetDir, `original.${format}`);
    if (fileExists(originalPath)) {
      existingFormats.push({ format, path: originalPath });
    } else {
      missingFormats.push(format);
    }
  }
  
  // Si no hay formatos existentes, no podemos generar los faltantes
  if (existingFormats.length === 0) {
    console.log(`⚠️ No se encontraron formatos existentes para el asset ${assetId}`);
    return { success: false, error: 'No se encontraron formatos existentes' };
  }
  
  // Usar el primer formato existente como fuente
  const sourceFormat = existingFormats[0];
  console.log(`✅ Usando ${sourceFormat.format} como fuente para generar formatos faltantes`);
  
  // Generar formatos faltantes
  const results = [];
  
  for (const format of missingFormats) {
    const targetPath = path.join(assetDir, `original.${format}`);
    
    try {
      // Cargar imagen fuente
      const image = sharp(sourceFormat.path);
      
      // Convertir al formato deseado
      let processedImage;
      
      switch (format) {
        case 'webp':
          processedImage = await image.webp({ quality: 80 }).toBuffer();
          break;
        case 'jpg':
          processedImage = await image.jpeg({ quality: 85 }).toBuffer();
          break;
        case 'png':
          processedImage = await image.png({ quality: 90 }).toBuffer();
          break;
        case 'avif':
          processedImage = await image.avif({ quality: 70 }).toBuffer();
          break;
        default:
          throw new Error(`Formato no soportado: ${format}`);
      }
      
      // Guardar imagen procesada
      fs.writeFileSync(targetPath, processedImage);
      
      console.log(`✅ Formato ${format} generado correctamente para el asset ${assetId}`);
      results.push({ format, success: true });
      
      // Si es webp, generar también el placeholder
      if (format === 'webp') {
        const placeholderPath = path.join(assetDir, `placeholder.${format}`);
        
        if (!fileExists(placeholderPath)) {
          const placeholderImage = await image
            .resize(20) // Tamaño muy pequeño para el placeholder
            .webp({ quality: 20 })
            .toBuffer();
          
          fs.writeFileSync(placeholderPath, placeholderImage);
          console.log(`✅ Placeholder generado correctamente para el asset ${assetId}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error al generar formato ${format} para el asset ${assetId}:`, error);
      results.push({ format, success: false, error: error.message });
    }
  }
  
  return { success: true, results };
}

// Función principal
async function fixMissingImageFormats() {
  console.log('🔍 Verificando formatos de imágenes...');
  
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
  
  // Cargar el catálogo de assets
  let catalog = {};
  if (fileExists(CATALOG_FILE)) {
    try {
      catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
    } catch (error) {
      console.error('❌ Error al cargar el catálogo de assets:', error);
    }
  }
  
  // Verificar cada producto
  const report = {
    totalProducts: products.length,
    productsProcessed: 0,
    productsWithMissingFormats: 0,
    productsFixed: 0,
    productsWithErrors: 0,
    details: [],
  };
  
  for (const product of products) {
    const assetDir = path.join(ASSETS_DIR, product.asset_id);
    const assetExists = directoryExists(assetDir);
    
    if (!assetExists) {
      console.log(`❌ No existe el directorio de asset para el producto ${product.name} (${product.id}): ${assetDir}`);
      report.details.push({
        id: product.id,
        name: product.name,
        asset_id: product.asset_id,
        status: 'error',
        message: 'No existe el directorio de asset',
      });
      report.productsWithErrors++;
      continue;
    }
    
    // Verificar formatos
    const formats = ['webp', 'jpg', 'png', 'avif'];
    const existingFormats = [];
    const missingFormats = [];
    
    for (const format of formats) {
      const originalPath = path.join(assetDir, `original.${format}`);
      if (fileExists(originalPath)) {
        existingFormats.push(format);
      } else {
        missingFormats.push(format);
      }
    }
    
    // Verificar placeholder
    const placeholderPath = path.join(assetDir, 'placeholder.webp');
    const hasPlaceholder = fileExists(placeholderPath);
    
    if (!hasPlaceholder) {
      missingFormats.push('placeholder');
    }
    
    report.productsProcessed++;
    
    // Si no faltan formatos, continuar con el siguiente producto
    if (missingFormats.length === 0) {
      report.details.push({
        id: product.id,
        name: product.name,
        asset_id: product.asset_id,
        status: 'ok',
        message: 'Todos los formatos están disponibles',
      });
      continue;
    }
    
    report.productsWithMissingFormats++;
    
    console.log(`⚠️ El producto ${product.name} (${product.id}) tiene formatos faltantes: ${missingFormats.join(', ')}`);
    
    // Generar formatos faltantes
    try {
      const result = await generateMissingFormats(assetDir, product.asset_id);
      
      if (result.success) {
        report.productsFixed++;
        report.details.push({
          id: product.id,
          name: product.name,
          asset_id: product.asset_id,
          status: 'fixed',
          message: `Formatos generados: ${missingFormats.join(', ')}`,
          details: result.results,
        });
        
        // Actualizar el catálogo si existe
        if (catalog[product.asset_id]) {
          // Asegurarse de que existan las versiones
          if (!catalog[product.asset_id].versions) {
            catalog[product.asset_id].versions = {};
          }
          
          // Actualizar las versiones para cada formato generado
          for (const formatResult of result.results) {
            if (formatResult.success) {
              const format = formatResult.format;
              
              if (!catalog[product.asset_id].versions[format]) {
                catalog[product.asset_id].versions[format] = {};
              }
              
              // Añadir información sobre el formato generado
              catalog[product.asset_id].versions[format].original = {
                path: `assets\\images\\products\\${product.asset_id}\\original.${format}`,
                size: fs.statSync(path.join(assetDir, `original.${format}`)).size,
              };
              
              // Si es webp, añadir también el placeholder
              if (format === 'webp' && fileExists(path.join(assetDir, `placeholder.${format}`))) {
                catalog[product.asset_id].versions[format].placeholder = {
                  path: `assets\\images\\products\\${product.asset_id}\\placeholder.${format}`,
                  size: fs.statSync(path.join(assetDir, `placeholder.${format}`)).size,
                };
              }
            }
          }
        }
      } else {
        report.productsWithErrors++;
        report.details.push({
          id: product.id,
          name: product.name,
          asset_id: product.asset_id,
          status: 'error',
          message: result.error,
        });
      }
    } catch (error) {
      console.error(`❌ Error al generar formatos para el producto ${product.name} (${product.id}):`, error);
      report.productsWithErrors++;
      report.details.push({
        id: product.id,
        name: product.name,
        asset_id: product.asset_id,
        status: 'error',
        message: error.message,
      });
    }
  }
  
  // Guardar el catálogo actualizado
  try {
    fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));
    console.log(`✅ Catálogo de assets actualizado correctamente`);
  } catch (error) {
    console.error('❌ Error al guardar el catálogo de assets:', error);
  }
  
  // Guardar reporte
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  
  // Mostrar resumen
  console.log('\n📊 Resumen:');
  console.log(`Total de productos: ${report.totalProducts}`);
  console.log(`Productos procesados: ${report.productsProcessed}`);
  console.log(`Productos con formatos faltantes: ${report.productsWithMissingFormats}`);
  console.log(`Productos corregidos: ${report.productsFixed}`);
  console.log(`Productos con errores: ${report.productsWithErrors}`);
  console.log(`\nSe ha guardado un reporte detallado en: ${REPORT_FILE}`);
}

// Ejecutar función principal
fixMissingImageFormats().catch(error => {
  console.error('❌ Error al corregir formatos de imágenes:', error);
});
