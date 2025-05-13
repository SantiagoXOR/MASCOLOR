/**
 * Script para actualizar la base de datos de Supabase con la información de assets
 * y actualizar las referencias en la tabla products
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Variables de entorno de Supabase no configuradas");
  console.error(
    "Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY en .env.local"
  );
  process.exit(1);
}

// Cliente de Supabase con clave de servicio para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rutas de archivos
const CATALOG_PATH = path.join(__dirname, "../public/assets/catalog.json");

// Función principal
async function updateAssetsDatabase() {
  try {
    console.log("🔄 Actualizando base de datos de assets...");

    // Verificar si existe el catálogo
    if (!fs.existsSync(CATALOG_PATH)) {
      console.error("❌ Error: No se encontró el catálogo de assets");
      process.exit(1);
    }

    // Leer el catálogo
    const catalogData = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));

    // Obtener todos los productos
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, slug, image_url");

    if (productsError) {
      throw productsError;
    }

    console.log(
      `📊 Se encontraron ${products.length} productos en la base de datos`
    );
    console.log(
      `📊 Se encontraron ${
        Object.keys(catalogData).length
      } assets en el catálogo`
    );

    // Crear registros en la tabla assets
    console.log("🔄 Creando registros en la tabla assets...");

    let assetsCreated = 0;
    let assetsSkipped = 0;

    for (const assetId in catalogData) {
      const asset = catalogData[assetId];

      // Verificar si el asset ya existe
      const { data: existingAsset, error: existingAssetError } = await supabase
        .from("assets")
        .select("id")
        .eq("id", assetId)
        .single();

      if (existingAssetError && existingAssetError.code !== "PGRST116") {
        console.error(
          `❌ Error al verificar asset ${assetId}:`,
          existingAssetError
        );
        continue;
      }

      if (existingAsset) {
        console.log(
          `⏩ Asset ${assetId} (${asset.name}) ya existe, omitiendo...`
        );
        assetsSkipped++;
        continue;
      }

      // Crear el asset
      const { error: insertError } = await supabase.from("assets").insert({
        id: assetId,
        name: asset.name,
        category: asset.category,
        originalformat: asset.originalFormat,
        originalwidth: asset.originalWidth,
        originalheight: asset.originalHeight,
        originalsize: asset.originalSize,
        dateadded: asset.dateAdded,
        versions: asset.versions,
        metadata: {},
      });

      if (insertError) {
        console.error(`❌ Error al crear asset ${assetId}:`, insertError);
        continue;
      }

      console.log(`✅ Asset ${assetId} (${asset.name}) creado correctamente`);
      assetsCreated++;
    }

    console.log(
      `📊 Assets creados: ${assetsCreated}, omitidos: ${assetsSkipped}`
    );

    // Actualizar referencias en la tabla products
    console.log("🔄 Actualizando referencias en la tabla products...");

    let productsUpdated = 0;
    let productsSkipped = 0;

    for (const product of products) {
      // Extraer el ID del asset de la URL de la imagen
      let assetId = null;

      if (product.image_url.includes("/assets/images/products/")) {
        // Formato: /assets/images/products/{assetId}/original.webp
        assetId = product.image_url.split("/")[4];
      } else if (
        product.image_url.includes(".avif") ||
        product.image_url.includes(".webp")
      ) {
        // Buscar por nombre en el catálogo
        const productName = product.name.toLowerCase().replace(/\s+/g, "-");

        for (const id in catalogData) {
          if (catalogData[id].name.toLowerCase() === productName) {
            assetId = id;
            break;
          }
        }
      }

      if (!assetId) {
        console.log(
          `⚠️ No se pudo determinar el asset_id para el producto ${product.name} (${product.id})`
        );
        productsSkipped++;
        continue;
      }

      // Actualizar el producto
      const { error: updateError } = await supabase
        .from("products")
        .update({ asset_id: assetId })
        .eq("id", product.id);

      if (updateError) {
        console.error(
          `❌ Error al actualizar producto ${product.id}:`,
          updateError
        );
        continue;
      }

      console.log(
        `✅ Producto ${product.name} (${product.id}) actualizado con asset_id: ${assetId}`
      );
      productsUpdated++;
    }

    console.log(
      `📊 Productos actualizados: ${productsUpdated}, omitidos: ${productsSkipped}`
    );

    console.log("✅ Base de datos actualizada correctamente");
  } catch (error) {
    console.error("❌ Error al actualizar la base de datos:", error);
    process.exit(1);
  }
}

// Ejecutar la función principal
updateAssetsDatabase();
