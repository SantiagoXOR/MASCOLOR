/**
 * Script para validar que las imágenes de productos existen
 * 
 * Este script:
 * 1. Obtiene todos los productos de la base de datos
 * 2. Verifica que las imágenes referenciadas existen en el sistema de archivos
 * 3. Genera un reporte con los productos que tienen imágenes faltantes
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridas');
  process.exit(1);
}

// Crear cliente de Supabase con clave de servicio
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Directorio base de imágenes
const imagesBaseDir = path.join(__dirname, '../public');

// Función para verificar si una imagen existe
function imageExists(imagePath) {
  // Convertir ruta relativa a absoluta
  const absolutePath = path.join(imagesBaseDir, imagePath.replace(/^\//, ''));
  return fs.existsSync(absolutePath);
}

// Función principal
async function validateProductImages() {
  try {
    console.log('🔍 Validando imágenes de productos...');
    
    // Obtener todos los productos
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug, name, image_url');
    
    if (error) {
      throw error;
    }
    
    console.log(`📊 Encontrados ${products.length} productos`);
    
    // Verificar cada imagen
    const missingImages = [];
    
    for (const product of products) {
      const exists = imageExists(product.image_url);
      
      if (!exists) {
        missingImages.push({
          id: product.id,
          slug: product.slug,
          name: product.name,
          image_url: product.image_url
        });
        
        console.log(`❌ Imagen faltante: ${product.image_url} (${product.name})`);
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 Resumen:');
    if (missingImages.length === 0) {
      console.log('✅ Todas las imágenes de productos existen');
    } else {
      console.log(`❌ Se encontraron ${missingImages.length} productos con imágenes faltantes`);
      
      // Generar reporte
      const reportPath = path.join(__dirname, '../missing-product-images.json');
      fs.writeFileSync(reportPath, JSON.stringify(missingImages, null, 2));
      console.log(`📄 Se ha generado un reporte en ${reportPath}`);
    }
  } catch (error) {
    console.error('Error durante la validación:', error);
  }
}

// Ejecutar la función principal
validateProductImages();
