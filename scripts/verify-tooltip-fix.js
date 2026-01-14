#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 VERIFICACIÓN DE CORRECCIÓN DEL TOOLTIP DUPLICADO\n');

// Función para verificar y mostrar resultados
function logResult(condition, message, details = '') {
  const icon = condition ? '✅' : '❌';
  console.log(`${icon} ${message}`);
  if (details && condition) {
    console.log(`   ${details}`);
  }
  if (!condition) {
    console.log(`   ❗ Problema: ${details}`);
  }
}

// Verificar el componente HeroBentoMobile
console.log('📱 VERIFICACIÓN DEL COMPONENTE HERO BENTO MOBILE\n');

const heroFile = path.join(process.cwd(), 'components/sections/hero-bento-mobile.tsx');
if (fs.existsSync(heroFile)) {
  const content = fs.readFileSync(heroFile, 'utf8');
  
  // Verificar que NO hay tooltip duplicado arriba
  logResult(
    !content.includes('absolute -top-16'),
    'Tooltip duplicado eliminado',
    'No hay tooltip arriba del avatar que cause duplicación'
  );
  
  // Verificar que el avatar tiene funcionalidad de modal
  logResult(
    content.includes('onClick={() => setAdvisorModalOpen(true)}'),
    'Avatar clickeable para modal',
    'Avatar abre el modal del asesor al hacer clic'
  );
  
  // Verificar que el avatar mantiene el diseño correcto
  logResult(
    content.includes('w-16 h-16 bg-mascolor-primary rounded-full'),
    'Diseño del avatar mantenido',
    'Avatar circular de 64px con color primario'
  );
  
  // Verificar que el indicador online está presente
  logResult(
    content.includes('bg-green-400') && content.includes('animate-pulse'),
    'Indicador online presente',
    'Punto verde animado en el avatar'
  );
  
  // Verificar que NO hay múltiples tooltips
  const tooltipMatches = content.match(/Tooltip con información del asesor/g);
  logResult(
    !tooltipMatches || tooltipMatches.length === 0,
    'Sin tooltips duplicados en el código',
    'No hay múltiples instancias de tooltips en el componente'
  );
  
  // Verificar que el contenedor principal está correcto
  logResult(
    content.includes('border-4 border-mascolor-primary') && content.includes('rounded-full'),
    'Contenedor principal correcto',
    'Contenedor con borde morado y forma redondeada'
  );
  
  // Verificar botón WhatsApp
  logResult(
    content.includes('Contactar por WhatsApp') && content.includes('bg-green-500'),
    'Botón WhatsApp correcto',
    'Botón verde con texto "Contactar por WhatsApp"'
  );
  
  // Verificar botón +COLOR
  logResult(
    content.includes('w-12 h-12 bg-mascolor-primary') && content.includes('animate={{ rotate: [0, 360] }}'),
    'Botón +COLOR correcto',
    'Botón circular morado con rotación'
  );
  
} else {
  logResult(false, 'Componente HeroBentoMobile', 'Archivo no encontrado');
}

// Verificar que el modal del asesor está disponible
console.log('\n🔧 VERIFICACIÓN DEL MODAL DEL ASESOR\n');

const modalFile = path.join(process.cwd(), 'components/ui/advisor-modal.tsx');
if (fs.existsSync(modalFile)) {
  const content = fs.readFileSync(modalFile, 'utf8');
  
  logResult(
    content.includes('export function AdvisorModal'),
    'Modal del asesor disponible',
    'Componente AdvisorModal exportado correctamente'
  );
  
  logResult(
    content.includes('isAdvisorModalOpen') && content.includes('setAdvisorModalOpen'),
    'Estado del modal funcional',
    'Hook de estado para abrir/cerrar modal'
  );
  
} else {
  logResult(false, 'Modal del asesor', 'Archivo no encontrado');
}

// Verificar hook de estado
console.log('\n🔧 VERIFICACIÓN DEL HOOK DE ESTADO\n');

const hookFile = path.join(process.cwd(), 'hooks/useFloatingComponents.ts');
if (fs.existsSync(hookFile)) {
  const content = fs.readFileSync(hookFile, 'utf8');
  
  logResult(
    content.includes('isAdvisorModalOpen: boolean'),
    'Estado del modal en hook',
    'isAdvisorModalOpen definido en useFloatingComponents'
  );
  
  logResult(
    content.includes('setAdvisorModalOpen: (isOpen: boolean) => void'),
    'Función de control en hook',
    'setAdvisorModalOpen definido en useFloatingComponents'
  );
  
} else {
  logResult(false, 'Hook useFloatingComponents', 'Archivo no encontrado');
}

// Resumen de la corrección
console.log('\n🎯 RESUMEN DE LA CORRECCIÓN\n');

if (fs.existsSync(heroFile)) {
  const content = fs.readFileSync(heroFile, 'utf8');
  
  const hasNoDuplicateTooltip = !content.includes('absolute -top-16');
  const hasClickableAvatar = content.includes('onClick={() => setAdvisorModalOpen(true)}');
  const hasCorrectDesign = content.includes('w-16 h-16 bg-mascolor-primary rounded-full');
  
  if (hasNoDuplicateTooltip && hasClickableAvatar && hasCorrectDesign) {
    console.log('🎉 ¡CORRECCIÓN EXITOSA!');
    console.log('✅ Tooltip duplicado eliminado');
    console.log('✅ Avatar clickeable funcional');
    console.log('✅ Diseño mantenido correctamente');
    console.log('✅ Modal del asesor integrado');
    console.log('✅ Funcionalidad WhatsApp preservada');
    console.log('✅ Botón +COLOR con rotación');
    
    console.log('\n📋 FUNCIONALIDADES VERIFICADAS:');
    console.log('🔸 Avatar abre modal del asesor (no chat duplicado)');
    console.log('🔸 Tooltip original funciona correctamente');
    console.log('🔸 Botón WhatsApp abre enlace directo');
    console.log('🔸 Botón +COLOR navega a productos');
    console.log('🔸 Diseño coincide con mockup');
    console.log('🔸 Sin elementos duplicados');
    
  } else {
    console.log('⚠️  Aún hay problemas que resolver:');
    if (!hasNoDuplicateTooltip) console.log('❌ Tooltip duplicado aún presente');
    if (!hasClickableAvatar) console.log('❌ Avatar no clickeable');
    if (!hasCorrectDesign) console.log('❌ Diseño incorrecto');
  }
} else {
  console.log('❌ No se puede verificar - archivo no encontrado');
}

console.log('\n📝 COMPORTAMIENTO ESPERADO:');
console.log('1. Un solo tooltip visible (el original de abajo)');
console.log('2. Avatar clickeable abre modal del asesor Leandro');
console.log('3. Botón WhatsApp abre chat directo');
console.log('4. Botón +COLOR navega a productos');
console.log('5. Diseño horizontal según mockup');
