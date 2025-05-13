/**
 * Script para actualizar las referencias de imágenes en la base de datos de Supabase
 * 
 * Este script:
 * 1. Verifica que las rutas de imágenes en la base de datos coincidan con los archivos reales
 * 2. Actualiza las rutas que no coinciden
 * 3. Genera un informe de los cambios realizados
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración
const IMAGES_DIR = path.join(__dirname, '../public/images/products');
const REPORT_FILE = path.join(__dirname, '../reports/database-image-references-report.json');

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

// Función para obtener todos los productos de la base de datos
async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image_url');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    return [];
  }
}

// Función para verificar si un archivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Función para encontrar el archivo real que mejor coincide con la ruta en la base de datos
function findMatchingFile(dbImagePath) {
  try {
    // Extraer el nombre del archivo de la ruta
    const dbFileName = path.basename(dbImagePath);
    
    // Obtener todos los archivos en el directorio de imágenes
    const files = fs.readdirSync(IMAGES_DIR);
    
    // Buscar coincidencia exacta
    if (files.includes(dbFileName)) {
      return dbFileName;
    }
    
    // Buscar coincidencia ignorando mayúsculas/minúsculas
    const lowerDbFileName = dbFileName.toLowerCase();
    const upperDbFileName = dbFileName.toUpperCase();
    
    for (const file of files) {
      if (file.toLowerCase() === lowerDbFileName) {
        return file;
      }
      if (file.toUpperCase() === upperDbFileName) {
        return file;
      }
    }
    
    // Buscar coincidencia parcial (nombre base sin extensión)
    const dbFileNameWithoutExt = path.basename(dbFileName, path.extname(dbFileName));
    
    for (const file of files) {
      const fileNameWithoutExt = path.basename(file, path.extname(file));
      
      if (fileNameWithoutExt.toLowerCase() === dbFileNameWithoutExt.toLowerCase()) {
        return file;
      }
    }
    
    // No se encontró coincidencia
    return null;
  } catch (error) {
    console.error(`❌ Error al buscar archivo coincidente para ${dbImagePath}:`, error);
    return null;
  }
}

// Función para actualizar la referencia de imagen en la base de datos
async function updateImageReference(productId, oldImageUrl, newImageUrl) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: newImageUrl })
      .eq('id', productId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`❌ Error al actualizar referencia de imagen para producto ${productId}:`, error);
    return { success: false, error: error.message };
  }
}

// Función principal
async function updateDatabaseImageReferences() {
  try {
    console.log('🔄 Actualizando referencias de imágenes en la base de datos...');
    
    // Asegurarse de que el directorio de informes existe
    ensureDir(path.dirname(REPORT_FILE));
    
    // Obtener todos los productos
    const products = await getAllProducts();
    
    console.log(`📊 Encontrados ${products.length} productos en la base de datos`);
    
    // Crear un registro de cambios
    const changes = [];
    
    // Procesar cada producto
    for (const product of products) {
      const { id, name, image_url } = product;
      
      // Si no hay URL de imagen, continuar con el siguiente producto
      if (!image_url) {
        console.log(`⚠️ Producto ${name} (${id}) no tiene URL de imagen`);
        continue;
      }
      
      // Extraer la ruta relativa de la imagen
      const relativePath = image_url.startsWith('/') ? image_url.substring(1) : image_url;
      
      // Construir la ruta completa
      const fullPath = path.join(__dirname, '..', 'public', relativePath);
      
      // Verificar si el archivo existe
      const exists = fileExists(fullPath);
      
      if (exists) {
        console.log(`✅ Imagen para producto ${name} (${id}) existe: ${image_url}`);
        continue;
      }
      
      console.log(`❌ Imagen para producto ${name} (${id}) no existe: ${image_url}`);
      
      // Buscar archivo coincidente
      const matchingFile = findMatchingFile(image_url);
      
      if (matchingFile) {
        // Construir nueva URL
        const newImageUrl = `/images/products/${matchingFile}`;
        
        console.log(`🔍 Encontrado archivo coincidente: ${matchingFile}`);
        console.log(`🔄 Actualizando referencia: ${image_url} -> ${newImageUrl}`);
        
        // Actualizar referencia en la base de datos
        const updateResult = await updateImageReference(id, image_url, newImageUrl);
        
        changes.push({
          productId: id,
          productName: name,
          oldImageUrl: image_url,
          newImageUrl: newImageUrl,
          updateResult: updateResult
        });
        
        if (updateResult.success) {
          console.log(`✅ Referencia actualizada correctamente`);
        } else {
          console.error(`❌ Error al actualizar referencia: ${updateResult.error}`);
        }
      } else {
        console.error(`❌ No se encontró archivo coincidente para ${image_url}`);
        
        changes.push({
          productId: id,
          productName: name,
          oldImageUrl: image_url,
          newImageUrl: null,
          updateResult: { success: false, error: 'No se encontró archivo coincidente' }
        });
      }
    }
    
    // Guardar informe
    fs.writeFileSync(REPORT_FILE, JSON.stringify(changes, null, 2));
    
    console.log(`✅ Proceso completado. Se procesaron ${products.length} productos.`);
    console.log(`📝 Informe guardado en ${REPORT_FILE}`);
    
    return changes;
  } catch (error) {
    console.error('❌ Error durante la actualización de referencias:', error);
    return [];
  }
}

// Ejecutar la función principal
updateDatabaseImageReferences();
