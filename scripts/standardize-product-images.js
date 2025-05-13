/**
 * Script para estandarizar nombres de imágenes de productos y actualizar la base de datos
 *
 * Este script:
 * 1. Renombra las imágenes según la convención establecida
 * 2. Actualiza las referencias en la base de datos
 * 3. Genera un registro de los cambios realizados
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Error: Variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridas"
  );
  process.exit(1);
}

// Crear cliente de Supabase con clave de servicio
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Directorio de imágenes de productos
const PRODUCTS_DIR = path.join(__dirname, "../public/images/products");

// Mapeo de marcas para normalizar nombres
const BRAND_MAP = {
  PREMIUM: "premium",
  "PREMIUM-": "premium-",
  EXPRESSION: "expression",
  "EXPRESSION-": "expression-",
  ECOPAINTING: "ecopainting",
  "NEW-HOUSE": "newhouse",
  "FACIL FIX": "facilfix",
  FACIL: "facilfix",
  NEW: "newhouse",
};

// Mapeo de productos para normalizar nombres
const PRODUCT_MAP = {
  LATEXEXT: "latex-exterior",
  LATEXINT: "latex-interior",
  LATEXINTEXT: "latex-multiuso",
  LAVABLE: "lavable",
  SUPERLAVABLE: "superlavable",
  BARNIZALAGUA: "barniz-agua",
  ESMALTEALAGUA: "esmalte-agua",
  FRENTESIMPERMEABILIZANTES: "frentes-impermeabilizantes",
  HIDROLACA: "hidrolaca",
  MEMBRANA: "membrana",
  PISCINAS: "piscinas",
  PISOSDEPORTIVOS: "pisos-deportivos",
  "BARNIZ-MARINO": "barniz-marino",
  "ESMALTE-SINTETICO": "esmalte-sintetico",
  IMPREGNANTE: "impregnante",
  "LATEX-ACRILICO-EXTERIOR": "latex-exterior",
  "LATEX-ACRILICO-INTERIOR": "latex-interior",
  CIELORRASO: "cielorraso",
  ENDUIDO: "enduido",
  FIBRADO: "fibrado",
  FIJADOR: "fijador",
  IMPRIMACION: "imprimacion",
  "LADRILLO-VISTO": "ladrillo-visto",
  "MASILLA-PARA-YESO": "masilla-yeso",
  "EXTERIOR BLANCO": "exterior-blanco",
  "EXTERIOR GRIS": "exterior-gris",
  "INTERIOR BLANCO": "interior-blanco",
  MICROCEMENTO: "microcemento",
};

// Función para normalizar un nombre de archivo
function normalizeFileName(filename) {
  // Obtener nombre base y extensión
  const ext = path.extname(filename).toLowerCase();
  let basename = path.basename(filename, ext);

  // Eliminar números y caracteres especiales al final
  basename = basename.replace(/-\d+$/, "").replace(/\s+\d+$/, "");

  // Identificar marca y producto
  let brand = "";
  let product = "";

  // Buscar marca en el nombre
  for (const [brandKey, brandValue] of Object.entries(BRAND_MAP)) {
    if (basename.startsWith(brandKey)) {
      brand = brandValue;
      basename = basename.replace(brandKey, "").trim();
      break;
    }
  }

  // Si no se encontró marca, usar la primera palabra
  if (!brand) {
    const parts = basename.split(/[\s-]+/);
    brand = parts[0].toLowerCase();
    basename = parts.slice(1).join("-");
  }

  // Buscar producto en el nombre
  for (const [productKey, productValue] of Object.entries(PRODUCT_MAP)) {
    if (basename.includes(productKey)) {
      product = productValue;
      basename = basename.replace(productKey, "").trim();
      break;
    }
  }

  // Si no se encontró producto, usar el resto del nombre
  if (!product) {
    product = basename.toLowerCase().replace(/\s+/g, "-");
  }

  // Eliminar guiones al inicio y final
  product = product.replace(/^-+|-+$/g, "");

  // Construir nuevo nombre
  let newName = brand;
  if (product) {
    newName += "-" + product;
  }

  // Agregar variante si existe
  if (basename && !basename.match(/^[-\s]*$/)) {
    const variant = basename
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (variant) {
      newName += "-" + variant;
    }
  }

  // Eliminar guiones múltiples
  newName = newName.replace(/-+/g, "-");

  // Agregar extensión
  return newName + ext;
}

// Función para renombrar un archivo
function renameFile(oldPath, newPath) {
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(oldPath)) {
      console.error(`❌ El archivo ${oldPath} no existe`);
      return false;
    }

    // Verificar que el directorio de destino existe
    const newDir = path.dirname(newPath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Verificar que el archivo de destino no existe o es el mismo archivo
    if (fs.existsSync(newPath) && oldPath !== newPath) {
      console.error(`❌ El archivo ${newPath} ya existe`);
      return false;
    }

    // Si es el mismo archivo, no hacer nada
    if (oldPath === newPath) {
      console.log(
        `✅ El archivo ${path.basename(oldPath)} ya tiene el nombre correcto`
      );
      return true;
    }

    // Renombrar el archivo
    fs.renameSync(oldPath, newPath);
    console.log(
      `✅ Renombrado: ${path.basename(oldPath)} -> ${path.basename(newPath)}`
    );
    return true;
  } catch (error) {
    console.error(`Error al renombrar ${oldPath} a ${newPath}:`, error);
    return false;
  }
}

// Función para actualizar referencias en la base de datos
async function updateDatabaseReferences(oldRelativePath, newRelativePath) {
  try {
    console.log(
      `🔄 Actualizando referencia en la base de datos: ${oldRelativePath} -> ${newRelativePath}`
    );

    // Actualizar referencias en la tabla products
    const { data, error } = await supabase
      .from("products")
      .update({ image_url: newRelativePath })
      .eq("image_url", oldRelativePath);

    if (error) {
      console.error(
        `Error al actualizar referencias en la base de datos:`,
        error
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `Error al actualizar referencias en la base de datos:`,
      error
    );
    return false;
  }
}

// Función principal
async function standardizeProductImages() {
  try {
    console.log("🔄 Estandarizando nombres de imágenes de productos...");

    // Obtener todos los archivos en el directorio de productos
    const files = fs.readdirSync(PRODUCTS_DIR);

    // Filtrar solo imágenes
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"].includes(ext);
    });

    console.log(`🖼️ Encontradas ${imageFiles.length} imágenes`);

    // Crear un registro de cambios
    const changes = [];

    // Procesar cada imagen
    for (const file of imageFiles) {
      const oldPath = path.join(PRODUCTS_DIR, file);
      const newFileName = normalizeFileName(file);
      const newPath = path.join(PRODUCTS_DIR, newFileName);

      // Renombrar el archivo
      const renamed = renameFile(oldPath, newPath);

      if (renamed) {
        // Convertir rutas a formato relativo para la base de datos
        const oldRelativePath = `/images/products/${file}`;
        const newRelativePath = `/images/products/${newFileName}`;

        // Actualizar referencias en la base de datos
        const updated = await updateDatabaseReferences(
          oldRelativePath,
          newRelativePath
        );

        changes.push({
          oldName: file,
          newName: newFileName,
          oldPath: oldRelativePath,
          newPath: newRelativePath,
          databaseUpdated: updated,
        });
      }
    }

    // Generar registro de cambios
    const changesPath = path.join(
      __dirname,
      "../standardized-product-images.json"
    );
    fs.writeFileSync(changesPath, JSON.stringify(changes, null, 2));

    console.log(`\n📊 Resumen:`);
    console.log(
      `✅ Se procesaron ${changes.length} de ${imageFiles.length} imágenes`
    );
    console.log(`📄 Se ha generado un registro de cambios en ${changesPath}`);
  } catch (error) {
    console.error("Error durante la estandarización:", error);
  }
}

// Ejecutar directamente para este caso específico
console.log(
  "⚠️ ADVERTENCIA: Este script renombrará archivos y actualizará la base de datos."
);
console.log(
  "⚠️ Se está ejecutando automáticamente como parte del proceso de actualización."
);
console.log("");

// Ejecutar la función principal
standardizeProductImages();
