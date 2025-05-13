/**
 * Script para verificar que todas las imágenes referenciadas en la base de datos existen en el sistema de archivos
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

// Función principal
async function verifyImagePaths() {
  try {
    console.log('🔄 Verificando rutas de imágenes en la base de datos...');

    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, image_url, asset_id');
    
    if (productsError) {
      throw productsError;
    }

    console.log(`📊 Se encontraron ${products.length} productos en la base de datos`);

    // Verificar las rutas de imágenes
    let validCount = 0;
    let invalidCount = 0;
    let missingFiles = [];

    for (const product of products) {
      // Obtener la ruta completa del archivo
      const imagePath = path.join(PUBLIC_DIR, product.image_url.replace(/^\//, ''));
      
      // Verificar si el archivo existe
      const fileExists = fs.existsSync(imagePath);
      
      if (fileExists) {
        console.log(`✅ Producto ${product.name} (${product.id}): Imagen encontrada en ${imagePath}`);
        validCount++;
      } else {
        console.error(`❌ Producto ${product.name} (${product.id}): Imagen no encontrada en ${imagePath}`);
        invalidCount++;
        missingFiles.push({
          product: product.name,
          id: product.id,
          path: imagePath,
          url: product.image_url,
          asset_id: product.asset_id
        });
      }
    }

    console.log(`📊 Imágenes válidas: ${validCount}, inválidas: ${invalidCount}`);
    
    if (invalidCount > 0) {
      console.log('⚠️ Archivos faltantes:');
      missingFiles.forEach((file, index) => {
        console.log(`${index + 1}. Producto: ${file.product} (${file.id})`);
        console.log(`   URL: ${file.url}`);
        console.log(`   Ruta: ${file.path}`);
        console.log(`   Asset ID: ${file.asset_id}`);
        console.log('---');
      });
    } else {
      console.log('✅ Todas las imágenes existen en el sistema de archivos');
    }
  } catch (error) {
    console.error('❌ Error al verificar rutas de imágenes:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verifyImagePaths();
