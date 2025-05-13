/**
 * Script para generar versiones WebP y AVIF de las imágenes existentes
 * 
 * Este script:
 * 1. Busca todas las imágenes en el directorio public/images/products
 * 2. Genera versiones WebP y AVIF de cada imagen en el mismo directorio
 * 3. Mantiene la estructura de directorios original
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuración
const PRODUCTS_DIR = path.join(__dirname, '../public/images/products');
const QUALITY = {
  webp: 80,
  avif: 70
};

// Función para recorrer directorios recursivamente
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

// Función para verificar si un archivo es una imagen
function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
}

// Función para generar versiones WebP y AVIF de una imagen
async function convertImage(file) {
  try {
    const ext = path.extname(file);
    const baseName = file.slice(0, -ext.length);
    const webpPath = `${baseName}.webp`;
    const avifPath = `${baseName}.avif`;

    console.log(`Procesando: ${path.basename(file)}`);

    // Verificar si ya existen las versiones WebP y AVIF
    const webpExists = fs.existsSync(webpPath);
    const avifExists = fs.existsSync(avifPath);

    // Cargar la imagen con sharp
    const image = sharp(file);

    // Generar versión WebP si no existe
    if (!webpExists) {
      await image
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath);
      console.log(`  ✅ Generado: ${path.basename(webpPath)}`);
    } else {
      console.log(`  ⏭️ Ya existe: ${path.basename(webpPath)}`);
    }

    // Generar versión AVIF si no existe
    if (!avifExists) {
      await image
        .avif({ quality: QUALITY.avif })
        .toFile(avifPath);
      console.log(`  ✅ Generado: ${path.basename(avifPath)}`);
    } else {
      console.log(`  ⏭️ Ya existe: ${path.basename(avifPath)}`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error al procesar ${path.basename(file)}:`, error.message);
    return false;
  }
}

// Función principal
async function main() {
  try {
    console.log('🔍 Buscando imágenes para convertir...');

    // Obtener todos los archivos
    const files = await getFiles(PRODUCTS_DIR);

    // Filtrar solo imágenes
    const imageFiles = files.filter(isImage);

    console.log(`🖼️ Encontradas ${imageFiles.length} imágenes para convertir`);

    // Convertir todas las imágenes
    const results = [];
    for (const file of imageFiles) {
      results.push(await convertImage(file));
    }

    // Mostrar resultados
    const successful = results.filter(Boolean).length;
    console.log(`
    ✨ Conversión completada:
    - Total de imágenes: ${imageFiles.length}
    - Convertidas con éxito: ${successful}
    - Fallidas: ${imageFiles.length - successful}
    `);
  } catch (error) {
    console.error('Error en el proceso de conversión:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
