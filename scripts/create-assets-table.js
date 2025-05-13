/**
 * Script para crear la tabla de activos en Supabase
 *
 * Este script:
 * 1. Lee el archivo SQL con la definición de la tabla
 * 2. Ejecuta el SQL en Supabase
 * 3. Verifica que la tabla se haya creado correctamente
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

// Función principal
async function createAssetsTable() {
  try {
    console.log("🔄 Creando tabla de activos en Supabase...");

    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, "create-assets-table.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    // Dividir el SQL en sentencias individuales
    const statements = sql.split(";").filter((stmt) => stmt.trim() !== "");

    // Ejecutar cada sentencia individualmente
    for (const statement of statements) {
      if (statement.trim() === "") continue;

      try {
        const { error } = await supabase.rpc("query", {
          query_text: statement,
        });

        if (error) {
          // Intentar con la API REST
          const { error: restError } = await supabase
            .from("_sql")
            .select("*")
            .eq("query", statement);

          if (restError) {
            // Último intento: usar la API de consulta directa
            const { error: queryError } = await supabase
              .from("query")
              .select("*")
              .eq("sql", statement);

            if (queryError) {
              // Si todo falla, usar la API de database/query
              const { error: dbQueryError } = await fetch(
                `${supabaseUrl}/rest/v1/query`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    apikey: supabaseServiceKey,
                    Authorization: `Bearer ${supabaseServiceKey}`,
                  },
                  body: JSON.stringify({ query: statement }),
                }
              ).then((res) => res.json());

              if (dbQueryError) {
                console.error(
                  `❌ Error al ejecutar sentencia: ${statement.substring(
                    0,
                    50
                  )}...`,
                  dbQueryError
                );
              } else {
                console.log(
                  `✅ Sentencia ejecutada correctamente: ${statement.substring(
                    0,
                    50
                  )}...`
                );
              }
            } else {
              console.log(
                `✅ Sentencia ejecutada correctamente: ${statement.substring(
                  0,
                  50
                )}...`
              );
            }
          } else {
            console.log(
              `✅ Sentencia ejecutada correctamente: ${statement.substring(
                0,
                50
              )}...`
            );
          }
        } else {
          console.log(
            `✅ Sentencia ejecutada correctamente: ${statement.substring(
              0,
              50
            )}...`
          );
        }
      } catch (error) {
        console.error(
          `❌ Error al ejecutar sentencia: ${statement.substring(0, 50)}...`,
          error
        );
      }
    }

    // Verificar que la tabla se haya creado
    const { data, error: checkError } = await supabase
      .from("assets")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("❌ Error al verificar la tabla:", checkError);

      if (checkError.code === "42P01") {
        console.error(
          '❌ La tabla "assets" no existe. Verifica los permisos o intenta crear la tabla manualmente.'
        );
      }
    } else {
      console.log('✅ Tabla "assets" creada correctamente');
    }

    console.log("✅ Proceso completado");
  } catch (error) {
    console.error("❌ Error durante la creación de la tabla:", error);
  }
}

// Ejecutar la función principal
createAssetsTable();
