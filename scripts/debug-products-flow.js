/**
 * Script para depurar el flujo de datos de productos
 * 
 * Este script verifica el flujo de datos desde Supabase hasta los componentes de UI
 * para identificar dónde se rompe la cadena de datos.
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

// Función para obtener productos con filtros
async function getProducts({
  category,
  brand,
  search,
  limit = 100,
  offset = 0,
}) {
  console.log('🔍 Obteniendo productos con filtros:', {
    category,
    brand,
    search,
    limit,
    offset
  });
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, slug, name),
      brand:brands(id, slug, name, logo_url)
    `)
    .order('name')
    .range(offset, offset + limit - 1);
  
  // Aplicar filtros si se proporcionan
  let categoryId = null;
  let brandId = null;
  
  if (category) {
    console.log(`🔍 Aplicando filtro por categoría: ${category}`);
    try {
      // Primero obtenemos el ID de la categoría
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();
      
      if (categoryError) {
        if (categoryError.code === 'PGRST116') {
          console.log(`⚠️ No se encontró la categoría: ${category}`);
        } else {
          console.log(`⚠️ Error al obtener ID de categoría:`, categoryError);
        }
      } else if (categoryData) {
        categoryId = categoryData.id;
        console.log(`✅ ID de categoría obtenido: ${categoryId}`);
      }
    } catch (error) {
      console.log(`⚠️ Error en filtro de categoría:`, error);
    }
    
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
  }
  
  if (brand) {
    console.log(`🔍 Aplicando filtro por marca: ${brand}`);
    try {
      // Primero obtenemos el ID de la marca
      const { data: brandData, error: brandError } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", brand)
        .single();
      
      if (brandError) {
        if (brandError.code === 'PGRST116') {
          console.log(`⚠️ No se encontró la marca: ${brand}`);
        } else {
          console.log(`⚠️ Error al obtener ID de marca:`, brandError);
        }
      } else if (brandData) {
        brandId = brandData.id;
        console.log(`✅ ID de marca obtenido: ${brandId}`);
      }
    } catch (error) {
      console.log(`⚠️ Error en filtro de marca:`, error);
    }
    
    if (brandId) {
      query = query.eq("brand_id", brandId);
    }
  }
  
  if (search) {
    console.log(`🔍 Aplicando filtro por búsqueda: ${search}`);
    query = query.ilike("name", `%${search}%`);
  }
  
  try {
    const { data, error } = await query;
    
    if (error) {
      console.log(`❌ Error al obtener productos:`, error);
      throw error;
    }
    
    console.log(`✅ Productos obtenidos: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log(`📊 Primer producto:`, {
        id: data[0].id,
        name: data[0].name,
        category: data[0].category?.name,
        brand: data[0].brand?.name,
        image_url: data[0].image_url
      });
    } else {
      console.log(`⚠️ No se encontraron productos con los filtros aplicados`);
    }
    
    return data || [];
  } catch (error) {
    console.log(`❌ Error en la consulta de productos:`, error);
    throw error;
  }
}

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
    
    if (data && data.length > 0) {
      console.log(`📊 Marcas:`, data.map(b => ({ id: b.id, name: b.name, slug: b.slug })));
    }
    
    return data || [];
  } catch (error) {
    console.log(`❌ Error al obtener marcas:`, error);
    throw error;
  }
}

// Función principal
async function debugProductsFlow() {
  try {
    console.log('🔄 Iniciando depuración del flujo de datos de productos...');
    
    // 1. Obtener categorías
    const categories = await getCategories();
    
    // 2. Obtener marcas
    const brands = await getBrands();
    
    // 3. Obtener productos sin filtros
    console.log('\n🔍 Obteniendo todos los productos (sin filtros)');
    const allProducts = await getProducts({});
    
    // 4. Obtener productos por categoría
    if (categories.length > 0) {
      console.log(`\n🔍 Obteniendo productos por categoría: ${categories[0].slug}`);
      const productsByCategory = await getProducts({ category: categories[0].slug });
      console.log(`✅ Productos encontrados para categoría ${categories[0].name}: ${productsByCategory.length}`);
    }
    
    // 5. Obtener productos por marca
    if (brands.length > 0) {
      console.log(`\n🔍 Obteniendo productos por marca: ${brands[0].slug}`);
      const productsByBrand = await getProducts({ brand: brands[0].slug });
      console.log(`✅ Productos encontrados para marca ${brands[0].name}: ${productsByBrand.length}`);
    }
    
    console.log('\n✅ Depuración completada');
  } catch (error) {
    console.error('❌ Error durante la depuración:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
debugProductsFlow();
