/**
 * Script para verificar las relaciones entre productos y marcas
 * 
 * Este script:
 * 1. Verifica que todos los productos tengan una marca asignada
 * 2. Verifica que las marcas asignadas existan en la base de datos
 * 3. Muestra estadísticas sobre la distribución de productos por marca
 * 
 * Uso:
 * node scripts/verify-product-brands.js
 */

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

// Función para obtener todos los productos con sus marcas
async function getProductsWithBrands() {
  try {
    console.log('🔍 Obteniendo todos los productos con sus marcas');
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, slug, brand_id,
        brand:brands(id, name, slug, logo_url)
      `)
      .order('name');
    
    if (error) {
      console.error('❌ Error al obtener productos:', error);
      throw error;
    }
    
    console.log(`✅ Se encontraron ${data.length} productos`);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    throw error;
  }
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

// Función para actualizar la marca de un producto
async function updateProductBrand(productId, brandId) {
  try {
    console.log(`🔄 Actualizando marca del producto ${productId} a ${brandId}`);
    
    const { data, error } = await supabase
      .from('products')
      .update({ brand_id: brandId })
      .eq('id', productId)
      .select();
    
    if (error) {
      console.error('❌ Error al actualizar producto:', error);
      return false;
    }
    
    console.log(`✅ Producto actualizado correctamente`);
    return true;
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    return false;
  }
}

// Función principal
async function main() {
  try {
    console.log('🚀 Iniciando verificación de relaciones entre productos y marcas');
    
    // Obtener todas las marcas
    const brands = await getBrands();
    
    // Crear un mapa de marcas por ID para facilitar la búsqueda
    const brandsMap = {};
    brands.forEach(brand => {
      brandsMap[brand.id] = brand;
    });
    
    // Obtener todos los productos con sus marcas
    const products = await getProductsWithBrands();
    
    let missingBrandCount = 0;
    let invalidBrandCount = 0;
    let updatedCount = 0;
    
    // Estadísticas por marca
    const brandStats = {};
    brands.forEach(brand => {
      brandStats[brand.id] = {
        name: brand.name,
        slug: brand.slug,
        count: 0
      };
    });
    
    // Verificar cada producto
    for (const product of products) {
      // Verificar si tiene brand_id
      if (!product.brand_id) {
        console.log(`⚠️ Producto sin brand_id: ${product.name} (${product.id})`);
        missingBrandCount++;
        continue;
      }
      
      // Verificar si la marca existe
      if (!brandsMap[product.brand_id]) {
        console.log(`⚠️ Producto con brand_id inválido: ${product.name} (${product.id}), brand_id: ${product.brand_id}`);
        invalidBrandCount++;
        continue;
      }
      
      // Verificar si la relación con la marca está correcta
      if (!product.brand) {
        console.log(`⚠️ Producto sin relación con marca: ${product.name} (${product.id}), brand_id: ${product.brand_id}`);
        continue;
      }
      
      // Incrementar contador de estadísticas
      if (brandStats[product.brand_id]) {
        brandStats[product.brand_id].count++;
      }
    }
    
    // Mostrar estadísticas por marca
    console.log('\n📊 Estadísticas por marca:');
    for (const brandId in brandStats) {
      const stat = brandStats[brandId];
      console.log(`${stat.name} (${stat.slug}): ${stat.count} productos`);
    }
    
    // Mostrar resumen
    console.log('\n📊 Resumen:');
    console.log(`Total de productos: ${products.length}`);
    console.log(`Productos sin marca: ${missingBrandCount}`);
    console.log(`Productos con marca inválida: ${invalidBrandCount}`);
    console.log(`Productos actualizados: ${updatedCount}`);
    
    console.log('\n✅ Verificación completada');
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
