/**
 * Script para buscar imágenes faltantes y actualizar las referencias en la base de datos
 * 
 * Este script:
 * 1. Busca productos con imágenes faltantes
 * 2. Intenta encontrar coincidencias en el directorio de imágenes
 * 3. Actualiza las referencias en la base de datos
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración
const PRODUCTS_DIR = path.join(__dirname, '../public/images/products');
const REPORT_FILE = path.join(__dirname, '../reports/missing-images-report.json');

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

// Función para crear directorios si no existen
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para obtener todos los productos de la base de datos
async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image_url, slug, brand_id, category_id');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    return [];
  }
}

// Función para obtener todas las marcas de la base de datos
async function getAllBrands() {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, slug');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('❌ Error al obtener marcas:', error);
    return [];
  }
}

// Función para obtener todas las categorías de la base de datos
async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    return [];
  }
}

// Función para buscar coincidencias de imágenes
function findMatchingImage(productName, brandName, categoryName, productSlug) {
  try {
    // Obtener todos los archivos en el directorio de imágenes
    const files = fs.readdirSync(PRODUCTS_DIR);
    
    // Normalizar nombres para búsqueda
    const productNameLower = productName.toLowerCase().replace(/\s+/g, '-');
    const brandNameLower = brandName ? brandName.toLowerCase().replace(/\s+/g, '-') : '';
    const categoryNameLower = categoryName ? categoryName.toLowerCase().replace(/\s+/g, '-') : '';
    const productSlugLower = productSlug ? productSlug.toLowerCase() : '';
    
    // Crear diferentes patrones de búsqueda
    const patterns = [
      // Patrón 1: marca-producto
      brandNameLower && productNameLower ? `${brandNameLower}-${productNameLower}` : null,
      // Patrón 2: producto-marca
      brandNameLower && productNameLower ? `${productNameLower}-${brandNameLower}` : null,
      // Patrón 3: categoría-producto
      categoryNameLower && productNameLower ? `${categoryNameLower}-${productNameLower}` : null,
      // Patrón 4: producto-categoría
      categoryNameLower && productNameLower ? `${productNameLower}-${categoryNameLower}` : null,
      // Patrón 5: solo producto
      productNameLower,
      // Patrón 6: slug
      productSlugLower
    ].filter(Boolean);
    
    // Buscar coincidencias
    for (const pattern of patterns) {
      const matches = files.filter(file => 
        file.toLowerCase().includes(pattern) ||
        pattern.includes(file.toLowerCase().replace(/\.(png|jpg|jpeg|webp|avif)$/i, ''))
      );
      
      if (matches.length > 0) {
        return path.join(PRODUCTS_DIR, matches[0]);
      }
    }
    
    // Buscar coincidencias parciales
    const words = productNameLower.split('-').filter(word => word.length > 3);
    
    for (const word of words) {
      const matches = files.filter(file => 
        file.toLowerCase().includes(word)
      );
      
      if (matches.length > 0) {
        return path.join(PRODUCTS_DIR, matches[0]);
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error al buscar coincidencias para ${productName}:`, error);
    return null;
  }
}

// Función para actualizar la referencia de imagen en la base de datos
async function updateImageReference(productId, imagePath) {
  try {
    // Convertir ruta absoluta a relativa
    const relativePath = `/images/products/${path.basename(imagePath)}`;
    
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: relativePath })
      .eq('id', productId);
    
    if (error) {
      throw error;
    }
    
    return { success: true, newImageUrl: relativePath };
  } catch (error) {
    console.error(`❌ Error al actualizar referencia de imagen para producto ${productId}:`, error);
    return { success: false, error: error.message };
  }
}

// Función principal
async function findMissingImages() {
  try {
    console.log('🔄 Buscando imágenes faltantes...');
    
    // Asegurarse de que el directorio de informes existe
    ensureDir(path.dirname(REPORT_FILE));
    
    // Obtener todos los productos, marcas y categorías
    const products = await getAllProducts();
    const brands = await getAllBrands();
    const categories = await getAllCategories();
    
    console.log(`📊 Encontrados ${products.length} productos en la base de datos`);
    
    // Crear un registro de cambios
    const changes = [];
    
    // Procesar cada producto
    for (const product of products) {
      const { id, name, image_url, slug, brand_id, category_id } = product;
      
      // Verificar si la imagen existe
      const imagePath = image_url && image_url.startsWith('/') 
        ? path.join(__dirname, '..', 'public', image_url) 
        : null;
      
      const imageExists = imagePath && fs.existsSync(imagePath);
      
      if (imageExists) {
        console.log(`✅ Imagen para producto ${name} (${id}) existe: ${image_url}`);
        continue;
      }
      
      console.log(`❌ Imagen para producto ${name} (${id}) no existe: ${image_url || 'No definida'}`);
      
      // Buscar marca y categoría
      const brand = brands.find(b => b.id === brand_id);
      const category = categories.find(c => c.id === category_id);
      
      // Buscar coincidencias
      const matchingImage = findMatchingImage(
        name,
        brand ? brand.name : null,
        category ? category.name : null,
        slug
      );
      
      if (matchingImage) {
        console.log(`🔍 Encontrada coincidencia: ${path.basename(matchingImage)}`);
        
        // Actualizar referencia en la base de datos
        const updateResult = await updateImageReference(id, matchingImage);
        
        changes.push({
          productId: id,
          productName: name,
          oldImageUrl: image_url,
          newImageUrl: updateResult.newImageUrl,
          updateResult: updateResult
        });
        
        if (updateResult.success) {
          console.log(`✅ Referencia actualizada correctamente para producto ${name} (${id})`);
        } else {
          console.error(`❌ Error al actualizar referencia para producto ${name} (${id}): ${updateResult.error}`);
        }
      } else {
        console.error(`❌ No se encontraron coincidencias para ${name}`);
        
        changes.push({
          productId: id,
          productName: name,
          oldImageUrl: image_url,
          newImageUrl: null,
          updateResult: { success: false, error: 'No se encontraron coincidencias' }
        });
      }
    }
    
    // Guardar informe
    fs.writeFileSync(REPORT_FILE, JSON.stringify(changes, null, 2));
    
    console.log(`✅ Proceso completado. Se procesaron ${products.length} productos.`);
    console.log(`📝 Informe guardado en ${REPORT_FILE}`);
    
    return changes;
  } catch (error) {
    console.error('❌ Error durante la búsqueda de imágenes faltantes:', error);
    return [];
  }
}

// Ejecutar la función principal
findMissingImages();
