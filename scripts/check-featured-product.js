#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 Verificando producto destacado en Supabase...\n");

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("❌ Variables de entorno de Supabase no configuradas");
  console.log(
    "   NEXT_PUBLIC_SUPABASE_URL:",
    supabaseUrl ? "✅ Configurada" : "❌ Faltante"
  );
  console.log(
    "   SUPABASE_SERVICE_ROLE_KEY:",
    supabaseServiceKey ? "✅ Configurada" : "❌ Faltante"
  );
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkFeaturedProduct() {
  try {
    console.log("📊 Verificando acceso a la tabla products...");

    // 1. Intentar acceder directamente a la tabla products
    const { data: testProducts, error: testError } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    if (testError) {
      console.log(
        "❌ Error accediendo a la tabla products:",
        testError.message
      );
      console.log("   Código:", testError.code);
      console.log("   Detalles:", testError.details);
      return;
    }

    console.log("✅ La tabla products es accesible");

    // 2. Intentar buscar productos con diferentes campos
    console.log('\n🔍 Buscando productos con badge="featured"...');

    const { data: featuredByBadge, error: badgeError } = await supabase
      .from("products")
      .select("id, name, slug, badge")
      .eq("badge", "featured");

    if (badgeError) {
      if (badgeError.code === "42703") {
        console.log('❌ El campo "badge" no existe en la tabla products');
      } else {
        console.log("❌ Error buscando por badge:", badgeError.message);
      }
    } else {
      console.log(
        `✅ Búsqueda por badge exitosa. Productos encontrados: ${featuredByBadge.length}`
      );
      if (featuredByBadge.length > 0) {
        featuredByBadge.forEach((product) => {
          console.log(`   - ${product.name} (${product.slug})`);
        });
      }
    }

    // 3. Intentar buscar productos con is_featured
    console.log("\n🔍 Buscando productos con is_featured=true...");

    const { data: featuredByFlag, error: flagError } = await supabase
      .from("products")
      .select("id, name, slug, is_featured")
      .eq("is_featured", true);

    if (flagError) {
      if (flagError.code === "42703") {
        console.log('❌ El campo "is_featured" no existe en la tabla products');
      } else {
        console.log("❌ Error buscando por is_featured:", flagError.message);
      }
    } else {
      console.log(
        `✅ Búsqueda por is_featured exitosa. Productos encontrados: ${featuredByFlag.length}`
      );
      if (featuredByFlag.length > 0) {
        featuredByFlag.forEach((product) => {
          console.log(`   - ${product.name} (${product.slug})`);
        });
      }
    }

    // 4. Contar productos totales
    const { count: totalProducts, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.log("❌ Error contando productos:", countError.message);
      return;
    }

    console.log(`\n📦 Total de productos: ${totalProducts}`);

    // 5. Buscar productos con badge='featured'
    if (hasBadgeField) {
      const { data: featuredProducts, error: featuredError } = await supabase
        .from("products")
        .select(
          `
          id, name, slug, badge,
          brand:brands(id, name, slug, logo_url)
        `
        )
        .eq("badge", "featured");

      if (featuredError) {
        console.log(
          "❌ Error buscando productos destacados:",
          featuredError.message
        );
        return;
      }

      console.log(
        `\n⭐ Productos con badge='featured': ${featuredProducts.length}`
      );

      if (featuredProducts.length > 0) {
        featuredProducts.forEach((product) => {
          console.log(
            `   ✅ ${product.name} (${product.slug}) - Marca: ${
              product.brand?.name || "Sin marca"
            }`
          );
        });
      } else {
        console.log('   ❌ No se encontraron productos con badge="featured"');

        // Sugerir productos existentes
        const { data: allProducts, error: allError } = await supabase
          .from("products")
          .select("id, name, slug, badge")
          .limit(5);

        if (!allError && allProducts.length > 0) {
          console.log("\n💡 Productos existentes (primeros 5):");
          allProducts.forEach((product) => {
            console.log(
              `   - ${product.name} (badge: ${product.badge || "null"})`
            );
          });
        }
      }
    }

    // 6. Verificar tabla brands
    const { data: brands, error: brandsError } = await supabase
      .from("brands")
      .select("id, name, slug, logo_url")
      .limit(5);

    if (brandsError) {
      console.log("\n❌ Error verificando marcas:", brandsError.message);
    } else {
      console.log(`\n🏢 Marcas disponibles: ${brands.length}`);
      brands.forEach((brand) => {
        console.log(
          `   - ${brand.name} (${brand.slug}) - Logo: ${
            brand.logo_url ? "✅" : "❌"
          }`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error general:", error);
  }
}

// Función para crear un producto destacado de ejemplo
async function createFeaturedProduct() {
  try {
    console.log("\n🔧 ¿Deseas crear un producto destacado de ejemplo? (y/N)");

    // En un entorno real, aquí podrías usar readline para input del usuario
    // Por ahora, solo mostramos el SQL que se necesitaría

    console.log(
      "\n📝 Para crear un producto destacado, ejecuta este SQL en Supabase:"
    );
    console.log(`
-- Primero, verificar si existe una marca
SELECT id, name FROM brands LIMIT 1;

-- Luego, crear o actualizar un producto como destacado
INSERT INTO products (
  slug, name, description, image_url, badge, brand_id
) VALUES (
  'producto-destacado',
  'Producto Destacado +COLOR',
  'Nuestro producto más popular para proyectos de construcción',
  '/images/products/premium-lavable-super.png',
  'featured',
  (SELECT id FROM brands LIMIT 1)
) ON CONFLICT (slug) DO UPDATE SET
  badge = 'featured';
    `);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Ejecutar verificación
checkFeaturedProduct().then(() => {
  createFeaturedProduct();
});
