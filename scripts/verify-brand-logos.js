/**
 * Script para verificar los logos de las marcas en la base de datos
 * 
 * Este script:
 * 1. Verifica que todas las marcas tengan un logo_url
 * 2. Verifica que los logos existan en el sistema de archivos
 * 3. Actualiza las marcas que no tienen logo_url con una ruta predeterminada
 * 
 * Uso:
 * node scripts/verify-brand-logos.js
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

// Directorio de logos
const LOGOS_DIR = path.join(__dirname, '../public/images/logos');

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Función para verificar si una URL de imagen es accesible
function isImageAccessible(imageUrl) {
  // Si la URL es relativa, verificar si existe en el sistema de archivos
  if (imageUrl.startsWith('/')) {
    const filePath = path.join(__dirname, '../public', imageUrl);
    return fileExists(filePath);
  }
  
  // Si es una URL externa, asumimos que es accesible
  return true;
}

// Función para obtener todas las marcas
async function getBrands() {
  try {
    console.log('🔍 Obteniendo todas las marcas');
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ Error al obtener marcas:', error);
      throw error;
    }
    
    console.log(`✅ Se encontraron ${data.length} marcas`);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener marcas:', error);
    throw error;
  }
}

// Función para actualizar el logo_url de una marca
async function updateBrandLogo(brandId, logoUrl) {
  try {
    console.log(`🔄 Actualizando logo de marca ${brandId} a ${logoUrl}`);
    
    const { data, error } = await supabase
      .from('brands')
      .update({ logo_url: logoUrl })
      .eq('id', brandId)
      .select();
    
    if (error) {
      console.error('❌ Error al actualizar marca:', error);
      return false;
    }
    
    console.log(`✅ Marca actualizada correctamente`);
    return true;
  } catch (error) {
    console.error('❌ Error al actualizar marca:', error);
    return false;
  }
}

// Función principal
async function main() {
  try {
    console.log('🚀 Iniciando verificación de logos de marcas');
    
    // Obtener todas las marcas
    const brands = await getBrands();
    
    let missingLogoCount = 0;
    let inaccessibleLogoCount = 0;
    let updatedCount = 0;
    
    // Verificar cada marca
    for (const brand of brands) {
      console.log(`\n🔍 Verificando marca: ${brand.name} (${brand.slug})`);
      
      // Verificar si tiene logo_url
      if (!brand.logo_url) {
        console.log(`⚠️ Marca sin logo_url: ${brand.name}`);
        missingLogoCount++;
        
        // Generar una ruta predeterminada basada en el slug
        const defaultLogoUrl = `/images/logos/${brand.slug}.svg`;
        console.log(`🔄 Generando ruta predeterminada: ${defaultLogoUrl}`);
        
        // Verificar si el archivo existe
        if (isImageAccessible(defaultLogoUrl)) {
          console.log(`✅ Logo predeterminado encontrado: ${defaultLogoUrl}`);
          
          // Actualizar la marca con la ruta predeterminada
          const updated = await updateBrandLogo(brand.id, defaultLogoUrl);
          if (updated) {
            updatedCount++;
          }
        } else {
          console.log(`❌ Logo predeterminado no encontrado: ${defaultLogoUrl}`);
        }
      } else {
        console.log(`✅ Marca con logo_url: ${brand.logo_url}`);
        
        // Verificar si el logo es accesible
        if (isImageAccessible(brand.logo_url)) {
          console.log(`✅ Logo accesible: ${brand.logo_url}`);
        } else {
          console.log(`❌ Logo inaccesible: ${brand.logo_url}`);
          inaccessibleLogoCount++;
          
          // Generar una ruta predeterminada basada en el slug
          const defaultLogoUrl = `/images/logos/${brand.slug}.svg`;
          console.log(`🔄 Intentando usar ruta predeterminada: ${defaultLogoUrl}`);
          
          // Verificar si el archivo existe
          if (isImageAccessible(defaultLogoUrl)) {
            console.log(`✅ Logo predeterminado encontrado: ${defaultLogoUrl}`);
            
            // Actualizar la marca con la ruta predeterminada
            const updated = await updateBrandLogo(brand.id, defaultLogoUrl);
            if (updated) {
              updatedCount++;
            }
          } else {
            console.log(`❌ Logo predeterminado no encontrado: ${defaultLogoUrl}`);
          }
        }
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 Resumen:');
    console.log(`Total de marcas: ${brands.length}`);
    console.log(`Marcas sin logo_url: ${missingLogoCount}`);
    console.log(`Marcas con logo inaccesible: ${inaccessibleLogoCount}`);
    console.log(`Marcas actualizadas: ${updatedCount}`);
    
    console.log('\n✅ Verificación completada');
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
