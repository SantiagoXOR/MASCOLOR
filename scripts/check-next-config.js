/**
 * Script para verificar la configuración de Next.js
 * 
 * Este script verifica que la configuración de Next.js sea correcta
 * y que las variables de entorno estén correctamente configuradas.
 */

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

// Función para leer un archivo
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error al leer el archivo ${filePath}:`, error);
    return null;
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

// Leer el archivo .env.local
const envContent = readFile(envPath);
if (!envContent) {
  console.error('❌ Error: No se pudo leer el archivo .env.local');
  process.exit(1);
}

// Verificar las variables de entorno
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const supabaseAnonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

console.log('\nVerificando variables de entorno en .env.local:');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrlMatch ? '✅ Definida' : '❌ No definida'}`);
if (supabaseUrlMatch) {
  const supabaseUrl = supabaseUrlMatch[1].trim();
  console.log(`  Valor: ${supabaseUrl}`);
  
  if (!supabaseUrl.startsWith('https://')) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL debe comenzar con https://');
  }
}

console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKeyMatch ? '✅ Definida' : '❌ No definida'}`);
if (supabaseAnonKeyMatch) {
  const supabaseAnonKey = supabaseAnonKeyMatch[1].trim();
  // Mostrar solo los primeros y últimos caracteres por seguridad
  const maskedKey = supabaseAnonKey.substring(0, 5) + '...' + supabaseAnonKey.substring(supabaseAnonKey.length - 5);
  console.log(`  Valor: ${maskedKey}`);
}

// Verificar el archivo next.config.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
console.log(`\nVerificando archivo next.config.js en: ${nextConfigPath}`);

if (!fileExists(nextConfigPath)) {
  console.error('❌ Error: No se encontró el archivo next.config.js');
  process.exit(1);
}

console.log('✅ Archivo next.config.js encontrado');

// Leer el archivo next.config.js
const nextConfigContent = readFile(nextConfigPath);
if (!nextConfigContent) {
  console.error('❌ Error: No se pudo leer el archivo next.config.js');
  process.exit(1);
}

// Verificar la configuración de Next.js
console.log('\nVerificando configuración de Next.js:');

// Verificar si se están exponiendo las variables de entorno
const envExposed = nextConfigContent.includes('env:') || 
                  nextConfigContent.includes('publicRuntimeConfig:') || 
                  nextConfigContent.includes('serverRuntimeConfig:');

console.log(`Exposición de variables de entorno: ${envExposed ? '✅ Configurada' : '⚠️ No configurada'}`);

// Verificar si se está utilizando webpack
const webpackConfigured = nextConfigContent.includes('webpack:');
console.log(`Configuración de webpack: ${webpackConfigured ? '✅ Configurada' : '⚠️ No configurada'}`);

// Verificar si se está utilizando imágenes
const imagesConfigured = nextConfigContent.includes('images:');
console.log(`Configuración de imágenes: ${imagesConfigured ? '✅ Configurada' : '⚠️ No configurada'}`);

// Resumen
console.log('\nResumen:');
if (supabaseUrlMatch && supabaseAnonKeyMatch) {
  console.log('✅ Variables de entorno de Supabase correctamente configuradas en .env.local');
} else {
  console.error('❌ Hay problemas con las variables de entorno de Supabase en .env.local');
}

// Sugerencias
console.log('\nSugerencias:');
if (!envExposed) {
  console.log('- Considera exponer las variables de entorno en next.config.js:');
  console.log(`
  module.exports = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    // ... resto de la configuración
  };
  `);
}

if (!imagesConfigured) {
  console.log('- Considera configurar el módulo de imágenes en next.config.js:');
  console.log(`
  module.exports = {
    images: {
      domains: ['hffupqoqbjhehedtemvl.supabase.co'],
    },
    // ... resto de la configuración
  };
  `);
}
