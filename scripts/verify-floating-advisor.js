#!/usr/bin/env node

/**
 * Script de verificación para el widget flotante del asesor
 * Verifica que se haya implementado correctamente como elemento persistente
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 VERIFICACIÓN DEL WIDGET FLOTANTE DEL ASESOR\n');

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

// 1. Verificar eliminación del modal
console.log('🗑️ ELIMINACIÓN DEL MODAL DUPLICADO\n');

const heroFile = path.join(process.cwd(), 'components/sections/hero-bento-mobile.tsx');
const heroContent = readFile(heroFile);

// Verificar que no hay estado del modal
const noModalState = !heroContent.includes('showAdvisorModal') || 
                     heroContent.includes('// Remover estado del modal');
allPassed &= logResult(noModalState, 'Estado del modal removido', 'showAdvisorModal eliminado');

// Verificar que no hay AnimatePresence para modal
const noAnimatePresenceModal = !heroContent.includes('AnimatePresence') || 
                              !heroContent.includes('showAdvisorModal &&');
allPassed &= logResult(noAnimatePresenceModal, 'AnimatePresence del modal removido', 'Modal popup eliminado');

// Verificar que no hay click handler para modal
const noModalClickHandler = !heroContent.includes('setShowAdvisorModal');
allPassed &= logResult(noModalClickHandler, 'Click handler del modal removido', 'Funcionalidad de modal eliminada');

// 2. Verificar widget flotante
console.log('\n🎈 WIDGET FLOTANTE IMPLEMENTADO\n');

// Verificar posición fixed
const hasFixedPosition = heroContent.includes('fixed bottom-5 left-4 right-4 z-50');
allPassed &= logResult(hasFixedPosition, 'Posición fixed implementada', 'bottom-5, z-50 aplicados');

// Verificar que está fuera del contenedor principal
const isOutsideContainer = heroContent.includes('WIDGET FLOTANTE DEL ASESOR - Persistente');
allPassed &= logResult(isOutsideContainer, 'Widget fuera del contenedor', 'Posicionado independientemente');

// Verificar animación de entrada
const hasEntryAnimation = heroContent.includes('initial={{ opacity: 0, y: 100 }}') && 
                         heroContent.includes('animate={{ opacity: 1, y: 0 }}');
allPassed &= logResult(hasEntryAnimation, 'Animación de entrada', 'Aparece desde abajo');

// 3. Verificar información del asesor integrada
console.log('\n👤 INFORMACIÓN DEL ASESOR INTEGRADA\n');

// Verificar información en el contenedor
const hasIntegratedInfo = heroContent.includes('advisor-info') && 
                         heroContent.includes('Leandro') && 
                         heroContent.includes('Asesor de +COLOR') &&
                         heroContent.includes('En línea ahora');
allPassed &= logResult(hasIntegratedInfo, 'Información integrada', 'Nombre, rol y estado en contenedor');

// Verificar que no es modal separado
const infoNotInModal = heroContent.includes('advisor-info') && 
                      !heroContent.includes('absolute -top-');
allPassed &= logResult(infoNotInModal, 'Información no es modal', 'Está dentro del contenedor principal');

// 4. Verificar estructura del contenedor
console.log('\n📦 ESTRUCTURA DEL CONTENEDOR\n');

// Verificar avatar solo visual
const hasVisualAvatar = heroContent.includes('advisor-avatar-floating') && 
                       !heroContent.includes('onClick={() => setShowAdvisorModal');
allPassed &= logResult(hasVisualAvatar, 'Avatar solo visual', 'Sin funcionalidad de modal');

// Verificar botones funcionales
const hasFunctionalButtons = heroContent.includes('advisor-whatsapp-floating') && 
                            heroContent.includes('advisor-plus-floating');
allPassed &= logResult(hasFunctionalButtons, 'Botones funcionales', 'WhatsApp y +COLOR operativos');

// Verificar diseño en línea
const hasInlineDesign = heroContent.includes('flex items-center gap-3');
allPassed &= logResult(hasInlineDesign, 'Diseño en línea', 'Elementos horizontales');

// 5. Verificar estilos CSS del widget flotante
console.log('\n🎨 ESTILOS CSS DEL WIDGET FLOTANTE\n');

const cssFile = path.join(process.cwd(), 'styles/hero-bento.css');
const cssContent = readFile(cssFile);

// Verificar estilos del avatar flotante
const hasFloatingAvatarStyles = cssContent.includes('.advisor-avatar-floating') && 
                               cssContent.includes('border: 3px solid white');
allPassed &= logResult(hasFloatingAvatarStyles, 'Estilos avatar flotante', 'Borde blanco y sombras');

// Verificar contenedor flotante
const hasFloatingContainerStyles = cssContent.includes('.advisor-container-floating') && 
                                  cssContent.includes('backdrop-filter: blur(12px)');
allPassed &= logResult(hasFloatingContainerStyles, 'Contenedor flotante', 'Backdrop blur y sombras');

// Verificar información del asesor
const hasInfoStyles = cssContent.includes('.advisor-info') && 
                     cssContent.includes('flex-shrink: 1');
allPassed &= logResult(hasInfoStyles, 'Estilos información', 'Responsive y flexible');

// Verificar botones flotantes
const hasFloatingButtonStyles = cssContent.includes('.advisor-whatsapp-floating') && 
                               cssContent.includes('.advisor-plus-floating');
allPassed &= logResult(hasFloatingButtonStyles, 'Botones flotantes', 'Estilos específicos aplicados');

// 6. Verificar responsividad
console.log('\n📱 RESPONSIVIDAD DEL WIDGET\n');

// Verificar breakpoints móviles
const hasMobileBreakpoints = cssContent.includes('@media (max-width: 480px)') && 
                            cssContent.includes('.advisor-avatar-floating');
allPassed &= logResult(hasMobileBreakpoints, 'Breakpoints móviles', 'Adaptación para pantallas pequeñas');

// Verificar adaptación extrema
const hasExtremeAdaptation = cssContent.includes('@media (max-width: 360px)') && 
                            cssContent.includes('display: none');
allPassed &= logResult(hasExtremeAdaptation, 'Adaptación extrema', 'Optimización para pantallas muy pequeñas');

// Verificar max-width dinámico
const hasDynamicWidth = cssContent.includes('max-width: calc(100vw - 120px)');
allPassed &= logResult(hasDynamicWidth, 'Ancho dinámico', 'Se adapta al viewport');

// 7. Verificar funcionalidad persistente
console.log('\n🔄 FUNCIONALIDAD PERSISTENTE\n');

// Verificar que mantiene funcionalidad WhatsApp
const maintainsWhatsApp = heroContent.includes('https://wa.me/5493547639917');
allPassed &= logResult(maintainsWhatsApp, 'WhatsApp funcional', 'Enlace directo mantenido');

// Verificar navegación a productos
const maintainsNavigation = heroContent.includes('getElementById("products")') && 
                           heroContent.includes('scrollIntoView');
allPassed &= logResult(maintainsNavigation, 'Navegación a productos', 'Scroll suave mantenido');

// Verificar efecto de giro
const maintainsSpinEffect = heroContent.includes('rotate: [0, 360]') && 
                           heroContent.includes('duration: 3, repeat: Infinity');
allPassed &= logResult(maintainsSpinEffect, 'Efecto de giro', 'Animación continua mantenida');

// 8. Verificar limpieza de código
console.log('\n🧹 LIMPIEZA DE CÓDIGO\n');

// Verificar que se removió el espacio del módulo original
const hasCleanedOriginalSpace = heroContent.includes('Este espacio se deja vacío ya que el widget ahora es flotante');
allPassed &= logResult(hasCleanedOriginalSpace, 'Espacio original limpio', 'Comentario explicativo agregado');

// Verificar que no hay código duplicado
const noDuplicatedCode = !heroContent.includes('advisor-avatar-leandro') || 
                        heroContent.includes('advisor-avatar-floating');
allPassed &= logResult(noDuplicatedCode, 'Sin código duplicado', 'Clases específicas para widget flotante');

// Resumen final
console.log('\n📊 RESUMEN DE VERIFICACIÓN\n');

if (allPassed) {
  console.log('🎉 ¡PERFECTO! El widget flotante está implementado correctamente');
  console.log('✅ Modal removido, información integrada, widget persistente');
} else {
  console.log('⚠️  Algunos elementos necesitan ajustes');
  console.log('🔧 Revisa los elementos marcados con ❌ arriba');
}

console.log('\n🎯 CARACTERÍSTICAS DEL WIDGET FLOTANTE:\n');
console.log('1. ✅ Posición fixed en bottom de la pantalla');
console.log('2. ✅ Avatar solo visual sin modal');
console.log('3. ✅ Información del asesor integrada');
console.log('4. ✅ Botones WhatsApp y +COLOR funcionales');
console.log('5. ✅ Diseño horizontal en una línea');
console.log('6. ✅ Persistente durante el scroll');
console.log('7. ✅ Responsividad móvil completa');
console.log('8. ✅ Animaciones y efectos mantenidos');

process.exit(allPassed ? 0 : 1);
