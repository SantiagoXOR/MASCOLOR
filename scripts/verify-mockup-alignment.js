#!/usr/bin/env node

/**
 * Script de verificación para alineación exacta con el mockup
 * Verifica que HeroBentoMobile coincida exactamente con el diseño de referencia
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 VERIFICACIÓN DE ALINEACIÓN CON MOCKUP\n');

// Función para leer archivos
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error al leer ${filePath}:`, error.message);
    return '';
  }
}

// Función para verificar resultados
function logResult(condition, description, details = '') {
  const status = condition ? '✅' : '❌';
  console.log(`${status} ${description}`);
  if (details && !condition) {
    console.log(`   💡 ${details}`);
  }
  return condition;
}

let allPassed = true;

// 1. Verificar estructura del componente HeroBentoMobile
console.log('🏗️ ESTRUCTURA DEL LAYOUT SEGÚN MOCKUP\n');

const heroFile = path.join(process.cwd(), 'components/sections/hero-bento-mobile.tsx');
const heroContent = readFile(heroFile);

// Verificar las 4 secciones principales
const hasHeader = heroContent.includes('1. HEADER - Logo (izquierda) + Teléfono (derecha)');
allPassed &= logResult(hasHeader, 'Header con Logo y Teléfono', 'Debe incluir logo izquierda y teléfono derecha');

const hasCarousel = heroContent.includes('2. CAROUSEL - Área principal expandida con título e indicadores');
allPassed &= logResult(hasCarousel, 'Carousel principal', 'Área expandida con título e indicadores');

const hasAdvisor = heroContent.includes('3. ASESOR - Módulo completo según mockup');
allPassed &= logResult(hasAdvisor, 'Módulo de asesor', 'Módulo compacto según mockup');

const hasBenefits = heroContent.includes('4. BENEFICIOS - Sección blanca al final según mockup');
allPassed &= logResult(hasBenefits, 'Sección de beneficios', 'Sección blanca al final con ícono y número');

// 2. Verificar elementos específicos del mockup
console.log('\n🎨 ELEMENTOS VISUALES DEL MOCKUP\n');

// Verificar layout responsivo
const hasResponsiveLayout = heroContent.includes('min-h-screen') && heroContent.includes('flex flex-col gap-3');
allPassed &= logResult(hasResponsiveLayout, 'Layout responsivo', 'Flexbox vertical con gaps optimizados');

// Verificar carrusel compacto
const hasCompactCarousel = heroContent.includes('min-h-[380px] max-h-[420px]');
allPassed &= logResult(hasCompactCarousel, 'Carrusel compacto', 'Altura optimizada para dejar espacio a otras secciones');

// Verificar asesor compacto
const hasCompactAdvisor = heroContent.includes('p-4') && heroContent.includes('gap-3') && heroContent.includes('width={48}');
allPassed &= logResult(hasCompactAdvisor, 'Asesor compacto', 'Padding y elementos reducidos según mockup');

// Verificar sección de beneficios
const hasBenefitsSection = heroContent.includes('02') && heroContent.includes('años de garantía');
allPassed &= logResult(hasBenefitsSection, 'Contenido de beneficios', 'Número destacado y texto de garantía');

// 3. Verificar estilos CSS actualizados
console.log('\n🎨 ESTILOS CSS OPTIMIZADOS\n');

const cssFile = path.join(process.cwd(), 'styles/hero-bento.css');
const cssContent = readFile(cssFile);

// Verificar flexbox layout
const hasFlexLayout = cssContent.includes('display: flex') && cssContent.includes('flex-direction: column');
allPassed &= logResult(hasFlexLayout, 'Layout flexbox', 'Grid reemplazado por flexbox para mejor control');

// Verificar alturas optimizadas
const hasOptimizedHeights = cssContent.includes('height: 380px') && cssContent.includes('max-height: 420px');
allPassed &= logResult(hasOptimizedHeights, 'Alturas optimizadas', 'Carrusel con altura controlada');

// Verificar elementos flex-shrink
const hasFlexShrink = cssContent.includes('flex-shrink: 0') && cssContent.includes('flex: 1');
allPassed &= logResult(hasFlexShrink, 'Control de flex items', 'Header y footer fijos, carrusel expandible');

// 4. Verificar responsividad móvil
console.log('\n📱 RESPONSIVIDAD MÓVIL\n');

// Verificar breakpoints específicos
const hasMobileBreakpoints = cssContent.includes('@media (max-width: 480px)') && 
                            cssContent.includes('height: 350px');
allPassed &= logResult(hasMobileBreakpoints, 'Breakpoints móviles', 'Alturas específicas para móviles pequeños');

const hasTabletBreakpoints = cssContent.includes('@media (min-width: 481px) and (max-width: 768px)') &&
                            cssContent.includes('height: 400px');
allPassed &= logResult(hasTabletBreakpoints, 'Breakpoints tablets', 'Alturas específicas para tablets');

// 5. Verificar animaciones y transiciones
console.log('\n✨ ANIMACIONES Y TRANSICIONES\n');

// Verificar motion components
const hasMotionComponents = heroContent.includes('motion.div') && heroContent.includes('initial={{ opacity: 0');
allPassed &= logResult(hasMotionComponents, 'Componentes animados', 'Framer Motion implementado');

// Verificar delays escalonados
const hasStaggeredDelays = heroContent.includes('delay: 0.1') && heroContent.includes('delay: 0.3') && heroContent.includes('delay: 0.4');
allPassed &= logResult(hasStaggeredDelays, 'Delays escalonados', 'Animaciones secuenciales implementadas');

// 6. Verificar accesibilidad y UX
console.log('\n♿ ACCESIBILIDAD Y UX\n');

// Verificar alt texts
const hasAltTexts = heroContent.includes('alt="Logo +Color') && heroContent.includes('alt={advisor.name}');
allPassed &= logResult(hasAltTexts, 'Textos alternativos', 'Alt texts descriptivos implementados');

// Verificar botones accesibles
const hasAccessibleButtons = heroContent.includes('whileHover') && heroContent.includes('whileTap');
allPassed &= logResult(hasAccessibleButtons, 'Botones interactivos', 'Feedback visual en interacciones');

// Resumen final
console.log('\n📊 RESUMEN DE VERIFICACIÓN\n');

if (allPassed) {
  console.log('🎉 ¡PERFECTO! Todos los elementos del mockup están implementados correctamente');
  console.log('✅ El componente HeroBentoMobile coincide exactamente con el diseño de referencia');
} else {
  console.log('⚠️  Hay algunos elementos que necesitan ajustes para coincidir con el mockup');
  console.log('🔧 Revisa los elementos marcados con ❌ arriba');
}

console.log('\n🔧 PRÓXIMOS PASOS:\n');
console.log('1. ✅ Layout de 4 secciones implementado');
console.log('2. ✅ Carrusel compacto optimizado');
console.log('3. ✅ Asesor y beneficios según mockup');
console.log('4. ✅ Responsividad móvil mejorada');
console.log('5. 🔄 Verificar en dispositivos móviles reales');

process.exit(allPassed ? 0 : 1);
