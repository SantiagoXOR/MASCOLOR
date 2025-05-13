/**
 * Script para verificar la estructura de directorios de assets
 */

const fs = require('fs');
const path = require('path');

// Rutas de archivos
const PUBLIC_DIR = path.join(__dirname, '../public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const PRODUCTS_DIR = path.join(ASSETS_DIR, 'images/products');

console.log('Verificando estructura de directorios de assets...');
console.log('Directorio público:', PUBLIC_DIR);
console.log('Directorio de assets:', ASSETS_DIR);
console.log('Directorio de productos:', PRODUCTS_DIR);

// Verificar si los directorios existen
console.log('\nVerificando existencia de directorios:');
console.log(`¿Existe ${PUBLIC_DIR}?`, fs.existsSync(PUBLIC_DIR) ? 'Sí' : 'No');
console.log(`¿Existe ${ASSETS_DIR}?`, fs.existsSync(ASSETS_DIR) ? 'Sí' : 'No');
console.log(`¿Existe ${PRODUCTS_DIR}?`, fs.existsSync(PRODUCTS_DIR) ? 'Sí' : 'No');

// Si el directorio de productos existe, listar su contenido
if (fs.existsSync(PRODUCTS_DIR)) {
  const assets = fs.readdirSync(PRODUCTS_DIR);
  console.log('\nAssets encontrados:', assets.length);
  console.log('Primeros 5 assets:', assets.slice(0, 5));
  
  // Verificar la estructura de algunos assets
  console.log('\nVerificando estructura de algunos assets:');
  for (let i = 0; i < Math.min(5, assets.length); i++) {
    const asset = assets[i];
    const assetDir = path.join(PRODUCTS_DIR, asset);
    console.log(`\nAsset: ${asset}`);
    console.log(`Ruta completa: ${assetDir}`);
    console.log(`¿Es directorio?`, fs.statSync(assetDir).isDirectory() ? 'Sí' : 'No');
    
    if (fs.statSync(assetDir).isDirectory()) {
      const files = fs.readdirSync(assetDir);
      console.log(`Archivos:`, files);
      
      // Verificar si existen los archivos esperados
      const hasOriginalWebp = files.includes('original.webp');
      const hasOriginalAvif = files.includes('original.avif');
      
      console.log(`¿Tiene original.webp?`, hasOriginalWebp ? 'Sí' : 'No');
      console.log(`¿Tiene original.avif?`, hasOriginalAvif ? 'Sí' : 'No');
      
      // Verificar tamaño de los archivos
      if (hasOriginalWebp) {
        const webpPath = path.join(assetDir, 'original.webp');
        const webpStats = fs.statSync(webpPath);
        console.log(`Tamaño de original.webp: ${(webpStats.size / 1024).toFixed(2)} KB`);
      }
      
      if (hasOriginalAvif) {
        const avifPath = path.join(assetDir, 'original.avif');
        const avifStats = fs.statSync(avifPath);
        console.log(`Tamaño de original.avif: ${(avifStats.size / 1024).toFixed(2)} KB`);
      }
    }
  }
} else {
  console.log('\nEl directorio de productos no existe');
}

// Verificar la estructura del directorio public/images
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const PRODUCTS_IMAGES_DIR = path.join(IMAGES_DIR, 'products');

console.log('\nVerificando estructura de directorios de imágenes antiguas:');
console.log(`¿Existe ${IMAGES_DIR}?`, fs.existsSync(IMAGES_DIR) ? 'Sí' : 'No');
console.log(`¿Existe ${PRODUCTS_IMAGES_DIR}?`, fs.existsSync(PRODUCTS_IMAGES_DIR) ? 'Sí' : 'No');

// Si el directorio de imágenes de productos existe, listar su contenido
if (fs.existsSync(PRODUCTS_IMAGES_DIR)) {
  const images = fs.readdirSync(PRODUCTS_IMAGES_DIR);
  console.log('\nImágenes antiguas encontradas:', images.length);
  console.log('Primeras 10 imágenes:', images.slice(0, 10));
}
