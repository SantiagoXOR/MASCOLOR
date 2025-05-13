/**
 * Script para verificar y corregir los formatos de imagen en los assets
 * 
 * Este script verifica que todos los assets tengan los formatos necesarios (webp, avif, jpg, png)
 * y genera los formatos faltantes si es necesario.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

// Rutas de archivos
const PUBLIC_DIR = path.join(__dirname, '../public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const PRODUCTS_DIR = path.join(ASSETS_DIR, 'images/products');

// Verificar si sharp está instalado
let sharpInstalled = false;
try {
  require.resolve('sharp');
  sharpInstalled = true;
} catch (e) {
  console.warn('⚠️ Sharp no está instalado. Se intentará instalarlo automáticamente.');
  try {
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    sharpInstalled = true;
    console.log('✅ Sharp instalado correctamente');
  } catch (error) {
    console.error('❌ Error al instalar Sharp:', error);
    console.error('Por favor, instala Sharp manualmente: npm install sharp --save-dev');
  }
}

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error al verificar si existe el archivo ${filePath}:`, error);
    return false;
  }
}

// Función para convertir una imagen a diferentes formatos
async function convertImage(inputPath, outputDir, baseName) {
  if (!sharpInstalled) {
    console.error('❌ Sharp no está instalado. No se pueden convertir imágenes.');
    return false;
  }

  try {
    const sharp = require('sharp');
    const formats = ['webp', 'avif', 'jpg', 'png'];
    let success = true;

    for (const format of formats) {
      const outputPath = path.join(outputDir, `${baseName}.${format}`);
      
      // Verificar si ya existe el archivo
      if (fileExists(outputPath)) {
        console.log(`   El archivo ${baseName}.${format} ya existe`);
        continue;
      }
      
      console.log(`   Generando ${baseName}.${format}...`);
      
      try {
        const image = sharp(inputPath);
        
        // Configurar opciones según el formato
        switch (format) {
          case 'webp':
            await image.webp({ quality: 80 }).toFile(outputPath);
            break;
          case 'avif':
            await image.avif({ quality: 65 }).toFile(outputPath);
            break;
          case 'jpg':
            await image.jpeg({ quality: 85 }).toFile(outputPath);
            break;
          case 'png':
            await image.png({ compressionLevel: 9 }).toFile(outputPath);
            break;
        }
        
        console.log(`   ✅ Generado ${baseName}.${format}`);
      } catch (error) {
        console.error(`   ❌ Error al generar ${baseName}.${format}:`, error);
        success = false;
      }
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error al convertir imagen:', error);
    return false;
  }
}

// Función principal
async function fixAssetFormats() {
  try {
    console.log('🔄 Verificando y corrigiendo formatos de imagen en assets...');

    // Verificar si existe el directorio de productos
    if (!fileExists(PRODUCTS_DIR)) {
      console.error(`❌ El directorio de productos no existe: ${PRODUCTS_DIR}`);
      return;
    }

    // Obtener todos los assets
    const assets = fs.readdirSync(PRODUCTS_DIR);
    console.log(`📊 Se encontraron ${assets.length} assets`);

    let fixedCount = 0;
    let errorCount = 0;
    let okCount = 0;

    for (const assetId of assets) {
      const assetDir = path.join(PRODUCTS_DIR, assetId);
      
      // Verificar si es un directorio
      if (!fs.statSync(assetDir).isDirectory()) {
        console.log(`⚠️ ${assetId} no es un directorio, omitiendo...`);
        continue;
      }
      
      console.log(`\n🔍 Verificando asset: ${assetId}`);
      
      // Verificar si existen los formatos necesarios
      const formats = ['webp', 'avif', 'jpg', 'png'];
      const existingFormats = [];
      const missingFormats = [];
      
      for (const format of formats) {
        const formatPath = path.join(assetDir, `original.${format}`);
        if (fileExists(formatPath)) {
          existingFormats.push(format);
        } else {
          missingFormats.push(format);
        }
      }
      
      console.log(`   Formatos existentes: ${existingFormats.join(', ') || 'ninguno'}`);
      console.log(`   Formatos faltantes: ${missingFormats.join(', ') || 'ninguno'}`);
      
      // Si faltan formatos y existe al menos uno, generar los faltantes
      if (missingFormats.length > 0 && existingFormats.length > 0) {
        console.log(`   Generando formatos faltantes...`);
        
        // Usar el primer formato existente como fuente
        const sourceFormat = existingFormats[0];
        const sourcePath = path.join(assetDir, `original.${sourceFormat}`);
        
        // Convertir a los formatos faltantes
        const success = await convertImage(sourcePath, assetDir, 'original');
        
        if (success) {
          console.log(`   ✅ Formatos generados correctamente`);
          fixedCount++;
        } else {
          console.error(`   ❌ Error al generar formatos`);
          errorCount++;
        }
      } else if (missingFormats.length === 0) {
        console.log(`   ✅ El asset ya tiene todos los formatos necesarios`);
        okCount++;
      } else {
        console.error(`   ❌ No hay ningún formato existente para usar como fuente`);
        errorCount++;
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   Assets correctos: ${okCount}`);
    console.log(`   Assets corregidos: ${fixedCount}`);
    console.log(`   Errores: ${errorCount}`);
    
    if (fixedCount > 0) {
      console.log('✅ Se han corregido los formatos de imagen en los assets');
    } else if (okCount === assets.length) {
      console.log('✅ Todos los assets tienen los formatos necesarios');
    } else {
      console.log('⚠️ No se ha podido corregir todos los formatos de imagen');
    }
  } catch (error) {
    console.error('❌ Error al corregir formatos de imagen:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
fixAssetFormats();
