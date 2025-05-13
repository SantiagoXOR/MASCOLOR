/**
 * Script para corregir las rutas de imágenes en la base de datos
 * 
 * Este script actualiza las rutas de imágenes en la tabla products para que apunten
 * a las imágenes optimizadas en la carpeta assets.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY en .env.local');
  process.exit(1);
}

// Cliente de Supabase con clave de servicio para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función principal
async function fixImagePaths() {
  try {
    console.log('🔄 Corrigiendo rutas de imágenes en la base de datos...');

    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, image_url, asset_id');
    
    if (productsError) {
      throw productsError;
    }

    console.log(`📊 Se encontraron ${products.length} productos en la base de datos`);

    // Actualizar las rutas de imágenes
    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      if (!product.asset_id) {
        console.log(`⚠️ Producto ${product.name} (${product.id}) no tiene asset_id, omitiendo...`);
        skippedCount++;
        continue;
      }

      // Construir la nueva ruta de imagen
      const newImageUrl = `/assets/images/products/${product.asset_id}/original.webp`;

      // Verificar si la ruta ya está actualizada
      if (product.image_url === newImageUrl) {
        console.log(`⏩ Producto ${product.name} (${product.id}) ya tiene la ruta correcta, omitiendo...`);
        skippedCount++;
        continue;
      }

      // Actualizar la ruta de imagen
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: newImageUrl })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`❌ Error al actualizar producto ${product.id}:`, updateError);
        continue;
      }

      console.log(`✅ Producto ${product.name} (${product.id}) actualizado con image_url: ${newImageUrl}`);
      updatedCount++;
    }

    console.log(`📊 Productos actualizados: ${updatedCount}, omitidos: ${skippedCount}`);
    console.log('✅ Rutas de imágenes corregidas correctamente');
  } catch (error) {
    console.error('❌ Error al corregir rutas de imágenes:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixImagePaths();
