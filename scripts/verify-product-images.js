/**
 * Script para verificar y corregir las rutas de imágenes de productos
 * 
 * Este script verifica que todas las imágenes de productos existan y sean accesibles,
 * y corrige las rutas en la base de datos si es necesario.
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
async function isImageAccessible(url) {
  try {
    // Convertir URL relativa a ruta de archivo local
    const filePath = path.join(PUBLIC_DIR, url.replace(/^\//, ''));
    return fileExists(filePath);
  } catch (error) {
    console.error(`Error al verificar accesibilidad de imagen ${url}:`, error);
    return false;
  }
}

// Función para encontrar la mejor ruta de imagen disponible
async function findBestImagePath(assetId) {
  const assetDir = path.join(PRODUCTS_DIR, assetId);
  
  // Verificar si existe el directorio del asset
  if (!fileExists(assetDir)) {
    console.log(`⚠️ No se encontró el directorio del asset: ${assetDir}`);
    return null;
  }
  
  // Verificar formatos en orden de preferencia
  const formats = ['webp', 'avif', 'jpg', 'png'];
  for (const format of formats) {
    const imagePath = path.join(assetDir, `original.${format}`);
    if (fileExists(imagePath)) {
      return `/assets/images/products/${assetId}/original.${format}`;
    }
  }
  
  return null;
}

// Función principal
async function verifyProductImages() {
  try {
    console.log('🔍 Verificando imágenes de productos...');

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
    let errorCount = 0;
    let okCount = 0;

    for (const product of products) {
      console.log(`\n🔍 Verificando producto: ${product.name} (${product.id})`);
      console.log(`   URL actual: ${product.image_url}`);
      
      // Verificar si la imagen actual es accesible
      const isAccessible = await isImageAccessible(product.image_url);
      console.log(`   ¿Imagen accesible? ${isAccessible ? 'Sí ✅' : 'No ❌'}`);
      
      if (isAccessible) {
        okCount++;
        continue;
      }
      
      // Si la imagen no es accesible, intentar encontrar una alternativa
      let newImageUrl = null;
      
      // Si tiene asset_id, buscar la mejor ruta disponible
      if (product.asset_id) {
        console.log(`   Buscando mejor ruta para asset_id: ${product.asset_id}`);
        newImageUrl = await findBestImagePath(product.asset_id);
      }
      
      // Si no se encontró una ruta con asset_id, buscar en el directorio de imágenes antiguas
      if (!newImageUrl) {
        console.log(`   Buscando en directorio de imágenes antiguas...`);
        
        // Intentar encontrar por nombre de producto
        const productName = product.name.toLowerCase().replace(/\s+/g, '-');
        const brandSlugs = ['facilfix', 'ecopainting', 'newhouse', 'premium', 'expression'];
        
        for (const brandSlug of brandSlugs) {
          const possibleNames = [
            `${brandSlug}-${productName}`,
            `${brandSlug}_${productName}`,
            `${productName}`
          ];
          
          for (const name of possibleNames) {
            for (const ext of ['webp', 'avif', 'png', 'jpg']) {
              const imagePath = path.join(PRODUCTS_IMAGES_DIR, `${name}.${ext}`);
              if (fileExists(imagePath)) {
                newImageUrl = `/images/products/${name}.${ext}`;
                break;
              }
              
              // Intentar con versión en mayúsculas
              const uppercaseName = name.toUpperCase();
              const uppercaseImagePath = path.join(PRODUCTS_IMAGES_DIR, `${uppercaseName}.${ext}`);
              if (fileExists(uppercaseImagePath)) {
                newImageUrl = `/images/products/${uppercaseName}.${ext}`;
                break;
              }
            }
            
            if (newImageUrl) break;
          }
          
          if (newImageUrl) break;
        }
      }
      
      // Si se encontró una nueva ruta, actualizar el producto
      if (newImageUrl) {
        console.log(`   ✅ Se encontró una nueva ruta: ${newImageUrl}`);
        
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
      } else {
        console.log(`   ⚠️ No se encontró ninguna imagen alternativa para ${product.name}`);
        
        // Usar imagen de placeholder como último recurso
        const placeholderUrl = '/images/products/placeholder.jpg';
        if (await isImageAccessible(placeholderUrl)) {
          console.log(`   ⚠️ Usando imagen de placeholder como último recurso`);
          
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: placeholderUrl })
            .eq('id', product.id);
          
          if (updateError) {
            console.error(`   ❌ Error al actualizar producto ${product.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`   ✅ Producto actualizado con imagen de placeholder`);
            updatedCount++;
          }
        } else {
          console.error(`   ❌ No se pudo encontrar ninguna imagen válida para ${product.name}`);
          errorCount++;
        }
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   Productos correctos: ${okCount}`);
    console.log(`   Productos actualizados: ${updatedCount}`);
    console.log(`   Errores: ${errorCount}`);
    
    if (updatedCount > 0) {
      console.log('✅ Se han corregido las rutas de imágenes de productos');
    } else if (okCount === products.length) {
      console.log('✅ Todas las imágenes de productos son accesibles');
    } else {
      console.log('⚠️ No se ha podido corregir todas las rutas de imágenes');
    }
  } catch (error) {
    console.error('❌ Error al verificar imágenes de productos:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verifyProductImages();
