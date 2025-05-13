/**
 * Script para crear una imagen de placeholder para productos
 * 
 * Este script crea una imagen de placeholder simple con el logo de +COLOR
 * para usar como fallback cuando las imágenes de productos no se pueden cargar.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Rutas
const OUTPUT_PATH = path.join(__dirname, '../public/images/products/placeholder.jpg');
const LOGO_PATH = path.join(__dirname, '../public/images/logos/+colorsolo.svg');

// Verificar que el logo existe
if (!fs.existsSync(LOGO_PATH)) {
  console.error(`El archivo de logo no existe en ${LOGO_PATH}`);
  process.exit(1);
}

// Crear una imagen de placeholder
async function createPlaceholder() {
  try {
    // Crear un fondo blanco con un borde suave
    const width = 800;
    const height = 800;
    
    // Crear un buffer con un fondo blanco
    const background = Buffer.from(
      `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#f8f9fa"/>
        <rect x="10" y="10" width="${width-20}" height="${height-20}" rx="20" ry="20" fill="#ffffff" stroke="#e9ecef" stroke-width="2"/>
        <text x="${width/2}" y="${height/2 + 200}" font-family="Arial" font-size="32" fill="#adb5bd" text-anchor="middle">Imagen no disponible</text>
      </svg>`
    );
    
    // Leer el logo
    const logoBuffer = await fs.promises.readFile(LOGO_PATH);
    
    // Crear la imagen final
    await sharp(background)
      .composite([
        {
          input: logoBuffer,
          top: Math.floor(height/2) - 100,
          left: Math.floor(width/2) - 100,
          width: 200,
          height: 200,
        }
      ])
      .jpeg({ quality: 90 })
      .toFile(OUTPUT_PATH);
    
    console.log(`✅ Imagen de placeholder creada en ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error al crear la imagen de placeholder:', error);
    process.exit(1);
  }
}

// Ejecutar la función
createPlaceholder();
