/**
 * Script para probar la conexión a Supabase
 *
 * Este script verifica que la conexión a Supabase funcione correctamente,
 * utilizando tanto la clave anónima como la clave de servicio.
 */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log("🔍 Verificando configuración de Supabase...");
console.log(`URL: ${supabaseUrl ? "✅ Configurada" : "❌ No configurada"}`);
console.log(
  `Clave anónima: ${supabaseAnonKey ? "✅ Configurada" : "❌ No configurada"}`
);
console.log(
  `Clave de servicio: ${
    supabaseServiceKey ? "✅ Configurada" : "❌ No configurada"
  }`
);

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error("❌ Error: Faltan variables de entorno de Supabase");
  console.error(
    "Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY y SUPABASE_SERVICE_KEY en .env.local"
  );
  process.exit(1);
}

// Crear clientes de Supabase
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

// Función para probar la conexión con la clave anónima
async function testAnonConnection() {
  try {
    console.log("\n🔍 Probando conexión con clave anónima...");

    // Intentar obtener la versión de PostgreSQL
    const { data, error } = await supabaseAnon
      .from("_supabase_version")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      // Si la tabla _supabase_version no existe, intentar con otra consulta
      console.log(
        "⚠️ No se pudo consultar _supabase_version, intentando con health check..."
      );

      const healthCheck = await supabaseAnon.auth.getSession();

      if (healthCheck.error) {
        console.error(
          "❌ Error al conectar con clave anónima:",
          healthCheck.error
        );
        return false;
      }

      console.log("✅ Conexión con clave anónima exitosa (auth health check)");
      return true;
    }

    console.log("✅ Conexión con clave anónima exitosa");
    console.log("Información de versión:", data);
    return true;
  } catch (error) {
    console.error("❌ Error al probar conexión con clave anónima:", error);
    return false;
  }
}

// Función para probar la conexión con la clave de servicio
async function testServiceConnection() {
  try {
    console.log("\n🔍 Probando conexión con clave de servicio...");

    // Intentar listar las tablas del esquema público
    const { data, error } = await supabaseService
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .limit(5);

    if (error) {
      // Si no se puede acceder a pg_tables, intentar con otra consulta
      console.log(
        "⚠️ No se pudo consultar pg_tables, intentando con health check..."
      );

      const healthCheck = await supabaseService.auth.getSession();

      if (healthCheck.error) {
        console.error(
          "❌ Error al conectar con clave de servicio:",
          healthCheck.error
        );
        return false;
      }

      console.log(
        "✅ Conexión con clave de servicio exitosa (auth health check)"
      );
      return true;
    }

    console.log("✅ Conexión con clave de servicio exitosa");
    console.log("Tablas encontradas:", data.length);
    data.forEach((table) => console.log(`   - ${table.tablename}`));
    return true;
  } catch (error) {
    console.error("❌ Error al probar conexión con clave de servicio:", error);
    return false;
  }
}

// Función para listar tablas disponibles
async function listTables() {
  try {
    console.log("\n🔍 Listando tablas disponibles...");

    // Consultar la vista de información del esquema para obtener las tablas
    const { data, error } = await supabaseService
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (error) {
      console.error("❌ Error al listar tablas:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("⚠️ No se encontraron tablas en el esquema público");
      return;
    }

    console.log("📊 Tablas disponibles:");
    data.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
  } catch (error) {
    console.error("❌ Error al listar tablas:", error);
  }
}

// Función para probar una consulta simple a cada tabla
async function testQueries() {
  try {
    console.log("\n🔍 Probando consultas simples...");

    // Lista de tablas a probar
    const tables = ["products", "categories", "brands", "assets"];

    for (const table of tables) {
      console.log(`\n🔍 Probando consulta a tabla: ${table}`);

      // Intentar obtener un registro de la tabla
      const { data, error } = await supabaseService
        .from(table)
        .select("*")
        .limit(1);

      if (error) {
        console.error(`❌ Error al consultar tabla ${table}:`, error);
        continue;
      }

      if (!data || data.length === 0) {
        console.log(`⚠️ No se encontraron registros en la tabla ${table}`);
        continue;
      }

      console.log(`✅ Consulta a tabla ${table} exitosa`);
      console.log(`Ejemplo de registro:`, data[0]);
    }
  } catch (error) {
    console.error("❌ Error al probar consultas:", error);
  }
}

// Función principal
async function testSupabaseConnection() {
  try {
    const anonConnected = await testAnonConnection();
    const serviceConnected = await testServiceConnection();

    if (anonConnected && serviceConnected) {
      await listTables();
      await testQueries();

      console.log("\n✅ Prueba de conexión a Supabase completada con éxito");
    } else {
      console.error("\n❌ Prueba de conexión a Supabase fallida");
    }
  } catch (error) {
    console.error("❌ Error al probar conexión a Supabase:", error);
  }
}

// Ejecutar la función principal
testSupabaseConnection();
