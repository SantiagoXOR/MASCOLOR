/**
 * Script para renombrar archivos de imágenes según la convención establecida
 * 
 * Este script:
 * 1. Lee el reporte generado por validate-image-names.js
 * 2. Renombra los archivos según las sugerencias
 * 3. Actualiza las referencias en la base de datos
 * 
 * IMPORTANTE: Hacer una copia de seguridad antes de ejecutar este script
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridas');
  process.exit(1);
}

// Crear cliente de Supabase con clave de servicio
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Ruta del reporte
const reportPath = path.join(__dirname, '../invalid-image-names.json');

// Función para renombrar un archivo
function renameFile(oldPath, newPath) {
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(oldPath)) {
      console.error(`❌ El archivo ${oldPath} no existe`);
      return false;
    }
    
    // Verificar que el directorio de destino existe
    const newDir = path.dirname(newPath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }
    
    // Verificar que el archivo de destino no existe
    if (fs.existsSync(newPath)) {
      console.error(`❌ El archivo ${newPath} ya existe`);
      return false;
    }
    
    // Renombrar el archivo
    fs.renameSync(oldPath, newPath);
    return true;
  } catch (error) {
    console.error(`Error al renombrar ${oldPath} a ${newPath}:`, error);
    return false;
  }
}

// Función para actualizar referencias en la base de datos
async function updateDatabaseReferences(oldPath, newPath) {
  try {
    // Convertir rutas a formato relativo para la base de datos
    const oldRelativePath = `/images/${path.relative('public/images', oldPath)}`.replace(/\\/g, '/');
    const newRelativePath = `/images/${path.relative('public/images', newPath)}`.replace(/\\/g, '/');
    
    // Actualizar referencias en la tabla products
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: newRelativePath })
      .eq('image_url', oldRelativePath);
    
    if (error) {
      console.error(`Error al actualizar referencias en la base de datos:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error al actualizar referencias en la base de datos:`, error);
    return false;
  }
}

// Función principal
async function renameImages() {
  try {
    console.log('🔄 Renombrando archivos de imágenes...');
    
    // Verificar que el reporte existe
    if (!fs.existsSync(reportPath)) {
      console.error(`❌ El reporte ${reportPath} no existe. Ejecute primero validate-image-names.js`);
      process.exit(1);
    }
    
    // Leer el reporte
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    if (report.length === 0) {
      console.log('✅ No hay archivos para renombrar');
      process.exit(0);
    }
    
    console.log(`🖼️ Se renombrarán ${report.length} archivos`);
    
    // Crear un registro de cambios
    const changes = [];
    
    // Renombrar cada archivo
    for (const file of report) {
      const oldPath = path.join(__dirname, '..', file.path);
      const newPath = path.join(path.dirname(oldPath), file.suggestedName);
      
      console.log(`🔄 Renombrando ${file.currentName} -> ${file.suggestedName}`);
      
      // Renombrar el archivo
      const renamed = renameFile(oldPath, newPath);
      
      if (renamed) {
        // Actualizar referencias en la base de datos
        const updated = await updateDatabaseReferences(oldPath, newPath);
        
        changes.push({
          oldPath: file.path,
          newPath: path.relative(path.join(__dirname, '..'), newPath),
          databaseUpdated: updated
        });
        
        console.log(`✅ Archivo renombrado y referencias actualizadas`);
      }
    }
    
    // Generar registro de cambios
    const changesPath = path.join(__dirname, '../renamed-images.json');
    fs.writeFileSync(changesPath, JSON.stringify(changes, null, 2));
    
    console.log(`\n📊 Resumen:`);
    console.log(`✅ Se renombraron ${changes.length} de ${report.length} archivos`);
    console.log(`📄 Se ha generado un registro de cambios en ${changesPath}`);
    
    // Eliminar el reporte
    fs.unlinkSync(reportPath);
    
    console.log('\n💡 Para verificar que todos los archivos cumplen con la convención, ejecute:');
    console.log('node scripts/validate-image-names.js');
  } catch (error) {
    console.error('Error durante el renombrado:', error);
  }
}

// Solicitar confirmación antes de ejecutar
console.log('⚠️ ADVERTENCIA: Este script renombrará archivos y actualizará la base de datos.');
console.log('⚠️ Se recomienda hacer una copia de seguridad antes de continuar.');
console.log('');
console.log('Para continuar, escriba "CONFIRMAR" y presione Enter:');

process.stdin.once('data', (data) => {
  const input = data.toString().trim();
  
  if (input === 'CONFIRMAR') {
    renameImages();
  } else {
    console.log('❌ Operación cancelada');
    process.exit(0);
  }
});
