/**
 * Script para verificar y corregir las rutas de imágenes de productos en la base de datos
 * 
 * Este script verifica que todas las rutas de imágenes en la tabla products apunten
 * a la ubicación correcta en el sistema de archivos y corrige las que no lo hacen.
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

// Rutas de archivos
const PUBLIC_DIR = path.join(__dirname, '../public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const PRODUCTS_DIR = path.join(ASSETS_DIR, 'images/products');

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Función principal
async function fixProductImagePaths() {
  try {
    console.log('🔄 Verificando y corrigiendo rutas de imágenes de productos...');

    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, image_url, asset_id');
    
    if (productsError) {
      throw productsError;
    }

    console.log(`📊 Se encontraron ${products.length} productos en la base de datos`);

    // Verificar y corregir las rutas de imágenes
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      console.log(`\n🔍 Verificando producto: ${product.name} (${product.id})`);
      console.log(`   URL actual: ${product.image_url}`);
      console.log(`   Asset ID: ${product.asset_id || 'No asignado'}`);

      // Si no tiene asset_id, no podemos corregir la ruta
      if (!product.asset_id) {
        console.log(`⚠️ Producto sin asset_id, buscando coincidencia por nombre...`);
        
        // Intentar encontrar un asset_id basado en el nombre del producto
        const productName = product.name.toLowerCase().replace(/\s+/g, '-');
        const { data: assets, error: assetsError } = await supabase
          .from('assets')
          .select('id, name')
          .ilike('name', `%${productName}%`)
          .limit(1);
        
        if (assetsError) {
          console.error(`❌ Error al buscar assets para ${product.name}:`, assetsError);
          errorCount++;
          continue;
        }
        
        if (assets && assets.length > 0) {
          const assetId = assets[0].id;
          console.log(`✅ Se encontró un asset coincidente: ${assets[0].name} (${assetId})`);
          
          // Actualizar el producto con el asset_id encontrado
          const newImageUrl = `/assets/images/products/${assetId}/original.webp`;
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              asset_id: assetId,
              image_url: newImageUrl
            })
            .eq('id', product.id);
          
          if (updateError) {
            console.error(`❌ Error al actualizar producto ${product.id}:`, updateError);
            errorCount++;
            continue;
          }
          
          console.log(`✅ Producto actualizado con asset_id: ${assetId}`);
          console.log(`✅ Nueva URL: ${newImageUrl}`);
          updatedCount++;
        } else {
          console.log(`⚠️ No se encontró ningún asset coincidente para ${product.name}`);
          skippedCount++;
        }
        
        continue;
      }

      // Verificar si la ruta actual es correcta
      const expectedImageUrl = `/assets/images/products/${product.asset_id}/original.webp`;
      const fullImagePath = path.join(PUBLIC_DIR, expectedImageUrl.replace(/^\//, ''));
      
      console.log(`   Ruta esperada: ${expectedImageUrl}`);
      console.log(`   Ruta completa: ${fullImagePath}`);
      
      const imageExists = fileExists(fullImagePath);
      console.log(`   ¿Existe el archivo? ${imageExists ? 'Sí' : 'No'}`);
      
      // Si la ruta actual no es la esperada o el archivo no existe, intentar corregir
      if (product.image_url !== expectedImageUrl || !imageExists) {
        // Verificar si existe alguna versión del archivo
        const assetDir = path.join(PRODUCTS_DIR, product.asset_id);
        
        if (fs.existsSync(assetDir)) {
          // Buscar archivos en el directorio del asset
          const files = fs.readdirSync(assetDir);
          console.log(`   Archivos encontrados en el directorio: ${files.join(', ')}`);
          
          // Verificar si existe original.avif
          const avifPath = path.join(assetDir, 'original.avif');
          const webpPath = path.join(assetDir, 'original.webp');
          
          if (fs.existsSync(webpPath)) {
            // Actualizar la ruta a original.webp
            const { error: updateError } = await supabase
              .from('products')
              .update({ image_url: expectedImageUrl })
              .eq('id', product.id);
            
            if (updateError) {
              console.error(`❌ Error al actualizar producto ${product.id}:`, updateError);
              errorCount++;
              continue;
            }
            
            console.log(`✅ Producto actualizado con URL: ${expectedImageUrl}`);
            updatedCount++;
          } else if (fs.existsSync(avifPath)) {
            // Actualizar la ruta a original.avif
            const avifUrl = `/assets/images/products/${product.asset_id}/original.avif`;
            const { error: updateError } = await supabase
              .from('products')
              .update({ image_url: avifUrl })
              .eq('id', product.id);
            
            if (updateError) {
              console.error(`❌ Error al actualizar producto ${product.id}:`, updateError);
              errorCount++;
              continue;
            }
            
            console.log(`✅ Producto actualizado con URL: ${avifUrl}`);
            updatedCount++;
          } else {
            console.log(`⚠️ No se encontró ninguna versión del archivo para ${product.name}`);
            skippedCount++;
          }
        } else {
          console.log(`⚠️ No se encontró el directorio del asset para ${product.name}`);
          skippedCount++;
        }
      } else {
        console.log(`✅ La ruta de imagen ya es correcta`);
        skippedCount++;
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   Productos actualizados: ${updatedCount}`);
    console.log(`   Productos omitidos: ${skippedCount}`);
    console.log(`   Errores: ${errorCount}`);
    
    if (updatedCount > 0) {
      console.log('✅ Se han corregido las rutas de imágenes de productos');
    } else {
      console.log('ℹ️ No se ha realizado ninguna corrección');
    }
  } catch (error) {
    console.error('❌ Error al corregir rutas de imágenes:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixProductImagePaths();
