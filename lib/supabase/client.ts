import { createClient } from '@supabase/supabase-js';

// Estas variables de entorno deben estar definidas en el archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
};
