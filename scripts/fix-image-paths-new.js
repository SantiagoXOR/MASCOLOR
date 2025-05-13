/**
 * Script para corregir las rutas de imágenes en la base de datos
 * 
 * Este script verifica y corrige las rutas de imágenes en la base de datos
 * para asegurarse de que estén utilizando los asset_id correctos.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

// Cliente de Supabase con clave de servicio para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para registrar información con colores
const logInfo = (message) => console.log(`🔍 ${message}`);
const logSuccess = (message) => console.log(`✅ ${message}`);
const logWarning = (message) => console.log(`⚠️ ${message}`);
const logError = (message) => console.error(`❌ ${message}`);

// Función para obtener todos los productos de la base de datos
async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image_url, asset_id');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    logError(`Error al obtener productos: ${error.message}`);
    return [];
  }
}

// Función para actualizar la ruta de imagen de un producto
async function updateProductImageUrl(productId, newImageUrl) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: newImageUrl })
      .eq('id', productId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    logError(`Error al actualizar producto ${productId}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Función para verificar si un directorio existe
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// Función principal
async function fixImagePaths() {
  try {
    logInfo('Iniciando corrección de rutas de imágenes...');
    
    // Obtener todos los productos
    const products = await getAllProducts();
    logInfo(`Se encontraron ${products.length} productos en la base de datos`);
    
    // Verificar y corregir las rutas de imágenes
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      // Verificar si el producto tiene un asset_id
      if (!product.asset_id) {
        logWarning(`Producto ${product.name} (${product.id}) no tiene asset_id`);
        continue;
      }
      
      // Construir la ruta correcta basada en el asset_id
      const correctPath = `/assets/images/products/${product.asset_id}/original.webp`;
      
      // Verificar si la ruta actual es incorrecta
      if (product.image_url !== correctPath) {
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
      }
    }
    
    logInfo('Corrección de rutas completada');
    logSuccess(`Productos actualizados: ${updatedCount}`);
    if (errorCount > 0) {
      logWarning(`Errores encontrados: ${errorCount}`);
    }
  } catch (error) {
    logError(`Error inesperado: ${error.message}`);
  }
}

// Ejecutar la función principal
fixImagePaths();
