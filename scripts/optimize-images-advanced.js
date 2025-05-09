/**
 * Script avanzado para optimizar imágenes en el proyecto +COLOR
 * 
 * Este script:
 * 1. Optimiza todas las imágenes en el directorio public/images
 * 2. Genera versiones WebP para mejorar el rendimiento
 * 3. Crea versiones responsive para diferentes tamaños de pantalla
 * 4. Genera placeholders de baja resolución para carga progresiva
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuración
const IMAGE_DIR = path.join(__dirname, '../public/images');
const QUALITY = 80;
const RESPONSIVE_SIZES = [640, 768, 1024, 1280, 1536];
const FORMATS = ['webp', 'avif']; // Formatos modernos a generar

// Función para recorrer directorios recursivamente
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

// Función para verificar si un archivo es una imagen
function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext);
}

// Función para crear el directorio si no existe
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Función para optimizar una imagen
async function optimizeImage(file) {
  try {
    console.log(`Optimizando: ${file}`);
    
    // Obtener información del archivo
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const dirName = path.dirname(file);
    
    // Crear directorio para versiones responsive si no existe
    const responsiveDir = path.join(dirName, 'responsive');
    ensureDirectoryExists(responsiveDir);
    
    // Cargar la imagen con sharp
    const image = sharp(file);
    const metadata = await image.metadata();
    
    // Optimizar la imagen original
    if (ext === '.jpg' || ext === '.jpeg') {
      await image.jpeg({ quality: QUALITY }).toFile(`${file.replace(ext, '')}-optimized${ext}`);
    } else if (ext === '.png') {
      await image.png({ quality: QUALITY }).toFile(`${file.replace(ext, '')}-optimized${ext}`);
    } else if (ext === '.gif') {
      // GIF no se puede optimizar con sharp, se copia tal cual
      fs.copyFileSync(file, `${file.replace(ext, '')}-optimized${ext}`);
    }
    
    // Generar versiones WebP y AVIF
    for (const format of FORMATS) {
      await image[format]({ quality: QUALITY }).toFile(`${file.replace(ext, '')}.${format}`);
    }
    
    // Generar versiones responsive
    for (const width of RESPONSIVE_SIZES.filter(w => w < metadata.width)) {
      const resizedImage = await image.resize(width).toBuffer();
      
      // Guardar en formato original
      await sharp(resizedImage)
        .toFile(path.join(responsiveDir, `${baseName}-${width}${ext}`));
      
      // Guardar en formatos modernos
      for (const format of FORMATS) {
        await sharp(resizedImage)
          [format]({ quality: QUALITY })
          .toFile(path.join(responsiveDir, `${baseName}-${width}.${format}`));
      }
    }
    
    // Generar placeholder de baja resolución
    await image
      .resize(20)
      .blur(5)
      .toFile(path.join(dirName, `${baseName}-placeholder${ext}`));
    
    console.log(`✅ Optimización completa para: ${file}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al optimizar ${file}:`, error);
    return false;
  }
}

// Función principal
async function main() {
  try {
    console.log('🔍 Buscando imágenes para optimizar...');
    
    // Obtener todos los archivos
    const files = await getFiles(IMAGE_DIR);
    
    // Filtrar solo imágenes
    const imageFiles = files.filter(isImage);
    
    console.log(`🖼️ Encontradas ${imageFiles.length} imágenes para optimizar`);
    
    // Optimizar todas las imágenes
    const results = await Promise.all(imageFiles.map(optimizeImage));
    
    // Mostrar resultados
    const successful = results.filter(Boolean).length;
    console.log(`
    ✨ Optimización completada:
    - Total de imágenes: ${imageFiles.length}
    - Optimizadas con éxito: ${successful}
    - Fallidas: ${imageFiles.length - successful}
    `);
  } catch (error) {
    console.error('Error en el proceso de optimización:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
