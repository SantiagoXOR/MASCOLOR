/**
 * Script avanzado para optimizar imágenes en el proyecto +COLOR
 *
 * Este script:
 * 1. Optimiza todas las imágenes en el directorio public/images
 * 2. Prioriza formatos WebP y AVIF para mejor rendimiento
 * 3. Crea versiones responsive para diferentes tamaños de pantalla
 * 4. Genera placeholders de baja resolución para carga progresiva
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuración
const IMAGE_DIR = path.join(__dirname, "../public/images");
const OUTPUT_DIR = path.join(__dirname, "../public/images/optimized");
const QUALITY = {
  jpeg: 80,
  webp: 75,
  avif: 65, // Menor calidad para AVIF ya que mantiene mejor calidad visual
};
const RESPONSIVE_SIZES = [640, 768, 1024, 1280, 1536];
const FORMATS = ["webp", "avif"]; // Priorizar formatos modernos

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
  return [".jpg", ".jpeg", ".png", ".gif", ".svg"].includes(ext);
}

// Función para crear directorios recursivamente
async function ensureDir(dirPath) {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

// Función para optimizar una imagen
async function optimizeImage(file) {
  try {
    console.log(`Optimizando: ${file}`);

    // Obtener información del archivo
    const relativePath = path.relative(IMAGE_DIR, file);
    const outputFilePath = path.join(OUTPUT_DIR, relativePath);
    const dirName = path.dirname(outputFilePath);
    const baseName = path.basename(file, path.extname(file));
    const ext = path.extname(file).toLowerCase();

    // Crear directorios de salida
    await ensureDir(dirName);
    const responsiveDir = path.join(dirName, "responsive");
    await ensureDir(responsiveDir);

    // Cargar la imagen con sharp
    const image = sharp(file);
    const metadata = await image.metadata();

    // Optimizar la imagen original
    if (ext === ".jpg" || ext === ".jpeg") {
      await image.jpeg({ quality: QUALITY.jpeg }).toFile(outputFilePath);
    } else if (ext === ".png") {
      await image.png({ quality: QUALITY.jpeg }).toFile(outputFilePath);
    } else if (ext === ".gif") {
      // GIF no se puede optimizar con sharp, se copia tal cual
      fs.copyFileSync(file, outputFilePath);
    }

    // Generar versiones WebP y AVIF
    for (const format of FORMATS) {
      await image[format]({ quality: QUALITY[format] }).toFile(
        path.join(dirName, `${baseName}.${format}`)
      );
    }

    // Generar versiones responsive
    for (const width of RESPONSIVE_SIZES.filter((w) => w < metadata.width)) {
      const resizedImage = await image.resize(width).toBuffer();

      // Guardar en formato original
      await sharp(resizedImage).toFile(
        path.join(responsiveDir, `${baseName}-${width}${ext}`)
      );

      // Guardar en formatos modernos
      for (const format of FORMATS) {
        await sharp(resizedImage)
          [format]({ quality: QUALITY[format] })
          .toFile(path.join(responsiveDir, `${baseName}-${width}.${format}`));
      }
    }

    // Generar placeholder de baja resolución
    await image
      .resize({ width: 20, height: 20, fit: "inside" })
      .blur(5)
      .toFile(path.join(dirName, `${baseName}-placeholder${ext}`));

    // Generar versiones de placeholder en formatos modernos
    for (const format of FORMATS) {
      await image
        .resize({ width: 20, height: 20, fit: "inside" })
        .blur(5)
        [format]({ quality: 50 })
        .toFile(path.join(dirName, `${baseName}-placeholder.${format}`));
    }

    console.log(`✅ Optimización completa para: ${relativePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al optimizar ${file}:`, error);
    return false;
  }
}

// Función principal
async function main() {
  try {
    console.log("🔍 Buscando imágenes para optimizar...");

    // Crear directorio de salida si no existe
    await ensureDir(OUTPUT_DIR);

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
    - Directorio de salida: ${OUTPUT_DIR}
    `);
  } catch (error) {
    console.error("Error en el proceso de optimización:", error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main();
