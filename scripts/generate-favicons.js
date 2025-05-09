const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

// Instalar sharp si no está instalado
try {
  require.resolve('sharp');
  console.log('Sharp ya está instalado.');
} catch (e) {
  console.log('Instalando sharp...');
  execSync('npm install sharp --save-dev');
  console.log('Sharp instalado correctamente.');
}

// Rutas
const SVG_PATH = path.join(__dirname, '../public/favicon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Tamaños de favicon
const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

// Verificar que el SVG existe
if (!fs.existsSync(SVG_PATH)) {
  console.error(`El archivo SVG no existe en ${SVG_PATH}`);
  process.exit(1);
}

// Crear favicon.ico (16x16, 32x32, 48x48)
async function generateFavicon() {
  try {
    // Generar PNGs
    for (const { name, size } of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, name);
      await sharp(SVG_PATH)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Generado ${name}`);
    }

    // Generar favicon.ico (requiere convertir primero a PNG)
    const faviconPath = path.join(OUTPUT_DIR, 'favicon.ico');
    const tempPng16 = path.join(OUTPUT_DIR, 'favicon-16x16.png');
    const tempPng32 = path.join(OUTPUT_DIR, 'favicon-32x32.png');
    
    // Usar sharp para crear un favicon.ico básico (solo 32x32)
    // Nota: Para un favicon.ico completo con múltiples tamaños, se recomienda usar herramientas especializadas
    await sharp(tempPng32)
      .toFile(faviconPath);
    
    console.log('Generado favicon.ico');
    console.log('Todos los favicons han sido generados correctamente.');
  } catch (error) {
    console.error('Error al generar los favicons:', error);
  }
}

generateFavicon();
