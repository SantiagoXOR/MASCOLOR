/**
 * Script para corregir las rutas de imágenes en la base de datos
 * 
 * Este script actualiza todas las rutas de imágenes de productos que usan 640.webp
 * a original.webp para corregir los errores 404.
 */

// Importar dependencias
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

// Cliente de Supabase con clave de servicio para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Funciones de utilidad para logs
const logInfo = (message) => console.log(`ℹ️ ${message}`);
const logSuccess = (message) => console.log(`✅ ${message}`);
const logError = (message) => console.error(`❌ ${message}`);
const logWarning = (message) => console.warn(`⚠️ ${message}`);

// Función para actualizar la URL de imagen de un producto
async function updateProductImageUrl(productId, newImageUrl) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: newImageUrl })
      .eq('id', productId);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Función principal
async function fixImagePaths() {
  try {
    logInfo('Iniciando corrección de rutas de imágenes...');
    
    // Obtener todos los productos
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, slug, image_url, asset_id');
    
    if (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
    
    logInfo(`Se encontraron ${products.length} productos en la base de datos`);
    
    // Contadores para estadísticas
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Procesar cada producto
    for (const product of products) {
      // Verificar si el producto tiene asset_id
      if (!product.asset_id) {
        logWarning(`Producto ${product.name} (${product.id}) no tiene asset_id, omitiendo...`);
        skippedCount++;
        continue;
      }
      
      // Verificar si la ruta actual usa 640.webp
      if (product.image_url && product.image_url.includes('640.webp')) {
        // Construir la ruta correcta
        const correctPath = `/assets/images/products/${product.asset_id}/original.webp`;
        
        logInfo(`Corrigiendo ruta de imagen para ${product.name} (${product.id})`);
        logInfo(`  Ruta actual: ${product.image_url}`);
        logInfo(`  Ruta correcta: ${correctPath}`);
        
        // Actualizar la ruta en la base de datos
        const result = await updateProductImageUrl(product.id, correctPath);
        
        if (result.success) {
          logSuccess(`Ruta actualizada para ${product.name}`);
          updatedCount++;
        } else {
          logError(`Error al actualizar ruta para ${product.name}: ${result.error}`);
          errorCount++;
        }
      } else {
        logInfo(`Producto ${product.name} (${product.id}) ya tiene la ruta correcta, omitiendo...`);
        skippedCount++;
      }
    }
    
    // Mostrar resumen
    logInfo('\n--- Resumen ---');
    logInfo(`Total de productos: ${products.length}`);
    logSuccess(`Productos actualizados: ${updatedCount}`);
    logInfo(`Productos omitidos: ${skippedCount}`);
    logError(`Errores: ${errorCount}`);
    
  } catch (error) {
    logError(`Error en el proceso: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixImagePaths();
