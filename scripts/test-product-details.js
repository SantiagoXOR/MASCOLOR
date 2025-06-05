/**
 * Script para probar la funcionalidad de detalles de productos
 * Ejecutar con: node scripts/test-product-details.js
 */

const { getProductById, getProductBySlug } = require('../lib/supabase/products');

async function testProductDetails() {
  console.log('🧪 Probando funcionalidad de detalles de productos...\n');

  try {
    // Test 1: Obtener producto por ID
    console.log('📋 Test 1: Obtener producto por ID');
    const productById = await getProductById('b817e62f-8bdd-4944-832f-e79a7b39bcc0');
    
    if (productById) {
      console.log('✅ Producto obtenido por ID:');
      console.log(`   - Nombre: ${productById.name}`);
      console.log(`   - Descripción: ${productById.description}`);
      console.log(`   - Categoría: ${productById.category?.name || 'N/A'}`);
      console.log(`   - Marca: ${productById.brand?.name || 'N/A'}`);
      console.log(`   - Características: ${productById.features?.length || 0}`);
      
      if (productById.features && productById.features.length > 0) {
        console.log('   - Detalles de características:');
        productById.features.forEach(feature => {
          console.log(`     * ${feature.name}: ${feature.value}`);
        });
      }
    } else {
      console.log('❌ No se pudo obtener el producto por ID');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Obtener producto por slug
    console.log('📋 Test 2: Obtener producto por slug');
    
    // Primero necesitamos obtener un slug válido
    if (productById && productById.slug) {
      const productBySlug = await getProductBySlug(productById.slug);
      
      if (productBySlug) {
        console.log('✅ Producto obtenido por slug:');
        console.log(`   - Slug: ${productBySlug.slug}`);
        console.log(`   - Nombre: ${productBySlug.name}`);
        console.log(`   - ID coincide: ${productBySlug.id === productById.id ? '✅' : '❌'}`);
      } else {
        console.log('❌ No se pudo obtener el producto por slug');
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Probar con producto inexistente
    console.log('📋 Test 3: Probar con producto inexistente');
    
    const nonExistentProduct = await getProductById('00000000-0000-0000-0000-000000000000');
    if (nonExistentProduct === null) {
      console.log('✅ Manejo correcto de producto inexistente (retorna null)');
    } else {
      console.log('❌ Error: debería retornar null para producto inexistente');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Verificar estructura de datos
    console.log('📋 Test 4: Verificar estructura de datos');
    
    if (productById) {
      const requiredFields = ['id', 'slug', 'name', 'description', 'image_url'];
      const missingFields = requiredFields.filter(field => !productById[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ Todos los campos requeridos están presentes');
      } else {
        console.log(`❌ Campos faltantes: ${missingFields.join(', ')}`);
      }

      // Verificar relaciones
      if (productById.category && productById.category.id && productById.category.name) {
        console.log('✅ Relación con categoría correcta');
      } else {
        console.log('⚠️  Relación con categoría incompleta o faltante');
      }

      if (productById.brand && productById.brand.id && productById.brand.name) {
        console.log('✅ Relación con marca correcta');
      } else {
        console.log('⚠️  Relación con marca incompleta o faltante');
      }

      // Verificar características
      if (productById.features && Array.isArray(productById.features)) {
        console.log(`✅ Características cargadas: ${productById.features.length} elementos`);
        
        if (productById.features.length > 0) {
          const validFeatures = productById.features.filter(f => f.name && f.value);
          if (validFeatures.length === productById.features.length) {
            console.log('✅ Todas las características tienen nombre y valor');
          } else {
            console.log('⚠️  Algunas características están incompletas');
          }
        }
      } else {
        console.log('⚠️  Características no cargadas o formato incorrecto');
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 5: Verificar URLs de imagen
    console.log('📋 Test 5: Verificar URLs de imagen');
    
    if (productById) {
      console.log(`   - URL de imagen: ${productById.image_url}`);
      
      if (productById.asset_id) {
        console.log(`   - Asset ID: ${productById.asset_id}`);
        console.log('✅ Producto tiene asset_id para optimización de imágenes');
      } else {
        console.log('⚠️  Producto no tiene asset_id');
      }

      // Verificar formato de URL
      const isValidUrl = productById.image_url.startsWith('/') || 
                        productById.image_url.startsWith('http://') || 
                        productById.image_url.startsWith('https://');
      
      if (isValidUrl) {
        console.log('✅ URL de imagen tiene formato válido');
      } else {
        console.log('❌ URL de imagen tiene formato inválido');
      }
    }

    console.log('\n🎉 Pruebas completadas!\n');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar las pruebas
if (require.main === module) {
  testProductDetails().then(() => {
    console.log('✅ Script de pruebas finalizado');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { testProductDetails };
