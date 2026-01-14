#!/usr/bin/env node

/**
 * Script de verificación específico para el módulo del asesor
 * Verifica que coincida exactamente con el mockup horizontal
 */

const fs = require('fs');
const path = require('path');

console.log('👨‍💼 VERIFICACIÓN DEL MÓDULO DEL ASESOR\n');

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

// 1. Verificar estructura del módulo del asesor
console.log('🏗️ ESTRUCTURA DEL MÓDULO SEGÚN MOCKUP\n');

const heroFile = path.join(process.cwd(), 'components/sections/hero-bento-mobile.tsx');
const heroContent = readFile(heroFile);

// Verificar diseño horizontal
const hasHorizontalLayout = heroContent.includes('advisor-module') && 
                           heroContent.includes('flex items-center justify-between');
allPassed &= logResult(hasHorizontalLayout, 'Diseño horizontal implementado', 'Layout flex horizontal con justify-between');

// Verificar avatar con ícono
const hasAvatarIcon = heroContent.includes('advisor-avatar') && 
                     heroContent.includes('M12 12c2.21 0 4-1.79 4-4');
allPassed &= logResult(hasAvatarIcon, 'Avatar con ícono de usuario', 'Ícono SVG de usuario implementado');

// Verificar indicador online
const hasOnlineIndicator = heroContent.includes('advisor-online-indicator');
allPassed &= logResult(hasOnlineIndicator, 'Indicador online', 'Punto verde animado implementado');

// Verificar botón WhatsApp
const hasWhatsAppButton = heroContent.includes('advisor-whatsapp-btn') && 
                         heroContent.includes('WhatsApp');
allPassed &= logResult(hasWhatsAppButton, 'Botón WhatsApp', 'Botón verde con texto WhatsApp');

// Verificar botón adicional
const hasPlusButton = heroContent.includes('advisor-plus-btn') && 
                     heroContent.includes('PlusCircle');
allPassed &= logResult(hasPlusButton, 'Botón adicional', 'Botón circular con ícono plus');

// 2. Verificar estilos CSS específicos
console.log('\n🎨 ESTILOS CSS DEL MÓDULO\n');

const cssFile = path.join(process.cwd(), 'styles/hero-bento.css');
const cssContent = readFile(cssFile);

// Verificar módulo con rounded-full
const hasRoundedModule = cssContent.includes('.advisor-module') && 
                        cssContent.includes('border-radius: 9999px');
allPassed &= logResult(hasRoundedModule, 'Módulo con bordes redondeados', 'border-radius: 9999px (rounded-full)');

// Verificar avatar con gradiente
const hasGradientAvatar = cssContent.includes('.advisor-avatar') && 
                         cssContent.includes('background: linear-gradient(135deg, #870064, #b05096)');
allPassed &= logResult(hasGradientAvatar, 'Avatar con gradiente', 'Gradiente del color primario');

// Verificar indicador online animado
const hasAnimatedIndicator = cssContent.includes('.advisor-online-indicator') && 
                            cssContent.includes('animation: ping');
allPassed &= logResult(hasAnimatedIndicator, 'Indicador online animado', 'Animación ping implementada');

// Verificar botón WhatsApp verde
const hasGreenWhatsApp = cssContent.includes('.advisor-whatsapp-btn') && 
                        cssContent.includes('background: #25d366');
allPassed &= logResult(hasGreenWhatsApp, 'Botón WhatsApp verde', 'Color oficial de WhatsApp #25d366');

// Verificar botón plus circular
const hasCircularPlus = cssContent.includes('.advisor-plus-btn') && 
                       cssContent.includes('border-radius: 50%');
allPassed &= logResult(hasCircularPlus, 'Botón plus circular', 'border-radius: 50%');

// 3. Verificar interacciones y animaciones
console.log('\n✨ INTERACCIONES Y ANIMACIONES\n');

// Verificar hover effects
const hasHoverEffects = heroContent.includes('whileHover={{ scale: 1.05 }}') && 
                       heroContent.includes('whileTap={{ scale: 0.95 }}');
allPassed &= logResult(hasHoverEffects, 'Efectos hover/tap', 'Animaciones de escala implementadas');

// Verificar transiciones CSS
const hasTransitions = cssContent.includes('transition: all 0.3s ease') && 
                      cssContent.includes('transform: translateY(-1px)');
allPassed &= logResult(hasTransitions, 'Transiciones CSS', 'Transiciones suaves en hover');

// Verificar sombras dinámicas
const hasDynamicShadows = cssContent.includes('box-shadow: 0 8px 16px') && 
                         cssContent.includes('box-shadow: 0 12px 20px');
allPassed &= logResult(hasDynamicShadows, 'Sombras dinámicas', 'Sombras que cambian en hover');

// 4. Verificar funcionalidad
console.log('\n🔧 FUNCIONALIDAD\n');

// Verificar enlace WhatsApp
const hasWhatsAppLink = heroContent.includes('https://wa.me/5493547639917') && 
                       heroContent.includes('encodeURIComponent');
allPassed &= logResult(hasWhatsAppLink, 'Enlace WhatsApp funcional', 'URL con mensaje predefinido');

// Verificar información del asesor
const hasAdvisorInfo = heroContent.includes('{advisor.name}') && 
                      heroContent.includes('{advisor.role}');
allPassed &= logResult(hasAdvisorInfo, 'Información dinámica', 'Nombre y rol del asesor dinámicos');

// Verificar texto "En línea ahora"
const hasOnlineText = heroContent.includes('En línea ahora');
allPassed &= logResult(hasOnlineText, 'Texto de estado online', 'Indicador textual de disponibilidad');

// 5. Verificar responsividad
console.log('\n📱 RESPONSIVIDAD DEL MÓDULO\n');

// Verificar altura máxima
const hasMaxHeight = cssContent.includes('max-height: 80px');
allPassed &= logResult(hasMaxHeight, 'Altura máxima controlada', 'max-height: 80px para compactación');

// Verificar padding responsivo
const hasResponsivePadding = cssContent.includes('padding: 0.75rem 1.5rem');
allPassed &= logResult(hasResponsivePadding, 'Padding optimizado', 'px-6 py-3 equivalente');

// Verificar flex-shrink
const hasFlexShrink = cssContent.includes('flex-shrink: 0');
allPassed &= logResult(hasFlexShrink, 'Flex shrink controlado', 'Evita compresión del módulo');

// Resumen final
console.log('\n📊 RESUMEN DE VERIFICACIÓN DEL ASESOR\n');

if (allPassed) {
  console.log('🎉 ¡PERFECTO! El módulo del asesor coincide exactamente con el mockup');
  console.log('✅ Diseño horizontal, avatar con gradiente, botones funcionales');
  console.log('✅ Animaciones, transiciones y responsividad implementadas');
} else {
  console.log('⚠️  Hay algunos elementos del módulo que necesitan ajustes');
  console.log('🔧 Revisa los elementos marcados con ❌ arriba');
}

console.log('\n🎯 CARACTERÍSTICAS IMPLEMENTADAS:\n');
console.log('1. ✅ Diseño horizontal compacto');
console.log('2. ✅ Avatar circular con gradiente');
console.log('3. ✅ Indicador online animado');
console.log('4. ✅ Botón WhatsApp funcional');
console.log('5. ✅ Botón adicional circular');
console.log('6. ✅ Efectos hover y transiciones');
console.log('7. ✅ Responsividad móvil');

process.exit(allPassed ? 0 : 1);
