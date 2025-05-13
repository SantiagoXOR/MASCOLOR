/**
 * Script para corregir la referencia faltante del producto "Membrana Líquida Ecopainting"
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

// Función principal
async function fixMissingAssetReference() {
  try {
    console.log('🔄 Corrigiendo referencia faltante para "Membrana Líquida Ecopainting"...');

    // Obtener el producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, slug, image_url')
      .eq('slug', 'membrana-liquida-ecopainting')
      .single();
    
    if (productError) {
      throw productError;
    }

    if (!product) {
      console.error('❌ Error: Producto "Membrana Líquida Ecopainting" no encontrado');
      process.exit(1);
    }

    console.log(`📊 Producto encontrado: ${product.name} (${product.id})`);
    console.log(`📊 URL de imagen actual: ${product.image_url}`);

    // Buscar un asset existente que pueda ser utilizado (membrana)
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('id, name')
      .eq('name', 'membrana')
      .limit(1);
    
    if (assetsError) {
      throw assetsError;
    }

    if (!assets || assets.length === 0) {
      console.error('❌ Error: No se encontró ningún asset de tipo "membrana"');
      process.exit(1);
    }

    const assetId = assets[0].id;
    console.log(`📊 Asset encontrado: ${assets[0].name} (${assetId})`);

    // Actualizar el producto
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        asset_id: assetId,
        image_url: `/assets/images/products/${assetId}/original.webp`
      })
      .eq('id', product.id);
    
    if (updateError) {
      throw updateError;
    }

    console.log(`✅ Producto ${product.name} (${product.id}) actualizado con asset_id: ${assetId}`);
    console.log(`✅ URL de imagen actualizada a: /assets/images/products/${assetId}/original.webp`);
    
    console.log('✅ Referencia corregida correctamente');
  } catch (error) {
    console.error('❌ Error al corregir referencia:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixMissingAssetReference();
