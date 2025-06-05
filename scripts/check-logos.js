#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando logos de marcas...\n');

const logosDir = path.join(process.cwd(), 'public', 'images', 'logos');
const expectedLogos = ['facilfix.svg', 'ecopainting.svg', 'newhouse.svg', 'premium.svg', 'expression.svg'];

console.log(`📁 Directorio de logos: ${logosDir}\n`);

// Verificar si el directorio existe
if (!fs.existsSync(logosDir)) {
  console.log('❌ El directorio de logos no existe');
  process.exit(1);
}

// Listar todos los archivos en el directorio
const allFiles = fs.readdirSync(logosDir);
console.log('📋 Archivos encontrados:');
allFiles.forEach(file => {
  console.log(`   - ${file}`);
});

console.log('\n🎯 Verificando logos esperados:');

let allFound = true;
expectedLogos.forEach(logo => {
  const exists = fs.existsSync(path.join(logosDir, logo));
  if (exists) {
    const stats = fs.statSync(path.join(logosDir, logo));
    console.log(`   ✅ ${logo} (${stats.size} bytes)`);
  } else {
    console.log(`   ❌ ${logo} - NO ENCONTRADO`);
    allFound = false;
  }
});

console.log('\n📊 Resumen:');
if (allFound) {
  console.log('✅ Todos los logos esperados están presentes');
} else {
  console.log('❌ Faltan algunos logos');
}

// Verificar el logo principal
const mainLogo = path.join(process.cwd(), 'public', 'images', 'logos', '+color.svg');
if (fs.existsSync(mainLogo)) {
  console.log('✅ Logo principal (+color.svg) encontrado');
} else {
  console.log('❌ Logo principal (+color.svg) NO encontrado');
}

console.log('\n🔧 URLs que se están intentando cargar:');
expectedLogos.forEach(logo => {
  console.log(`   /images/logos/${logo}`);
});
