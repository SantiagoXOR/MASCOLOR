/**
 * Script para buscar rutas de imágenes antiguas en el código
 * 
 * Este script busca en todo el código dónde se están utilizando rutas de imágenes antiguas
 * como /assets/images/products/facilfix/microcemento/original.webp
 */

const fs = require('fs');
const path = require('path');

// Rutas a buscar
const oldPaths = [
  'facilfix/microcemento',
  'newhouse/barniz-marino'
];

// Directorios a excluir
const excludeDirs = [
  'node_modules',
  '.next',
  '.git',
  'out'
];

// Extensiones de archivos a buscar
const fileExtensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.html',
  '.css'
];

// Función para registrar información con colores
const logInfo = (message) => console.log(`🔍 ${message}`);
const logSuccess = (message) => console.log(`✅ ${message}`);
const logWarning = (message) => console.log(`⚠️ ${message}`);
const logError = (message) => console.error(`❌ ${message}`);

// Función para buscar texto en un archivo
function searchInFile(filePath, searchTexts) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];
    
    for (const searchText of searchTexts) {
      if (content.includes(searchText)) {
        matches.push(searchText);
      }
    }
    
    if (matches.length > 0) {
      logWarning(`Encontrado en ${filePath}:`);
      for (const match of matches) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(match)) {
            logInfo(`  Línea ${i + 1}: ${lines[i].trim()}`);
          }
        }
      }
      return true;
    }
    
    return false;
  } catch (error) {
    logError(`Error al leer el archivo ${filePath}: ${error.message}`);
    return false;
  }
}

// Función para recorrer directorios recursivamente
function walkDir(dir, searchTexts, callback) {
  const files = fs.readdirSync(dir);
  let matchesFound = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Saltar directorios excluidos
      if (excludeDirs.includes(file)) {
        continue;
      }
      
      // Buscar en subdirectorios
      matchesFound += walkDir(filePath, searchTexts, callback);
    } else {
      // Verificar extensión del archivo
      const ext = path.extname(filePath).toLowerCase();
      if (fileExtensions.includes(ext)) {
        if (callback(filePath, searchTexts)) {
          matchesFound++;
        }
      }
    }
  }
  
  return matchesFound;
}

// Función principal
function findOldImagePaths() {
  try {
    logInfo('Buscando rutas de imágenes antiguas...');
    
    // Directorio raíz del proyecto
    const rootDir = path.resolve('.');
    
    // Buscar en todos los archivos
    const matchesFound = walkDir(rootDir, oldPaths, searchInFile);
    
    if (matchesFound > 0) {
      logWarning(`Se encontraron ${matchesFound} archivos con rutas antiguas`);
    } else {
      logSuccess('No se encontraron rutas antiguas');
    }
  } catch (error) {
    logError(`Error inesperado: ${error.message}`);
  }
}

// Ejecutar la función principal
findOldImagePaths();
