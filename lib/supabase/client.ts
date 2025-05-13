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
    }

    console.log("🔄 Creando cliente de Supabase con URL:", supabaseUrl);

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    console.log("✅ Cliente de Supabase creado");
  }
  return supabaseClient;
};
