const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Open Graph para WhatsApp...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'public/og-image-final.svg',
  'config/seo.ts',
  'app/layout.tsx'
];

console.log('📁 Verificando archivos necesarios:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Existe`);
  } else {
    console.log(`❌ ${file} - No encontrado`);
  }
});

// Verificar contenido de config/seo.ts
console.log('\n⚙️ Verificando configuración SEO:');
try {
  const seoConfigPath = path.join(__dirname, '..', 'config/seo.ts');
  const seoContent = fs.readFileSync(seoConfigPath, 'utf8');
  
  if (seoContent.includes('og-image-final.svg')) {
    console.log('✅ URL de imagen Open Graph configurada correctamente');
  } else {
    console.log('❌ URL de imagen Open Graph no encontrada en config');
  }
  
  if (seoContent.includes('pinturamascolor.com.ar')) {
    console.log('✅ URL del sitio web configurada');
  } else {
    console.log('⚠️ Verificar URL del sitio web en config');
  }
} catch (error) {
  console.log('❌ Error al leer config/seo.ts:', error.message);
}

// Verificar layout.tsx
console.log('\n📄 Verificando layout principal:');
try {
  const layoutPath = path.join(__dirname, '..', 'app/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  if (layoutContent.includes('openGraph')) {
    console.log('✅ Meta tags Open Graph configuradas');
  } else {
    console.log('❌ Meta tags Open Graph no encontradas');
  }
  
  if (layoutContent.includes('twitter')) {
    console.log('✅ Meta tags Twitter configuradas');
  } else {
    console.log('❌ Meta tags Twitter no encontradas');
  }
  
  if (layoutContent.includes('siteConfig')) {
    console.log('✅ Configuración SEO importada correctamente');
  } else {
    console.log('❌ Configuración SEO no importada');
  }
} catch (error) {
  console.log('❌ Error al leer app/layout.tsx:', error.message);
}

// Verificar imagen SVG
console.log('\n🖼️ Verificando imagen Open Graph:');
try {
  const svgPath = path.join(__dirname, '..', 'public/og-image-final.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  if (svgContent.includes('1200') && svgContent.includes('630')) {
    console.log('✅ Dimensiones correctas (1200x630)');
  } else {
    console.log('❌ Dimensiones incorrectas');
  }
  
  if (svgContent.includes('+COLOR')) {
    console.log('✅ Logo +COLOR incluido');
  } else {
    console.log('❌ Logo +COLOR no encontrado');
  }
  
  if (svgContent.includes('#870064')) {
    console.log('✅ Colores de marca incluidos');
  } else {
    console.log('❌ Colores de marca no encontrados');
  }
} catch (error) {
  console.log('❌ Error al leer imagen SVG:', error.message);
}

console.log('\n📱 Instrucciones para probar en WhatsApp:');
console.log('1. Despliega tu sitio web en Vercel o tu plataforma preferida');
console.log('2. Asegúrate de que la URL en config/seo.ts coincida con tu dominio');
console.log('3. Comparte el enlace de tu sitio en WhatsApp');
console.log('4. Deberías ver una vista previa con la imagen de +COLOR');

console.log('\n🔧 Si no funciona inmediatamente:');
console.log('- WhatsApp puede tardar unos minutos en actualizar el cache');
console.log('- Puedes usar herramientas como Facebook Debugger para verificar');
console.log('- Asegúrate de que el archivo SVG sea accesible públicamente');

console.log('\n✅ Configuración completada exitosamente!');
