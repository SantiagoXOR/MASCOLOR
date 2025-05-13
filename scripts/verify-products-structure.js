/**
 * Script para verificar la estructura de los productos en la base de datos
 * 
 * Este script verifica que todos los productos tengan la estructura correcta,
 * incluyendo relaciones con categorías y marcas, y rutas de imágenes válidas.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
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

// Rutas de archivos
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

// Función para verificar si una imagen es accesible desde la web
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

// Función para verificar la estructura de los productos
async function verifyProductsStructure() {
  try {
    console.log('🔍 Verificando estructura de productos...');

    // Obtener todos los productos con sus relaciones
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, image_url, asset_id, badge, icon,
        category:categories(id, slug, name),
        brand:brands(id, slug, name)
      `);
    
    if (productsError) {
      throw productsError;
    }

    console.log(`📊 Se encontraron ${products.length} productos en la base de datos`);

    // Verificar la estructura de cada producto
    let validCount = 0;
    let invalidCount = 0;
    let missingCategoryCount = 0;
    let missingBrandCount = 0;
    let missingImageCount = 0;
    let inaccessibleImageCount = 0;
    let missingAssetIdCount = 0;

    for (const product of products) {
      console.log(`\n🔍 Verificando producto: ${product.name} (${product.id})`);
      
      let isValid = true;
      
      // Verificar si tiene categoría
      if (!product.category) {
        console.log(`   ❌ No tiene categoría asignada`);
        missingCategoryCount++;
        isValid = false;
      } else {
        console.log(`   ✅ Categoría: ${product.category.name} (${product.category.slug})`);
      }
      
      // Verificar si tiene marca
      if (!product.brand) {
        console.log(`   ❌ No tiene marca asignada`);
        missingBrandCount++;
        isValid = false;
      } else {
        console.log(`   ✅ Marca: ${product.brand.name} (${product.brand.slug})`);
      }
      
      // Verificar si tiene imagen
      if (!product.image_url) {
        console.log(`   ❌ No tiene URL de imagen`);
        missingImageCount++;
        isValid = false;
      } else {
        console.log(`   ✅ URL de imagen: ${product.image_url}`);
        
        // Verificar si la imagen es accesible
        const isAccessible = isImageAccessible(product.image_url);
        if (!isAccessible) {
          console.log(`   ❌ La imagen no es accesible`);
          inaccessibleImageCount++;
          isValid = false;
        } else {
          console.log(`   ✅ La imagen es accesible`);
        }
      }
      
      // Verificar si tiene asset_id
      if (!product.asset_id) {
        console.log(`   ❌ No tiene asset_id`);
        missingAssetIdCount++;
        isValid = false;
      } else {
        console.log(`   ✅ Asset ID: ${product.asset_id}`);
      }
      
      // Verificar si tiene descripción
      if (!product.description) {
        console.log(`   ⚠️ No tiene descripción`);
      } else {
        console.log(`   ✅ Tiene descripción`);
      }
      
      // Verificar si tiene badge
      if (!product.badge) {
        console.log(`   ⚠️ No tiene badge`);
      } else {
        console.log(`   ✅ Badge: ${product.badge}`);
      }
      
      // Verificar si tiene icon
      if (!product.icon) {
        console.log(`   ⚠️ No tiene icon`);
      } else {
        console.log(`   ✅ Icon: ${product.icon}`);
      }
      
      // Resultado final
      if (isValid) {
        console.log(`   ✅ Producto válido`);
        validCount++;
      } else {
        console.log(`   ❌ Producto inválido`);
        invalidCount++;
      }
    }

    console.log(`\n📊 Resumen de verificación:`);
    console.log(`   Productos válidos: ${validCount}`);
    console.log(`   Productos inválidos: ${invalidCount}`);
    console.log(`   Productos sin categoría: ${missingCategoryCount}`);
    console.log(`   Productos sin marca: ${missingBrandCount}`);
    console.log(`   Productos sin imagen: ${missingImageCount}`);
    console.log(`   Productos con imagen inaccesible: ${inaccessibleImageCount}`);
    console.log(`   Productos sin asset_id: ${missingAssetIdCount}`);
    
    if (validCount === products.length) {
      console.log('✅ Todos los productos tienen la estructura correcta');
    } else {
      console.log('⚠️ Algunos productos tienen problemas de estructura');
    }
  } catch (error) {
    console.error('❌ Error al verificar estructura de productos:', error);
    process.exit(1);
  }
}

// Función para verificar las categorías
async function verifyCategories() {
  try {
    console.log('\n🔍 Verificando categorías...');

    // Obtener todas las categorías
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      throw categoriesError;
    }

    console.log(`📊 Se encontraron ${categories.length} categorías en la base de datos`);
    
    // Mostrar las categorías
    categories.forEach(category => {
      console.log(`   - ${category.name} (${category.slug})`);
    });
  } catch (error) {
    console.error('❌ Error al verificar categorías:', error);
  }
}

// Función para verificar las marcas
async function verifyBrands() {
  try {
    console.log('\n🔍 Verificando marcas...');

    // Obtener todas las marcas
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('*');
    
    if (brandsError) {
      throw brandsError;
    }

    console.log(`📊 Se encontraron ${brands.length} marcas en la base de datos`);
    
    // Mostrar las marcas
    brands.forEach(brand => {
      console.log(`   - ${brand.name} (${brand.slug})`);
    });
  } catch (error) {
    console.error('❌ Error al verificar marcas:', error);
  }
}

// Función principal
async function verifyStructure() {
  try {
    console.log('🔄 Verificando estructura de la base de datos...');
    
    await verifyCategories();
    await verifyBrands();
    await verifyProductsStructure();
    
    console.log('\n✅ Verificación completada');
  } catch (error) {
    console.error('❌ Error al verificar estructura:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
verifyStructure();
