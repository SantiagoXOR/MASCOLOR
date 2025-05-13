/**
 * Script para depurar el componente ProductsSection
 * 
 * Este script simula el comportamiento del componente ProductsSection
 * para identificar por qué no se están mostrando los productos.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
    
    return products || [];
  } catch (error) {
    console.log(`❌ Error al obtener productos por categoría:`, error);
    throw error;
  }
}

// Función para obtener productos por marca
async function getProductsByBrand(brandSlug) {
  console.log(`🔍 Obteniendo productos para marca: ${brandSlug}`);
  
  try {
    // Primero obtenemos el ID de la marca
    const { data: brandData, error: brandError } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", brandSlug)
      .single();
    
    if (brandError) {
      console.log(`❌ Error al obtener ID de marca:`, brandError);
      throw brandError;
    }
    
    const brandId = brandData.id;
    console.log(`✅ ID de marca obtenido: ${brandId}`);
    
    // Ahora obtenemos los productos de esa marca
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, slug, name),
        brand:brands(id, slug, name, logo_url)
      `)
      .eq("brand_id", brandId)
      .order('name');
    
    if (productsError) {
      console.log(`❌ Error al obtener productos:`, productsError);
      throw productsError;
    }
    
    console.log(`✅ Productos obtenidos para marca ${brandSlug}: ${products?.length || 0}`);
    
    return products || [];
  } catch (error) {
    console.log(`❌ Error al obtener productos por marca:`, error);
    throw error;
  }
}

// Función para verificar si las imágenes de los productos son accesibles
function verifyProductImages(products) {
  console.log(`🔍 Verificando imágenes de ${products.length} productos`);
  
  const PUBLIC_DIR = path.join(__dirname, '../public');
  
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
    try {
      // Convertir URL relativa a ruta de archivo local
      const filePath = path.join(PUBLIC_DIR, url.replace(/^\//, ''));
      return fileExists(filePath);
    } catch (error) {
      console.error(`Error al verificar accesibilidad de imagen ${url}:`, error);
      return false;
    }
  }
  
  let accessibleCount = 0;
  let inaccessibleCount = 0;
  
  for (const product of products) {
    const isAccessible = isImageAccessible(product.image_url);
    
    if (isAccessible) {
      accessibleCount++;
    } else {
      inaccessibleCount++;
      console.log(`⚠️ Imagen inaccesible para producto ${product.name}: ${product.image_url}`);
    }
  }
  
  console.log(`📊 Resumen de imágenes:`);
  console.log(`   Imágenes accesibles: ${accessibleCount}`);
  console.log(`   Imágenes inaccesibles: ${inaccessibleCount}`);
}

// Función principal
async function debugProductsSection() {
  try {
    console.log('🔄 Iniciando depuración del componente ProductsSection...');
    
    // 1. Obtener categorías
    const categories = await getCategories();
    
    // 2. Obtener marcas
    const brands = await getBrands();
    
    // 3. Simular el comportamiento del componente ProductsSection
    console.log('\n🔍 Simulando comportamiento del componente ProductsSection');
    
    // 3.1. Filtrar por categoría
    console.log('\n🔍 Simulando filtrado por categoría');
    
    for (const category of categories) {
      console.log(`\n🔍 Categoría: ${category.name} (${category.slug})`);
      
      const products = await getProductsByCategory(category.slug);
      
      // Verificar si las imágenes de los productos son accesibles
      verifyProductImages(products);
    }
    
    // 3.2. Filtrar por marca
    console.log('\n🔍 Simulando filtrado por marca');
    
    for (const brand of brands) {
      console.log(`\n🔍 Marca: ${brand.name} (${brand.slug})`);
      
      const products = await getProductsByBrand(brand.slug);
      
      // Verificar si las imágenes de los productos son accesibles
      verifyProductImages(products);
    }
    
    console.log('\n✅ Depuración completada');
  } catch (error) {
    console.error('❌ Error durante la depuración:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
debugProductsSection();
