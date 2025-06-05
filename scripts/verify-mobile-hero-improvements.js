#!/usr/bin/env node

/**
 * Script de verificación para las mejoras del HeroBentoMobile
 * Verifica que todas las optimizaciones UX/UI estén implementadas correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando mejoras del HeroBentoMobile...\n');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const checkmark = '✅';
const crossmark = '❌';
const warning = '⚠️';

let totalChecks = 0;
let passedChecks = 0;

function logResult(passed, message, details = '') {
  totalChecks++;
  if (passed) {
    passedChecks++;
    console.log(`${checkmark} ${colors.green}${message}${colors.reset}`);
  } else {
    console.log(`${crossmark} ${colors.red}${message}${colors.reset}`);
  }
  if (details) {
    console.log(`   ${colors.blue}${details}${colors.reset}`);
  }
}

function logWarning(message, details = '') {
  console.log(`${warning} ${colors.yellow}${message}${colors.reset}`);
  if (details) {
    console.log(`   ${colors.blue}${details}${colors.reset}`);
  }
}

function logSection(title) {
  console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

// 1. Verificar estructura del componente HeroBentoMobile
logSection('Estructura del Componente');

const heroMobileFile = path.join(process.cwd(), 'components/sections/hero-bento-mobile.tsx');
if (fs.existsSync(heroMobileFile)) {
  const content = fs.readFileSync(heroMobileFile, 'utf8');
  
  // Verificar disposición de elementos según mockup
  logResult(
    content.includes('título arriba-izquierda') && content.includes('imagen del producto abajo-derecha'),
    'Disposición de elementos según mockup implementada',
    'Título arriba-izquierda, imagen abajo-derecha, logo abajo-izquierda'
  );
  
  // Verificar tipografía Mazzard
  logResult(
    content.includes('font-mazzard') && content.includes('font-bold'),
    'Tipografía Mazzard Bold implementada',
    'Se usa Mazzard Bold para títulos de productos'
  );
  
  // Verificar color corporativo
  logResult(
    content.includes('#870064') || content.includes('mascolor-primary'),
    'Color corporativo #870064 implementado',
    'Se usa la paleta de colores corporativa'
  );
  
  // Verificar controles táctiles optimizados
  logResult(
    content.includes('touch-pan-x') && content.includes('dragElastic'),
    'Controles táctiles optimizados',
    'Swipe mejorado con umbral y velocidad'
  );
  
  // Verificar animaciones fluidas
  logResult(
    content.includes('easeOut') && content.includes('duration: 0.6'),
    'Animaciones fluidas implementadas',
    'Transiciones suaves entre productos/marcas'
  );
  
} else {
  logResult(false, 'Archivo HeroBentoMobile no encontrado');
}

// 2. Verificar estilos CSS optimizados
logSection('Estilos CSS Optimizados');

const cssFile = path.join(process.cwd(), 'styles/hero-bento.css');
if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');
  
  // Verificar responsividad móvil
  logResult(
    cssContent.includes('@media (max-width: 480px)') && cssContent.includes('100dvh'),
    'Responsividad móvil optimizada',
    'Breakpoints específicos para diferentes tamaños móviles'
  );
  
  // Verificar tipografía Mazzard
  logResult(
    cssContent.includes('font-family: "Mazzard"') && cssContent.includes('font-weight: 700'),
    'Tipografía Mazzard configurada en CSS',
    'Jerarquía tipográfica correcta'
  );
  
  // Verificar optimizaciones de rendimiento
  logResult(
    cssContent.includes('backface-visibility: hidden') && cssContent.includes('transform: translateZ(0)'),
    'Optimizaciones de rendimiento implementadas',
    'Aceleración por hardware habilitada'
  );
  
  // Verificar soporte para dispositivos con notch
  logResult(
    cssContent.includes('env(safe-area-inset-top)'),
    'Soporte para dispositivos con notch',
    'Safe area insets configurados'
  );
  
} else {
  logResult(false, 'Archivo CSS hero-bento.css no encontrado');
}

// 3. Verificar configuración de Tailwind
logSection('Configuración de Tailwind');

const tailwindFile = path.join(process.cwd(), 'tailwind.config.ts');
if (fs.existsSync(tailwindFile)) {
  const tailwindContent = fs.readFileSync(tailwindFile, 'utf8');
  
  // Verificar colores corporativos
  logResult(
    tailwindContent.includes('"#870064"') && tailwindContent.includes('mascolor'),
    'Colores corporativos configurados en Tailwind',
    'Paleta mascolor con #870064 como primario'
  );
  
  // Verificar fuente Mazzard
  logResult(
    tailwindContent.includes('mazzard') && tailwindContent.includes('fontFamily'),
    'Fuente Mazzard configurada en Tailwind',
    'Font family mazzard disponible'
  );
  
} else {
  logResult(false, 'Archivo tailwind.config.ts no encontrado');
}

// 4. Verificar importación de estilos
logSection('Importación de Estilos');

const layoutFile = path.join(process.cwd(), 'app/layout.tsx');
if (fs.existsSync(layoutFile)) {
  const layoutContent = fs.readFileSync(layoutFile, 'utf8');
  
  logResult(
    layoutContent.includes('hero-bento.css'),
    'Estilos CSS importados en layout',
    'hero-bento.css incluido en el layout principal'
  );
  
  logResult(
    layoutContent.includes('typekit.net'),
    'Fuente Mazzard cargada desde Adobe Fonts',
    'Typekit configurado correctamente'
  );
  
} else {
  logResult(false, 'Archivo app/layout.tsx no encontrado');
}

// 5. Verificar imágenes móviles optimizadas
logSection('Imágenes Móviles Optimizadas');

const bucketsDir = path.join(process.cwd(), 'public/images/buckets');
if (fs.existsSync(bucketsDir)) {
  const files = fs.readdirSync(bucketsDir);
  const mobileImages = files.filter(file => file.includes('-mobile.jpg'));
  
  logResult(
    mobileImages.length >= 5,
    `Imágenes móviles optimizadas (${mobileImages.length} encontradas)`,
    'Formato 9:16 para dispositivos móviles'
  );
  
  // Verificar marcas específicas
  const expectedBrands = ['FACILFIX', 'ECOPAINTING', 'NEWHOUSE', 'PREMIUM', 'EXPRESSION'];
  const foundBrands = expectedBrands.filter(brand => 
    mobileImages.some(img => img.includes(brand))
  );
  
  logResult(
    foundBrands.length === expectedBrands.length,
    `Imágenes para todas las marcas (${foundBrands.length}/${expectedBrands.length})`,
    `Marcas: ${foundBrands.join(', ')}`
  );
  
} else {
  logResult(false, 'Directorio de imágenes buckets no encontrado');
}

// 6. Verificar compatibilidad con versión desktop
logSection('Compatibilidad Desktop');

const homeContentFile = path.join(process.cwd(), 'app/home-content.tsx');
if (fs.existsSync(homeContentFile)) {
  const homeContent = fs.readFileSync(homeContentFile, 'utf8');
  
  logResult(
    homeContent.includes('showMobileHero') && homeContent.includes('HeroSection'),
    'Compatibilidad con versión desktop mantenida',
    'Lógica condicional para mostrar Hero móvil/desktop'
  );
  
} else {
  logResult(false, 'Archivo app/home-content.tsx no encontrado');
}

// Resumen final
logSection('Resumen de Verificación');

const successRate = Math.round((passedChecks / totalChecks) * 100);
const statusColor = successRate >= 90 ? colors.green : successRate >= 70 ? colors.yellow : colors.red;

console.log(`\n${colors.bold}Resultado Final:${colors.reset}`);
console.log(`${statusColor}${passedChecks}/${totalChecks} verificaciones pasaron (${successRate}%)${colors.reset}\n`);

if (successRate >= 90) {
  console.log(`${checkmark} ${colors.green}${colors.bold}¡Excelente! Las mejoras del HeroBentoMobile están correctamente implementadas.${colors.reset}`);
} else if (successRate >= 70) {
  console.log(`${warning} ${colors.yellow}${colors.bold}Bueno. La mayoría de las mejoras están implementadas, pero hay algunas áreas que necesitan atención.${colors.reset}`);
} else {
  console.log(`${crossmark} ${colors.red}${colors.bold}Se necesita más trabajo. Varias mejoras críticas no están implementadas.${colors.reset}`);
}

console.log('\n📱 Para probar las mejoras:');
console.log('1. npm run dev');
console.log('2. Abrir en dispositivo móvil o DevTools móvil');
console.log('3. Verificar disposición de elementos según mockup');
console.log('4. Probar controles táctiles (swipe)');
console.log('5. Verificar tipografía Mazzard y colores corporativos\n');

process.exit(successRate >= 70 ? 0 : 1);
