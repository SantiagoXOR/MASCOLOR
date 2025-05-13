/**
 * Script para verificar las variables de entorno de Supabase
 * 
 * Este script verifica que las variables de entorno necesarias para
 * conectarse a Supabase estén correctamente configuradas.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Verificar si existe el archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
console.log(`Verificando archivo .env.local en: ${envPath}`);

if (!fileExists(envPath)) {
  console.error('❌ Error: No se encontró el archivo .env.local');
  console.log('Por favor, crea un archivo .env.local con las siguientes variables:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase');
  process.exit(1);
}

console.log('✅ Archivo .env.local encontrado');

// Verificar las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\nVerificando variables de entorno:');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Definida' : '❌ No definida'}`);
if (supabaseUrl) {
  console.log(`  Valor: ${supabaseUrl}`);
}

console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Definida' : '❌ No definida'}`);
if (supabaseAnonKey) {
  // Mostrar solo los primeros y últimos caracteres por seguridad
  const maskedKey = supabaseAnonKey.substring(0, 5) + '...' + supabaseAnonKey.substring(supabaseAnonKey.length - 5);
  console.log(`  Valor: ${maskedKey}`);
}

// Verificar si las variables están vacías
if (supabaseUrl === '') {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL está definida pero vacía');
}

if (supabaseAnonKey === '') {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY está definida pero vacía');
}

// Verificar formato de URL
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL debe comenzar con https://');
}

// Resumen
console.log('\nResumen:');
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '' && supabaseUrl.startsWith('https://')) {
  console.log('✅ Variables de entorno de Supabase correctamente configuradas');
} else {
  console.error('❌ Hay problemas con las variables de entorno de Supabase');
  console.log('\nPor favor, asegúrate de que el archivo .env.local contenga:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima');
}
