/**
 * Script para actualizar la base de datos de productos
 * 
 * Este script:
 * 1. Obtiene todas las imágenes de productos disponibles
 * 2. Verifica qué productos ya existen en la base de datos
 * 3. Agrega los productos faltantes
 * 4. Actualiza los productos existentes si es necesario
 */

const fs = require('fs');
const path = require('path');
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

// Directorio de imágenes de productos
const PRODUCTS_DIR = path.join(__dirname, '../public/images/products');

// Mapeo de marcas para identificar a qué marca pertenece cada producto
const BRAND_MAP = {
  'premium': 'premium',
  'expression': 'expression',
  'ecopainting': 'ecopainting',
  'newhouse': 'newhouse',
  'facilfix': 'facilfix'
};

// Mapeo de categorías para identificar a qué categoría pertenece cada producto
const CATEGORY_MAP = {
  'exterior': 'exteriores',
  'interior': 'interiores',
  'membrana': 'especiales',
  'barniz': 'especiales',
  'esmalte': 'especiales',
  'microcemento': 'recubrimientos',
  'piscinas': 'especiales',
  'pisos': 'especiales',
  'frentes': 'exteriores',
  'cielorraso': 'interiores',
  'enduido': 'especiales',
  'fijador': 'especiales',
  'imprimacion': 'especiales',
  'ladrillo': 'recubrimientos',
  'masilla': 'especiales'
};

// Mapeo de iconos para asignar a cada producto
const ICON_MAP = {
  'exterior': 'exterior',
  'interior': 'interior',
  'membrana': 'waterproof',
  'barniz': 'wood',
  'esmalte': 'paint',
  'microcemento': 'concrete',
  'piscinas': 'pool',
  'pisos': 'floor',
  'frentes': 'building',
  'cielorraso': 'ceiling',
  'enduido': 'trowel',
  'fijador': 'drop',
  'imprimacion': 'primer',
  'ladrillo': 'brick',
  'masilla': 'putty'
};

// Función para extraer información de un nombre de archivo
function extractProductInfo(filename) {
  // Obtener nombre base sin extensión
  const basename = path.basename(filename, path.extname(filename));
  
  // Dividir en partes por guiones
  const parts = basename.split('-');
  
  // Extraer marca (primera parte)
  const brandSlug = parts[0].toLowerCase();
  
  // Extraer nombre del producto
  let name = parts.slice(1).join(' ');
  name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  
  // Extraer slug del producto
  const slug = parts.slice(1).join('-').toLowerCase();
  
  // Determinar categoría
  let categorySlug = 'especiales'; // Categoría por defecto
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (slug.includes(keyword)) {
      categorySlug = category;
      break;
    }
  }
  
  // Determinar icono
  let icon = 'paint'; // Icono por defecto
  for (const [keyword, iconName] of Object.entries(ICON_MAP)) {
    if (slug.includes(keyword)) {
      icon = iconName;
      break;
    }
  }
  
  // Generar descripción
  let description = '';
  if (categorySlug === 'interiores') {
    description = `Pintura acrílica para interiores con excelente rendimiento y acabado.`;
  } else if (categorySlug === 'exteriores') {
    description = `Pintura de alta calidad para exteriores con máxima resistencia a la intemperie.`;
  } else if (slug.includes('barniz')) {
    description = `Barniz de alta resistencia para maderas expuestas a la intemperie.`;
  } else if (slug.includes('membrana')) {
    description = `Impermeabilizante para techos y terrazas.`;
  } else if (slug.includes('microcemento')) {
    description = `Revestimiento de microcemento para pisos y paredes.`;
  } else {
    description = `Producto de alta calidad para ${categorySlug}.`;
  }
  
  // Determinar precio (aleatorio entre 5000 y 10000)
  const price = Math.floor(Math.random() * 5000) + 5000;
  
  // Determinar badge (aleatorio entre bestseller, new, featured o null)
  const badges = ['bestseller', 'new', 'featured', null, null];
  const badge = badges[Math.floor(Math.random() * badges.length)];
  
  // Determinar cobertura (aleatorio entre 6 y 15)
  const coverage = Math.floor(Math.random() * 10) + 6;
  
  // Determinar capas (aleatorio entre 1 y 3)
  const coats = Math.floor(Math.random() * 3) + 1;
  
  return {
    slug: `${slug}-${brandSlug}`,
    name,
    description,
    price,
    image_url: `/images/products/${filename}`,
    badge,
    icon,
    coverage,
    coats,
    brand_slug: brandSlug,
    category_slug: categorySlug
  };
}

// Función para obtener el ID de una marca por su slug
async function getBrandId(brandSlug) {
  const { data, error } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', brandSlug)
    .single();
  
  if (error) {
    console.error(`Error al obtener ID de marca ${brandSlug}:`, error);
    return null;
  }
  
  return data.id;
}

// Función para obtener el ID de una categoría por su slug
async function getCategoryId(categorySlug) {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();
  
  if (error) {
    console.error(`Error al obtener ID de categoría ${categorySlug}:`, error);
    return null;
  }
  
  return data.id;
}

// Función para verificar si un producto ya existe
async function productExists(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug);
  
  if (error) {
    console.error(`Error al verificar si existe el producto ${slug}:`, error);
    return false;
  }
  
  return data.length > 0;
}

// Función para agregar un nuevo producto
async function addProduct(product) {
  try {
    // Obtener IDs de marca y categoría
    const brandId = await getBrandId(product.brand_slug);
    const categoryId = await getCategoryId(product.category_slug);
    
    if (!brandId || !categoryId) {
      console.error(`❌ No se pudo obtener ID de marca o categoría para ${product.slug}`);
      return false;
    }
    
    // Crear objeto de producto para insertar
    const productData = {
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      badge: product.badge,
      icon: product.icon,
      coverage: product.coverage,
      coats: product.coats,
      brand_id: brandId,
      category_id: categoryId
    };
    
    // Insertar producto
    const { data, error } = await supabase
      .from('products')
      .insert(productData);
    
    if (error) {
      console.error(`Error al agregar producto ${product.slug}:`, error);
      return false;
    }
    
    console.log(`✅ Producto agregado: ${product.name}`);
    return true;
  } catch (error) {
    console.error(`Error al agregar producto ${product.slug}:`, error);
    return false;
  }
}

// Función principal
async function updateProductDatabase() {
  try {
    console.log('🔄 Actualizando base de datos de productos...');
    
    // Obtener todos los archivos en el directorio de productos
    const files = fs.readdirSync(PRODUCTS_DIR);
    
    // Filtrar solo imágenes
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext) && file !== 'placeholder.jpg';
    });
    
    console.log(`🖼️ Encontradas ${imageFiles.length} imágenes de productos`);
    
    // Crear un registro de productos agregados
    const addedProducts = [];
    
    // Procesar cada imagen
    for (const file of imageFiles) {
      // Extraer información del producto
      const product = extractProductInfo(file);
      
      // Verificar si el producto ya existe
      const exists = await productExists(product.slug);
      
      if (!exists) {
        // Agregar producto
        const added = await addProduct(product);
        
        if (added) {
          addedProducts.push(product);
        }
      } else {
        console.log(`ℹ️ El producto ${product.slug} ya existe en la base de datos`);
      }
    }
    
    // Generar registro de productos agregados
    const reportPath = path.join(__dirname, '../added-products.json');
    fs.writeFileSync(reportPath, JSON.stringify(addedProducts, null, 2));
    
    console.log(`\n📊 Resumen:`);
    console.log(`✅ Se agregaron ${addedProducts.length} productos nuevos`);
    console.log(`ℹ️ Se encontraron ${imageFiles.length - addedProducts.length} productos que ya existían`);
    console.log(`📄 Se ha generado un registro de productos agregados en ${reportPath}`);
  } catch (error) {
    console.error('Error durante la actualización de la base de datos:', error);
  }
}

// Ejecutar la función principal
updateProductDatabase();
