/**
 * Script para depurar la relación entre productos y marcas
 * 
 * Este script:
 * 1. Simula la obtención de productos como lo hace el frontend
 * 2. Verifica que la propiedad brand esté correctamente configurada
 * 3. Muestra información detallada sobre la estructura de los productos
 * 
 * Uso:
 * node scripts/debug-product-brand-relation.js
 */

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

// Función para obtener productos simulando el comportamiento del frontend
async function getProducts(options = {}) {
  const { category, brand, search, limit = 100, offset = 0 } = options;
  
  console.log('🔍 Obteniendo productos con filtros:', {
    category,
    brand,
    search,
    limit,
    offset
  });
  
  // Determinar los campos a seleccionar (igual que en el frontend)
  const selectFields = `
    *,
    category:categories(id, slug, name),
    brand:brands(id, slug, name, logo_url)
  `;
  
  // Iniciar la consulta base
  let query = supabase
    .from('products')
    .select(selectFields)
    .order('name')
    .range(offset, offset + limit - 1);
  
  // Aplicar filtros si se proporcionan
  if (category) {
    // Primero obtenemos el ID de la categoría
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }
  
  if (brand) {
    // Primero obtenemos el ID de la marca
    const { data: brandData } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', brand)
      .single();
    
    if (brandData) {
      query = query.eq('brand_id', brandData.id);
    }
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  // Ejecutar la consulta
  const { data, error } = await query;
  
  if (error) {
    console.error('❌ Error al obtener productos:', error);
    throw error;
  }
  
  console.log(`✅ Productos obtenidos: ${data?.length || 0}`);
  return data || [];
}

// Función principal
async function main() {
  try {
    console.log('🚀 Iniciando depuración de relación entre productos y marcas');
    
    // 1. Obtener todos los productos
    const allProducts = await getProducts();
    
    // 2. Verificar la estructura de los productos
    console.log('\n🔍 Verificando estructura de productos:');
    
    let productsWithBrand = 0;
    let productsWithoutBrand = 0;
    let productsWithBrandId = 0;
    let productsWithoutBrandId = 0;
    let productsWithBrandLogo = 0;
    let productsWithoutBrandLogo = 0;
    
    for (const product of allProducts) {
      // Verificar si tiene brand
      if (product.brand) {
        productsWithBrand++;
      } else {
        productsWithoutBrand++;
        console.log(`⚠️ Producto sin brand: ${product.name} (${product.id})`);
      }
      
      // Verificar si tiene brand_id
      if (product.brand_id) {
        productsWithBrandId++;
      } else {
        productsWithoutBrandId++;
        console.log(`⚠️ Producto sin brand_id: ${product.name} (${product.id})`);
      }
      
      // Verificar si tiene logo_url en brand
      if (product.brand?.logo_url) {
        productsWithBrandLogo++;
      } else if (product.brand) {
        productsWithoutBrandLogo++;
        console.log(`⚠️ Producto con brand pero sin logo_url: ${product.name} (${product.id}), brand: ${product.brand.name}`);
      }
    }
    
    // 3. Mostrar estadísticas
    console.log('\n📊 Estadísticas:');
    console.log(`Total de productos: ${allProducts.length}`);
    console.log(`Productos con brand: ${productsWithBrand}`);
    console.log(`Productos sin brand: ${productsWithoutBrand}`);
    console.log(`Productos con brand_id: ${productsWithBrandId}`);
    console.log(`Productos sin brand_id: ${productsWithoutBrandId}`);
    console.log(`Productos con logo_url en brand: ${productsWithBrandLogo}`);
    console.log(`Productos sin logo_url en brand: ${productsWithoutBrandLogo}`);
    
    // 4. Mostrar estructura detallada de algunos productos
    console.log('\n🔍 Estructura detallada de algunos productos:');
    
    if (allProducts.length > 0) {
      // Mostrar el primer producto
      const firstProduct = allProducts[0];
      console.log('Primer producto:');
      console.log(JSON.stringify(firstProduct, null, 2));
      
      // Mostrar un producto con brand
      const productWithBrand = allProducts.find(p => p.brand);
      if (productWithBrand) {
        console.log('\nProducto con brand:');
        console.log(JSON.stringify({
          id: productWithBrand.id,
          name: productWithBrand.name,
          brand_id: productWithBrand.brand_id,
          brand: productWithBrand.brand
        }, null, 2));
      }
      
      // Mostrar un producto sin brand
      const productWithoutBrand = allProducts.find(p => !p.brand);
      if (productWithoutBrand) {
        console.log('\nProducto sin brand:');
        console.log(JSON.stringify({
          id: productWithoutBrand.id,
          name: productWithoutBrand.name,
          brand_id: productWithoutBrand.brand_id,
          brand: productWithoutBrand.brand
        }, null, 2));
      }
    }
    
    // 5. Obtener productos por marca
    console.log('\n🔍 Obteniendo productos por marca:');
    
    // Obtener productos de la marca Premium
    const premiumProducts = await getProducts({ brand: 'premium' });
    console.log(`Productos de Premium: ${premiumProducts.length}`);
    
    // Verificar si todos los productos tienen la marca correcta
    const allPremium = premiumProducts.every(p => p.brand && p.brand.slug === 'premium');
    console.log(`¿Todos los productos tienen la marca Premium? ${allPremium ? 'Sí ✅' : 'No ❌'}`);
    
    if (!allPremium) {
      console.log('Productos con marca incorrecta:');
      premiumProducts
        .filter(p => !p.brand || p.brand.slug !== 'premium')
        .forEach(p => {
          console.log(`- ${p.name} (${p.id}), marca: ${p.brand?.name || 'Sin marca'}`);
        });
    }
    
    console.log('\n✅ Depuración completada');
  } catch (error) {
    console.error('❌ Error durante la depuración:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
