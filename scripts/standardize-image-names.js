/**
 * Script para estandarizar los nombres de archivos de imágenes en el proyecto +COLOR
 * 
 * Este script:
 * 1. Normaliza los nombres de archivos de imágenes (todos en minúsculas)
 * 2. Actualiza las referencias en la base de datos de Supabase
 * 3. Genera un informe de los cambios realizados
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración
const IMAGES_DIR = path.join(__dirname, '../public/images/products');
const REPORT_FILE = path.join(__dirname, '../reports/image-standardization-report.json');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY en .env.local');
  process.exit(1);
}

// Cliente de Supabase con clave de servicio para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para crear directorios si no existen
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para normalizar un nombre de archivo
function normalizeFileName(filename) {
  // Obtener nombre base y extensión
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext).toLowerCase();
  
  // Reemplazar espacios por guiones
  const normalized = basename.replace(/\s+/g, '-');
  
  // Devolver nombre normalizado con extensión en minúsculas
  return `${normalized}${ext}`;
}

// Función para renombrar un archivo
function renameFile(oldPath, newPath) {
  try {
    // Si el archivo ya tiene el nombre correcto, no hacer nada
    if (oldPath === newPath) {
      return { success: true, skipped: true };
    }
    
    // Si el archivo de destino ya existe, no sobrescribir
    if (fs.existsSync(newPath)) {
      console.warn(`⚠️ No se puede renombrar ${oldPath} a ${newPath} porque el destino ya existe`);
      return { success: false, error: 'El archivo de destino ya existe' };
    }
    
    // Renombrar el archivo
    fs.renameSync(oldPath, newPath);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error al renombrar ${oldPath}:`, error);
    return { success: false, error: error.message };
  }
}

// Función para actualizar referencias en la base de datos
async function updateDatabaseReferences(oldPath, newPath) {
  try {
    // Convertir rutas a formato relativo para la base de datos
    const oldRelativePath = `/images/products/${path.basename(oldPath)}`;
    const newRelativePath = `/images/products/${path.basename(newPath)}`;
    
    // Actualizar referencias en la tabla de productos
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: newRelativePath })
      .eq('image_url', oldRelativePath);
    
    if (error) {
      console.error(`❌ Error al actualizar referencias en la base de datos:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true, updatedCount: data ? data.length : 0 };
  } catch (error) {
    console.error(`❌ Error al actualizar referencias en la base de datos:`, error);
    return { success: false, error: error.message };
  }
}

// Función principal
async function standardizeImageNames() {
  try {
    console.log('🔄 Estandarizando nombres de archivos de imágenes...');
    
    // Asegurarse de que el directorio de informes existe
    ensureDir(path.dirname(REPORT_FILE));
    
    // Obtener todos los archivos en el directorio de imágenes
    const files = fs.readdirSync(IMAGES_DIR);
    
    // Filtrar solo imágenes
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext);
    });
    
    console.log(`🖼️ Encontradas ${imageFiles.length} imágenes`);
    
    // Crear un registro de cambios
    const changes = [];
    
    // Procesar cada imagen
    for (const file of imageFiles) {
      const oldPath = path.join(IMAGES_DIR, file);
      const newFileName = normalizeFileName(file);
      const newPath = path.join(IMAGES_DIR, newFileName);
      
      console.log(`🔄 Procesando: ${file} -> ${newFileName}`);
      
      // Renombrar el archivo
      const renameResult = renameFile(oldPath, newPath);
      
      if (renameResult.success && !renameResult.skipped) {
        // Actualizar referencias en la base de datos
        const updateResult = await updateDatabaseReferences(oldPath, newPath);
        
        changes.push({
          oldName: file,
          newName: newFileName,
          oldPath: oldPath,
          newPath: newPath,
          databaseUpdateResult: updateResult
        });
        
        console.log(`✅ Archivo renombrado y referencias actualizadas`);
      } else if (renameResult.skipped) {
        console.log(`⏭️ Archivo ya tiene el nombre correcto: ${file}`);
      } else {
        console.error(`❌ Error al renombrar ${file}: ${renameResult.error}`);
      }
    }
    
    // Guardar informe
    fs.writeFileSync(REPORT_FILE, JSON.stringify(changes, null, 2));
    
    console.log(`✅ Proceso completado. Se procesaron ${imageFiles.length} imágenes.`);
    console.log(`📝 Informe guardado en ${REPORT_FILE}`);
    
    return changes;
  } catch (error) {
    console.error('❌ Error durante la estandarización de nombres:', error);
    return [];
  }
}

// Ejecutar la función principal
standardizeImageNames();
