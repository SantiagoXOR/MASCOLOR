/**
 * Script para depurar el componente ProductsSection
 * 
 * Este script simula el flujo de datos del componente ProductsSection
 * para identificar por qué no se están mostrando los productos.
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
    
    if (data && data.length > 0) {
      console.log(`📊 Categorías:`, data.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
    }
    
    return data || [];
  } catch (error) {
    console.log(`❌ Error al obtener categorías:`, error);
    throw error;
  }
}

// Función para obtener productos por categoría
async function getProductsByCategory(categorySlug) {
  console.log(`🔍 Obteniendo productos para categoría: ${categorySlug}`);
  
  try {
    // Primero obtenemos el ID de la categoría
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    
    if (categoryError) {
      console.log(`❌ Error al obtener ID de categoría:`, categoryError);
      throw categoryError;
    }
    
    const categoryId = categoryData.id;
    console.log(`✅ ID de categoría obtenido: ${categoryId}`);
    
    // Ahora obtenemos los productos de esa categoría
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, slug, name),
        brand:brands(id, slug, name, logo_url)
      `)
      .eq("category_id", categoryId)
      .order('name');
    
    if (productsError) {
      console.log(`❌ Error al obtener productos:`, productsError);
      throw productsError;
    }
    
    console.log(`✅ Productos obtenidos para categoría ${categorySlug}: ${products?.length || 0}`);
    
    if (products && products.length > 0) {
      console.log(`📊 Primer producto:`, {
        id: products[0].id,
        name: products[0].name,
        category: products[0].category?.name,
        brand: products[0].brand?.name,
        image_url: products[0].image_url
      });
      
      // Verificar si hay productos sin imagen
      const productsWithoutImage = products.filter(p => !p.image_url);
      if (productsWithoutImage.length > 0) {
        console.log(`⚠️ Hay ${productsWithoutImage.length} productos sin imagen`);
      }
      
      // Verificar si hay productos sin categoría
      const productsWithoutCategory = products.filter(p => !p.category);
      if (productsWithoutCategory.length > 0) {
        console.log(`⚠️ Hay ${productsWithoutCategory.length} productos sin categoría`);
      }
      
      // Verificar si hay productos sin marca
      const productsWithoutBrand = products.filter(p => !p.brand);
      if (productsWithoutBrand.length > 0) {
        console.log(`⚠️ Hay ${productsWithoutBrand.length} productos sin marca`);
      }
    } else {
      console.log(`⚠️ No se encontraron productos para la categoría ${categorySlug}`);
    }
    
    return products || [];
  } catch (error) {
    console.log(`❌ Error al obtener productos por categoría:`, error);
    throw error;
  }
}

// Función principal
async function debugProductsSection() {
  try {
    console.log('🔄 Iniciando depuración del componente ProductsSection...');
    
    // 1. Obtener categorías
    const categories = await getCategories();
    
    if (categories.length === 0) {
      console.log('❌ No hay categorías disponibles');
      return;
    }
    
    // 2. Obtener productos para cada categoría
    for (const category of categories) {
      console.log(`\n🔍 Analizando categoría: ${category.name} (${category.slug})`);
      const products = await getProductsByCategory(category.slug);
      
      console.log(`📊 Resumen para categoría ${category.name}:`);
      console.log(`   - Total de productos: ${products.length}`);
      
      // Agrupar productos por marca
      const brandCounts = {};
      products.forEach(product => {
        const brandName = product.brand?.name || 'Sin marca';
        brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
      });
      
      console.log('   - Productos por marca:');
      Object.entries(brandCounts).forEach(([brand, count]) => {
        console.log(`     * ${brand}: ${count} productos`);
      });
    }
    
    console.log('\n✅ Depuración completada');
  } catch (error) {
    console.error('❌ Error durante la depuración:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
debugProductsSection();
