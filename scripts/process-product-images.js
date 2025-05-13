/**
 * Script para procesar todas las imágenes de productos utilizando el sistema de gestión de activos
 *
 * Este script:
 * 1. Escanea el directorio de imágenes de productos
 * 2. Procesa cada imagen utilizando el sistema de gestión de activos
 * 3. Actualiza las referencias en la base de datos
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const assetManager = require("./asset-management-system");
require("dotenv").config({ path: ".env.local" });

// Configuración
const PRODUCTS_DIR = path.join(__dirname, "../public/images/products");
const REPORT_FILE = path.join(
  __dirname,
  "../reports/product-images-processing-report.json"
);

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
      .from("products")
      .select("id, name, image_url");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return [];
  }
}

// Función para actualizar la referencia de imagen en la base de datos
async function updateProductImageReference(productId, assetId) {
  try {
    // Verificar que el assetId no sea undefined
    if (!assetId) {
      console.error(
        `❌ Error: assetId es undefined para el producto ${productId}`
      );
      return { success: false, error: "assetId es undefined" };
    }

    // Construir la nueva URL de imagen basada en el sistema de gestión de activos
    const newImageUrl = `/assets/images/products/${assetId}/original.webp`;

    // Verificar si la tabla assets existe
    try {
      // Intentar una consulta simple a la tabla assets
      const { data, error } = await supabase
        .from("assets")
        .select("id")
        .limit(1);

      // Si hay un error y el código es 42P01, la tabla no existe
      const tableExists = !(error && error.code === "42P01");

      // Si hay otro tipo de error, registrarlo pero continuar
      if (error && error.code !== "42P01") {
        console.warn(`⚠️ Error al verificar la tabla assets: ${error.message}`);
      }

      // Si la tabla assets existe, actualizar asset_id
      if (tableExists) {
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
      } else {
        // Si la tabla assets no existe, solo actualizar image_url
        const { data, error } = await supabase
          .from("products")
          .update({
            image_url: newImageUrl,
          })
          .eq("id", productId);

        if (error) {
          throw error;
        }
      }

      return { success: true, newImageUrl };
    } catch (error) {
      console.error(
        `❌ Error al actualizar referencia de imagen para producto ${productId}:`,
        error
      );
      return { success: false, error: error.message };
    }
  } catch (error) {
    console.error(
      `❌ Error al actualizar referencia de imagen para producto ${productId}:`,
      error
    );
    return { success: false, error: error.message };
  }
}

// Función principal
async function processProductImages() {
  try {
    console.log("🔄 Procesando imágenes de productos...");

    // Asegurarse de que el directorio de informes existe
    ensureDir(path.dirname(REPORT_FILE));

    // Obtener todos los productos
    const products = await getAllProducts();

    console.log(
      `📊 Encontrados ${products.length} productos en la base de datos`
    );

    // Crear un registro de cambios
    const changes = [];

    // Procesar cada producto
    for (const product of products) {
      const { id, name, image_url } = product;

      // Si no hay URL de imagen, continuar con el siguiente producto
      if (!image_url) {
        console.log(`⚠️ Producto ${name} (${id}) no tiene URL de imagen`);
        continue;
      }

      // Extraer la ruta relativa de la imagen
      const relativePath = image_url.startsWith("/")
        ? image_url.substring(1)
        : image_url;

      // Construir la ruta completa
      let fullPath = path.join(__dirname, "..", "public", relativePath);

      // Verificar si el archivo existe
      if (!fs.existsSync(fullPath)) {
        console.error(
          `❌ Imagen para producto ${name} (${id}) no existe: ${image_url}`
        );

        // Intentar encontrar la imagen con otro nombre
        const productDir = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "products"
        );
        const files = fs.readdirSync(productDir);

        // Buscar coincidencias parciales
        const productNameLower = name.toLowerCase().replace(/\s+/g, "-");
        const possibleMatches = files.filter(
          (file) =>
            file.toLowerCase().includes(productNameLower) ||
            productNameLower.includes(
              file.toLowerCase().replace(/\.(png|jpg|jpeg|webp|avif)$/i, "")
            )
        );

        if (possibleMatches.length > 0) {
          const newFullPath = path.join(productDir, possibleMatches[0]);
          console.log(
            `🔍 Encontrada posible coincidencia: ${possibleMatches[0]}`
          );
          console.log(`🔍 Nueva ruta completa: ${newFullPath}`);

          if (fs.existsSync(newFullPath)) {
            console.log(`✅ Archivo encontrado, usando ruta alternativa`);
            fullPath = newFullPath;
          } else {
            console.error(`❌ Archivo alternativo no existe`);
            continue;
          }
        } else {
          console.error(`❌ No se encontraron coincidencias para ${name}`);
          continue;
        }
      }

      console.log(
        `🔄 Procesando imagen para producto ${name} (${id}): ${image_url}`
      );

      // Procesar la imagen con el sistema de gestión de activos
      console.log(`🔍 Ruta completa de la imagen: ${fullPath}`);
      console.log(
        `🔍 Verificando si el archivo existe: ${fs.existsSync(fullPath)}`
      );

      let asset;
      try {
        asset = await assetManager.processAsset(
          fullPath,
          "products",
          `${name.toLowerCase().replace(/\s+/g, "-")}`
        );

        console.log(`🔍 Resultado del procesamiento: ${asset ? "OK" : "NULL"}`);

        if (!asset) {
          console.error(
            `❌ Error al procesar imagen para producto ${name} (${id})`
          );
          continue;
        }
      } catch (error) {
        console.error(
          `❌ Error al procesar imagen para producto ${name} (${id}):`,
          error
        );
        continue;
      }

      // Verificar que el asset tenga un ID
      if (!asset.id) {
        console.error(
          `❌ Error: El activo procesado no tiene ID para el producto ${name} (${id})`
        );
        continue;
      }

      console.log(`✅ Activo generado con ID: ${asset.id}`);

      // Actualizar la referencia en la base de datos
      const updateResult = await updateProductImageReference(id, asset.id);

      changes.push({
        productId: id,
        productName: name,
        oldImageUrl: image_url,
        newImageUrl: updateResult.newImageUrl,
        assetId: asset.id,
        updateResult: updateResult,
      });

      if (updateResult.success) {
        console.log(
          `✅ Referencia actualizada correctamente para producto ${name} (${id})`
        );
      } else {
        console.error(
          `❌ Error al actualizar referencia para producto ${name} (${id}): ${updateResult.error}`
        );
      }
    }

    // Guardar informe
    fs.writeFileSync(REPORT_FILE, JSON.stringify(changes, null, 2));

    console.log(
      `✅ Proceso completado. Se procesaron ${products.length} productos.`
    );
    console.log(`📝 Informe guardado en ${REPORT_FILE}`);

    return changes;
  } catch (error) {
    console.error(
      "❌ Error durante el procesamiento de imágenes de productos:",
      error
    );
    return [];
  }
}

// Ejecutar la función principal
processProductImages();
