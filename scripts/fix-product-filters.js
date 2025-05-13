/**
 * Script para verificar y corregir el filtrado de productos por categoría y marca
 * 
 * Este script verifica si hay algún problema con el filtrado de productos por categoría y marca,
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

// Función para obtener categorías
async function getCategories() {
  console.log('🔍 Obteniendo categorías');
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.log(`❌ Error al obtener categorías:`, error);
      throw error;
    }
    
    console.log(`✅ Categorías obtenidas: ${data?.length || 0}`);
    return data || [];
  } catch (error) {
    console.log(`❌ Error al obtener categorías:`, error);
    throw error;
  }
}

// Función para obtener marcas
async function getBrands() {
  console.log('🔍 Obteniendo marcas');
  
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) {
      console.log(`❌ Error al obtener marcas:`, error);
      throw error;
    }
    
    console.log(`✅ Marcas obtenidas: ${data?.length || 0}`);
    return data || [];
  } catch (error) {
    console.log(`❌ Error al obtener marcas:`, error);
    throw error;
  }
}

// Función para obtener productos
async function getProducts() {
  console.log('🔍 Obteniendo todos los productos');
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, slug, name),
        brand:brands(id, slug, name, logo_url)
      `)
      .order('name');
    
    if (error) {
      console.log(`❌ Error al obtener productos:`, error);
      throw error;
    }
    
    console.log(`✅ Productos obtenidos: ${data?.length || 0}`);
    return data || [];
  } catch (error) {
    console.log(`❌ Error al obtener productos:`, error);
    throw error;
  }
}

// Función para verificar y corregir el filtrado de productos por categoría
async function verifyAndFixCategoryFiltering() {
  try {
    console.log('🔍 Verificando filtrado de productos por categoría');
    
    // Obtener categorías
    const categories = await getCategories();
    
    // Obtener todos los productos
    const allProducts = await getProducts();
    
    // Verificar cada categoría
    for (const category of categories) {
      console.log(`\n🔍 Verificando categoría: ${category.name} (${category.slug})`);
      
      // Filtrar productos por categoría
      const productsInCategory = allProducts.filter(
        (product) => product.category && product.category.slug === category.slug
      );
      
      console.log(`✅ Productos en categoría ${category.name}: ${productsInCategory.length}`);
      
      // Verificar si hay productos sin category_id
      const productsWithoutCategoryId = productsInCategory.filter(
        (product) => !product.category_id
      );
      
      if (productsWithoutCategoryId.length > 0) {
        console.log(`⚠️ Hay ${productsWithoutCategoryId.length} productos sin category_id`);
        
        // Corregir productos sin category_id
        for (const product of productsWithoutCategoryId) {
          console.log(`🔧 Corrigiendo producto: ${product.name} (${product.id})`);
          
          const { error } = await supabase
            .from('products')
            .update({ category_id: category.id })
            .eq('id', product.id);
          
          if (error) {
            console.log(`❌ Error al corregir producto:`, error);
          } else {
            console.log(`✅ Producto corregido`);
          }
        }
      }
      
      // Verificar si hay productos con category_id incorrecto
      const productsWithIncorrectCategoryId = productsInCategory.filter(
        (product) => product.category_id !== category.id
      );
      
      if (productsWithIncorrectCategoryId.length > 0) {
        console.log(`⚠️ Hay ${productsWithIncorrectCategoryId.length} productos con category_id incorrecto`);
        
        // Corregir productos con category_id incorrecto
        for (const product of productsWithIncorrectCategoryId) {
          console.log(`🔧 Corrigiendo producto: ${product.name} (${product.id})`);
          
          const { error } = await supabase
            .from('products')
            .update({ category_id: category.id })
            .eq('id', product.id);
          
          if (error) {
            console.log(`❌ Error al corregir producto:`, error);
          } else {
            console.log(`✅ Producto corregido`);
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error al verificar filtrado de productos por categoría:`, error);
  }
}

// Función para verificar y corregir el filtrado de productos por marca
async function verifyAndFixBrandFiltering() {
  try {
    console.log('\n🔍 Verificando filtrado de productos por marca');
    
    // Obtener marcas
    const brands = await getBrands();
    
    // Obtener todos los productos
    const allProducts = await getProducts();
    
    // Verificar cada marca
    for (const brand of brands) {
      console.log(`\n🔍 Verificando marca: ${brand.name} (${brand.slug})`);
      
      // Filtrar productos por marca
      const productsInBrand = allProducts.filter(
        (product) => product.brand && product.brand.slug === brand.slug
      );
      
      console.log(`✅ Productos en marca ${brand.name}: ${productsInBrand.length}`);
      
      // Verificar si hay productos sin brand_id
      const productsWithoutBrandId = productsInBrand.filter(
        (product) => !product.brand_id
      );
      
      if (productsWithoutBrandId.length > 0) {
        console.log(`⚠️ Hay ${productsWithoutBrandId.length} productos sin brand_id`);
        
        // Corregir productos sin brand_id
        for (const product of productsWithoutBrandId) {
          console.log(`🔧 Corrigiendo producto: ${product.name} (${product.id})`);
          
          const { error } = await supabase
            .from('products')
            .update({ brand_id: brand.id })
            .eq('id', product.id);
          
          if (error) {
            console.log(`❌ Error al corregir producto:`, error);
          } else {
            console.log(`✅ Producto corregido`);
          }
        }
      }
      
      // Verificar si hay productos con brand_id incorrecto
      const productsWithIncorrectBrandId = productsInBrand.filter(
        (product) => product.brand_id !== brand.id
      );
      
      if (productsWithIncorrectBrandId.length > 0) {
        console.log(`⚠️ Hay ${productsWithIncorrectBrandId.length} productos con brand_id incorrecto`);
        
        // Corregir productos con brand_id incorrecto
        for (const product of productsWithIncorrectBrandId) {
          console.log(`🔧 Corrigiendo producto: ${product.name} (${product.id})`);
          
          const { error } = await supabase
            .from('products')
            .update({ brand_id: brand.id })
            .eq('id', product.id);
          
          if (error) {
            console.log(`❌ Error al corregir producto:`, error);
          } else {
            console.log(`✅ Producto corregido`);
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error al verificar filtrado de productos por marca:`, error);
  }
}

// Función principal
async function fixProductFilters() {
  try {
    console.log('🔄 Iniciando verificación y corrección de filtros de productos...');
    
    // Verificar y corregir filtrado por categoría
    await verifyAndFixCategoryFiltering();
    
    // Verificar y corregir filtrado por marca
    await verifyAndFixBrandFiltering();
    
    console.log('\n✅ Verificación y corrección completada');
  } catch (error) {
    console.error('❌ Error durante la verificación y corrección:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixProductFilters();
