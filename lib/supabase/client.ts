import { createClient } from "@supabase/supabase-js";

// Estas variables de entorno deben estar definidas en el archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Singleton para el cliente de Supabase
let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Obtiene una instancia del cliente de Supabase
 * Si no existe, crea una nueva instancia
 *
 * @returns Cliente de Supabase
 */
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    try {
      // Verificar que las variables de entorno estén definidas
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error(
          "❌ Error: Variables de entorno de Supabase no configuradas"
        );
        console.error(
          "NEXT_PUBLIC_SUPABASE_URL:",
          supabaseUrl ? "Definida" : "No definida"
        );
        console.error(
          "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
          supabaseAnonKey ? "Definida" : "No definida"
        );

        // Crear un cliente con valores vacíos para evitar errores en tiempo de ejecución
        // Esto permitirá que la aplicación siga funcionando con datos de respaldo
        supabaseClient = createClient(
          "https://placeholder.supabase.co",
          "placeholder-key",
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          }
        );

        console.warn(
          "⚠️ Se ha creado un cliente de Supabase con valores de placeholder. La aplicación usará datos de respaldo."
        );
        return supabaseClient;
      }

      console.log("🔄 Creando cliente de Supabase con URL:", supabaseUrl);

      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });

      console.log("✅ Cliente de Supabase creado correctamente");
    } catch (error) {
      console.error("❌ Error al crear el cliente de Supabase:", error);

      // Crear un cliente con valores vacíos para evitar errores en tiempo de ejecución
      supabaseClient = createClient(
        "https://placeholder.supabase.co",
        "placeholder-key",
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

      console.warn(
        "⚠️ Se ha creado un cliente de Supabase con valores de placeholder debido a un error. La aplicación usará datos de respaldo."
      );
    }
  }
  return supabaseClient;
};
