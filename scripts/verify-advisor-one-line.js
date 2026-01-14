#!/usr/bin/env node

/**
 * Script de verificación para el diseño del asesor en una línea
 * Verifica que coincida exactamente con el mockup horizontal
 */

const fs = require('fs');
const path = require('path');

console.log('📏 VERIFICACIÓN DEL DISEÑO EN UNA LÍNEA\n');

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

// 1. Verificar estructura en una línea
console.log('📐 ESTRUCTURA EN UNA LÍNEA\n');

const heroFile = path.join(process.cwd(), 'components/sections/hero-bento-mobile.tsx');
const heroContent = readFile(heroFile);

// Verificar layout flex horizontal
const hasHorizontalLayout = heroContent.includes('flex items-center gap-4 px-4');
allPassed &= logResult(hasHorizontalLayout, 'Layout horizontal implementado', 'flex items-center gap-4');

// Verificar avatar de Leandro
const hasLeandrAvatar = heroContent.includes('advisor-avatar-leandro');
allPassed &= logResult(hasLeandrAvatar, 'Avatar de Leandro', 'Clase CSS específica aplicada');

// Verificar contenedor con outline
const hasOutlineContainer = heroContent.includes('advisor-container');
allPassed &= logResult(hasOutlineContainer, 'Contenedor con outline', 'Border del color primario');

// Verificar botón WhatsApp principal
const hasMainWhatsApp = heroContent.includes('advisor-whatsapp-main') && 
                       heroContent.includes('Contactanos por WhatsApp');
allPassed &= logResult(hasMainWhatsApp, 'Botón WhatsApp principal', 'Texto "Contactanos por WhatsApp"');

// Verificar botón +COLOR
const hasPlusColorButton = heroContent.includes('advisor-plus-color') && 
                          heroContent.includes('rotate: [0, 360]');
allPassed &= logResult(hasPlusColorButton, 'Botón +COLOR con giro', 'Efecto de rotación continua');

// 2. Verificar elementos específicos del mockup
console.log('\n🎯 ELEMENTOS DEL MOCKUP\n');

// Verificar modal de información
const hasModal = heroContent.includes('advisor-modal') && 
                heroContent.includes('Leandro') && 
                heroContent.includes('Asesor de +COLOR');
allPassed &= logResult(hasModal, 'Modal de información', 'Información de Leandro al hover');

// Verificar indicador online
const hasOnlineIndicator = heroContent.includes('advisor-online-leandro');
allPassed &= logResult(hasOnlineIndicator, 'Indicador online', 'Punto verde animado');

// Verificar navegación a productos
const hasProductsNavigation = heroContent.includes('getElementById("products")') && 
                             heroContent.includes('scrollIntoView');
allPassed &= logResult(hasProductsNavigation, 'Navegación a productos', 'Scroll suave a sección productos');

// 3. Verificar estilos CSS
console.log('\n🎨 ESTILOS CSS ESPECÍFICOS\n');

const cssFile = path.join(process.cwd(), 'styles/hero-bento.css');
const cssContent = readFile(cssFile);

// Verificar avatar con gradiente
const hasAvatarGradient = cssContent.includes('.advisor-avatar-leandro') && 
                         cssContent.includes('background: linear-gradient(135deg, #870064, #b05096)');
allPassed &= logResult(hasAvatarGradient, 'Avatar con gradiente', 'Gradiente del color primario');

// Verificar contenedor con border
const hasContainerBorder = cssContent.includes('.advisor-container') && 
                          cssContent.includes('border: 2px solid #870064');
allPassed &= logResult(hasContainerBorder, 'Contenedor con border', 'Border 2px del color primario');

// Verificar botón WhatsApp verde
const hasGreenWhatsApp = cssContent.includes('.advisor-whatsapp-main') && 
                        cssContent.includes('background: #25d366');
allPassed &= logResult(hasGreenWhatsApp, 'Botón WhatsApp verde', 'Color oficial #25d366');

// Verificar botón +COLOR con animación
const hasPlusColorAnimation = cssContent.includes('.advisor-plus-color') && 
                             cssContent.includes('background: #870064');
allPassed &= logResult(hasPlusColorAnimation, 'Botón +COLOR animado', 'Fondo color primario');

// Verificar modal hover
const hasModalHover = cssContent.includes('.advisor-avatar-leandro:hover + .advisor-modal');
allPassed &= logResult(hasModalHover, 'Modal al hover', 'Aparece al hacer hover en avatar');

// 4. Verificar animaciones
console.log('\n✨ ANIMACIONES Y EFECTOS\n');

// Verificar efecto de giro
const hasSpinEffect = cssContent.includes('@keyframes spin-slow') && 
                     cssContent.includes('animation: spin-slow 3s linear infinite');
allPassed &= logResult(hasSpinEffect, 'Efecto de giro', 'Animación continua de 3 segundos');

// Verificar indicador ping
const hasPingAnimation = cssContent.includes('.advisor-online-leandro::before') && 
                        cssContent.includes('animation: ping');
allPassed &= logResult(hasPingAnimation, 'Animación ping', 'Indicador online animado');

// Verificar hover effects
const hasHoverEffects = cssContent.includes('transform: translateY(-2px)') && 
                       cssContent.includes('box-shadow: 0 12px 25px');
allPassed &= logResult(hasHoverEffects, 'Efectos hover', 'Elevación y sombras dinámicas');

// 5. Verificar responsividad
console.log('\n📱 RESPONSIVIDAD\n');

// Verificar breakpoints móviles
const hasMobileBreakpoints = cssContent.includes('@media (max-width: 480px)') && 
                            cssContent.includes('.advisor-avatar-leandro');
allPassed &= logResult(hasMobileBreakpoints, 'Breakpoints móviles', 'Ajustes para pantallas pequeñas');

// Verificar tamaños responsivos
const hasResponsiveSizes = cssContent.includes('width: 56px') && 
                          cssContent.includes('height: 56px');
allPassed &= logResult(hasResponsiveSizes, 'Tamaños responsivos', 'Avatar más pequeño en móviles');

// 6. Verificar funcionalidad
console.log('\n🔧 FUNCIONALIDAD\n');

// Verificar enlace WhatsApp
const hasWhatsAppLink = heroContent.includes('https://wa.me/5493547639917');
allPassed &= logResult(hasWhatsAppLink, 'Enlace WhatsApp', 'URL correcta implementada');

// Verificar mensaje predefinido
const hasPredefinedMessage = heroContent.includes('encodeURIComponent') && 
                            heroContent.includes('me gustaría obtener más información');
allPassed &= logResult(hasPredefinedMessage, 'Mensaje predefinido', 'Texto automático para WhatsApp');

// Verificar scroll a productos
const hasScrollFunction = heroContent.includes('scrollIntoView({ behavior: "smooth" })');
allPassed &= logResult(hasScrollFunction, 'Scroll suave', 'Navegación suave a productos');

// Resumen final
console.log('\n📊 RESUMEN DE VERIFICACIÓN\n');

if (allPassed) {
  console.log('🎉 ¡PERFECTO! El diseño en una línea está implementado correctamente');
  console.log('✅ Avatar, contenedor con outline, botones funcionales');
  console.log('✅ Animaciones, modal y responsividad completa');
} else {
  console.log('⚠️  Hay algunos elementos que necesitan ajustes');
  console.log('🔧 Revisa los elementos marcados con ❌ arriba');
}

console.log('\n🎯 CARACTERÍSTICAS DEL DISEÑO EN UNA LÍNEA:\n');
console.log('1. ✅ Avatar de Leandro con gradiente');
console.log('2. ✅ Contenedor con outline del color primario');
console.log('3. ✅ Botón WhatsApp "Contactanos por WhatsApp"');
console.log('4. ✅ Botón +COLOR con efecto de giro');
console.log('5. ✅ Modal de información al hover');
console.log('6. ✅ Indicador online animado');
console.log('7. ✅ Navegación a sección productos');
console.log('8. ✅ Responsividad móvil completa');

process.exit(allPassed ? 0 : 1);
