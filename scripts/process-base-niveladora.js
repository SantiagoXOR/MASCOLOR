/**
 * Script para procesar la imagen de Base Niveladora Facilfix
 * y crear la estructura de carpetas necesaria
 */

const fs = require("fs");
const path = require("path");
const assetManager = require("./asset-management-system");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Configuración
const SOURCE_IMAGE = path.join(
  __dirname,
  "../public/images/products/base-niveladora-niveladora.webp"
);
const PRODUCT_ID = "6106bc99-5f69-4a16-8c83-124affea2342";
const ASSET_NAME = "base-niveladora-facilfix";
const CATEGORY = "products";

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log("🔍 Verificando credenciales de Supabase:");
console.log(`URL: ${supabaseUrl ? "✅ Encontrada" : "❌ No encontrada"}`);
console.log(
  `Service Key: ${supabaseServiceKey ? "✅ Encontrada" : "❌ No encontrada"}`
);

// Cliente de Supabase con clave de servicio para operaciones administrativas
let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log("✅ Cliente de Supabase creado correctamente");
} else {
  console.error("❌ Error: No se encontraron las credenciales de Supabase");
  process.exit(1);
}

// Función para actualizar la referencia de imagen en la base de datos
async function updateProductImageReference(productId, assetId) {
  try {
    console.log(
      `🔄 Actualizando referencia de imagen para producto ${productId}...`
    );

    // Construir la nueva URL de imagen basada en el sistema de gestión de activos
    const newImageUrl = `/assets/images/products/${assetId}/original.webp`;

    // Actualizar el producto con el nuevo asset_id y la nueva URL de imagen
    const { data, error } = await supabase
      .from("products")
      .update({
        image_url: newImageUrl,
        asset_id: assetId,
      })
      .eq("id", productId);

    if (error) {
      throw error;
    }

    return { success: true, newImageUrl };
  } catch (error) {
    console.error(
      `❌ Error al actualizar referencia de imagen para producto ${productId}:`,
      error
    );
    return { success: false, error: error.message };
  }
}

// Función principal
async function processBaseNiveladora() {
  try {
    console.log("🔄 Procesando imagen de Base Niveladora Facilfix...");

    // Verificar si la imagen existe
    if (!fs.existsSync(SOURCE_IMAGE)) {
      console.error(`❌ Error: No se encontró la imagen en ${SOURCE_IMAGE}`);
      return;
    }

    console.log(`✅ Imagen encontrada: ${SOURCE_IMAGE}`);

    // Procesar la imagen con el sistema de gestión de activos
    const asset = await assetManager.processAsset(
      SOURCE_IMAGE,
      CATEGORY,
      ASSET_NAME
    );

    if (!asset) {
      console.error("❌ Error al procesar la imagen");
      return;
    }

    console.log(`✅ Imagen procesada correctamente. Asset ID: ${asset.id}`);

    // Actualizar la referencia en la base de datos
    const updateResult = await updateProductImageReference(
      PRODUCT_ID,
      asset.id
    );

    if (updateResult.success) {
      console.log(
        `✅ Referencia actualizada correctamente en la base de datos`
      );
      console.log(`🔗 Nueva URL de imagen: ${updateResult.newImageUrl}`);
    } else {
      console.error(
        `❌ Error al actualizar la referencia en la base de datos: ${updateResult.error}`
      );
    }

    console.log("✅ Proceso completado");
  } catch (error) {
    console.error("❌ Error durante el procesamiento:", error);
  }
}

// Ejecutar la función principal
processBaseNiveladora();
