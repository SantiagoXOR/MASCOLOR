/**
 * Script para verificar las imágenes de los productos
 * 
 * Este script verifica que todas las imágenes de los productos
 * existan en el sistema de archivos y sean accesibles.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local');
  process.exit(1);
}

// Cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Función para verificar si una imagen es accesible
function isImageAccessible(url) {
  if (!url) return false;
  
  try {
    // Si la URL es absoluta (comienza con http:// o https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // No podemos verificar URLs absolutas en este script
      console.log(`⚠️ No se puede verificar URL absoluta: ${url}`);
      return true;
    }
    
    // Convertir URL relativa a ruta de archivo local
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, url.replace(/^\//, ''));
    
    const exists = fileExists(filePath);
    
    if (!exists) {
      console.log(`❌ Imagen no encontrada: ${filePath}`);
    }
    
    return exists;
  } catch (error) {
    console.error(`Error al verificar accesibilidad de imagen ${url}:`, error);
    return false;
  }
}

// Función para verificar las imágenes de los productos
async function checkProductImages() {
  try {
    console.log('🔍 Obteniendo productos...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        image_url,
        category:categories(id, slug, name),
        brand:brands(id, slug, name, logo_url)
      `);
    
    if (error) {
      console.error('❌ Error al obtener productos:', error);
      return;
    }
    
    console.log(`✅ Productos obtenidos: ${products.length}`);
    
    // Verificar imágenes de productos
    console.log('\n🔍 Verificando imágenes de productos...');
    
    let accessibleCount = 0;
    let inaccessibleCount = 0;
    let missingUrlCount = 0;
    
    for (const product of products) {
      if (!product.image_url) {
        console.log(`⚠️ Producto sin URL de imagen: ${product.name} (${product.id})`);
        missingUrlCount++;
        continue;
      }
      
      const isAccessible = isImageAccessible(product.image_url);
      
      if (isAccessible) {
        accessibleCount++;
      } else {
        inaccessibleCount++;
        console.log(`❌ Imagen inaccesible para producto: ${product.name} (${product.id})`);
        console.log(`   URL: ${product.image_url}`);
        console.log(`   Categoría: ${product.category?.name || 'N/A'}`);
        console.log(`   Marca: ${product.brand?.name || 'N/A'}`);
      }
    }
    
    // Verificar logos de marcas
    console.log('\n🔍 Verificando logos de marcas...');
    
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, name, logo_url');
    
    if (brandsError) {
      console.error('❌ Error al obtener marcas:', brandsError);
      return;
    }
    
    let accessibleLogosCount = 0;
    let inaccessibleLogosCount = 0;
    let missingLogoUrlCount = 0;
    
    for (const brand of brands) {
      if (!brand.logo_url) {
        console.log(`⚠️ Marca sin URL de logo: ${brand.name} (${brand.id})`);
        missingLogoUrlCount++;
        continue;
      }
      
      const isAccessible = isImageAccessible(brand.logo_url);
      
      if (isAccessible) {
        accessibleLogosCount++;
      } else {
        inaccessibleLogosCount++;
        console.log(`❌ Logo inaccesible para marca: ${brand.name} (${brand.id})`);
        console.log(`   URL: ${brand.logo_url}`);
      }
    }
    
    // Resumen
    console.log('\n📊 Resumen de imágenes de productos:');
    console.log(`   Total de productos: ${products.length}`);
    console.log(`   Productos sin URL de imagen: ${missingUrlCount}`);
    console.log(`   Imágenes accesibles: ${accessibleCount}`);
    console.log(`   Imágenes inaccesibles: ${inaccessibleCount}`);
    
    console.log('\n📊 Resumen de logos de marcas:');
    console.log(`   Total de marcas: ${brands.length}`);
    console.log(`   Marcas sin URL de logo: ${missingLogoUrlCount}`);
    console.log(`   Logos accesibles: ${accessibleLogosCount}`);
    console.log(`   Logos inaccesibles: ${inaccessibleLogosCount}`);
    
    if (inaccessibleCount === 0 && missingUrlCount === 0 && inaccessibleLogosCount === 0 && missingLogoUrlCount === 0) {
      console.log('\n✅ Todas las imágenes son accesibles');
    } else {
      console.log('\n⚠️ Hay problemas con algunas imágenes');
    }
  } catch (error) {
    console.error('❌ Error al verificar imágenes:', error);
  }
}

// Ejecutar la función principal
checkProductImages();
