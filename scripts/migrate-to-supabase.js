/**
 * Script para migrar datos estáticos a Supabase
 *
 * Este script:
 * 1. Valida que las imágenes referenciadas existan
 * 2. Inserta categorías en la tabla 'categories'
 * 3. Inserta marcas en la tabla 'brands'
 * 4. Inserta productos en la tabla 'products'
 *
 * Uso:
 * 1. Configurar las variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY
 * 2. Ejecutar: node scripts/migrate-to-supabase.js
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

// Datos de categorías
const categories = [
  {
    slug: "especiales",
    name: "Especiales",
    description: "Productos especiales para necesidades específicas",
    icon: "Droplet",
  },
  {
    slug: "exteriores",
    name: "Para Exteriores",
    description: "Pinturas y revestimientos para uso exterior",
    icon: "Building",
  },
  {
    slug: "interiores",
    name: "Para Interiores",
    description: "Pinturas y revestimientos para uso interior",
    icon: "Home",
  },
  {
    slug: "recubrimientos",
    name: "Recubrimientos",
    description: "Revestimientos texturados y especiales",
    icon: "Layers",
  },
];

// Datos de marcas
const brands = [
  {
    slug: "facilfix",
    name: "Facilfix",
    description: "Línea de productos para reparación y construcción",
    logo_url: "/images/logos/facilfix.svg",
  },
  {
    slug: "ecopainting",
    name: "Ecopainting",
    description: "Pinturas ecológicas de alta calidad",
    logo_url: "/images/logos/ecopainting.svg",
  },
  {
    slug: "newhouse",
    name: "Newhouse",
    description: "Productos para protección y renovación",
    logo_url: "/images/logos/newhouse.svg",
  },
  {
    slug: "premium",
    name: "Premium",
    description: "Línea premium de pinturas y revestimientos",
    logo_url: "/images/logos/premium.svg",
  },
  {
    slug: "expression",
    name: "Expression",
    description: "Productos para expresar tu estilo",
    logo_url: "/images/logos/expression.svg",
  },
];

// Datos de productos
const products = [
  {
    slug: "latex-exterior-premium",
    name: "Látex Exterior Premium",
    description:
      "Pintura de alta calidad para exteriores con máxima resistencia a la intemperie.",
    price: 7500,
    image_url: "/images/products/PREMIUM-LATEXEXT.png",
    category_slug: "exteriores",
    brand_slug: "premium",
    badge: "bestseller",
    icon: "exterior",
    coverage: 10,
    coats: 2,
  },
  {
    slug: "latex-interior-expression",
    name: "Látex Interior Expression",
    description:
      "Pintura acrílica para interiores con excelente rendimiento y acabado.",
    price: 6200,
    image_url: "/images/products/EXPRESSION-LATEX-ACRILICO-INTERIOR-1.png",
    category_slug: "interiores",
    brand_slug: "expression",
    badge: "featured",
    icon: "interior",
    coverage: 12,
    coats: 2,
  },
  {
    slug: "microcemento-facilfix",
    name: "Microcemento Facilfix",
    description: "Revestimiento de microcemento para pisos y paredes.",
    price: 8900,
    image_url: "/images/products/FACIL FIX MICROCEMENTO.png",
    category_slug: "recubrimientos",
    brand_slug: "facilfix",
    badge: "new",
    icon: "concrete",
    coverage: 8,
    coats: 3,
  },
  {
    slug: "membrana-liquida-ecopainting",
    name: "Membrana Líquida Ecopainting",
    description: "Impermeabilizante ecológico para techos y terrazas.",
    price: 9500,
    image_url: "/images/products/ECOPAINTINGMEMBRANA.png",
    category_slug: "especiales",
    brand_slug: "ecopainting",
    badge: "featured",
    icon: "waterproof",
    coverage: 6,
    coats: 2,
  },
  {
    slug: "barniz-marino-newhouse",
    name: "Barniz Marino Newhouse",
    description:
      "Barniz de alta resistencia para maderas expuestas a la intemperie.",
    price: 5800,
    image_url: "/images/products/NEW-HOUSE-BARNIZ-MARINO.png",
    category_slug: "especiales",
    brand_slug: "newhouse",
    badge: "bestseller",
    icon: "wood",
    coverage: 14,
    coats: 3,
  },
];

// Función para verificar si una imagen existe
function imageExists(imagePath) {
  // Convertir ruta relativa a absoluta
  const absolutePath = path.join(
    __dirname,
    "../public",
    imagePath.replace(/^\//, "")
  );
  return fs.existsSync(absolutePath);
}

// Función para validar imágenes de productos
function validateProductImages() {
  console.log("🔍 Validando imágenes de productos...");

  const missingImages = [];

  // Verificar imágenes de marcas
  for (const brand of brands) {
    if (!imageExists(brand.logo_url)) {
      missingImages.push({
        type: "brand",
        name: brand.name,
        path: brand.logo_url,
      });
      console.log(
        `❌ Imagen de marca faltante: ${brand.logo_url} (${brand.name})`
      );
    }
  }

  // Verificar imágenes de productos
  for (const product of products) {
    if (!imageExists(product.image_url)) {
      missingImages.push({
        type: "product",
        name: product.name,
        path: product.image_url,
      });
      console.log(
        `❌ Imagen de producto faltante: ${product.image_url} (${product.name})`
      );
    }
  }

  // Mostrar resumen
  if (missingImages.length > 0) {
    console.log(
      `\n⚠️ Se encontraron ${missingImages.length} imágenes faltantes`
    );
    console.log("⚠️ Se recomienda corregir las rutas antes de continuar");

    // Preguntar si desea continuar
    return false;
  }

  console.log("✅ Todas las imágenes existen");
  return true;
}

// Función principal para migrar datos
async function migrateData() {
  try {
    console.log("Iniciando migración de datos a Supabase...");

    // 1. Validar imágenes
    console.log("\n🔍 Paso 1: Validación de imágenes");
    const imagesValid = validateProductImages();

    if (!imagesValid) {
      console.log(
        "\n⚠️ Se encontraron imágenes faltantes. ¿Desea continuar de todos modos? (s/N)"
      );
      process.stdin.once("data", (data) => {
        const input = data.toString().trim().toLowerCase();
        if (
          input === "s" ||
          input === "si" ||
          input === "y" ||
          input === "yes"
        ) {
          console.log("Continuando con la migración...\n");
          continueWithMigration();
        } else {
          console.log("Migración cancelada");
          process.exit(0);
        }
      });
    } else {
      continueWithMigration();
    }
  } catch (error) {
    console.error("Error durante la migración:", error);
    process.exit(1);
  }
}

// Función para continuar con la migración después de la validación
async function continueWithMigration() {
  try {
    // 2. Insertar categorías
    console.log("Insertando categorías...");
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .upsert(categories, { onConflict: "slug" })
      .select();

    if (categoriesError) {
      throw categoriesError;
    }
    console.log(`✅ ${categoriesData.length} categorías insertadas`);

    // 2. Insertar marcas
    console.log("Insertando marcas...");
    const { data: brandsData, error: brandsError } = await supabase
      .from("brands")
      .upsert(brands, { onConflict: "slug" })
      .select();

    if (brandsError) {
      throw brandsError;
    }
    console.log(`✅ ${brandsData.length} marcas insertadas`);

    // 3. Obtener IDs de categorías y marcas
    const { data: categoriesMap } = await supabase
      .from("categories")
      .select("id, slug");

    const { data: brandsMap } = await supabase
      .from("brands")
      .select("id, slug");

    // Crear mapeos para búsqueda rápida
    const categoryIdBySlug = Object.fromEntries(
      (categoriesMap || []).map((cat) => [cat.slug, cat.id])
    );

    const brandIdBySlug = Object.fromEntries(
      (brandsMap || []).map((brand) => [brand.slug, brand.id])
    );

    // 4. Preparar productos para inserción
    const productsToInsert = products.map((product) => ({
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category_id: categoryIdBySlug[product.category_slug],
      brand_id: brandIdBySlug[product.brand_slug],
      badge: product.badge,
      icon: product.icon,
      coverage: product.coverage,
      coats: product.coats,
    }));

    // 5. Insertar productos
    console.log("Insertando productos...");
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .upsert(productsToInsert, { onConflict: "slug" })
      .select();

    if (productsError) {
      throw productsError;
    }
    console.log(`✅ ${productsData.length} productos insertados`);

    console.log("Migración completada con éxito!");
  } catch (error) {
    console.error("Error durante la migración:", error);
    process.exit(1);
  }
}

// Ejecutar la migración
migrateData();
