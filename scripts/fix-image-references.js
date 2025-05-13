/**
 * Script para verificar y corregir las referencias a imágenes en la base de datos
 * 
 * Este script verifica que todas las referencias a imágenes en la base de datos
 * apunten a archivos existentes y corrige las que no lo hacen.
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
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const PRODUCTS_IMAGES_DIR = path.join(IMAGES_DIR, 'products');

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Función para verificar si una imagen es accesible desde la web
function isImageAccessible(url) {
  try {
    // Convertir URL relativa a ruta de archivo local
    const filePath = path.join(PUBLIC_DIR, url.replace(/^\//, ''));
    return fileExists(filePath);
  } catch (error) {
    console.error(`Error al verificar accesibilidad de imagen ${url}:`, error);
    return false;
  }
}

// Función para encontrar la mejor ruta de imagen disponible para un asset
function findBestImagePathForAsset(assetId) {
  const assetDir = path.join(PRODUCTS_DIR, assetId);
  
  // Verificar si existe el directorio del asset
  if (!fileExists(assetDir)) {
    console.log(`⚠️ No se encontró el directorio del asset: ${assetDir}`);
    return null;
  }
  
  // Verificar formatos en orden de preferencia
  const formats = ['jpg', 'png', 'webp', 'avif'];
  for (const format of formats) {
    const imagePath = path.join(assetDir, `original.${format}`);
    if (fileExists(imagePath)) {
      return `/assets/images/products/${assetId}/original.${format}`;
    }
  }
  
  return null;
}

// Función para encontrar una imagen por nombre de producto
function findImageByProductName(productName, brandSlug) {
  const normalizedName = productName.toLowerCase().replace(/\s+/g, '-');
  
  // Posibles combinaciones de nombres
  const possibleNames = [
    `${brandSlug}-${normalizedName}`,
    `${brandSlug}_${normalizedName}`,
    `${normalizedName}`
  ];
  
  // Formatos a verificar
  const formats = ['jpg', 'png', 'webp', 'avif'];
  
  // Verificar todas las combinaciones
  for (const name of possibleNames) {
    for (const format of formats) {
      // Verificar versión en minúsculas
      const lowerImagePath = path.join(PRODUCTS_IMAGES_DIR, `${name}.${format}`);
      if (fileExists(lowerImagePath)) {
        return `/images/products/${name}.${format}`;
      }
      
      // Verificar versión en mayúsculas
      const upperName = name.toUpperCase();
      const upperImagePath = path.join(PRODUCTS_IMAGES_DIR, `${upperName}.${format}`);
      if (fileExists(upperImagePath)) {
        return `/images/products/${upperName}.${format}`;
      }
    }
  }
  
  return null;
}

// Función principal
async function fixImageReferences() {
  try {
    console.log('🔍 Verificando y corrigiendo referencias a imágenes en la base de datos...');

    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, image_url, asset_id, brand_id, brand:brands(slug)');
    
    if (productsError) {
      throw productsError;
    }

    console.log(`📊 Se encontraron ${products.length} productos en la base de datos`);

    // Verificar y corregir las referencias a imágenes
    let updatedCount = 0;
    let errorCount = 0;
    let okCount = 0;

    for (const product of products) {
      console.log(`\n🔍 Verificando producto: ${product.name} (${product.id})`);
      console.log(`   URL actual: ${product.image_url}`);
      console.log(`   Asset ID: ${product.asset_id || 'No asignado'}`);
      console.log(`   Marca: ${product.brand?.slug || 'Desconocida'}`);
      
      // Verificar si la imagen actual es accesible
      const isAccessible = isImageAccessible(product.image_url);
      console.log(`   ¿Imagen accesible? ${isAccessible ? 'Sí ✅' : 'No ❌'}`);
      
      if (isAccessible) {
        okCount++;
        continue;
      }
      
      // Si la imagen no es accesible, intentar encontrar una alternativa
      let newImageUrl = null;
      
      // 1. Si tiene asset_id, buscar la mejor ruta disponible
      if (product.asset_id) {
        console.log(`   Buscando mejor ruta para asset_id: ${product.asset_id}`);
        newImageUrl = findBestImagePathForAsset(product.asset_id);
        
        if (newImageUrl) {
          console.log(`   ✅ Se encontró una ruta basada en asset_id: ${newImageUrl}`);
        }
      }
      
      // 2. Si no se encontró una ruta con asset_id, buscar por nombre de producto
      if (!newImageUrl && product.brand?.slug) {
        console.log(`   Buscando imagen por nombre de producto...`);
        newImageUrl = findImageByProductName(product.name, product.brand.slug);
        
        if (newImageUrl) {
          console.log(`   ✅ Se encontró una imagen por nombre: ${newImageUrl}`);
        }
      }
      
      // 3. Si aún no se encontró, usar imagen de placeholder
      if (!newImageUrl) {
        console.log(`   ⚠️ No se encontró ninguna imagen alternativa para ${product.name}`);
        
        // Usar imagen de placeholder como último recurso
        const placeholderUrl = '/images/products/placeholder.jpg';
        if (isImageAccessible(placeholderUrl)) {
          console.log(`   ⚠️ Usando imagen de placeholder como último recurso`);
          newImageUrl = placeholderUrl;
        } else {
          console.error(`   ❌ No se pudo encontrar ninguna imagen válida para ${product.name}`);
          errorCount++;
          continue;
        }
      }
      
      // Actualizar el producto con la nueva URL
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: newImageUrl })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`   ❌ Error al actualizar producto ${product.id}:`, updateError);
        errorCount++;
      } else {
        console.log(`   ✅ Producto actualizado con nueva URL: ${newImageUrl}`);
        updatedCount++;
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   Productos correctos: ${okCount}`);
    console.log(`   Productos actualizados: ${updatedCount}`);
    console.log(`   Errores: ${errorCount}`);
    
    if (updatedCount > 0) {
      console.log('✅ Se han corregido las referencias a imágenes');
    } else if (okCount === products.length) {
      console.log('✅ Todas las referencias a imágenes son correctas');
    } else {
      console.log('⚠️ No se ha podido corregir todas las referencias a imágenes');
    }
  } catch (error) {
    console.error('❌ Error al corregir referencias a imágenes:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixImageReferences();
