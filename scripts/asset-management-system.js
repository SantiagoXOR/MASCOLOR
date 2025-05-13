/**
 * Sistema de gestión de activos para el proyecto +COLOR
 *
 * Este script:
 * 1. Organiza y cataloga todos los activos (imágenes, videos, etc.)
 * 2. Genera versiones optimizadas para diferentes usos
 * 3. Mantiene un registro centralizado de todos los activos
 * 4. Proporciona una API para acceder a los activos
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Configuración
const ASSETS_DIR = path.join(__dirname, "../public/assets");
const IMAGES_DIR = path.join(ASSETS_DIR, "images");
const CATALOG_FILE = path.join(ASSETS_DIR, "catalog.json");
const FORMATS = ["webp", "avif", "jpg", "png"];
const SIZES = [640, 768, 1024, 1280, 1536];
const QUALITY = {
  webp: 80,
  avif: 70,
  jpg: 85,
  png: 90,
};

// Crear directorios necesarios
ensureDir(ASSETS_DIR);
ensureDir(IMAGES_DIR);
ensureDir(path.join(IMAGES_DIR, "products"));

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Cliente de Supabase con clave de servicio para operaciones administrativas
let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// Función para crear directorios si no existen
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para generar un hash único para un archivo
function generateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(fileBuffer).digest("hex");
}

// Función para obtener metadatos de una imagen
async function getImageMetadata(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: fs.statSync(filePath).size,
    };
  } catch (error) {
    console.error(`❌ Error al obtener metadatos de ${filePath}:`, error);
    return null;
  }
}

// Función para optimizar una imagen
async function optimizeImage(sourcePath, category, name) {
  try {
    const hash = generateFileHash(sourcePath);
    const metadata = await getImageMetadata(sourcePath);

    if (!metadata) {
      return null;
    }

    // Crear directorio para esta imagen
    const assetDir = path.join(IMAGES_DIR, category, hash);
    ensureDir(assetDir);

    // Información del activo
    const asset = {
      id: hash,
      name: name,
      category: category,
      originalFormat: metadata.format,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      originalSize: metadata.size,
      dateAdded: new Date().toISOString(),
      versions: {},
    };

    // Cargar la imagen con sharp
    const image = sharp(sourcePath);

    // Generar versiones en diferentes formatos y tamaños
    for (const format of FORMATS) {
      asset.versions[format] = {};

      // Versión original (tamaño completo)
      const originalOutputPath = path.join(assetDir, `original.${format}`);

      // Usar los métodos correctos de Sharp según el formato
      if (format === "webp") {
        await image
          .webp({ quality: QUALITY[format] })
          .toFile(originalOutputPath);
      } else if (format === "avif") {
        await image
          .avif({ quality: QUALITY[format] })
          .toFile(originalOutputPath);
      } else if (format === "jpg" || format === "jpeg") {
        await image
          .jpeg({ quality: QUALITY[format] })
          .toFile(originalOutputPath);
      } else if (format === "png") {
        await image
          .png({ quality: QUALITY[format] })
          .toFile(originalOutputPath);
      }

      asset.versions[format].original = {
        path: path.relative(
          path.join(__dirname, "../public"),
          originalOutputPath
        ),
        size: fs.statSync(originalOutputPath).size,
      };

      // Versiones responsive
      for (const width of SIZES.filter((w) => w < metadata.width)) {
        const outputPath = path.join(assetDir, `${width}.${format}`);
        const resizedImage = sharp(await image.resize(width).toBuffer());

        // Usar los métodos correctos de Sharp según el formato
        if (format === "webp") {
          await resizedImage
            .webp({ quality: QUALITY[format] })
            .toFile(outputPath);
        } else if (format === "avif") {
          await resizedImage
            .avif({ quality: QUALITY[format] })
            .toFile(outputPath);
        } else if (format === "jpg" || format === "jpeg") {
          await resizedImage
            .jpeg({ quality: QUALITY[format] })
            .toFile(outputPath);
        } else if (format === "png") {
          await resizedImage
            .png({ quality: QUALITY[format] })
            .toFile(outputPath);
        }

        asset.versions[format][width] = {
          path: path.relative(path.join(__dirname, "../public"), outputPath),
          size: fs.statSync(outputPath).size,
        };
      }

      // Versión placeholder (miniatura para carga progresiva)
      const placeholderPath = path.join(assetDir, `placeholder.${format}`);
      const placeholderImage = sharp(await image.resize(20).blur(5).toBuffer());

      // Usar los métodos correctos de Sharp según el formato
      if (format === "webp") {
        await placeholderImage
          .webp({ quality: QUALITY[format] })
          .toFile(placeholderPath);
      } else if (format === "avif") {
        await placeholderImage
          .avif({ quality: QUALITY[format] })
          .toFile(placeholderPath);
      } else if (format === "jpg" || format === "jpeg") {
        await placeholderImage
          .jpeg({ quality: QUALITY[format] })
          .toFile(placeholderPath);
      } else if (format === "png") {
        await placeholderImage
          .png({ quality: QUALITY[format] })
          .toFile(placeholderPath);
      }

      asset.versions[format].placeholder = {
        path: path.relative(path.join(__dirname, "../public"), placeholderPath),
        size: fs.statSync(placeholderPath).size,
      };
    }

    return asset;
  } catch (error) {
    console.error(`❌ Error al optimizar ${sourcePath}:`, error);
    return null;
  }
}

// Función para actualizar el catálogo
function updateCatalog(asset) {
  try {
    // Cargar catálogo existente o crear uno nuevo
    let catalog = {};
    if (fs.existsSync(CATALOG_FILE)) {
      catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, "utf8"));
    }

    // Añadir o actualizar activo
    catalog[asset.id] = asset;

    // Guardar catálogo
    fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));

    return true;
  } catch (error) {
    console.error("❌ Error al actualizar catálogo:", error);
    return false;
  }
}

// Función para actualizar la base de datos
async function updateDatabase(asset) {
  try {
    if (!supabase) {
      console.warn(
        "⚠️ Cliente de Supabase no configurado, omitiendo actualización de base de datos"
      );
      return false;
    }

    // Verificar si la tabla assets existe
    try {
      // Intentar una consulta simple a la tabla assets
      const { data, error } = await supabase
        .from("assets")
        .select("id")
        .limit(1);

      // Si hay un error y el código es 42P01, la tabla no existe
      if (error && error.code === "42P01") {
        console.warn(
          "⚠️ La tabla assets no existe, omitiendo actualización de base de datos"
        );
        return false;
      }

      // Si hay otro tipo de error, registrarlo pero continuar
      if (error) {
        console.warn(`⚠️ Error al verificar la tabla assets: ${error.message}`);
        return false;
      }

      // Si llegamos aquí, la tabla existe
      return true;
    } catch (error) {
      console.warn("⚠️ Error al verificar la tabla assets:", error);
      return false;
    }

    // Comprobar si el activo ya existe
    const { data, error } = await supabase
      .from("assets")
      .select("id")
      .eq("id", asset.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = No se encontró el registro
      throw error;
    }

    if (data) {
      // Actualizar activo existente
      const { error: updateError } = await supabase
        .from("assets")
        .update(asset)
        .eq("id", asset.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Insertar nuevo activo
      const { error: insertError } = await supabase
        .from("assets")
        .insert(asset);

      if (insertError) {
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error(
      `❌ Error al actualizar base de datos para activo ${asset.id}:`,
      error
    );
    return false;
  }
}

// Función para procesar un activo
async function processAsset(sourcePath, category, name) {
  try {
    console.log(`🔄 Procesando activo: ${name} (${category})`);

    // Optimizar imagen
    const asset = await optimizeImage(sourcePath, category, name);

    if (!asset) {
      console.error(`❌ Error al optimizar activo: ${name}`);
      return null;
    }

    // Actualizar catálogo
    const catalogUpdated = updateCatalog(asset);

    if (!catalogUpdated) {
      console.error(`❌ Error al actualizar catálogo para activo: ${name}`);
    }

    // Actualizar base de datos
    const databaseUpdated = await updateDatabase(asset);

    if (!databaseUpdated) {
      console.warn(
        `⚠️ No se pudo actualizar la base de datos para activo: ${name}`
      );
    }

    console.log(`✅ Activo procesado correctamente: ${name}`);
    return asset;
  } catch (error) {
    console.error(`❌ Error al procesar activo ${name}:`, error);
    return null;
  }
}

// Función principal
async function main() {
  try {
    console.log("🚀 Iniciando sistema de gestión de activos...");

    // Crear directorios necesarios
    ensureDir(ASSETS_DIR);
    ensureDir(IMAGES_DIR);

    // Aquí puedes implementar la lógica para procesar activos específicos
    // o escanear directorios en busca de nuevos activos

    console.log("✅ Sistema de gestión de activos inicializado correctamente");
  } catch (error) {
    console.error("❌ Error al iniciar sistema de gestión de activos:", error);
  }
}

// Exportar funciones para uso en otros scripts
module.exports = {
  processAsset,
  optimizeImage,
  updateCatalog,
  updateDatabase,
  getImageMetadata,
  generateFileHash,
};

// Si se ejecuta directamente, iniciar el sistema
if (require.main === module) {
  main();
}
