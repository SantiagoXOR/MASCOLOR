/**
 * Script para depurar el cliente de Supabase
 * 
 * Este script verifica la conexión a Supabase y realiza consultas
 * para identificar posibles problemas.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Función para mostrar información de depuración
function logDebug(message, data = {}) {
  console.log(`🔍 ${message}`);
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Función para mostrar error
function logError(message, error) {
  console.error(`❌ ${message}`);
  if (error) {
    console.error(error);
  }
}

// Función para mostrar éxito
function logSuccess(message, data = {}) {
  console.log(`✅ ${message}`);
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Verificar variables de entorno
logDebug('Verificando variables de entorno');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  logError('NEXT_PUBLIC_SUPABASE_URL no está definida');
  process.exit(1);
}

if (!supabaseAnonKey) {
  logError('NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
  process.exit(1);
}

logSuccess('Variables de entorno verificadas', {
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey.substring(0, 5) + '...' + supabaseAnonKey.substring(supabaseAnonKey.length - 5)
});

// Crear cliente de Supabase
logDebug('Creando cliente de Supabase');

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

logSuccess('Cliente de Supabase creado');

// Función para verificar la conexión a Supabase
async function checkConnection() {
  try {
    logDebug('Verificando conexión a Supabase');
    
    // Intentar una consulta simple
    const { data, error } = await supabase.from('categories').select('count');
    
    if (error) {
      logError('Error al conectar con Supabase', error);
      return false;
    }
    
    logSuccess('Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    logError('Error al conectar con Supabase', error);
    return false;
  }
}

// Función para obtener categorías
async function getCategories() {
  try {
    logDebug('Obteniendo categorías');
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      logError('Error al obtener categorías', error);
      return [];
    }
    
    logSuccess(`Categorías obtenidas: ${data.length}`);
    console.log(data);
    return data;
  } catch (error) {
    logError('Error al obtener categorías', error);
    return [];
  }
}

// Función para obtener marcas
async function getBrands() {
  try {
    logDebug('Obteniendo marcas');
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    
    if (error) {
      logError('Error al obtener marcas', error);
      return [];
    }
    
    logSuccess(`Marcas obtenidas: ${data.length}`);
    console.log(data);
    return data;
  } catch (error) {
    logError('Error al obtener marcas', error);
    return [];
  }
}

// Función para obtener productos por categoría
async function getProductsByCategory(categorySlug) {
  try {
    logDebug(`Obteniendo productos para categoría: ${categorySlug}`);
    
    // Primero obtenemos el ID de la categoría
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (categoryError) {
      logError('Error al obtener ID de categoría', categoryError);
      return [];
    }
    
    const categoryId = categoryData.id;
    logSuccess(`ID de categoría obtenido: ${categoryId}`);
    
    // Ahora obtenemos los productos de esa categoría
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, slug, name),
        brand:brands(id, slug, name, logo_url)
      `)
      .eq('category_id', categoryId);
    
    if (error) {
      logError('Error al obtener productos', error);
      return [];
    }
    
    logSuccess(`Productos obtenidos para categoría ${categorySlug}: ${data.length}`);
    console.log(data);
    return data;
  } catch (error) {
    logError('Error al obtener productos por categoría', error);
    return [];
  }
}

// Función para obtener productos por marca
async function getProductsByBrand(brandSlug) {
  try {
    logDebug(`Obteniendo productos para marca: ${brandSlug}`);
    
    // Primero obtenemos el ID de la marca
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', brandSlug)
      .single();
    
    if (brandError) {
      logError('Error al obtener ID de marca', brandError);
      return [];
    }
    
    const brandId = brandData.id;
    logSuccess(`ID de marca obtenido: ${brandId}`);
    
    // Ahora obtenemos los productos de esa marca
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, slug, name),
        brand:brands(id, slug, name, logo_url)
      `)
      .eq('brand_id', brandId);
    
    if (error) {
      logError('Error al obtener productos', error);
      return [];
    }
    
    logSuccess(`Productos obtenidos para marca ${brandSlug}: ${data.length}`);
    console.log(data);
    return data;
  } catch (error) {
    logError('Error al obtener productos por marca', error);
    return [];
  }
}

// Función principal
async function main() {
  // Verificar conexión
  const isConnected = await checkConnection();
  
  if (!isConnected) {
    logError('No se pudo establecer conexión con Supabase');
    process.exit(1);
  }
  
  // Obtener categorías
  const categories = await getCategories();
  
  // Obtener marcas
  const brands = await getBrands();
  
  // Obtener productos por categoría
  if (categories.length > 0) {
    const categorySlug = 'especiales'; // Categoría por defecto
    await getProductsByCategory(categorySlug);
  }
  
  // Obtener productos por marca
  if (brands.length > 0) {
    const brandSlug = 'facilfix'; // Marca por defecto
    await getProductsByBrand(brandSlug);
  }
  
  logSuccess('Depuración completada');
}

// Ejecutar función principal
main();
