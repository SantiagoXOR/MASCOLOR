// Script para eliminar productos específicos de la base de datos
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY en tu archivo .env');
  process.exit(1);
}

// Cliente de Supabase con clave de servicio para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Productos a eliminar (por slug)
const productsToDelete = [
  'membrana-ecopainting-2',
  'membrana-liquida-ecopainting'
];

// Función principal
async function deleteProducts() {
  console.log('🔄 Iniciando eliminación de productos...');
  
  try {
    // Primero, obtener información de los productos para confirmar
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, slug, asset_id')
      .in('slug', productsToDelete);
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!products || products.length === 0) {
      console.log('⚠️ No se encontraron productos con los slugs especificados');
      return;
    }
    
    console.log('📋 Productos encontrados para eliminar:');
    products.forEach(product => {
      console.log(`- ${product.name} (${product.slug}) [ID: ${product.id}]`);
    });
    
    // Confirmar eliminación
    console.log('\n🚨 Procediendo con la eliminación...');
    
    // Eliminar productos
    for (const product of products) {
      // Eliminar el producto
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);
      
      if (deleteError) {
        console.error(`❌ Error al eliminar producto ${product.name}:`, deleteError);
      } else {
        console.log(`✅ Producto eliminado: ${product.name}`);
        
        // Si el producto tiene un asset_id, también podríamos eliminar el asset
        if (product.asset_id) {
          console.log(`ℹ️ El producto tenía un asset_id: ${product.asset_id}`);
          console.log(`ℹ️ Nota: El asset no se eliminará automáticamente para evitar referencias cruzadas.`);
          console.log(`ℹ️ Si deseas eliminar el asset, usa el script cleanup-unused-assets.js`);
        }
      }
    }
    
    console.log('\n✅ Proceso completado');
    
  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
deleteProducts();
