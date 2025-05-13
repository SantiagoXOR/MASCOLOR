/**
 * Script para identificar y eliminar archivos de assets no referenciados
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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
const CATALOG_PATH = path.join(__dirname, '../public/assets/catalog.json');
const ASSETS_DIR = path.join(__dirname, '../public/assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');
const PRODUCTS_DIR = path.join(IMAGES_DIR, 'products');

// Función para eliminar un directorio recursivamente
function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

// Función principal
async function cleanupUnusedAssets() {
  try {
    console.log('🔄 Identificando y eliminando assets no utilizados...');

    // Verificar si existe el catálogo
    if (!fs.existsSync(CATALOG_PATH)) {
      console.error('❌ Error: No se encontró el catálogo de assets');
      process.exit(1);
    }

    // Leer el catálogo
    const catalogData = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    
    // Obtener todos los productos con sus asset_id
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, asset_id');
    
    if (productsError) {
      throw productsError;
    }

    console.log(`📊 Se encontraron ${products.length} productos en la base de datos`);
    console.log(`📊 Se encontraron ${Object.keys(catalogData).length} assets en el catálogo`);

    // Crear un conjunto de asset_ids utilizados
    const usedAssetIds = new Set();
    products.forEach(product => {
      if (product.asset_id) {
        usedAssetIds.add(product.asset_id);
      }
    });

    console.log(`📊 Se encontraron ${usedAssetIds.size} assets utilizados por productos`);

    // Identificar assets no utilizados
    const unusedAssetIds = [];
    for (const assetId in catalogData) {
      if (!usedAssetIds.has(assetId)) {
        unusedAssetIds.push(assetId);
      }
    }

    console.log(`📊 Se encontraron ${unusedAssetIds.length} assets no utilizados`);

    // Preguntar al usuario si desea eliminar los assets no utilizados
    if (unusedAssetIds.length > 0) {
      console.log('⚠️ Los siguientes assets no están siendo utilizados:');
      unusedAssetIds.forEach(assetId => {
        console.log(`- ${assetId} (${catalogData[assetId].name})`);
      });

      // En un entorno de producción, aquí se podría agregar una confirmación del usuario
      const confirmDelete = true; // Cambiar a false para evitar la eliminación automática
      
      if (confirmDelete) {
        console.log('🔄 Eliminando assets no utilizados...');
        
        let assetsDeleted = 0;
        let assetsSkipped = 0;
        
        for (const assetId of unusedAssetIds) {
          // Eliminar el directorio del asset
          const assetDir = path.join(PRODUCTS_DIR, assetId);
          
          if (fs.existsSync(assetDir)) {
            try {
              removeDir(assetDir);
              console.log(`✅ Directorio del asset ${assetId} eliminado correctamente`);
              assetsDeleted++;
            } catch (error) {
              console.error(`❌ Error al eliminar directorio del asset ${assetId}:`, error);
              assetsSkipped++;
            }
          } else {
            console.log(`⚠️ Directorio del asset ${assetId} no encontrado`);
            assetsSkipped++;
          }
          
          // Eliminar el asset de la base de datos
          const { error: deleteError } = await supabase
            .from('assets')
            .delete()
            .eq('id', assetId);
          
          if (deleteError) {
            console.error(`❌ Error al eliminar asset ${assetId} de la base de datos:`, deleteError);
          } else {
            console.log(`✅ Asset ${assetId} eliminado de la base de datos`);
          }
          
          // Eliminar el asset del catálogo
          delete catalogData[assetId];
        }
        
        // Guardar el catálogo actualizado
        fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalogData, null, 2), 'utf8');
        console.log('✅ Catálogo actualizado correctamente');
        
        console.log(`📊 Assets eliminados: ${assetsDeleted}, omitidos: ${assetsSkipped}`);
      } else {
        console.log('⚠️ Operación cancelada por el usuario');
      }
    } else {
      console.log('✅ No se encontraron assets no utilizados');
    }
    
    console.log('✅ Limpieza de assets completada');
  } catch (error) {
    console.error('❌ Error al limpiar assets no utilizados:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
cleanupUnusedAssets();
