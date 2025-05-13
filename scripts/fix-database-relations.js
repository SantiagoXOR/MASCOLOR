/**
 * Script para verificar y corregir las relaciones entre tablas
 * 
 * Este script verifica que las relaciones entre tablas sean correctas,
 * y corrige los problemas encontrados.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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

// Función para verificar y corregir la relación entre productos y categorías
async function fixProductCategoryRelations() {
  try {
    console.log('🔍 Verificando relación entre productos y categorías...');
    
    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category_id');
    
    if (productsError) {
      console.error('❌ Error al obtener productos:', productsError);
      return false;
    }
    
    // Obtener todas las categorías
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug, name');
    
    if (categoriesError) {
      console.error('❌ Error al obtener categorías:', categoriesError);
      return false;
    }
    
    console.log(`📊 Se encontraron ${products.length} productos y ${categories.length} categorías`);
    
    // Crear un mapa de categorías por ID para búsqueda rápida
    const categoriesMap = {};
    categories.forEach(category => {
      categoriesMap[category.id] = category;
    });
    
    // Verificar y corregir productos sin categoría o con categoría inválida
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      if (!product.category_id || !categoriesMap[product.category_id]) {
        console.log(`⚠️ Producto ${product.name} (${product.id}) tiene categoría inválida o faltante`);
        
        // Asignar la primera categoría como fallback
        const defaultCategory = categories[0];
        
        console.log(`   Asignando categoría por defecto: ${defaultCategory.name} (${defaultCategory.id})`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ category_id: defaultCategory.id })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`   ❌ Error al actualizar producto ${product.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`   ✅ Producto actualizado correctamente`);
          fixedCount++;
        }
      }
    }
    
    console.log(`📊 Resumen de corrección de relaciones productos-categorías:`);
    console.log(`   Productos corregidos: ${fixedCount}`);
    console.log(`   Errores: ${errorCount}`);
    
    return fixedCount > 0 || errorCount === 0;
  } catch (error) {
    console.error('❌ Error al corregir relaciones productos-categorías:', error);
    return false;
  }
}

// Función para verificar y corregir la relación entre productos y marcas
async function fixProductBrandRelations() {
  try {
    console.log('\n🔍 Verificando relación entre productos y marcas...');
    
    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, brand_id');
    
    if (productsError) {
      console.error('❌ Error al obtener productos:', productsError);
      return false;
    }
    
    // Obtener todas las marcas
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, slug, name');
    
    if (brandsError) {
      console.error('❌ Error al obtener marcas:', brandsError);
      return false;
    }
    
    console.log(`📊 Se encontraron ${products.length} productos y ${brands.length} marcas`);
    
    // Crear un mapa de marcas por ID para búsqueda rápida
    const brandsMap = {};
    brands.forEach(brand => {
      brandsMap[brand.id] = brand;
    });
    
    // Verificar y corregir productos sin marca o con marca inválida
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      if (!product.brand_id || !brandsMap[product.brand_id]) {
        console.log(`⚠️ Producto ${product.name} (${product.id}) tiene marca inválida o faltante`);
        
        // Asignar la primera marca como fallback
        const defaultBrand = brands[0];
        
        console.log(`   Asignando marca por defecto: ${defaultBrand.name} (${defaultBrand.id})`);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ brand_id: defaultBrand.id })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`   ❌ Error al actualizar producto ${product.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`   ✅ Producto actualizado correctamente`);
          fixedCount++;
        }
      }
    }
    
    console.log(`📊 Resumen de corrección de relaciones productos-marcas:`);
    console.log(`   Productos corregidos: ${fixedCount}`);
    console.log(`   Errores: ${errorCount}`);
    
    return fixedCount > 0 || errorCount === 0;
  } catch (error) {
    console.error('❌ Error al corregir relaciones productos-marcas:', error);
    return false;
  }
}

// Función principal
async function fixDatabaseRelations() {
  try {
    console.log('🔄 Verificando y corrigiendo relaciones en la base de datos...');
    
    // Verificar y corregir relaciones
    const productCategoryFixed = await fixProductCategoryRelations();
    const productBrandFixed = await fixProductBrandRelations();
    
    console.log('\n📊 Resumen de corrección de relaciones:');
    console.log(`   Relaciones productos-categorías: ${productCategoryFixed ? '✅ Corregidas' : '❌ Con errores'}`);
    console.log(`   Relaciones productos-marcas: ${productBrandFixed ? '✅ Corregidas' : '❌ Con errores'}`);
    
    if (productCategoryFixed && productBrandFixed) {
      console.log('✅ Todas las relaciones han sido verificadas y corregidas');
    } else {
      console.log('⚠️ Algunas relaciones no pudieron ser corregidas');
    }
  } catch (error) {
    console.error('❌ Error al corregir relaciones en la base de datos:', error);
  }
}

// Ejecutar la función principal
fixDatabaseRelations();
