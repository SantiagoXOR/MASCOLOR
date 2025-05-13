/**
 * Script para verificar la estructura de la base de datos
 * 
 * Este script verifica que la estructura de la base de datos sea correcta,
 * incluyendo tablas, columnas, relaciones y datos.
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

// Función para verificar la existencia de una tabla
async function checkTable(tableName) {
  try {
    console.log(`🔍 Verificando tabla: ${tableName}`);
    
    // Verificar si la tabla existe
    const { data, error } = await supabase
      .from(tableName)
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error(`❌ Error al verificar tabla ${tableName}:`, error);
      return false;
    }
    
    console.log(`✅ Tabla ${tableName} existe`);
    return true;
  } catch (error) {
    console.error(`❌ Error al verificar tabla ${tableName}:`, error);
    return false;
  }
}

// Función para verificar las relaciones entre tablas
async function checkRelations() {
  try {
    console.log('🔍 Verificando relaciones entre tablas');
    
    // Verificar relación entre productos y categorías
    const { data: productsWithCategory, error: productsError } = await supabase
      .from('products')
      .select('id, name, category_id, category:categories(id, name)')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Error al verificar relación productos-categorías:', productsError);
    } else {
      console.log('✅ Relación productos-categorías correcta');
      console.log('Ejemplo de producto con categoría:', productsWithCategory[0]);
    }
    
    // Verificar relación entre productos y marcas
    const { data: productsWithBrand, error: brandsError } = await supabase
      .from('products')
      .select('id, name, brand_id, brand:brands(id, name)')
      .limit(5);
    
    if (brandsError) {
      console.error('❌ Error al verificar relación productos-marcas:', brandsError);
    } else {
      console.log('✅ Relación productos-marcas correcta');
      console.log('Ejemplo de producto con marca:', productsWithBrand[0]);
    }
    
    return !productsError && !brandsError;
  } catch (error) {
    console.error('❌ Error al verificar relaciones:', error);
    return false;
  }
}

// Función para verificar los datos de productos
async function checkProductsData() {
  try {
    console.log('🔍 Verificando datos de productos');
    
    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, image_url, asset_id,
        category_id, category:categories(id, name, slug),
        brand_id, brand:brands(id, name, slug)
      `);
    
    if (productsError) {
      console.error('❌ Error al obtener productos:', productsError);
      return false;
    }
    
    console.log(`📊 Se encontraron ${products.length} productos`);
    
    // Verificar campos obligatorios
    let missingFields = 0;
    let missingCategory = 0;
    let missingBrand = 0;
    let missingImage = 0;
    
    for (const product of products) {
      if (!product.name || !product.slug || !product.description) {
        console.log(`⚠️ Producto ${product.id} tiene campos obligatorios faltantes`);
        missingFields++;
      }
      
      if (!product.category_id || !product.category) {
        console.log(`⚠️ Producto ${product.name} (${product.id}) no tiene categoría asignada`);
        missingCategory++;
      }
      
      if (!product.brand_id || !product.brand) {
        console.log(`⚠️ Producto ${product.name} (${product.id}) no tiene marca asignada`);
        missingBrand++;
      }
      
      if (!product.image_url) {
        console.log(`⚠️ Producto ${product.name} (${product.id}) no tiene imagen asignada`);
        missingImage++;
      }
    }
    
    console.log(`📊 Resumen de verificación de productos:`);
    console.log(`   Productos con campos obligatorios faltantes: ${missingFields}`);
    console.log(`   Productos sin categoría: ${missingCategory}`);
    console.log(`   Productos sin marca: ${missingBrand}`);
    console.log(`   Productos sin imagen: ${missingImage}`);
    
    return missingFields === 0 && missingCategory === 0 && missingBrand === 0 && missingImage === 0;
  } catch (error) {
    console.error('❌ Error al verificar datos de productos:', error);
    return false;
  }
}

// Función principal
async function verifyDatabaseStructure() {
  try {
    console.log('🔄 Verificando estructura de la base de datos...');
    
    // Verificar tablas principales
    const tablesExist = await Promise.all([
      checkTable('products'),
      checkTable('categories'),
      checkTable('brands'),
      checkTable('assets')
    ]);
    
    if (tablesExist.some(exists => !exists)) {
      console.error('❌ Faltan tablas en la base de datos');
      return;
    }
    
    // Verificar relaciones
    const relationsOk = await checkRelations();
    
    // Verificar datos de productos
    const productsDataOk = await checkProductsData();
    
    console.log('\n📊 Resumen de verificación de la base de datos:');
    console.log(`   Tablas: ${tablesExist.every(exists => exists) ? '✅ Correctas' : '❌ Incorrectas'}`);
    console.log(`   Relaciones: ${relationsOk ? '✅ Correctas' : '❌ Incorrectas'}`);
    console.log(`   Datos de productos: ${productsDataOk ? '✅ Correctos' : '⚠️ Con problemas'}`);
    
    if (tablesExist.every(exists => exists) && relationsOk && productsDataOk) {
      console.log('✅ La estructura de la base de datos es correcta');
    } else {
      console.log('⚠️ La estructura de la base de datos tiene problemas');
    }
  } catch (error) {
    console.error('❌ Error al verificar estructura de la base de datos:', error);
  }
}

// Ejecutar la función principal
verifyDatabaseStructure();
